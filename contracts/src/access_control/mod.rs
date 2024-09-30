use std::collections::HashSet;
use near_sdk::AccountId;
use near_sdk::borsh::{BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Deserialize, Serialize};
use crate::access_control::rules::Rule;
use crate::Contract;

pub mod owners;
pub mod rules;

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Debug, Clone, Ord, PartialOrd, Eq, PartialEq, Hash)]
#[borsh(crate = "near_sdk::borsh")]
pub enum AccessPermissionType {
    DAO,
    Community
}

use crate::*;
use crate::access_control::owners::AccessMetadata;

// Access-control call functions
#[near_bindgen]
impl Contract {

    // Check if the call is self-call
    fn is_self_call(&self) -> bool {
        env::predecessor_account_id() == env::current_account_id()
    }

    // Check if the account has access to a specific rule or access exists
    pub(crate) fn is_account_access(&self, account_id: &AccountId, permission_type: &AccessPermissionType, permission_id: u64, rule: Option<Rule>) -> bool {
        let access_list = self.owner_access.get(&account_id).unwrap_or(vec![]);
        for access_item in access_list {
            let access_item:AccessMetadata = access_item.into();
            if &access_item.permission_type == permission_type && access_item.permission_id == permission_id {
                return if rule.is_some() {
                    access_item.rules_list.contains(&rule.unwrap())
                } else {
                    true
                };
            }
        }
        return false;
    }

    // Add new DAO/Community owners
    // Access Level: Internal, only existing owners or self-call
    pub(crate) fn add_owners_access(&mut self, owners: &Vec<AccountId>, permission_type: AccessPermissionType, permission_id: u64) {
        assert!(
            self.is_self_call() || self.is_account_access(&env::predecessor_account_id(), &permission_type, permission_id, None),
            "No access"
        );

        let mut assigned_owners: Vec<AccountId> = vec![];
        for owner in owners {
            // skip if exists - use edit/remove access to change account permission
            if self.is_account_access(owner, &permission_type, permission_id, None) {
                continue;
            }

            let mut account_access = self.owner_access.get(&owner).unwrap_or_default();
            let metadata = AccessMetadata {
                permission_type: permission_type.clone(),
                permission_id,
                rules_list: HashSet::new(),
                children: HashSet::new(),
                parent: env::predecessor_account_id(),
            };

            account_access.push(metadata.into());
            assigned_owners.push(owner.clone());
            self.owner_access.insert(owner, &account_access);
        }

        // Assign children accounts
        if !self.is_self_call() && assigned_owners.len() > 0 {
            let mut my_account_access: Vec<VersionedAccessMetadata> = self.owner_access.get(&env::predecessor_account_id()).unwrap();

            for (i, metadata) in my_account_access.clone().into_iter().enumerate() {
                let mut metadata:AccessMetadata = metadata.into();
                if metadata.permission_type == permission_type && metadata.permission_id == permission_id {
                    metadata.children.extend(assigned_owners.clone());
                    my_account_access[i] = metadata.into();
                    break;
                }
            }

            self.owner_access.insert(&env::predecessor_account_id(), &my_account_access);
        }
    }

    // Remove access from owners
    // Access Level: Only owners with access
    pub fn remove_owner_access(&mut self, owner: &AccountId, permission_type: AccessPermissionType, permission_id: u64) {
        assert!(self.is_account_access(&env::predecessor_account_id(), &permission_type, permission_id, None), "No access");
        assert!(self.is_account_access(owner, &permission_type, permission_id, None), "Owner don't have such access");
        assert_ne!(&env::predecessor_account_id(), owner, "Cannot remove access from yourself");

        let mut account_access = self.owner_access.get(owner).unwrap_or(vec![]);
        account_access.retain(|metadata| {
            let metadata: AccessMetadata = (*metadata).clone().into();
            !(metadata.permission_type == permission_type && metadata.permission_id == permission_id)
        });

        self.owner_access.insert(owner, &account_access);
    }
}

#[cfg(all(test, not(target_arch = "wasm32")))]
mod tests {
    use near_sdk::{AccountId};
    use crate::access_control::AccessPermissionType;
    use crate::tests::{create_new_dao, setup_contract};

    #[test]
    pub fn test_add_owners_access() {
        let (context, mut contract) = setup_contract();
        let dao_id = create_new_dao(&context, &mut contract);

        let new_owner:AccountId = "new_owner.near".parse().unwrap();
        contract.add_owners_access(&vec![new_owner.clone()], AccessPermissionType::DAO, dao_id.clone());
        assert!(contract.is_account_access(&new_owner, &AccessPermissionType::DAO, dao_id, None));
    }

    #[test]
    pub fn test_remove_owners_access() {
        let (context, mut contract) = setup_contract();
        let dao_id = create_new_dao(&context, &mut contract);

        let new_owner:AccountId = "new_owner.near".parse().unwrap();
        contract.add_owners_access(&vec![new_owner.clone()], AccessPermissionType::DAO, dao_id.clone());
        contract.remove_owner_access(&new_owner, AccessPermissionType::DAO, dao_id);
        assert!(!contract.is_account_access(&new_owner, &AccessPermissionType::DAO, dao_id, None));
    }
}