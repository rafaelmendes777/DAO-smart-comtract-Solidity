mod like;
mod proposal;
mod report;
pub mod comment;

use std::collections::HashSet;
use near_sdk::borsh::{BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{AccountId, near_bindgen, Timestamp};
use crate::{Vertical, CommentId, CommunityId, Contract, DaoId, PostId};
use crate::post::like::Like;
use crate::post::proposal::VersionedProposal;
use crate::post::report::VersionedReport;
use crate::str_serializers::*;

#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
#[borsh(crate = "near_sdk::borsh")]
pub enum PostType {
    Proposal,
    Report
}

#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize, Clone, Debug, PartialEq)]
#[serde(crate = "near_sdk::serde")]
#[borsh(crate = "near_sdk::borsh")]
pub enum PostStatus {
    InReview,
    New,
    Approved,
    Rejected,
    Executed,
    Closed
}

#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
#[serde(tag = "post_version")]
#[borsh(crate = "near_sdk::borsh")]
pub enum VersionedPost {
    V1(Post),
    // V2(PostV2),
}

#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
#[borsh(crate = "near_sdk::borsh")]
pub struct Post {
    pub id: PostId,
    pub author_id: AccountId,
    pub dao_id: DaoId,
    pub likes: HashSet<Like>,
    pub comments: HashSet<CommentId>,
    #[serde(flatten)]
    pub snapshot: PostSnapshot,
    pub snapshot_history: Vec<PostSnapshot>,
}

impl From<VersionedPost> for Post {
    fn from(vp: VersionedPost) -> Self {
        match vp {
            VersionedPost::V1(v1) => v1,
        }
    }
}

impl From<Post> for VersionedPost {
    fn from(p: Post) -> Self {
        VersionedPost::V1(p)
    }
}
// impl From<PostV2> for VersionedPost {
//     fn from(p: PostV2) -> Self {
//         VersionedPost::V2(p)
//     }
// }

#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
#[borsh(crate = "near_sdk::borsh")]
pub struct PostSnapshot {
    pub status: PostStatus,
    pub editor_id: AccountId,
    #[serde(with = "u64_dec_format")]
    pub timestamp: Timestamp,
    #[serde(flatten)]
    pub body: PostBody,
}

#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
#[serde(tag = "post_type")]
#[borsh(crate = "near_sdk::borsh")]
pub enum PostBody {
    Proposal(VersionedProposal),
    Report(VersionedReport),
}

impl PostBody {
    pub fn get_post_title(&self) -> String {
        return match self.clone() {
            PostBody::Proposal(proposal) => proposal.latest_version().title,
            PostBody::Report(report) => report.latest_version().title,
        };
    }

    pub fn get_post_description(&self) -> String {
        return match self.clone() {
            PostBody::Proposal(proposal) => proposal.latest_version().description,
            PostBody::Report(report) => report.latest_version().description,
        };
    }

    pub fn get_post_community_id(&self) -> Option<CommunityId> {
        return match self.clone() {
            PostBody::Proposal(proposal) => proposal.latest_version().community_id,
            PostBody::Report(report) => report.latest_version().community_id,
        };
    }

    pub fn get_post_vertical(&self) -> Option<Vertical> {
        return match self.clone() {
            PostBody::Proposal(proposal) => proposal.latest_version().vertical,
            PostBody::Report(report) => report.latest_version().vertical,
        };
    }

     pub fn get_post_type(&self) -> PostType {
         return match self.clone() {
             PostBody::Proposal(_) => PostType::Proposal,
             PostBody::Report(_) => PostType::Report,
         };
     }

    pub fn validate(&self) {
        return match self.clone() {
            PostBody::Proposal(proposal) => proposal.validate(),
            PostBody::Report(report) => report.validate(),
        };
    }
}

use crate::*;

// Proposal/report call functions
#[near_bindgen]
impl Contract {

    // Add new DAO request/report
    // Access Level: Public
    pub fn add_post(&mut self, dao_id: DaoId, body: PostBody) -> PostId {
        let dao = self.get_dao_by_id(&dao_id);
        self.validate_add_post(&dao_id, &body);

        self.total_posts += 1;
        let author_id = env::predecessor_account_id();
        let post_id = self.total_posts;

        let post = Post {
            id: post_id.clone(),
            author_id: author_id.clone(),
            likes: Default::default(),
            comments: Default::default(),
            dao_id,
            snapshot: PostSnapshot {
                status: PostStatus::InReview,
                editor_id: author_id.clone(),
                timestamp: env::block_timestamp(),
                body: body.clone(),
            },
            snapshot_history: vec![],
        };
        self.posts.insert(&post_id, &post.into());

        // Update various post collections
        self.add_dao_posts_internal(&dao_id, post_id);
        self.add_post_authors_internal(&author_id, post_id);
        self.add_post_status_internal(post_id, PostStatus::InReview);
        self.add_vertical_posts_internal(&body, post_id);
        self.add_community_posts_internal(&body, post_id);

        // Proposals
        self.add_proposal_type_summary_internal(&body);
        // Reports
        self.assign_report_to_proposal(&body, post_id.clone());

        // Notifications
        notify::notify_mention(&body.get_post_title(), &body.get_post_description(), post_id.clone(), None);
        notify::notify_owners_new_post(dao.latest_version().owners, post_id.clone(), &body.get_post_title(), body.get_post_type());

        near_sdk::log!("POST ADDED: {}", post_id);
        post_id
    }

    // Validate post on create
    fn validate_add_post(&self, dao_id: &DaoId, body: &PostBody) {
        body.validate();
        self.get_dao_by_id(&dao_id);

        // Check proposal requested amount
        if let PostBody::Proposal(proposal) = body {
            assert!(proposal.clone().latest_version().requested_amount >= 0.0, "Wrong requested amount");
        }

        // Check if community is part of the DAO
        if let Some(community_id) = body.get_post_community_id() {
            let dao_communities = self.dao_communities.get(&dao_id).unwrap_or(vec![]);
            assert!(dao_communities.contains(&community_id), "Community not found in DAO");
        }
    }

    // Update dao_posts
    fn add_dao_posts_internal(&mut self, dao_id: &DaoId, post_id: PostId) {
        let mut dao_posts = self.dao_posts.get(dao_id).unwrap_or_else(Vec::new);
        dao_posts.push(post_id);
        self.dao_posts.insert(dao_id, &dao_posts);
    }

    // Update post_authors
    fn add_post_authors_internal(&mut self, author_id: &AccountId, post_id: PostId) {
        let mut post_authors = self.post_authors.get(author_id).unwrap_or_else(Vec::new);
        post_authors.push(post_id);
        self.post_authors.insert(author_id, &post_authors);
    }

    // Update post_status
    fn add_post_status_internal(&mut self, post_id: PostId, status: PostStatus) {
        let mut post_by_status = self.post_status.get(&status).unwrap_or_else(Vec::new);
        post_by_status.push(post_id);
        self.post_status.insert(&status, &post_by_status);
    }

    // Update vertical_posts
    fn add_vertical_posts_internal(&mut self, body: &PostBody, post_id: PostId) {
        if let Some(vertical) = body.get_post_vertical() {
            let mut vertical_posts = self.vertical_posts.get(&vertical).unwrap_or_else(Vec::new);
            vertical_posts.push(post_id);
            self.vertical_posts.insert(&vertical, &vertical_posts);
        }
    }

    // Update proposal_type_summary (only for proposals)
    fn add_proposal_type_summary_internal(&mut self, body: &PostBody) {
        if let PostBody::Proposal(post) = body {
            let mut proposals_summary = self.proposal_type_summary.get(&PostStatus::InReview).unwrap_or(0.0);
            proposals_summary += post.clone().latest_version().requested_amount;
            self.proposal_type_summary.insert(&PostStatus::InReview, &proposals_summary);
        }
    }

    fn assign_report_to_proposal(&mut self, body: &PostBody, post_id: PostId) {
        if let PostBody::Report(report) = body {
            let proposal_id = report.clone().latest_version().proposal_id;
            let mut proposal_post: Post = self.get_post_by_id(&proposal_id).into();

            if let PostBody::Proposal(proposal) = &mut proposal_post.snapshot.body {
                proposal.latest_version_mut().reports.push(post_id);
                self.posts.insert(&proposal_id, &proposal_post.into());
            }
        }
    }

    // Update community_posts
    fn add_community_posts_internal(&mut self, body: &PostBody, post_id: PostId) {
        if let Some(community_id) = body.get_post_community_id() {
            let mut community_posts = self.community_posts.get(&community_id).unwrap_or_else(Vec::new);
            community_posts.push(post_id);
            self.community_posts.insert(&community_id, &community_posts);
        }
    }


    // Edit request/report
    // Access Level: Post author
    pub fn edit_post(&mut self, id: PostId, body: PostBody) {
        let mut post: Post = self.get_post_by_id(&id).into();
        self.validate_edit_post(&post, &body);

        // Cleanup and update posts vertical and community
        self.update_vertical_posts_internal(&post, &body);
        self.update_community_posts_internal(&post, &body);
        self.update_proposal_type_summary_internal(&post, &body);

        post.snapshot_history.push(post.snapshot.clone());
        post.snapshot = PostSnapshot {
            status: PostStatus::InReview,
            editor_id: env::predecessor_account_id(),
            timestamp: env::block_timestamp(),
            body: body.clone(),
        };
        self.posts.insert(&post.id, &post.clone().into());

        near_sdk::log!("POST EDITED: {}", post.id);
    }

    // Validate post on edit
    fn validate_edit_post(&self, post: &Post, body: &PostBody) {
        assert_eq!(env::predecessor_account_id(), post.author_id, "Only the author can edit the post");
        assert_eq!(post.snapshot.status, PostStatus::InReview, "Only posts in review can be edited");
        body.validate();

        if let Some(community_id) = body.get_post_community_id() {
            let dao_communities = self.dao_communities.get(&post.dao_id).unwrap_or(vec![]);
            assert!(dao_communities.contains(&community_id), "Community not found in DAO");
        }
    }

    // Cleanup and update proposal_type_summary
    fn update_proposal_type_summary_internal(&mut self, post: &Post, body: &PostBody) {
        if let PostBody::Proposal(new_post) = body {
            if let PostBody::Proposal(old_post) = &post.snapshot.body {
                let old_amount = old_post.clone().latest_version().requested_amount;
                let new_amount = new_post.clone().latest_version().requested_amount;

                if old_amount != new_amount {
                    let mut proposals_summary = self.proposal_type_summary.get(&post.snapshot.status).unwrap_or(0.0);
                    proposals_summary = proposals_summary + new_amount - old_amount;
                    self.proposal_type_summary.insert(&post.snapshot.status, &proposals_summary);
                }
            }
        }
    }

    // Cleanup and update vertical_posts
    fn update_vertical_posts_internal(&mut self, post: &Post, body: &PostBody) {
        let current_vertical = post.snapshot.body.get_post_vertical();
        let new_vertical = body.get_post_vertical();

        // If the vertical hasn't changed, there's nothing to update.
        if current_vertical == new_vertical {
            return;
        }

        // Remove post from the old vertical if it exists.
        if let Some(vertical) = current_vertical {
            let mut vertical_posts = self.vertical_posts.get(&vertical).unwrap_or_else(Vec::new);
            vertical_posts.retain(|&x| x != post.id);
            self.vertical_posts.insert(&vertical, &vertical_posts);
        }

        // Add post to the new vertical if it's different from the current.
        if let Some(vertical) = new_vertical {
            let mut vertical_posts = self.vertical_posts.get(&vertical).unwrap_or_else(Vec::new);
            if !vertical_posts.contains(&post.id) {
                vertical_posts.push(post.id.clone());
                self.vertical_posts.insert(&vertical, &vertical_posts);
            }
        }
    }

    // Cleanup and update community_posts
    fn update_community_posts_internal(&mut self, post: &Post, body: &PostBody) {
        let current_community_id = post.snapshot.body.get_post_community_id();
        let new_community_id = body.get_post_community_id();

        // If the community hasn't changed, there's nothing to update.
        if current_community_id == new_community_id {
            return;
        }

        // Remove post from the old community if it exists.
        if let Some(community_id) = current_community_id {
            let mut community_posts = self.community_posts.get(&community_id).unwrap_or_else(Vec::new);
            community_posts.retain(|&x| x != post.id);
            self.community_posts.insert(&community_id, &community_posts);
        }

        // Add post to the new community if it's different from the current.
        if let Some(community_id) = new_community_id {
            let mut community_posts = self.community_posts.get(&community_id).unwrap_or_else(Vec::new);
            if !community_posts.contains(&post.id) {
                community_posts.push(post.id.clone());
                self.community_posts.insert(&community_id, &community_posts);
            }
        }
    }

    // Change request/report status
    // Access Level: DAO owners
    pub fn change_post_status(&mut self, id: PostId, status: PostStatus) {
        let mut post: Post = self.get_post_by_id(&id).into();

        self.validate_dao_ownership(&env::predecessor_account_id(), &post.dao_id);
        assert_ne!(post.snapshot.status, status, "Post already has this status");

        // TODO: Add restrictions & rules for status changes

        // Cleanup old post_status and add to new one, also update proposal_type_summary
        self.update_post_status_internal(&post, &status);
        self.move_proposal_type_summary_internal(&post, &status);

        // Update post
        post.snapshot_history.push(post.snapshot.clone());
        post.snapshot = PostSnapshot {
            status,
            editor_id: env::predecessor_account_id(),
            timestamp: env::block_timestamp(),
            body: post.snapshot.body.clone(),
        };
        self.posts.insert(&post.id, &post.clone().into());

        near_sdk::log!("POST STATUS CHANGED: {}", post.id);
    }

    // Cleanup old post_status and add to new post_status
    fn update_post_status_internal(&mut self, post: &Post, new_status: &PostStatus) {
        // Cleanup old post_status
        let mut post_by_status = self.post_status.get(&post.snapshot.status).unwrap_or_default();
        post_by_status.retain(|&x| x != post.id);
        self.post_status.insert(&post.snapshot.status, &post_by_status);

        // Add to new post_status
        let mut post_by_new_status = self.post_status.get(new_status).unwrap_or_default();
        post_by_new_status.push(post.id.clone());
        self.post_status.insert(new_status, &post_by_new_status);
    }

    fn move_proposal_type_summary_internal(&mut self, post: &Post,  new_status: &PostStatus) {
        if let PostBody::Proposal(proposal) = &post.snapshot.body {
            let mut status_summary = self.proposal_type_summary.get(&post.snapshot.status).unwrap_or(0.0);
            status_summary -= proposal.clone().latest_version().requested_amount;
            self.proposal_type_summary.insert(&post.snapshot.status, &status_summary);

            let mut status_summary = self.proposal_type_summary.get(new_status).unwrap_or(0.0);
            status_summary += proposal.clone().latest_version().requested_amount;
            self.proposal_type_summary.insert(new_status, &status_summary);
        }
    }
}

#[cfg(all(test, not(target_arch = "wasm32")))]
mod tests {
    use std::collections::HashMap;
    use crate::tests::{setup_contract, create_new_dao};
    use crate::post::{Post, PostBody, PostStatus, VersionedProposal};
    use crate::post::proposal::Proposal;
    use crate::{Contract, DaoId, PostId};
    use crate::post::report::{Report, VersionedReport};

    pub fn create_proposal(dao_id: &DaoId, contract: &mut Contract) -> PostId {
        contract.add_post(
            *dao_id,
            PostBody::Proposal(
                VersionedProposal::V1(
                    Proposal {
                        title: "Proposal title".to_string(),
                        description: "Proposal description".to_string(),
                        attachments: vec![],
                        labels: vec!["label1".to_string(), "label2".to_string()],
                        metrics: HashMap::new(),
                        reports: vec![],
                        requested_amount: 1000.0,
                        community_id: None,
                        vertical: None,
                    }
                )
            )
        )
    }

    pub fn create_report(dao_id: DaoId, contract: &mut Contract, proposal_id: PostId) -> PostId {
        contract.add_post(
            dao_id,
            PostBody::Report(
                VersionedReport::V1(
                    Report {
                        title: "Report title".to_string(),
                        description: "Report description".to_string(),
                        attachments: vec![],
                        labels: vec!["label1".to_string()],
                        metrics: HashMap::new(),
                        community_id: None,
                        vertical: None,
                        proposal_id,
                    }
                )
            )
        )
    }

    #[test]
    pub fn test_add_proposal() {
        let (context, mut contract) = setup_contract();
        let dao_id = create_new_dao(&context, &mut contract);
        let proposal_id = create_proposal(&dao_id, &mut contract);

        let post: Post = contract.get_post_by_id(&proposal_id).into();
        assert_eq!(post.snapshot.status, PostStatus::InReview);
        assert_eq!(post.snapshot.body.get_post_vertical(), None);
        assert_eq!(post.snapshot.body.get_post_community_id(), None);
        assert_eq!(post.snapshot_history.len(), 0);

        if let PostBody::Proposal(vp) = &post.snapshot.body {
            let VersionedProposal::V1(proposal) = vp;
            assert_eq!(proposal.title, "Proposal title".to_string());
            assert_eq!(proposal.description, "Proposal description".to_string());
            assert_eq!(proposal.attachments.len(), 0);
            assert_eq!(proposal.labels, vec!["label1".to_string(), "label2".to_string()]);
            assert_eq!(proposal.metrics, HashMap::new());
            assert_eq!(proposal.community_id, None);
            assert_eq!(proposal.vertical, None);
        }
    }

    #[test]
    pub fn test_edit_proposal() {
        let (context, mut contract) = setup_contract();
        let dao_id = create_new_dao(&context, &mut contract);
        let proposal_id = create_proposal(&dao_id, &mut contract);

        let new_title = "New Proposal title".to_string();
        let new_description = "New Proposal description".to_string();

        contract.edit_post(proposal_id, PostBody::Proposal(
            VersionedProposal::V1(
                Proposal {
                    title: new_title.clone(),
                    description: new_description.clone(),
                    attachments: vec!["some_url".to_string()],
                    labels: vec!["label1".to_string(), "label2".to_string()],
                    metrics: HashMap::new(),
                    reports: vec![],
                    requested_amount: 1000.0,
                    community_id: None,
                    vertical: None,
                }
            )
        ));

        let post: Post = contract.get_post_by_id(&proposal_id).into();
        assert_eq!(post.snapshot_history.len(), 1);

        if let PostBody::Proposal(vp) = &post.snapshot.body {
            let VersionedProposal::V1(proposal) = vp;
            assert_eq!(proposal.title, new_title);
            assert_eq!(proposal.description, new_description);
            assert_eq!(proposal.attachments.len(), 1);
            assert_eq!(proposal.labels, vec!["label1".to_string(), "label2".to_string()]);
            assert_eq!(proposal.metrics, HashMap::new());
            assert_eq!(proposal.reports.len(), 0);
            assert_eq!(proposal.requested_amount, 1000.0);
            assert_eq!(proposal.community_id, None);
            assert_eq!(proposal.vertical, None);
        }
    }

    #[test]
    pub fn test_add_report() {
        let (context, mut contract) = setup_contract();
        let dao_id = create_new_dao(&context, &mut contract);
        let proposal_id = create_proposal(&dao_id, &mut contract);
        let report_id = create_report(dao_id, &mut contract, proposal_id);

        let post: Post = contract.get_post_by_id(&report_id).into();
        assert_eq!(post.snapshot.status, PostStatus::InReview);
        assert_eq!(post.snapshot.body.get_post_vertical(), None);
        assert_eq!(post.snapshot.body.get_post_community_id(), None);
        assert_eq!(post.snapshot_history.len(), 0);

        if let PostBody::Report(vp) = &post.snapshot.body {
            let VersionedReport::V1(report) = vp;
            assert_eq!(report.proposal_id, proposal_id);
            assert_eq!(report.title, "Report title".to_string());
            assert_eq!(report.description, "Report description".to_string());
            assert_eq!(report.labels, vec!["label1".to_string()]);
            assert_eq!(report.metrics, HashMap::new());
            assert_eq!(report.community_id, None);
            assert_eq!(report.vertical, None);
        }
    }
}