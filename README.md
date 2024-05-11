# Team Ninjas Backend

## Description
This is the backend for E-Commerce-Ninjas, written in Node.js with TypeScript.

## Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/atlp-rwanda/e-commerce-ninjas-bn.git
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