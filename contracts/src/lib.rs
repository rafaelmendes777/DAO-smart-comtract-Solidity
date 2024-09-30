mod storage_keys;
pub mod access_control;
pub mod dao;
pub mod community;
pub mod post;
pub mod migrations;
pub mod str_serializers;
mod user;
mod notify;
mod social_db;

use std::collections::HashSet;
use storage_keys::*;
use post::*;

// use near_sdk::require;
// use near_sdk::serde_json::{json, Value};
use near_sdk::borsh::{BorshDeserialize, BorshSerialize};
use near_sdk::collections::{LookupMap, UnorderedMap};
use near_sdk::{near_bindgen, AccountId, PanicOnDefault, env};
use crate::access_control::AccessPermissionType;
use crate::access_control::owners::VersionedAccessMetadata;
use crate::community::VersionedCommunity;
use crate::dao::{VersionedDAO};
use crate::post::comment::{Comment, CommentSnapshot, VersionedComment};
use crate::user::{FollowType};

type DaoId = u64;
type PostId = u64;
type CommentId = u64;
type CommunityId = u64;
type PostLabel = String;
type Vertical = String;
type MetricLabel = String;
pub type Balance = u128;

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
#[borsh(crate = "near_sdk::borsh")]
pub struct Contract {
    pub total_posts: u64,
    pub total_comments: u64,
    pub total_communities: u64,

    pub dao: UnorderedMap<DaoId, VersionedDAO>,
    pub dao_posts: LookupMap<DaoId, Vec<PostId>>,
    pub dao_communities: LookupMap<DaoId, Vec<CommunityId>>,
    // pub dao_handles: UnorderedMap<String, DaoId>,

    pub posts: LookupMap<PostId, VersionedPost>,
    pub comments: LookupMap<CommentId, VersionedComment>,
    pub communities: LookupMap<CommunityId, VersionedCommunity>,
    pub community_handles: LookupMap<String, CommunityId>,

    pub proposal_type_summary: UnorderedMap<PostStatus, f64>,
    pub label_to_posts: UnorderedMap<PostLabel, Vec<PostId>>,
    pub vertical_posts: UnorderedMap<Vertical, Vec<PostId>>,
    pub community_posts: LookupMap<CommunityId, Vec<PostId>>,

    pub post_status: LookupMap<PostStatus, Vec<PostId>>,
    pub post_authors: LookupMap<AccountId, Vec<PostId>>,
    pub comment_authors: LookupMap<AccountId, Vec<CommentId>>,
    pub user_follow: LookupMap<(FollowType, AccountId), Vec<u64>>,
    pub owner_access: LookupMap<AccountId, Vec<VersionedAccessMetadata>>,
}

#[near_bindgen]
impl Contract {
    #[init]
    pub fn new() -> Self {
        migrations::state_version_write(&migrations::StateVersion::V1);

        let contract = Self {
            total_posts: 0,
            total_comments: 0,
            total_communities: 0,

            dao: UnorderedMap::new(StorageKey::DAO),
            dao_posts: LookupMap::new(StorageKey::DaoPosts),
            dao_communities: LookupMap::new(StorageKey::DaoCommunities),

            posts: LookupMap::new(StorageKey::Posts),
            comments: LookupMap::new(StorageKey::Comments),
            communities: LookupMap::new(StorageKey::Communities),
            community_handles: LookupMap::new(StorageKey::CommunityHandles),

            proposal_type_summary: UnorderedMap::new(StorageKey::ProposalTypeSummary),
            label_to_posts: UnorderedMap::new(StorageKey::LabelToPosts),
            vertical_posts: UnorderedMap::new(StorageKey::VerticalPosts),
            community_posts: LookupMap::new(StorageKey::CommunityPosts),

            post_status: LookupMap::new(StorageKey::PostStatus),
            post_authors: LookupMap::new(StorageKey::PostAuthors),
            comment_authors: LookupMap::new(StorageKey::CommentAuthors),
            user_follow: LookupMap::new(StorageKey::UserFollow),
            owner_access: LookupMap::new(StorageKey::OwnerAccess),
        };

        contract
    }
}

// Getters - All smart-contract view functions
#[near_bindgen]
impl Contract {

    // DAO: Get DAO by ID
    pub fn get_dao_by_id(&self, id: &DaoId) -> VersionedDAO {
        self.dao.get(id).unwrap_or_else(|| panic!("DAO #{} not found", id))
    }

    // DAO: Get DAO by handle
    pub fn get_dao_by_handle(&self, handle: &String) -> VersionedDAO {
        let dao = self.dao.values().find(|dao| dao.clone().latest_version().handle == *handle);
        dao.unwrap_or_else(|| panic!("DAO with handle {} not found", handle))
    }

    // DAO: Get all DAOs
    pub fn get_dao_list(&self) -> Vec<VersionedDAO> {
        self.dao.values().collect()
    }

    // Post: Get all posts from all DAOs except InReview status
    pub fn get_all_posts(&self, page:u64, limit:u64) -> Vec<VersionedPost> {
        let all_post_ids: HashSet<PostId> = (1..=self.total_posts).collect();
        let in_review_post_ids: HashSet<PostId> = self.post_status.get(&PostStatus::InReview).unwrap_or_default().iter().cloned().collect();

        let available_post_ids: Vec<PostId> = all_post_ids.difference(&in_review_post_ids)
            .cloned()
            .collect();

        let total_available_posts = available_post_ids.len();
        let start = page.saturating_mul(limit);
        let end = std::cmp::min(start + limit, total_available_posts as u64);

        available_post_ids[start as usize..end as usize]
            .iter()
            .filter_map(|post_id| self.posts.get(post_id))
            .collect()
    }

