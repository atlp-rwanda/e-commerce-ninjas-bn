# E-COMMERCE WEB APPLICATION SERVER - TEAM NINJAS.

Our e-commerce web application server, developed by Team Ninjas, facilitates smooth online shopping with features like user authentication, product cataloging, and secure payments. It's built to enhance the user experience with high performance and reliability. Suitable for any online marketplace looking to grow.

[![Reviewed by Hound](https://img.shields.io/badge/Reviewed_by-Hound-8E64B0.svg)](https://houndci.com)
[![Maintainability](https://api.codeclimate.com/v1/badges/839fc3fa18d25362cd8b/maintainability)](https://codeclimate.com/github/atlp-rwanda/e-commerce-ninjas-bn/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/839fc3fa18d25362cd8b/test_coverage)](https://codeclimate.com/github/atlp-rwanda/e-commerce-ninjas-bn/test_coverage)
[![Coverage Status](https://coveralls.io/repos/github/atlp-rwanda/e-commerce-ninjas-bn/badge.svg)](https://coveralls.io/github/atlp-rwanda/e-commerce-ninjas-bn)
[![CircleCI](https://dl.circleci.com/status-badge/img/gh/atlp-rwanda/e-commerce-ninjas-bn/tree/develop.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/gh/atlp-rwanda/e-commerce-ninjas-bn/tree/develop)
[![codecov](https://codecov.io/gh/atlp-rwanda/e-commerce-ninjas-bn/graph/badge.svg?token=6ZWudFPM1S)](https://codecov.io/gh/atlp-rwanda/e-commerce-ninjas-bn)

## HOSTED SERVER URL

[https://e-commerce-ninjas-platform-backend.onrender.com/](https://e-commerce-ninjas-platform-backend.onrender.com/)

#### HOSTED SWAGGER DOCUMENTATION

[https://e-commerce-ninjas-platform-backend.onrender.com/api-docs](https://e-commerce-ninjas-platform-backend.onrender.com/api-docs)

#### GITHUB REPOSITORY FOR E-COMMERCE-NINJAS BACKEND

[https://github.com/atlp-rwanda/e-commerce-ninjas-bn](https://github.com/atlp-rwanda/e-commerce-ninjas-bn)

## COMPLETED FEATURES

- Welcome Endpoint
- Register Endpoint
- Verification Email Endpoint
- Resend verification Endpoint
- Login Endpoint
- Verify OTP Endpoint
- 2FA Endpoint
- login vie google Endpoint
- Forget Password Endpoint
- Reset Password Endpoint
- Change Password Endpoint
- Admin Update Status Endpoint
- Admin Update Role Endpoint
- Admin get users Endpoint
- Admin get user Endpoint
- Logout Endpoint
- Update User Profile Endpoint
- Get User Profile Endpoint
- Seller create shop Endpoint
- Seller create product Endpoint
- Seller update product Endpoint
- Seller Delete Item Endpoint
- Seller get statistics Endpoint
- Seller update product status Endpoint
- Seller get products Endpoint
- User get product Endpoint
- User search products Endpoint
- buyer get specific product Endpoint
- seller get specific product Endpoint
- Buyer get carts Endpoint
- Buyer get single cart Endpoint
- Buyer clear carts Endpoint
- Buyer clear cart Endpoint
- Buyer clear cart product Endpoint
- Buyer create-update cart Endpoint
- buyer add product to wish list Endpoint
- buyer view All products from wishList Endpoint
- buyer view single product from wishList Endpoint
- buyer delete products from wishlist Endpoint
- buyer delete product from wishlist Endpoint
- User get notifications Endpoint
- User get notification Endpoint
- User mark All notifications Endpoint
- User mark notification Endpoint
- Buyer review product Endpoint
- Submit a seller request
- Buyer track order status Endpoint
- Admin update order status EndPoint 
- Buyer get order history Endpoint

## TABLE OF API ENDPOINTS SPECIFICATION AND DESCRIPTION

| No  | VERBS  | ENDPOINTS                                             | STATUS      | ACCESS  | DESCRIPTION                         |
| --- | ------ | ----------------------------------------------------- | ----------- | ------- | ----------------------------------- |
| 1   | GET    | /                                                     | 200 OK      | public  | Show welcome message                |
| 2   | POST   | /api/auth/register                                    | 201 CREATED | public  | create user account                 |
| 3   | GET    | /api/auth/verify-email/:token                         | 200 OK      | public  | Verifying email                     |
| 4   | POST   | /api/auth/send-verify-email                           | 200 OK      | public  | Resend verification email           |
| 5   | POST   | /api/auth/login                                       | 200 OK      | public  | Login with Email and Password       |
| 6   | POST   | /api/auth/verify-otp/:id                              | 200 OK      | public  | Verify OTP                          |
| 7   | PUT    | /api/auth/enable-2f                                   | 200 OK      | private | 2FA Endpoint                        |
| 8   | POST   | /api/auth/google                                      | 200 OK      | public  | Login Via google account            |
| 9   | POST   | /api/auth/logout                                      | 200 OK      | private | Logout user                         |
| 10  | POST   | /api/auth/forget-password                             | 200 OK      | public  | Forget Password                     |
| 11  | PUT    | /api/auth/reset-password/:token                       | 200 OK      | public  | Reset Password                      |
| 12  | GET    | /api/user/change-password                             | 200 OK      | private | User Update password                |
| 13  | PUT    | /api/user/user-update-profile                         | 200 OK      | private | Update User Profile Endpoint        |
| 14  | GET    | /api/user/user-get-profile                            | 200 OK      | private | Get User Profile Endpoint           |
| 15  | PUT    | /api/user/admin-update-user-status/:id                | 200 OK      | private | Admin Update Status Endpoint        |
| 16  | PUT    | /api/user/admin-update-role/:id                       | 200 OK      | private | Admin Update role Endpoint          |
| 17  | GET    | /api/user/admin-get-users                             | 200 OK      | private | Admin get all users Endpoint        |
| 18  | GET    | /api/user/admin-get-user/:id                          | 200 OK      | private | Admin get one user Endpoint         |
| 19  | POST   | /api/shop/seller-create-shop                          | 201 OK      | private | Create shop for products            |
| 20  | POST   | /api/shop/seller-create-product                       | 201 OK      | private | create product in shop              |
| 21  | PUT    | /api/shop/seller-update-product/:id                   | 200 OK      | private | update product in shop              |
| 22  | DELETE | /api/shop/delete-product/:id                          | 200 OK      | private | Delete Item in Collection           |
| 23  | POST   | /api/shop/seller-statistics                           | 200 OK      | private | Get seller statistics per timeframe |
| 24  | PUT    | /api/shop/seller-update-product-status/:id            | 200 OK      | private | Seller update product status        |
| 25  | GET    | /api/shop/seller-get-products                         | 200 OK      | private | Seller get products                 |
| 26  | GET    | /api/shop/user-get-products                           | 200 OK      | public  | User get product                    |
| 27  | GET    | /api/shop/user-search-products                        | 200 OK      | public  | User search products                |
| 28  | GET    | /api/shop/user-get-product/:id                        | 200 OK      | public  | Buyer get specific products         |
| 29  | GET    | /api/shop/seller-get-product/:id                      | 200 OK      | private | seller get specific products        |
| 30  | GET    | /api/cart/buyer-get-carts                             | 200 OK      | private | Buyer get carts                     |
| 31  | GET    | /api/cart/buyer-get-cart/:cartId                      | 200 OK      | private | Buyer get cart details              |
| 32  | DELETE | /api/cart/buyer-clear-cart-product/:cartId/:productId | 200 OK      | private | Buyer clear product in cart         |
| 33  | DELETE | /api/cart/buyer-clear-carts                           | 200 OK      | private | Buyer clear carts                   |
| 34  | DELETE | /api/cart/buyer-clear-cart/:id                        | 200 OK      | private | Buyer clear cart                    |
| 35  | POST   | /api/cart/create-update-cart                          | 201 CREATED | private | Buyer create-update cart            |
| 36  | POST   |  /api/shop/buyer-add-product-wishList/:id             | 200 OK      | private | buyer add product to wish list      |
| 37  | delete | /api/shop/delete-wishlist                             | 200 OK      | private | buyer delete products from wishlist |
| 38  | delete | /api/shop/delete-wishlist-product:id                  | 200 OK      | private | buyer delete product from wishlist  |
| 39  | GET    | /api/shop/buyer-view-wishlist-products                | 200 ok      | private | buyer view All product from wishList|
| 40  | GET    | /api/shop/buyer-view-wishlist-product/:id             | 200 ok      | private | buyer view  product from wishList   |
| 41  | GET    | /api/user/user-get-notifications                      | 200 OK      | private | user get notifications              |
| 42  | GET    | /api/user/user-get-notification/:id                   | 200 OK      | private | user get notification               |
| 43  | PUT    | /api/user/user-mark-all-notifications                 | 200 OK      | private | user mark all notifications         |
| 44  | PUT    | /api/user/user-mark-notification/:id                  | 200 OK      | private | user mark notification              |
| 45  | POST   | /api/shop/buyer-review-product/:id                    | 200 OK      | private | Buyer Create review                 |
| 46  | POST   | /api/user/user-submit-seller-request                  | 200 OK      | private | Submit a seller request             |
| 47  | GET    | /api/cart/user-get-order-status/:id        | 200 OK      | private | user get order status               |
| 48  | GET    | /api/cart/buyer-get-order-history          | 200 OK      | private | buyer get order history              |
| 49  |  PUT   | /api/cart/admin-update-order-status/:id    | 200 OK      | private | admin update order status           | 


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