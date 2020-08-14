## Requirements

* aws cli with credentials (bash: aws configure)
* sam cli

## First deploy

```bash
yarn
yarn first-deploy
```

## Updates

```bash
yarn deploy
```

## Local development

The AWS SAM CLI can also emulate your application's API. Use the `sam local start-api` command to run the API locally on port 3000.

```bash
my-application$ sam local start-api
my-application$ curl http://localhost:3000/
```

## Unit tests

```bash
my-application$ yarn test
```
