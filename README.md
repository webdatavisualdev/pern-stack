# pern-stack

(PERN) Postgres Express React Node stack using yarn workspaces.

## Getting Started

### Prerequisites

- [Yarn](https://yarnpkg.com/en/)
- [NodeJS](https://nodejs.org)
- [PostgreSQL](https://www.postgresql.org/)

### Steps

- Run `yarn`.
- Create a new database and run `db.sql` to setup the tables needed.
- In the packages/server directory, create a .env file (or rename the .env.example file to .env) and place the values.
- Make sure the new database with tables is running.
- Run `yarn dev`.
- Navigate to `localhost:3000` in your browser.

### `yarn dev`

Builds the app for development. It is watched by webpack for any changes in the front end (React) and back end (Express). Check out localhost:3000 on browser.
