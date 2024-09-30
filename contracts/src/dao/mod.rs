use near_sdk::borsh::{BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{AccountId};
use std::collections::{HashMap};
use crate::{Vertical, DaoId, MetricLabel};

#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
#[borsh(crate = "near_sdk::borsh")]
pub struct DAOInput {
    pub title: String,
    pub handle: String,
    pub description: String,
    pub logo_url: String,
    pub banner_url: String,
    pub is_congress: bool,
    pub account_id: AccountId,
}

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
#[borsh(crate = "near_sdk::borsh")]
pub struct DAO {
    pub id: DaoId,
    pub handle: String,
    pub title: String,
    pub description: String,
    pub logo_url: String,
    pub banner_url: String,
    pub is_congress: bool,
    pub account_id: AccountId,
    pub owners: Vec<AccountId>,
    pub verticals: Vec<Vertical>,
    pub metrics: Vec<MetricLabel>,
    pub metadata: HashMap<String, String>,
}

// #[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone)]
// #[serde(crate = "near_sdk::serde")]
// #[borsh(crate = "near_sdk::borsh")]
// pub struct DaoV2 {
//     pub name: String,
//     pub description: String,
// }

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
#[serde(tag = "dao_version")]
#[borsh(crate = "near_sdk::borsh")]
pub enum VersionedDAO {
    V1(DAO),
    // V2(DaoV2),
}

impl VersionedDAO {
    pub fn latest_version(self) -> DAO {
        self.into()
    }

    // pub fn latest_version(self) -> DaoV2 {
    //     self.into()
    // }
}

impl From<VersionedDAO> for DAO {
    fn from(vi: VersionedDAO) -> Self {
        match vi {
            VersionedDAO::V1(v1) => v1,
            // VersionedDAO::V2(_) => unimplemented!(),
        }
    }
}

// impl From<VersionedProposal> for ProposalV2 {
//     fn from(vi: VersionedProposal) -> Self {
//         match vi {
//             VersionedProposal::V2(v2) => v2,
//             _ => unimplemented!(),
//         }
//     }
// }

impl From<DAO> for VersionedDAO {
    fn from(dao: DAO) -> Self {
        VersionedDAO::V1(dao)
    }
}

use crate::*;

// DAO call functions
#[near_bindgen]
impl Contract {

    // Add new DAO
    // Access Level: Only self-call
    pub fn add_dao(
        &mut self,
        body: DAOInput,
        owners: Vec<AccountId>,
        verticals: Vec<Vertical>,
        metrics: Vec<MetricLabel>,
        metadata: HashMap<String, String>
    ) -> DaoId {
        near_sdk::assert_self();

        self.validate_dao_uniqueness(&body);

        let id = self.dao.len() + 1 as DaoId;
        let dao = DAO {
            id: id.clone(),
            handle: body.handle,
            title: body.title,
            description: body.description,
            logo_url: body.logo_url,
            banner_url: body.banner_url,
            is_congress: body.is_congress,
            owners: owners.clone(),
            account_id: body.account_id,
            verticals,
            metrics,
            metadata,
        };
        self.dao.insert(&id, &dao.into());

        if owners.len() > 0 {
            self.add_owners_access(&owners, AccessPermissionType::DAO, id);
        }

        near_sdk::log!("DAO ADDED: {}", id);
        id
    }

    // Validate DAO uniqueness (handle and title)
    fn validate_dao_uniqueness(&self, body: &DAOInput) {
        self.dao.iter().for_each(|(_, dao_ref)| {
            let dao: DAO = dao_ref.into();
            assert_ne!(dao.handle, body.handle, "DAO handle already exists");
            assert_ne!(dao.title, body.title, "DAO title already exists");
        });
    }

    // Validate DAO ownership
    pub(crate) fn validate_dao_ownership(&self, account_id: &AccountId, dao_id: &DaoId) {
        let dao: DAO = self.get_dao_by_id(dao_id).into();
        assert!(dao.owners.contains(account_id), "Must be DAO owner to add community");
    }

    // Edit DAO
    // Access Level: Only self-call
    pub fn edit_dao(
        &mut self,
        id: DaoId,
        body: DAOInput,
        // owners: Vec<AccountId>,
        verticals: Vec<Vertical>,
        metrics: Vec<MetricLabel>,
        metadata: HashMap<String, String>
    ) {
        near_sdk::assert_self();
        near_sdk::log!("EDIT DAO: {}", id);

        let mut dao: DAO = self.get_dao_by_id(&id).into();
        dao.title = body.title;
        dao.description = body.description;
        dao.logo_url = body.logo_url;
        dao.banner_url = body.banner_url;
        dao.is_congress = body.is_congress;
        dao.account_id = body.account_id;
        dao.verticals = verticals;
        dao.metrics = metrics;
        dao.metadata = metadata;
        // dao.owners = owners;

        self.dao.insert(&id, &dao.into());
    }

    pub fn user_follow_dao(&mut self, id: DaoId){
        let account_id = env::predecessor_account_id();
        self.get_dao_by_id(&id);

        let mut user_follow_list = self.user_follow.get(&(FollowType::DAO, account_id.clone())).unwrap_or(vec![]);
        if !user_follow_list.contains(&id) {
            user_follow_list.push(id);
            self.user_follow.insert(&(FollowType::DAO, account_id), &user_follow_list);
        }
    }
}

#[cfg(all(test, not(target_arch = "wasm32")))]
mod tests {
    use std::collections::HashMap;
    use super::{DAO, DAOInput};
    use crate::tests::{setup_contract, create_new_dao};
    use crate::user::FollowType;

    #[test]
    pub fn test_add_dao() {
        let (context, mut contract) = setup_contract();
        let dao_id = create_new_dao(&context, &mut contract);

        let dao:DAO = contract.get_dao_by_id(&dao_id).into();

        assert_eq!(dao.title, "DAO Title".to_string());
        assert_eq!(dao.handle, "dao-title".to_string());
        assert_eq!(dao.owners.len(), 1);
    }

    #[test]
    pub fn test_edit_dao() {
        let (context, mut contract) = setup_contract();
        let dao_id = create_new_dao(&context, &mut contract);

        let mut metadata = HashMap::new();
        metadata.insert("website".to_string(), "https://website.com".to_string());

        contract.edit_dao(
            dao_id,
            DAOInput {
                title: "DAO Title Updated".to_string(),
                handle: "dao-title".to_string(),
                description: "DAO Description updated".to_string(),
                logo_url: "https://logo2.com".to_string(),
                banner_url: "https://banner2.com".to_string(),
                is_congress: false,
                account_id: "some_account_id.near".parse().unwrap(),
            },
            vec!["Some vertical".to_string()],
            vec!["tx-count".to_string(), "volume".to_string()],
            metadata
        );

        let dao:DAO = contract.get_dao_by_id(&dao_id).into();

        assert_eq!(dao.title, "DAO Title Updated".to_string());
        assert_eq!(dao.description, "DAO Description updated".to_string());
        assert_eq!(dao.logo_url, "https://logo2.com".to_string());
        assert_eq!(dao.banner_url, "https://banner2.com".to_string());
        assert_eq!(dao.account_id, "some_account_id.near".to_string());
        assert_eq!(dao.is_congress, false);
        assert_eq!(dao.verticals.len(), 1);
        assert_eq!(dao.metrics.len(), 2);
        assert_eq!(dao.metadata.len(), 1);
    }

    #[test]
    pub fn test_user_follow_dao() {
        let (context, mut contract) = setup_contract();
        let dao_id = create_new_dao(&context, &mut contract);

        contract.user_follow_dao(dao_id.clone());
        let user_follow_list = contract.user_follow.get(&(FollowType::DAO, context.signer_account_id.clone())).unwrap();
        assert_eq!(user_follow_list.len(), 1);
        assert_eq!(user_follow_list[0], dao_id);
    }
}