    // Posts: Get Proposals/Reports by ID
    pub fn get_post_by_id(&self, id: &PostId) -> VersionedPost {
        self.posts.get(id).unwrap_or_else(|| panic!("Post id {} not found", id))
    }

    // Posts: Get total requested_amount  for posts by status
    pub fn get_proposal_type_summary(&self) -> Vec<(PostStatus, f64)> {
        self.proposal_type_summary.iter().collect()
    }

    // Posts: Get all Proposals/Reports except "in_review" for DAO
    pub fn get_dao_posts(&self, dao_id: DaoId, status: Option<PostStatus>) -> Vec<VersionedPost> {
        self.dao_posts.get(&dao_id).unwrap_or_default()
            .iter()
            .map(|post_id| self.get_post_by_id(post_id))
            .filter(|versioned_post| {
                let post:Post = (*versioned_post).clone().into();
                if status.is_some() {
                    // Filter by status if provided
                    post.snapshot.status == status.clone().unwrap()
                } else {
                    // Default: Exclude "in_review" status
                    post.snapshot.status != PostStatus::InReview
                }
            })
            .collect()

        // TODO: add pagination
    }

    // Posts: Get Proposals/Reports by Author
    pub fn get_posts_by_author(&self, author: AccountId) -> Vec<VersionedPost> {
        self.post_authors.get(&author).unwrap_or_default()
            .iter()
            .map(|post_id| self.get_post_by_id(post_id))
            .collect()

        // TODO: add pagination
    }

    // Posts: Get Proposals/Reports history
    pub fn get_post_history(&self, id: PostId) -> Vec<PostSnapshot> {
        let post: Post = self.get_post_by_id(&id).into();
        post.snapshot_history
    }

    // Communities: Get all communities by DAO
    pub fn get_dao_communities(&self, dao_id: DaoId) -> Vec<VersionedCommunity> {
        self.dao_communities.get(&dao_id).unwrap_or_default()
            .iter()
            .map(|community_id| self.get_community_by_id(community_id))
            .collect()
    }

    // Communities: Get Community by ID
    pub fn get_community_by_id(&self, id: &CommunityId) -> VersionedCommunity {
        self.communities.get(&id).unwrap_or_else(|| panic!("Community #{} not found", id))
    }

    // Communities: Get Community by handle
    pub fn get_community_by_handle(&self, handle: String) -> VersionedCommunity {
        let community = self.community_handles.get(&handle).and_then(|id| self.communities.get(&id));
        community.unwrap_or_else(|| panic!("Community {} not found", handle))
    }

    // Communities: Get follow list for user
    pub fn get_follow_id_list(&self, follow_type: FollowType, account_id: AccountId) -> Vec<u64> {
        self.user_follow.get(&(follow_type, account_id)).unwrap_or_default()
    }

    // Access-control: Get the access rules list for a specific account
    pub fn get_account_access(&self, account_id: AccountId) -> Vec<VersionedAccessMetadata> {
        self.owner_access.get(&account_id).unwrap_or(vec![])
    }

    // Comments: Get Comment by ID
    pub fn get_comment_by_id(&self, id: &CommentId) -> VersionedComment {
        self.comments.get(id).unwrap_or_else(|| panic!("Comment id {} not found", id))
    }

    // Comments: Get all comments by author
    pub fn get_comments_by_author(&self, author: AccountId) -> Vec<VersionedComment> {
        self.comment_authors.get(&author).unwrap_or_default()
            .iter()
            .map(|comment_id| self.get_comment_by_id(comment_id))
            .collect()
    }

    // Comments: Get all comments for a post
    pub fn get_post_comments(&self, post_id: PostId) -> Vec<VersionedComment> {
        let post:Post = self.posts.get(&post_id).unwrap_or_else(|| panic!("Post id {} not found", post_id)).into();
        post.comments.iter()
            .map(|comment_id| self.get_comment_by_id(comment_id))
            .collect()
    }

    // Comments: Get comment history
    pub fn get_comment_history(&self, id: CommentId) -> Vec<CommentSnapshot> {
        let comment: Comment = self.get_comment_by_id(&id).into();
        comment.snapshot_history
    }
}

#[cfg(all(test, not(target_arch = "wasm32")))]
pub mod tests {
    use std::collections::HashMap;
    use near_sdk::test_utils::VMContextBuilder;
    use near_sdk::{testing_env, VMContext};
    use crate::{Contract, DaoId};
    use crate::dao::DAOInput;

    pub fn get_context_with_signer(is_view: bool, signer: String) -> VMContext {
        VMContextBuilder::new()
            .signer_account_id(signer.clone().try_into().unwrap())
            .current_account_id(signer.try_into().unwrap())
            .is_view(is_view)
            .build()
    }

    pub fn setup_contract() -> (VMContext, Contract) {
        let context = get_context_with_signer(false, String::from("bob.near"));
        testing_env!(context.clone());
        (context, Contract::new())
    }

    // Setup function to initialize the contract and add a DAO
    pub fn create_new_dao(context: &VMContext, contract: &mut Contract) -> DaoId {
        contract.add_dao(
            DAOInput {
                title: "DAO Title".to_string(),
                handle: "dao-title".to_string(),
                description: "DAO Description".to_string(),
                logo_url: "https://logo.com".to_string(),
                banner_url: "https://banner.com".to_string(),
                is_congress: false,
                account_id: "some_acc.near".parse().unwrap(),
            },
            vec![context.signer_account_id.clone()],
            vec!["gaming".to_string()],
            vec![],
            HashMap::new()
        )
    }

}
