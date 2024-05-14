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

  ## ESLint Configuration

ESLint is a tool for identifying and reporting on patterns found in ECMAScript/JavaScript code. It helps maintain code quality and ensures consistency across the codebase.

We use ESLint in our project to enforce coding standards and catch common programming errors. Here's how we've configured ESLint for our project:

- We've extended the "airbnb-base" configuration to inherit a set of common JavaScript style rules recommended by Airbnb.
- We've disabled the "one-var", "one-var-declaration-per-line", and "new-cap" rules to allow multiple variable declarations in a single line and to disable the requirement for capitalizing constructor functions.
- We've set the "curly" rule to "warn" instead of "error" to raise a warning instead of an error when curly braces are omitted in control structures.
- We've enabled the "require-jsdoc" rule to enforce the presence of JSDoc comments for functions, methods, and classes, ensuring better code documentation.

### Usage

-To use eslint you should run

```bash
   npm run lint
```

### Fixing Issues

ESLint can automatically fix many common issues in your code, such as formatting inconsistencies and stylistic errors. To automatically fix issues reported by ESLint, run the following command:

```bash
    npm run lint -- --fix
```

## Husky

Husky is a tool that allows you to set up pre-commit hooks in your Git repository. Pre-commit hooks are scripts that run before each commit to enforce code quality and consistency.

In our project, we've configured Husky to run ESLint and lint-staged before each commit. Here's how it works:

When you run git commit, Husky triggers the pre-commit hook.

The pre-commit hook runs the following commands:

- npm run lint: This runs ESLint to check your code for errors and style issues.
- lint-staged: This runs lint-staged, a tool that runs ESLint (or other linters) on files staged for commit. This ensures that only staged files are checked by ESLint, making the process faster.

If any issues are found during these checks, the commit is aborted, and you'll need to fix the issues before committing again.

## Sequelize ORM

We used Sequelize ORM to connect to PostgreSQL database.

### Sample Codes

```javascript
const user = await User.create({ field: "value" });
```

```javascript
const users = await User.findAll();
```

### Run sample

1. Install dependencies

```bash
npm install
```

2. Run sample

```bash
npm start
```
