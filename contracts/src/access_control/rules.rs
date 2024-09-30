use std::hash::{Hash};
use near_sdk::borsh::{BorshDeserialize, BorshSerialize};
use serde::{Deserialize, Serialize};

#[derive(
    BorshSerialize,
    BorshDeserialize,
    Serialize,
    Deserialize,
    Clone,
    PartialOrd,
    PartialEq,
    Ord,
    Eq,
    Hash,
    Debug,
)]
#[serde(crate = "near_sdk::serde")]
#[serde(from = "String")]
#[serde(into = "String")]
#[borsh(crate = "near_sdk::borsh")]
pub enum Rule {
    FullAccess,
    AddLabelsDAO,
}

pub const FULL_ACCESS: &str = "*";

impl From<String> for Rule {
    fn from(full_str: String) -> Self {
        match full_str.as_str() {
            FULL_ACCESS => Rule::FullAccess,
            "AddLabelsDAO" => Rule::AddLabelsDAO,
            _ => panic!("Invalid rule"),
        }
    }
}

impl Into<String> for Rule {
    fn into(self) -> String {
        match self {
            Rule::FullAccess => FULL_ACCESS.to_string(),
            Rule::AddLabelsDAO => "AddLabelsDAO".to_string(),
        }
    }
}