# Team Ninjas Backend
[![Reviewed by Hound](https://img.shields.io/badge/Reviewed_by-Hound-8E64B0.svg)](https://houndci.com)
[![Maintainability](https://api.codeclimate.com/v1/badges/839fc3fa18d25362cd8b/maintainability)](https://codeclimate.com/github/atlp-rwanda/e-commerce-***REMOVED***-bn/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/839fc3fa18d25362cd8b/test_coverage)](https://codeclimate.com/github/atlp-rwanda/e-commerce-***REMOVED***-bn/test_coverage)

## Description
This is the backend for E-Commerce-Ninjas, written in Node.js with TypeScript.

## Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/atlp-rwanda/e-commerce-***REMOVED***-bn.git
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Rename `.env.example` to `.env` and add values to all variables.

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
  - `routes/`: API routes.
  - `utilities/`: Utility functions.
  - `validation/`: Validation schemas.
  - `index.ts`: Startup file for all requests.