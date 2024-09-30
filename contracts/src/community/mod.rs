use near_sdk::borsh::{BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{AccountId, near_bindgen};
use super::{Contract, DaoId};
use crate::{Vertical, CommunityId};
use std::collections::HashMap;
use crate::dao::DAO;

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
#[borsh(crate = "near_sdk::borsh")]
pub struct CommunityInput {
    pub handle: String,
    pub title: String,
    pub description: String,
    pub logo_url: String,
    pub banner_url: String,
    pub accounts: Vec<AccountId>,
}

impl CommunityInput {
    pub fn validate(&self) {
        assert!(!self.handle.is_empty(), "Handle is required");
        assert!(!self.title.is_empty(), "Title is required");
    }
}

#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize, Clone, Debug, PartialEq)]
#[serde(crate = "near_sdk::serde")]
#[borsh(crate = "near_sdk::borsh")]
pub enum CommunityStatus {
    Active,
    Inactive,
}

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
#[borsh(crate = "near_sdk::borsh")]
pub struct Community {
    pub id: CommunityId,
    pub dao_list: Vec<DaoId>,
    pub handle: String,
    pub title: String,
    pub description: String,
    pub verticals: Vec<Vertical>,
    pub logo_url: String,
    pub banner_url: String,
    pub status: CommunityStatus,
    pub owners: Vec<AccountId>,
    pub accounts: Vec<AccountId>,
    pub metadata: HashMap<String, String>
}

// #[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone)]
// #[serde(crate = "near_sdk::serde")]
// #[borsh(crate = "near_sdk::borsh")]
// pub struct CommunityV2 {
//     pub title: String,
//     pub description: String,
// }

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
#[serde(tag = "community_version")]
#[borsh(crate = "near_sdk::borsh")]
pub enum VersionedCommunity {
    V1(Community),
    // V2(CommunityV2),
}

impl VersionedCommunity {
    pub fn latest_version(self) -> Community {
        self.into()
    }

    // pub fn latest_version(self) -> CommunityV2 {
    //     self.into()
    // }
}

impl From<VersionedCommunity> for Community {
    fn from(vi: VersionedCommunity) -> Self {
        match vi {
            VersionedCommunity::V1(v1) => v1,
            // VersionedCommunity::V2(_) => unimplemented!(),
        }
    }
}

// impl From<VersionedCommunity> for CommunityV2 {
//     fn from(vi: VersionedCommunity) -> Self {
//         match vi {
//             VersionedCommunity::V2(v2) => v2,
//             _ => unimplemented!(),
//         }
//     }
// }

impl From<Community> for VersionedCommunity {
    fn from(community: Community) -> Self {
        VersionedCommunity::V1(community)
    }
}

use crate::*;

// Community call functions
#[near_bindgen]
impl Contract {
    // Add new DAO community
    // Access Level: DAO owners
    pub fn add_community(
        &mut self,
        dao_id: DaoId,
        owners: Vec<AccountId>,
        community_input: CommunityInput,
        verticals: Vec<Vertical>,
        metadata: HashMap<String, String>
    ) -> CommunityId {
        self.validate_dao_ownership(&env::predecessor_account_id(), &dao_id);
        community_input.validate();

        self.validate_community_uniqueness(&dao_id, &community_input);
        self.validate_verticals_in_dao(&dao_id, &verticals);

        self.total_communities += 1;
        let id = self.total_communities;
        let community = Community {
            id: id.clone(),
            dao_list: vec![dao_id],
            handle: community_input.handle.clone(),
            title: community_input.title,
            description: community_input.description,
            verticals,
            status: CommunityStatus::Active,
            logo_url: community_input.logo_url,
            banner_url: community_input.banner_url,
            accounts: community_input.accounts,
            owners,
            metadata
        };
        self.communities.insert(&id, &community.into());

        self.add_dao_communities_internal(&dao_id, id.clone());
        self.add_community_handle_internal(&community_input.handle, &id);

        id
    }

    // Validate uniqueness of community (handle and title)
    fn validate_community_uniqueness(&self, dao_id: &DaoId, community_input: &CommunityInput) {
        let dao_communities = self.dao_communities.get(dao_id).unwrap_or(vec![]);
        dao_communities.iter().for_each(|c| {
            let dao_community: Community = self.get_community_by_id(c).into();
            assert_ne!(dao_community.title, community_input.title, "Community title already exists");
        });

        // check if handle exists
        assert!(!self.community_handles.contains_key(&community_input.handle), "Community handle already exists");
    }

    // Validate verticals in list of DAO verticals
    fn validate_verticals_in_dao(&self, dao_id: &DaoId, verticals: &Vec<Vertical>) {
        let dao: DAO = self.get_dao_by_id(dao_id).into();
        verticals.iter().for_each(|c| {
            assert!(dao.verticals.contains(c), "Vertical not in DAO verticals list");
        });
    }

    // Add community to DAO community list
    fn add_dao_communities_internal(&mut self, dao_id: &DaoId, community_id: CommunityId) {
        let mut dao_communities = self.dao_communities.get(dao_id).unwrap_or(vec![]);
        dao_communities.push(community_id);
        self.dao_communities.insert(dao_id, &dao_communities);
    }

    fn add_community_handle_internal(&mut self, handle: &String, community_id: &CommunityId) {
        self.community_handles.insert(handle, &community_id);
    }

    // Change community status
    // Access Level: DAO owners
    pub fn change_community_status(&mut self, id: CommunityId, status: CommunityStatus) {
        let mut community: Community = self.get_community_by_id(&id).into();
        self.validate_community_edit_access(&community);

        community.status = status;
        self.communities.insert(&id, &community.into());
    }

    // Edit DAO community
    // Access Level: DAO owners
    pub fn edit_community(
        &mut self,
        id: CommunityId,
        description: String,
        logo_url: String,
        banner_url: String,
        owners: Vec<AccountId>,
        accounts: Vec<AccountId>,
        verticals: Vec<Vertical>,
        metadata: HashMap<String, String>
    ) {
        let mut community: Community = self.get_community_by_id(&id).into();

        self.validate_community_edit_access(&community);

        community.description = description;
        community.logo_url = logo_url;
        community.banner_url = banner_url;
        community.owners = owners;
        community.verticals = verticals;
        community.metadata = metadata;
        community.accounts = accounts;

        self.communities.insert(&id, &community.into());
    }

    // Validate community edit access
    fn validate_community_edit_access(&self, community: &Community) {
        let has_edit_permission = community.dao_list.iter().any(|dao_id| {
            let dao: DAO = self.get_dao_by_id(dao_id).into();
            dao.owners.contains(&env::predecessor_account_id())
        });
        assert!(has_edit_permission, "Must be DAO owner to edit community");
    }
}

#[cfg(all(test, not(target_arch = "wasm32")))]
mod tests {
    use std::collections::HashMap;
    use near_sdk::VMContext;
    use crate::community::{Community, CommunityInput};
    use crate::{CommunityId, Contract, DaoId};
    use crate::tests::{setup_contract, create_new_dao};

    pub fn add_community(contract: &mut Contract, context: &VMContext, dao_id: DaoId) -> CommunityId {
        contract.add_community(
            dao_id.clone(),
            vec![context.signer_account_id.clone()],
            CommunityInput {
                handle: "test".to_string(),
                title: "Test Community".to_string(),
                description: "Test Community Description".to_string(),
                logo_url: "https://test.com/logo.png".to_string(),
                banner_url: "https://test.com/banner.png".to_string(),
                accounts: vec![]
            },
            vec!["gaming".to_string()],
            HashMap::new()
        )
    }

    #[test]
    pub fn test_add_community() {
        let (context, mut contract) = setup_contract();
        let dao_id = create_new_dao(&context, &mut contract);

        let community_id = add_community(&mut contract, &context, dao_id.clone());
        let community:Community = contract.get_community_by_id(&community_id).into();

        assert_eq!(community.handle, "test", "No community handle");
        assert_eq!(community.title, "Test Community", "No community title");
        assert!(community.dao_list.contains(&dao_id), "Community not added to DAO");
        assert!(community.owners.contains(&context.signer_account_id), "Community owner not added");
        assert!(community.verticals.contains(&"gaming".to_string()), "Community vertical not added");
    }

    #[test]
    pub fn test_edit_community() {
        let (context, mut contract) = setup_contract();
        let dao_id = create_new_dao(&context, &mut contract);

        let community_id = add_community(&mut contract, &context, dao_id.clone());

        contract.edit_community(
            community_id.clone(),
            "New Description".to_string(),
            "https://new.com/logo.png".to_string(),
            "https://new.com/banner.png".to_string(),
            vec![context.signer_account_id.clone()],
            vec![],
            vec!["gaming".to_string()],
            HashMap::new()
        );

        let community:Community = contract.get_community_by_id(&community_id).into();
        assert!(community.owners.contains(&context.signer_account_id), "Community owner not updated");
        assert_eq!(community.description, "New Description", "Community description not updated");
        assert_eq!(community.logo_url, "https://new.com/logo.png", "Community logo not updated");
        assert_eq!(community.banner_url, "https://new.com/banner.png", "Community banner not updated");
    }
}