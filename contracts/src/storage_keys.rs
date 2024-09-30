use near_sdk::borsh::{BorshSerialize};
use near_sdk::{BorshStorageKey};

#[derive(BorshSerialize, BorshStorageKey)]
#[borsh(crate = "near_sdk::borsh")]
pub enum StorageKey {
    DAO,
    DaoPosts,
    DaoCommunities,
    Posts,
    Comments,
    Communities,
    CommunityHandles,
    LabelToPosts,
    ProposalTypeSummary,
    VerticalPosts,
    CommunityPosts,
    PostStatus,
    PostAuthors,
    CommentAuthors,
    UserFollow,
    OwnerAccess,
}