# DAOs 

List of sub-projects
1. MDAO https://near.org/ndcdev.near/widget/MDAO.App
2. DAOs https://near.org/ndcdev.near/widget/daos.App

## Setup

1. Clone repo
2. Install dependencies

```bash
yarn install
```

3. Run local dev server

```bash
yarn dev
```

4. Navigate to the https://near.org/flags and add the following URL: `http://127.0.0.1:4040/`.

Note: The server will serve all the widgets from all the apps, each app under the account specified in `bos.config.json`. If an app uses a widget from another account that you have in the workspace, the gateway will show you the local widget instead of the remote one. That's great for working on multiple apps/accounts simultaneously.

5. Navigate to dao page on BOS

## Build front-end

To build the widgets for deployment, run the following command:

```bash
yarn install
yarn build
```

## Deployment

To start the deploy cli, run the following command:

```bash
yarn deploy
```

To deploy a specific app, run the following command:

```bash
yarn deploy {appname}
```

## Testing

To test the build/dev scripts, run the following command:

```bash
yarn test:tools
```

## Build smart-contract
```bash
yarn 
```
