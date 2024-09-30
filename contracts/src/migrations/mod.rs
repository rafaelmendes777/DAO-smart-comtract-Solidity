mod migrate_to_v2;

use crate::*;
use near_sdk::{env, borsh::to_vec, Promise, NearToken};

#[derive(BorshDeserialize, BorshSerialize, Debug)]
#[borsh(crate = "near_sdk::borsh")]
pub(crate) enum StateVersion {
    V1,
    V2,
}

const VERSION_KEY: &[u8] = b"VERSION";

fn state_version_read() -> StateVersion {
    env::storage_read(VERSION_KEY)
        .map(|data| {
            StateVersion::try_from_slice(&data).expect("Cannot deserialize the contract state.")
        })
        .unwrap_or(StateVersion::V1)
}

pub(crate) fn state_version_write(version: &StateVersion) {
    let data = to_vec(&version).expect("Cannot serialize the contract state.");
    env::storage_write(VERSION_KEY, &data);
    near_sdk::log!("Migrated to version: {:?}", version);
}

// Migration call functions
#[near_bindgen]
impl Contract {
    pub fn unsafe_self_upgrade() {
        near_sdk::assert_self();

        let contract_code = env::input().expect("No contract code is attached in input").to_vec();
        Promise::new(env::current_account_id())
            .deploy_contract(contract_code)
            .function_call(
                "unsafe_migrate".to_string(),
                Vec::new(),
                NearToken::from_near(0),
                env::prepaid_gas().saturating_sub(near_sdk::Gas::from_tgas(100))
            )
            .as_return();
    }

    pub fn unsafe_migrate() {
        near_sdk::assert_self();

        let current_version = state_version_read();
        near_sdk::log!("Migrating from version: {:?}", current_version);

        match current_version {
            // StateVersion::V1 => {
                // Contract::unsafe_test_migration_v2();
                // state_version_write(&StateVersion::V2);
            // }
            _ => {
                return Contract::migration_done();
            }
        }
    }

    fn migration_done() {
        near_sdk::log!("Migration done.");
        env::value_return(b"\"done\"");
    }

    // Temporary function - state cleanup
    pub fn unsafe_self_state_cleanup(&mut self) {
        near_sdk::assert_self();

        // map all self.dao and cleanup posts for each dao
        self.dao.iter().for_each(|(dao_id, _)| {
            self.dao_posts.remove(&dao_id);
            self.dao_communities.remove(&dao_id);
        });

        for i in 1..=self.total_comments {
            self.comments.remove(&i);
        }

        for i in 1..=self.total_posts {
            self.posts.remove(&i);
        }

        for i in 1..=self.total_communities {
            self.communities.remove(&i);
        }

        self.dao.clear();
        self.label_to_posts.clear();
        self.vertical_posts.clear();
    }

}
