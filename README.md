# Kanggo BE Test
This repo is a project built for Kanggo technical test. It uses Node.js and Express framework with MySQL as its database.. This project serves as a basic e-commerce platform for a carpenter services. It handles CRUD operations, basic request validations, and user authentication using JWT.

## Features
### General :
- **User Authentication**: Authentication using JSON Web Tokens (JWT).

### Admin :
- **CRUD operations for Workers data**: Create, Read, Update, Delete workers data from database.

### Customer :
- **Workers List** : Retrieve list of available workers for orders.
- **Create Order** : Creating new order.
- **Order List** : Retrieve list of orders that the user has created.
- **Cancel Order** : Cancel order that has been created.

## Installation
1. Clone the repository
    ```bash
        git clone https://github.com/rez-a-put/kanggo-be-test.git
    ```
2. Change into project directory
    ```bash
        cd kanggo-be-test
    ```
3. Install dependencies
    ```bash
        npm install
    ```
4. Create .env file
    ```bash
        PORT=server_port
        JWT_SECRET=jwt_secret_key
        JWT_EXPIRES=how_long_jwt_exist_before_expires

        DB_HOST=database_host
        DB_USER=database_user
        DB_PASSWORD=database_password
        DB_NAME=database_name
    ```
    Example :
    ```bash
        PORT=3000
        JWT_SECRET=this_is_secret_key
        JWT_EXPIRES=1h

        DB_HOST=localhost
        DB_USER=root
        DB_PASSWORD=password
        DB_NAME=db_kanggo
    ```
5. Run the application
    ```bash
        npm start
    ```

## Endpoints List
### Authentications
- `POST /api/v1/register` : Register new user
- `POST /api/v1/login` : User login into system

### Admin
- `POST /api/v1/admin/workers` : Adding new workers
- `GET /api/v1/admin/workers` : Retrieve list of workers
- `PUT /api/v1/admin/workers/:id` : Update data of specific worker based on id
- `DELETE /api/v1/admin/workers/:id` : Remove data of specific worker based on id

### Customer
- `GET /api/v1/workers` : Retrieve list of workers
- `POST /api/v1/orders` : Adding new orders
- `GET /api/v1/orders` : Retrieve list of orders created
- `PUT /api/v1/cancel_order/:id` : Cancel specific order based on id