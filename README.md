# E-COMMERCE WEB APPLICATION SERVER - TEAM NINJAS.

Our e-commerce web application server, developed by Team Ninjas, facilitates smooth online shopping with features like user authentication, product cataloging, and secure payments. It's built to enhance the user experience with high performance and reliability. Suitable for any online marketplace looking to grow.

[![Reviewed by Hound](https://img.shields.io/badge/Reviewed_by-Hound-8E64B0.svg)](https://houndci.com)
[![Maintainability](https://api.codeclimate.com/v1/badges/839fc3fa18d25362cd8b/maintainability)](https://codeclimate.com/github/atlp-rwanda/e-commerce-ninjas-bn/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/839fc3fa18d25362cd8b/test_coverage)](https://codeclimate.com/github/atlp-rwanda/e-commerce-ninjas-bn/test_coverage)
[![Coverage Status](https://coveralls.io/repos/github/atlp-rwanda/e-commerce-ninjas-bn/badge.svg)](https://coveralls.io/github/atlp-rwanda/e-commerce-ninjas-bn)
[![CircleCI](https://dl.circleci.com/status-badge/img/gh/atlp-rwanda/e-commerce-ninjas-bn/tree/develop.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/gh/atlp-rwanda/e-commerce-ninjas-bn/tree/develop)
[![codecov](https://codecov.io/gh/atlp-rwanda/e-commerce-ninjas-bn/graph/badge.svg?token=6ZWudFPM1S)](https://codecov.io/gh/atlp-rwanda/e-commerce-ninjas-bn)

## HOSTED SERVER URL

[https://e-commerce-ninjas-backend.onrender.com/](https://e-commerce-ninjas-backend.onrender.com/)

#### Hosted Swagger Documentation

[https://e-commerce-ninjas-backend.onrender.com/api-docs](https://e-commerce-ninjas-backend.onrender.com/api-docs)

#### Github Repository For E-Commerce-Ninjas Backend

[https://github.com/atlp-rwanda/e-commerce-ninjas-bn](https://github.com/atlp-rwanda/e-commerce-ninjas-bn)

## COMPLETED FEATURES

- Welcome Endpoint
- Register Endpoint
- Verification Email Endpoint
- Resend verification Endpoint
- Login Endpoint
- Admin Update Status Endpoint
- Admin Update Role Endpoint
- Logout Endpoint

## TABLE OF API ENDPOINTS SPECIFICATION AND DESCRIPTION


| No | VERBS | ENDPOINTS                               | STATUS      | ACCESS  | DESCRIPTION                   |
|----|-------|-----------------------------------------|-------------|---------|-------------------------------|
| 1  | GET   | /                                       | 200 OK      | public  | Show welcome message          |
| 2  | POST  | /api/auth/register                      | 201 CREATED | public  | create user account           |
| 3  | GET   | /api/auth/verify-email/:token           | 200 OK      | public  | Verifying email               |
| 4  | POST  | /api/auth/send-verify-email             | 200 OK      | public  | Resend verification email     |
| 5  | POST  | /api/auth/login                         | 200 OK      | public  | Login with Email and Password |
| 6  | PUT   | /api/users/admin-update-user-status/:id | 200 OK      | private | Admin Update Status Endpoint  |
| 7  | PUT   | /api/users/admin-update-role/:id        | 200 OK      | private | Admin Update Role Endpoint    |
| 8  | POST  | /api/auth/logout                        | 200 OK      | private | Logout user                   |

## INSTALLATION

1. Clone the repository:

   ```sh
   git clone https://github.com/atlp-rwanda/e-commerce-ninjas-bn.git
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Copy `.env.example` to `.env` and add values to all variables.

4. Start the server:
   ```sh
   npm run dev
   ```

## FOLDER STRUCTURE

- `.env`: Secure environment variables.
- `src/`: Source code directory.

  - `databases/`: Database related files.
    - `config/`: Database connectivity configuration.
    - `models/`: Sequelize models.
  - `middlewares/`: Middleware functions.
  - `modules/`: Modules like User, Products, etc.
    - `user/`: user module.
      - `controller/`: user controllers.
      - `repository/`: user repositories.
      - `test/`: user test cases.
      - `validation/`: user validation schemas.
  - `routes/`: API routes.
  - `helpers/`: Utility functions.
  - `validation/`: Validation schemas.
  - `services/`: Service functions like sendEmails.
  - `index.ts`: Startup file for all requests.

## INITILIAZE SEQUELIZE CLI

1. Initialize Sequelize CLI:
   ```sh
   npx sequelize-cli init
   ```
2. Generate Seeder:
   ```sh
   npx sequelize-cli seed:generate --name name-of-your-seeder
   ```
3. Generate Migrations:
   ```sh
   npx sequelize-cli migration:generate --name name-of-your-migration
   ```
4. Define Migration:
   Edit the generated migration file to include the tables you want to create.
5. Define Seeder Data:
   Edit the generated seeder file to include the data you want to insert.
6. Run the Seeder:
   ```sh
   npm run createAllSeeders
   ```
7. Run the Migration:
   ```sh
   npm run createAllTables
   ```
8. Delete the Seeder:
   ```sh
   npm run deleteAllSeeders
   ```
9. Delete the Migration:
   ```sh
   npm run deleteAllTables
   ```
