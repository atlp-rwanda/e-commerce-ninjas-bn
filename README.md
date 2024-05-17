# Team Ninjas Backend

This is the backend for E-Commerce-Ninjas, written in Node.js with TypeScript.

[![Reviewed by Hound](https://img.shields.io/badge/Reviewed_by-Hound-8E64B0.svg)](https://houndci.com)
[![Maintainability](https://api.codeclimate.com/v1/badges/839fc3fa18d25362cd8b/maintainability)](https://codeclimate.com/github/atlp-rwanda/e-commerce-ninjas-bn/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/839fc3fa18d25362cd8b/test_coverage)](https://codeclimate.com/github/atlp-rwanda/e-commerce-ninjas-bn/test_coverage)
[![Coverage Status](https://coveralls.io/repos/github/atlp-rwanda/e-commerce-ninjas-bn/badge.svg)](https://coveralls.io/github/atlp-rwanda/e-commerce-ninjas-bn)
[![CircleCI](https://dl.circleci.com/status-badge/img/gh/atlp-rwanda/e-commerce-ninjas-bn/tree/develop.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/gh/atlp-rwanda/e-commerce-ninjas-bn/tree/develop)
[![codecov](https://codecov.io/gh/atlp-rwanda/e-commerce-ninjas-bn/graph/badge.svg?token=6ZWudFPM1S)](https://codecov.io/gh/atlp-rwanda/e-commerce-ninjas-bn)

## HOSTED SERVER URL

[https://e-commerce-ninjas-bn.onrender.com/](https://e-commerce-ninjas-bn.onrender.com/)

#### Hosted Swagger Documentation

[https://e-commerce-ninjas-bn.onrender.com/api-docs](https://e-commerce-ninjas-bn.onrender.com/api-docs)

#### Github Repository For E-Commerce-Ninjas Backend

[https://github.com/atlp-rwanda/e-commerce-ninjas-bn](https://github.com/atlp-rwanda/e-commerce-ninjas-bn)


## Completed Features

- Setup an empty express boilerplate with dotenv
- setup API documentation using swagger
- Integrate CircleCI, CodeClimate, Test coverage and HoundCI
- Link PivotalTracker with Github
- Setup unit testing

## TABLE OF API ENDPOINTS SPECIFICATION AND DESCRIPTION


| No | VERBS | ENDPOINTS | STATUS | ACCESS | DESCRIPTION         |
|----|-------|-----------|--------|--------|-------------------- |
| 1  | GET   | /         | 200 OK | public | Show welcome message|



## Installation

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

## Folder Structure

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



