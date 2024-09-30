use near_sdk::borsh::{BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Deserialize, Serialize};
use std::collections::HashMap;
use near_sdk::require;
use super::{PostId};
use crate::{Vertical, CommunityId, MetricLabel, PostLabel};

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
#[borsh(crate = "near_sdk::borsh")]
pub struct Report {
    pub title: String,
    pub description: String,
    pub attachments: Vec<String>,
    pub labels: Vec<PostLabel>,
    pub metrics: HashMap<MetricLabel, String>,
    pub community_id: Option<CommunityId>,
    pub vertical: Option<Vertical>,

    // Specific fields
    pub proposal_id: PostId,
}

// #[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone)]
// #[serde(crate = "near_sdk::serde")]
// #[borsh(crate = "near_sdk::borsh")]
// pub struct ReportV2 {
//     pub title: String,
//     pub description: String,
// }

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
#[serde(tag = "report_version")]
#[borsh(crate = "near_sdk::borsh")]
pub enum VersionedReport {
    V1(Report),
    // V2(ReportV2),
}

impl VersionedReport {
    pub fn latest_version(self) -> Report {
        self.into()
    }

    // pub fn latest_version(self) -> ReportV2 {
    //     self.into()
    // }

    pub fn validate(&self) {
        return match self.clone() {
            VersionedReport::V1(report) => {
                require!(
                    matches!(report.title.chars().count(), 5..=500),
                    "Report title must contain 5 to 500 characters"
                );
                require!(
                     report.description.len() > 0,
                    "No description provided for report"
                );
            },
        };
    }
}

impl From<VersionedReport> for Report {
    fn from(vi: VersionedReport) -> Self {
        match vi {
            VersionedReport::V1(v1) => v1,
            // VersionedReport::V1(_) => unimplemented!(),
        }
    }
}

// impl From<VersionedReport> for ReportV2 {
//     fn from(vi: VersionedReport) -> Self {
//         match vi {
//             VersionedReport::V1(v2) => v2,
//             _ => unimplemented!(),
//         }
//     }
// }

impl From<Report> for VersionedReport {
    fn from(report: Report) -> Self {
        VersionedReport::V1(report)
    }
}
