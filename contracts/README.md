# MDAO smart-contract

## Overview

The smart contract responsible for managing DAOs, communities, requests/reports, and permissions made available via the [MDAO frontend](https://mdao.near.social).

## Getting Started

### Requirements
- NEAR CLI
- Rust 1.6.9+

## Building

From the root directory, run:

```cmd
cd contracts
./build.sh
```

## Deploying

Using [NEAR CLI RS](https://github.com/near/near-cli-rs), run the following command. Be sure to set your own account id and corresponding network.

```cmd
cd contracts
near contract deploy mdao-owner.testnet use-file ./res/mdao.wasm with-init-call new json-args {} prepaid-gas '1 TGas' attached-deposit '0 NEAR' network-config testnet sign-with-keychain send
```

```cmd
cd contracts

ACCOUNT_ID=mdao-owner.testnet
CONTRACT=v1.mdao-owner.testnet

near call "$CONTRACT" unsafe_self_upgrade "$(base64 < res/mdao.wasm)" --base64 --accountId $ACCOUNT_ID --gas 300000000000000
```

## Running Tests

From the root directory, run:

```cmd
npm run contract:test
```

## Smart-contract methods

To use the smart-contract methods, you need to set variables: 
```cmd
ACCOUNT_ID=test-mdao.near
CONTRACT=v1.test-mdao.near
```

### DAO

- Add DAO
```cmd
NEAR_ENV=mainnet near call "$CONTRACT" add_dao '{"body": {"title":"First DAO", "handle":"first-dao", "account_id":"some_account_id.near", "description":"Some description...","logo_url":"logo url", "banner_url":"banner url","is_congress":false}, "owners":["'$ACCOUNT_ID'"], "verticals":["vertical1","vertical2"], "metrics":["metric-title"], "metadata":{"website":"test website"}}' --accountId "$CONTRACT"
```

- Get list of all DAOs (view)
```cmd
NEAR_ENV=mainnet near view "$CONTRACT" get_dao_list ''
```

- Get DAO by ID (view)
```cmd
NEAR_ENV=mainnet near view "$CONTRACT" get_dao_by_id '{"id":1}'
```

- Get DAO by handle (view)
```cmd
NEAR_ENV=mainnet near view "$CONTRACT" get_dao_by_handle '{"handle":"first-dao"}'
```


### Requests/reports

- Add Proposal
```cmd
NEAR_ENV=mainnet near call "$CONTRACT" add_post '{"dao_id":1, "body":{"title":"Proposal title", "description":"Proposal description", "attachments":["some_url"], "labels":["label1","label2"], "metrics":{"metric-title":"metric-value"}, "reports":[], "requested_amount": 1000, "post_type": "Proposal", "proposal_version": "V1"}}' --accountId "$ACCOUNT_ID"
```

- Add Report
```cmd
NEAR_ENV=mainnet near call "$CONTRACT" add_post '{"dao_id":1, "body":{"title":"Report title", "description":"Report description", "attachments":[], "labels":[], "metrics":{"metric-title":"metric-value"}, "proposal_id":1, "post_type": "Report", "report_version": "V1"}}' --accountId "$ACCOUNT_ID"
```

- Edit Proposal
```cmd
NEAR_ENV=mainnet near call "$CONTRACT" edit_post '{"id":1, "body":{"title":"Proposal title upd", "description":"Proposal description upd", "attachments":[], "labels":["label1"], "metrics":{}, "reports":[], "requested_amount": 2000, "post_type": "Proposal", "proposal_version": "V1"}}' --accountId "$ACCOUNT_ID"
```

- Edit Report
```cmd
NEAR_ENV=mainnet near call "$CONTRACT" edit_post '{"id":1, "body":{"title":"Report title upd", "description":"Report description upd", "attachments":["some_url"], "labels":["label2"], "metrics":{}, "proposal_id":1, "post_type": "Report", "report_version": "V1"}}' --accountId "$ACCOUNT_ID"
```

- Like proposals/reports
```cmd
NEAR_ENV=mainnet near call "$CONTRACT" post_like '{"id":1}' --accountId "$ACCOUNT_ID"
```

- Remove like from proposals/reports
```cmd
NEAR_ENV=mainnet near call "$CONTRACT" post_unlike '{"id":1}' --accountId "$ACCOUNT_ID"
```

- Get all proposals/reports EXCEPT "in_review" for all DAO (view)
```cmd
NEAR_ENV=mainnet near view "$CONTRACT" get_all_posts '{"page":0, "limit":100}'
```

- Get all proposals/reports for specific DAO EXCEPT "in_review" (view)
```cmd
NEAR_ENV=mainnet near view "$CONTRACT" get_dao_posts '{"dao_id":1}'
```

- Get all DAO proposals/reports by status, for example "in_review" (view)
```cmd
NEAR_ENV=mainnet near view "$CONTRACT" get_dao_posts '{"dao_id":1, "status":"InReview"}'
```
Status list: InReview, New, Approved, Rejected, Closed

- Get proposals/reports by author (view)
```cmd
NEAR_ENV=mainnet near view "$CONTRACT" get_posts_by_author '{"author":"'$ACCOUNT_ID'"}'
```

- Get post by ID (view)
```cmd
NEAR_ENV=mainnet near view "$CONTRACT" get_post_by_id '{"id":1}'
```

- Get post history (view)
```cmd
NEAR_ENV=mainnet near view "$CONTRACT" get_post_history '{"id":1}'
```


### Comments

- Add Comment
```cmd
NEAR_ENV=mainnet near call "$CONTRACT" add_comment '{"post_id":1, "description":"Some comment text", "attachments":["some_url"]}' --accountId "$ACCOUNT_ID"
```

- Add reply to comment
```cmd
NEAR_ENV=mainnet near call "$CONTRACT" add_comment '{"reply_to":1, "post_id":1, "description":"Reply comment text", "attachments":[]}' --accountId "$ACCOUNT_ID"
```

- Edit comment
```cmd
NEAR_ENV=mainnet near call "$CONTRACT" edit_comment '{"id":1, "description":"Some text upd", "attachments":[]}' --accountId "$ACCOUNT_ID"
```

- Get all comments for post (view)
```cmd
NEAR_ENV=mainnet near view "$CONTRACT" get_post_comments '{"post_id":1}'
```

- Get comment by ID (view)
```cmd
NEAR_ENV=mainnet near view "$CONTRACT" get_comment_by_id '{"id":1}'
```

- Get comments by author (view)
```cmd
NEAR_ENV=mainnet near view "$CONTRACT" get_comments_by_author '{"author":"'$ACCOUNT_ID'"}'
```

- Get comment history (view)
```cmd
NEAR_ENV=mainnet near view "$CONTRACT" get_comment_history '{"id":1}'
```

- Like comment
```cmd
NEAR_ENV=mainnet near call "$CONTRACT" comment_like '{"id":1}' --accountId "$ACCOUNT_ID"
```

- Remove like from comment
```cmd
NEAR_ENV=mainnet near call "$CONTRACT" comment_unlike '{"id":1}' --accountId "$ACCOUNT_ID"
```


### Communities

- Add community
```cmd
NEAR_ENV=mainnet near call "$CONTRACT" add_community '{"dao_id":1, "community_input":{"handle":"community-handle", "title":"Community title", "description":"Some description", "logo_url":"logo url", "banner_url":"banner url"}, "owners":["'$ACCOUNT_ID'"], "accounts":[], "verticals":[], "metadata":{"website":"test website"}}' --accountId "$ACCOUNT_ID"
```

- Edit community
```cmd
NEAR_ENV=mainnet near call "$CONTRACT" edit_community '{"id":1, "description":"Some description upd...","logo_url":"logo url upd", "banner_url":"banner url upd","owners":["'$ACCOUNT_ID'"], "accounts":[], "verticals":[], "metadata":{"website":"test website"}}' --accountId "$ACCOUNT_ID"
```

- Change community status
```cmd
NEAR_ENV=mainnet near call "$CONTRACT" change_community_status '{"id":1, "status":"Inactive"}' --accountId "$ACCOUNT_ID"
```

- Get list of communities for DAO (view)
```cmd
NEAR_ENV=mainnet near view "$CONTRACT" get_dao_communities '{"dao_id":1}'
```

- Get community by ID (view)
```cmd
NEAR_ENV=mainnet near view "$CONTRACT" get_dao_communities '{"id":1}'
```

- Get community by handle (view)
```cmd
NEAR_ENV=mainnet near view "$CONTRACT" get_community_by_handle '{"handle":"some-community"}'
```

### Access Control
- Get user access roles (view)
```cmd
NEAR_ENV=mainnet near view "$CONTRACT" get_account_access '{"account_id":"account.near"}'
```

### User

- Get user follow list by type (view)
```cmd
NEAR_ENV=mainnet near view "$CONTRACT" get_follow_list '{"follow_type":"DAO", dao_id":1}'
```
follow_type options: DAO, Community