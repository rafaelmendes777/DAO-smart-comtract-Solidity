#!/bin/bash

ACCOUNT_ID=mdao-owner.testnet
CONTRACT=v1.mdao-owner.testnet

near delete "$CONTRACT" "$ACCOUNT_ID" --force
near create-account "$CONTRACT" --masterAccount "$ACCOUNT_ID" --initialBalance 10

near deploy "$CONTRACT" ./res/mdao.wasm --initFunction new --initArgs '{}'

## -------- Data Seed --------
# Add DAO
 near call "$CONTRACT" add_dao '{"body": {"title":"First DAO", "handle":"first-dao", "account_id":"some_account_id.testnet", "description":"Some description...","logo_url":"logo", "banner_url":"banner","is_congress":false}, "owners":["'$ACCOUNT_ID'"], "verticals":["Gaming","NFT"], "metrics":[], "metadata":{"website":"test website"}}' --accountId "$CONTRACT"
 near call "$CONTRACT" add_dao '{"body": {"title":"Second DAO", "handle":"second-dao", "account_id":"some_account2_id.testnet", "description":"Some description 2...","logo_url":"logo2", "banner_url":"banner2","is_congress":false}, "owners":["'$ACCOUNT_ID'","owner.testnet"], "verticals":[], "metrics":[], "metadata":{"website":"test website"}}' --accountId "$CONTRACT"

# Add DAO Proposal
for i in {1..1000}
do
  near call "$CONTRACT" add_post '{"dao_id":1, "body":{"title":"Proposal title #1/'"$i"'", "description":"Proposal description 1 Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1Proposal description 1... @vlodkow.near @vlodkow1.near @vlodkow2.near @vlodkow3.near @vlodkow4.near @vlodkow5.near @vlodkow6.near @vlodkow7.near @vlodkow8.near @vlodkow9.near @vlodkow10.near", "attachments":[], "labels":[], "metrics":{}, "reports":[], "requested_amount": 3000, "post_type": "Proposal", "proposal_version": "V1"}}' --accountId "$ACCOUNT_ID"
  near call "$CONTRACT" add_post '{"dao_id":1, "body":{"title":"Report title #2/'"$i"'", "description":"Report description 2...Report description 2...Report description 2...Report description 2...Report description 2...Report description 2...Report description 2...Report description 2...Report description 2...Report description 2...Report description 2...", "attachments":["https://some_attachment.com", "https://some2_attachment.com"], "labels":["report-label", "gaming"], "metrics":{}, "proposal_id":1, "post_type": "Report", "report_version": "V1"}}' --accountId "$ACCOUNT_ID"
  near call "$CONTRACT" add_post '{"dao_id":2, "body":{"title":"Proposal title #3/'"$i"'", "description":"Proposal description 3...", "attachments":[], "labels":[], "metrics":{}, "reports":[], "requested_amount": 10000, "post_type": "Proposal", "proposal_version": "V1"}}' --accountId "$ACCOUNT_ID"
done

# Like Proposal/Report
 near call "$CONTRACT" post_like '{"id":1}' --accountId "$ACCOUNT_ID"

# Add Comment
 near call "$CONTRACT" add_comment '{"post_id":1, "description":"Some comment text", "attachments":["https://attachment.com"]}' --accountId "$ACCOUNT_ID"

# Add Comment reply
 near call "$CONTRACT" add_comment '{"post_id":1, "description":"Reply comment text", "attachments":[], "reply_id":1}' --accountId "$ACCOUNT_ID"

# Like comment
 near call "$CONTRACT" comment_like '{"id":1}' --accountId "$ACCOUNT_ID"

# Remove like from post
 near call "$CONTRACT" post_unlike '{"id":1}' --accountId "$ACCOUNT_ID"

# Add Community
 near call "$CONTRACT" add_community '{"dao_id":1, "community_input":{"handle":"community-handle", "title":"Community title", "description":"Some description", "logo_url":"logo url", "banner_url":"banner url", "accounts":[]}, "owners":["'$ACCOUNT_ID'"], "verticals":[], "metadata":{"website":"test website"}}' --accountId "$ACCOUNT_ID"

# Change Community Status
 near call "$CONTRACT" change_community_status '{"id":1, "status":"Inactive"}' --accountId "$ACCOUNT_ID"
