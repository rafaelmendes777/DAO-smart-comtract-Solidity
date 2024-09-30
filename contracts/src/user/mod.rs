use near_sdk::borsh::{BorshDeserialize, BorshSerialize};
use serde::{Deserialize, Serialize};

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone, Ord, PartialOrd, Eq, PartialEq, Hash)]
#[borsh(crate = "near_sdk::borsh")]
pub enum FollowType {
    DAO,
    Community
}

// #[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone)]
// #[serde(crate = "near_sdk::serde")]
// #[borsh(crate = "near_sdk::borsh")]
// pub struct UserFollow {
//     follow_type: FollowType,
//     follow_id: u64,
// }

// #[near_bindgen]
// impl Contract {
//
// }