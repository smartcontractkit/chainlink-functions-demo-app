# Chainlink Functions example

This is an example dApp that utilizes [Chainlink Functions](https://docs.chain.link/chainlink-functions/). The functionality allows users to donate MATIC to their favorite GitHub repositories. Authors of those repositories can then claim their donations. Donations are made in an amount of MATIC per amount of Stars the repository has.

Chainlink Functions is used to determine the total donation amount by multiplying the MATIC amount by the star count. There's no back-end involved in the whole donation process.

NOTE: This example is not production ready as edge cases are not handled.

## Getting Started

1. `cd <project_dir>`
2. `pnpm install`
   - no pnpm? no problem. `npm install -g pnpm` or npm / yarn classic work fine.
3. Generate and build all required files `pnpm build`.
4. Deploy your GH calculator `npx hardhat deploy-calculator`.
5. Store the returned address in the `NEXT_PUBLIC_CONTRACT_ADDRESS` environment variable.
6. Configure the dApp by setting the appropriate environment variables.
7. Run the application.
   1. Serve the build.
   2. Or run the dev server with `pnpm dev`.

### Local database

This repository comes with a Docker compose setup to run a local MongoDB instance. One can use the example values in `.env.example` to connect to it. Start the server by running

```shell
docker compose up -d
```

To remove the stack again run

```shell
docker compose down --remove-orphans --volumes
```

## Configuration

- `NEXT_PUBLIC_GA_TRACKING_ID` - Set to your Google Analytics tracking id to enable GA.
- `MONGO_USER` - Non-root user to use for the database connection with MongoDB.
- `MONGO_PW` - Password for the user specified in `MONGO_USER`.
- `DATABASE_URL` - Full URI to the MongoDB instance, including `MONGO_USER` and `MONGO_PW`. Mismatching these settings will result in a non-working setup.
- `PRIVATE_KEY` - Private key for the escrow wallet in the Mumbai network.
- `NEXTAUTH_URL` - Set this to your domain for the oAuth flow callback.
- `NEXTAUTH_SECRET` - See https://next-auth.js.org/configuration/options#nextauth_secret
- `GITHUB_OAUTH_CLIENT_ID` - Client ID as provided by GitHub
- `GITHUB_OAUTH_CLIENT_SECRET` - Client Secret as provided by GitHub
- `NEXT_PUBLIC_CONTRACT_ADDRESS` - Where the GH calculator is deployed
- `NEXT_PUBLIC_ESCROW_ADDRESS` - Escrow wallet address, this should match the private key

## Structure

- `contracts/` - Contains the GitHub calculator contract which uses Chainlink Functions to calculate the total amount owed. It also contains helper code provided by Chainlink.
- `Functions-GitHub-calculation.js` - This is the actual code that runs on Chainlink Functions.
- `components`/`hooks`/`lib`/`pages`/`public`/`sections`/`styles` - Are all part of the Next.JS application.
- `tasks` - Contains the Hardhat tasks to deploy a new version of the Calculator contract.
