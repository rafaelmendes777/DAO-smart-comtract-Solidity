use std::collections::HashSet;
use near_sdk::borsh::{BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{AccountId};
use crate::access_control::{AccessPermissionType};
use crate::access_control::rules::Rule;

#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
#[borsh(crate = "near_sdk::borsh")]
pub struct AccessMetadata {
    pub permission_type: AccessPermissionType,
    pub permission_id: u64,
    pub rules_list: HashSet<Rule>,
    pub children: HashSet<AccountId>,
    pub parent: AccountId,
}

#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
#[serde(tag = "access_owner_metadata_version")]
#[borsh(crate = "near_sdk::borsh")]
pub enum VersionedAccessMetadata {
    V1(AccessMetadata),
    // V2(AccessMetadataV2),
}

impl VersionedAccessMetadata {
    pub fn latest_version(self) -> AccessMetadata {
        self.into()
    }

    // pub fn latest_version(self) -> AccessMetadataV2 {
    //     self.into()
    // }
}

impl From<VersionedAccessMetadata> for AccessMetadata {
    fn from(vi: VersionedAccessMetadata) -> Self {
        match vi {
            VersionedAccessMetadata::V1(v1) => v1,
            // VersionedAccessMetadata::V2(_) => unimplemented!(),
        }
    }
}

// impl From<VersionedAccessMetadata> for AccessMetadataV2 {
//     fn from(vi: VersionedAccessMetadata) -> Self {
//         match vi {
//             VersionedAccessMetadata::V2(v2) => v2,
//             _ => unimplemented!(),
//         }
//     }
// }

impl From<AccessMetadata> for VersionedAccessMetadata {
    fn from(owner: AccessMetadata) -> Self {
        VersionedAccessMetadata::V1(owner)
    }
}
