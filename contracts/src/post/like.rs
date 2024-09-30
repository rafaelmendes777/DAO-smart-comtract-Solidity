use near_sdk::borsh::{BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{AccountId, Timestamp};
use std::cmp::Ordering;
use std::hash::{Hash, Hasher};
use crate::str_serializers::*;

#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize, Clone, Ord)]
#[serde(crate = "near_sdk::serde")]
#[borsh(crate = "near_sdk::borsh")]
pub struct Like {
    pub author_id: AccountId,
    #[serde(with = "u64_dec_format")]
    pub timestamp: Timestamp,
}

impl Hash for Like {
    fn hash<H: Hasher>(&self, state: &mut H) {
        self.author_id.hash(state)
    }
}

impl PartialEq for Like {
    fn eq(&self, other: &Self) -> bool {
        self.author_id.eq(&other.author_id)
    }
}

impl PartialOrd for Like {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        self.author_id.partial_cmp(&other.author_id)
    }
}

impl Eq for Like {}

use crate::*;

// Likes
#[near_bindgen]
impl Contract {

    // Add like to request/report
    // Access Level: Public
    pub fn post_like(&mut self, id: PostId) {
        let mut post: Post = self.get_post_by_id(&id).into();

        let like = Like {
            author_id: env::predecessor_account_id(),
            timestamp: env::block_timestamp(),
        };
        post.likes.insert(like);
        self.posts.insert(&id, &post.clone().into());

        // Like Post Notification
        notify::notify_like(post.id.into(), post.author_id, None);
    }

    // Remove like from request/report
    // Access Level: Public
    pub fn post_unlike(&mut self, id: PostId) {
        let mut post: Post = self.get_post_by_id(&id).into();

        post.likes.retain(|like| like.author_id != env::predecessor_account_id());
        self.posts.insert(&id, &post.into());
    }

    // Like comment
    // Access Level: Public
    pub fn comment_like(&mut self, id: CommentId) {
        let mut comment:Comment = self.get_comment_by_id(&id).into();
        let author_id = env::predecessor_account_id();
        let like = Like {
            author_id: author_id.clone(),
            timestamp: env::block_timestamp(),
        };
        comment.likes.insert(like);
        self.comments.insert(&id, &comment.clone().into());

        // Like Comment Notification
        notify::notify_like(comment.post_id, comment.author_id, Some(comment.id));
    }

    // Remove like from comment
    // Access Level: Public
    pub fn comment_unlike(&mut self, id: CommentId) {
        let mut comment:Comment = self.get_comment_by_id(&id).into();

        comment.likes.retain(|like| like.author_id != env::predecessor_account_id());
        self.comments.insert(&id, &comment.into());
    }
}

#[cfg(all(test, not(target_arch = "wasm32")))]
mod tests {
    use crate::post::{Post};
    use crate::post::comment::Comment;
    use crate::tests::{setup_contract, create_new_dao};
    use crate::post::tests::create_proposal;

    #[test]
    pub fn test_like_post() {
        let (context, mut contract) = setup_contract();
        let dao_id = create_new_dao(&context, &mut contract);
        let proposal_id = create_proposal(&dao_id, &mut contract);

        // Try to like post 2 times, only 1 like should be added
        contract.post_like(proposal_id.clone());
        contract.post_like(proposal_id.clone());
        let post: Post= contract.get_post_by_id(&proposal_id).into();

        assert_eq!(post.likes.len(), 1);
    }

    #[test]
    pub fn test_unlike_post() {
        let (context, mut contract) = setup_contract();
        let dao_id = create_new_dao(&context, &mut contract);
        let proposal_id = create_proposal(&dao_id, &mut contract);

        contract.post_like(proposal_id.clone());
        contract.post_unlike(proposal_id.clone());

        let post: Post= contract.get_post_by_id(&proposal_id).into();
        assert_eq!(post.likes.len(), 0);
    }

    #[test]
    pub fn test_like_comment() {
        let (context, mut contract) = setup_contract();
        let dao_id = create_new_dao(&context, &mut contract);
        let proposal_id = create_proposal(&dao_id, &mut contract);
        let comment_id = contract.add_comment(
            proposal_id,
            None,
            "Comment text".to_string(),
            vec![]
        );

        // Try to like comment 2 times, only 1 like should be added
        contract.comment_like(comment_id.clone());
        contract.comment_like(comment_id.clone());
        let comment:Comment = contract.get_comment_by_id(&comment_id).into();
        assert_eq!(comment.likes.len(), 1);
    }

    #[test]
    pub fn test_unlike_comment() {
        let (context, mut contract) = setup_contract();
        let dao_id = create_new_dao(&context, &mut contract);
        let proposal_id = create_proposal(&dao_id, &mut contract);
        let comment_id = contract.add_comment(
            proposal_id,
            None,
            "Comment text".to_string(),
            vec![]
        );

        contract.comment_like(comment_id.clone());
        contract.comment_unlike(comment_id.clone());

        let comment:Comment = contract.get_comment_by_id(&comment_id).into();
        assert_eq!(comment.likes.len(), 0);

    }

}