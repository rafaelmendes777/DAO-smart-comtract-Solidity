use crate::social_db::social_db_contract;
use near_sdk::{env, AccountId, NearToken};
use near_sdk::borsh::{BorshDeserialize, BorshSerialize};
use serde::{Deserialize, Serialize};
use crate::{CommentId, PostId};
use crate::post::PostType;
use near_sdk::serde_json::{json, Value};

const BASE_WIDGET_URL: &str = "ndcdev.near/widget/daos.App";
const NOTIFICATION_DEPOSIT: NearToken = NearToken::from_millinear(7); // 0.007 NEAR

#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize, Clone, Debug, PartialEq)]
#[serde(crate = "near_sdk::serde")]
#[borsh(crate = "near_sdk::borsh")]
pub enum NotificationType {
    Like,
    // Comment,
    Mention,
    NewPost,
}

// Get mentions from text
fn get_text_mentions(text: &str) -> Vec<String> {
    let mut mentions = Vec::new();
    let mut mention = String::new();
    let mut recording = false;

    for ch in text.chars() {
        if recording {
            if ch.is_alphanumeric() || ch == '.' {
                mention.push(ch);
            } else {
                if !mention.is_empty() {
                    mentions.push(mention.clone());
                    mention.clear();
                }
                recording = false;
            }
        }

        if ch == '@' {
            recording = true;
        }
    }

    // Push the last mention if it wasn't pushed yet
    if recording && !mention.is_empty() {
        mentions.push(mention);
    }

    mentions
}

// Notification for one account
fn notify_one(recipient: AccountId, notify_value: Value) {
    social_db_contract()
        .with_static_gas(env::prepaid_gas().saturating_div(4))
        .with_attached_deposit(NOTIFICATION_DEPOSIT.into())
        .set(json!({
            env::current_account_id() : {
            "index": {
              "notify": json!({
                "key": recipient,
                "value": notify_value,
              }).to_string()
            }
          }
        }));
}

// Notification for multiple accounts
fn notify_multiple(accounts: Vec<AccountId>, notify_value: Value) {
    if !accounts.is_empty() {
        let mut notify_values = Vec::new();

        for account in accounts {
            notify_values.push(json!({
                "key": account,
                "value": notify_value,
            }));
        }

        social_db_contract()
            .with_static_gas(env::prepaid_gas().saturating_div(4))
            .with_attached_deposit(NOTIFICATION_DEPOSIT.into())
            .set(json!({
            env::current_account_id() : {
                "index": {
                    "notify": json!(notify_values).to_string()
                }}
            }));
    }
}

// Get notified whenever somebody liked my post/comment
pub fn notify_like(post_id: u64, author: AccountId, comment_id: Option<CommentId>) {
    let account_id = env::predecessor_account_id();
    let params = match &comment_id {
        Some(cid) => json!({
            "page": "comments",
            "post_id": post_id,
            "comment_id": cid,
        }),
        None => json!({
            "page": "post",
            "post_id": post_id,
        }),
    };

    let message = if comment_id.is_some() {
        format!("👍 Comment like received: {} appreciates your thoughts", account_id)
    } else {
        format!("👍 New like: {} enjoyed your post", account_id)
    };

    let notify_value: Value = json!({
        "type": "custom",
        "message": message,
        "widget": BASE_WIDGET_URL,
        "params": params,
    });

    notify_one(author, notify_value)
}

// Get notified when someone tagged me in a post/comment
pub fn notify_mention(title: &str, text: &str, post_id: u64, comment_id: Option<CommentId>) {
    let account_id = env::predecessor_account_id();
    let mentions: Vec<AccountId> = get_text_mentions(text)
        .iter()
        .filter_map(|x| x.parse().ok())
        .collect();

    let (message, params) = match comment_id {
        Some(cid) => (
            format!("🔗 You've been mentioned: {} mentioned you in a comment", account_id),
            json!({
                "page": "comments",
                "comment_id": cid,
                "post_id": post_id
            }),
        ),
        None => (
            format!("🔗 You're in the spotlight: {} mentioned you in '{}'", account_id, title),
            json!({
                "page": "post",
                "post_id": post_id
            }),
        ),
    };

    let notify_value: Value = json!({
        "type": "custom",
        "message": message,
        "widget": BASE_WIDGET_URL,
        "params": params,
    });

    notify_multiple(mentions, notify_value)
}

// New Report or Proposal in DAO in Which I am a Council (DAO owners)
pub fn notify_owners_new_post(dao_owners: Vec<AccountId>, post_id: PostId, title: &str, post_type: PostType) {
    let post_type_str = match post_type {
        PostType::Proposal => "proposal",
        PostType::Report => "report",
    };

    let message = format!("🔔 New DAO {}: '{}' awaits your review", post_type_str, title);

    let notify_value: Value = json!({
        "type": "custom",
        "message": message,
        "widget": BASE_WIDGET_URL,
        "params": {
            "page": "post",
            "post_id": post_id,
        }
    });

    notify_multiple(dao_owners, notify_value)
}

// Added Comment to Post (for post author)
pub fn notify_post_comment(post_id: u64, post_title: &str, post_author: AccountId, comment_id: CommentId) {
    let account_id = env::predecessor_account_id();
    let message = format!("💬 Discussion update: {} added a new comment on '{}'", account_id, post_title);

    let notify_value: Value = json!({
        "type": "custom",
        "message": message,
        "widget": BASE_WIDGET_URL,
        "params": {
            "page": "comments",
            "post_id": post_id,
            "comment_id": comment_id,
        },
    });

    notify_one(post_author, notify_value)
}

// Added Reply to Comment (for comment author)
pub fn notify_comment_reply(post_id: u64, comment_id: CommentId, comment_author: AccountId) {
    let account_id = env::predecessor_account_id();
    let message = format!("🔁 New reply: {} replied to your comment", account_id);

    let notify_value: Value = json!({
        "type": "custom",
        "message": message,
        "widget": BASE_WIDGET_URL,
        "params": {
            "page": "comments",
            "post_id": post_id,
            "comment_id": comment_id,
        },
    });

    notify_one(comment_author, notify_value)
}