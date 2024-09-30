// use crate::*;
// use near_sdk::{env, near_bindgen};

// #[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
// #[borsh(crate = "near_sdk::borsh")]
// pub struct ContractV1 {
//
// }

// #[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
// #[borsh(crate = "near_sdk::borsh")]
// pub struct ContractV2 {
//
// }

// From ContractV1 to ContractV2
// #[near_bindgen]
// impl Contract {
//     pub fn unsafe_test_migration_v2() {
//         let old_state: ContractV1 = env::state_read().expect("failed");
//         let user_follow_dao = LookupMap::new(StorageKey::UserFollowDao);
//
//         env::state_write(&ContractV2 {
//
//         });
//     }
// }