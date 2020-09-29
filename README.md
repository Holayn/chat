# chat

A small web project using Vue, TypeScript, NodeJS, and a database of choice (DynamoDB).

Access deployment at: TODO

### Development

**Prerequisites:**
- Yarn 1.x
- NodeJS 10.x

**Installation:**
1. Run `yarn` from the project root
2. Create an `.env` file in the `chat-server` package with the following keys populated:
```
access_key_id=      // aws credentials
secret_access_key=  // aws credentials
jwt_secret=
```
3. Create an `ssl-cert` folder in the `chat-server` package that contains a `server.cert` and a `server.key`

**Development:**
1. Run `yarn start:vue` from the project root
2. Run `yarn start:server` in a separate command line from the project root
3. Visit localhost:8080

Rebuilds happen automatically with source file changes