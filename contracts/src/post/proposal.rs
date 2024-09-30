use near_sdk::borsh::{BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Deserialize, Serialize};
use super::{PostId};
use crate::{Vertical, CommunityId, MetricLabel, PostLabel};
use std::collections::HashMap;
use near_sdk::{require};

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
#[borsh(crate = "near_sdk::borsh")]
pub struct Proposal {
    pub title: String,
    pub description: String,
    pub attachments: Vec<String>,
    pub labels: Vec<PostLabel>,
    pub metrics: HashMap<MetricLabel, String>,
    pub community_id: Option<CommunityId>,
    pub vertical: Option<Vertical>,

    // Specific fields
    pub reports: Vec<PostId>,
    pub requested_amount: f64,
    // #[serde(with = "u64_dec_format")]
    // pub due_timestamp: Option<Timestamp>,
}

// #[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone)]
// #[serde(crate = "near_sdk::serde")]
// #[borsh(crate = "near_sdk::borsh")]
// pub struct ProposalV2 {
//     pub title: String,
//     pub description: String,
// }

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
#[serde(tag = "proposal_version")]
#[borsh(crate = "near_sdk::borsh")]
pub enum VersionedProposal {
    V1(Proposal),
    // V2(ProposalV2),
}

impl VersionedProposal {
    pub fn latest_version(self) -> Proposal {
        self.into()
    }

    pub fn latest_version_mut(&mut self) -> &mut Proposal {
        match self {
            VersionedProposal::V1(proposal) => proposal,
            // VersionedProposal::V2(proposal) => proposal,
        }
    }

    pub fn validate(&self) {
        return match self.clone() {
            VersionedProposal::V1(proposal) => {
                require!(
                    matches!(proposal.title.chars().count(), 5..=500),
                    "Proposal title must contain 5 to 500 characters"
                );
                require!(
                     proposal.description.len() > 0,
                    "No description provided for proposal"
                );
            },
        };
    }

}

impl From<VersionedProposal> for Proposal {
    fn from(vi: VersionedProposal) -> Self {
        match vi {
            VersionedProposal::V1(v1) => v1,
            // VersionedProposal::V2(_) => unimplemented!(),
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

impl From<Proposal> for VersionedProposal {
    fn from(proposal: Proposal) -> Self {
        VersionedProposal::V1(proposal)
    }
}
