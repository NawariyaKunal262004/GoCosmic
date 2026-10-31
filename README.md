# GoCosmic API

GoCosmic is a work-in-progress e-commerce API built with Express, MongoDB, and Mongoose. This README documents the endpoints that are currently registered; it does not imply that the application is complete. Order data is not available through an HTTP API yet.

## Getting started

### Requirements

- Node.js
- MongoDB

### Configure and run

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file in the project root:

   ```env
   MONGO_URI=mongodb://127.0.0.1:27017/gocosmic
   JWT_SECRET=replace-with-a-local-secret
   PORT=3000
   ```

   `MONGO_URI` and `JWT_SECRET` are required. `PORT` is optional and defaults to `3000`.

3. Start the development server:

   ```bash
   npm run dev
   ```

   Or start it without the development watcher:

   ```bash
   npm start
   ```

The default API base URL is `http://localhost:3000`. The server connects to MongoDB before it starts listening.

## API conventions

- Send and receive JSON. Include `Content-Type: application/json` with requests that have a JSON body.
- Protected routes require the JWT returned by login, sent as a bearer token.
- Login tokens expire after one hour.
- Roles are `customer`, `seller`, and `admin`. New users default to `customer` when `role` is omitted.
- IDs shown as `<...-id>` are MongoDB ObjectIds returned by the API.

### Endpoint overview

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/api/health` | Public | Check that the API is running |
| `POST` | `/api/users` | Public | Create a user |
| `POST` | `/api/auth/login` | Public | Log in and get a JWT |
| `GET` | `/api/auth/me` | Authenticated | Get the current user |
| `GET` | `/api/auth/seller-test` | Seller or admin | Check seller/admin authorization |
| `GET` | `/api/categories` | Public | List categories |
| `POST` | `/api/categories` | Admin | Create a category |
| `POST` | `/api/products` | Seller or admin | Create a product |
| `GET` | `/api/cart` | Authenticated | Get the current user's cart |
| `POST` | `/api/cart/items` | Authenticated | Add a product to the cart |
| `PATCH` | `/api/cart/items/:productId` | Authenticated | Set an item's quantity |
| `DELETE` | `/api/cart/items/:productId` | Authenticated | Remove an item |
| `DELETE` | `/api/cart` | Authenticated | Clear the cart |

## Endpoints

### Health

`GET /api/health`

Returns `200 OK`:

```json
{
  "message": "GoCosmic API is running"
}
```

### Users and authentication

#### Create a user

`POST /api/users`

This route is currently public. The password must be at least six characters and is hashed before it is saved. The role must be `customer`, `seller`, or `admin`; it defaults to `customer`. Because the route is unauthenticated, callers can currently choose any of those roles.

Request:

```json
{
  "name": "Cosmic Seller",
  "email": "seller@example.test",
  "password": "example-password",
  "role": "seller"
}
```

Returns `201 Created` with a `message` and the created `user`. Validation and save errors currently return `400 Bad Request`.

> **Implementation note:** The current response serializes the created user document, including its `password` property (the stored value is hashed). This response should not be exposed as-is in a production API.

#### Log in

`POST /api/auth/login`

Request:

```json
{
  "email": "seller@example.test",
  "password": "example-password"
}
```

Returns `200 OK`:

```json
{
  "message": "Login successful",
  "token": "<jwt>"
}
```

Unknown email or incorrect password returns `401 Unauthorized` with `"Invalid credentials"`.

#### Get the current user

`GET /api/auth/me`

Requires a bearer token. Returns `200 OK` with the authenticated user under `user`. Missing, invalid, expired, or unrecognized-user tokens return `401 Unauthorized`.

#### Check seller/admin access

`GET /api/auth/seller-test`

Requires a bearer token. Sellers and admins receive `200 OK`; customers receive `403 Forbidden`. Missing or invalid tokens return `401 Unauthorized`.

### Categories

#### List categories

`GET /api/categories`

Public endpoint. Returns `200 OK` with an array of category documents. Categories include `name`, optional `description`, and timestamps.

#### Create a category

`POST /api/categories`

Requires an admin bearer token.

Request:

```json
{
  "name": "Astronomy",
  "description": "Astronomy-themed products"
}
```

Returns `201 Created` with the category document. A duplicate name returns `409 Conflict`; validation errors return `400 Bad Request`.

### Products

#### Create a product

`POST /api/products`

Requires a seller or admin bearer token. The seller is taken from the authenticated user; do not provide a seller ID.

Request:

```json
{
  "name": "Moon Lamp",
  "description": "A moon-shaped bedside lamp",
  "price": 24.99,
  "categoryId": "<category-id>"
}
```

`name`, `price`, and `categoryId` are required. `price` must be non-negative, and `categoryId` must refer to an existing category.

Returns `201 Created` with a `message` and the created `product`. A category that does not exist returns `404 Not Found`. Other errors currently return `500 Internal Server Error`.

There is no product listing, detail, update, or delete route registered yet.

### Cart

All cart routes require a bearer token and operate on the authenticated user's cart.

#### Get the cart

`GET /api/cart`

Returns `200 OK` with the cart, populated product details, and a subtotal calculated from each product's current price and quantity:

```json
{
  "cart": {
    "items": []
  },
  "subtotal": 0,
  "message": "Cart is empty"
}
```

The example shows the response when no cart exists. For an existing cart, `cart` contains its items and the message is `"Cart fetched successfully"`.

#### Add an item

`POST /api/cart/items`

Request:

```json
{
  "productId": "<product-id>",
  "quantity": 2
}
```

`quantity` is optional and defaults to `1`. It must be a positive integer. If the product is already in the cart, the requested quantity is added to its existing quantity.

Returns `200 OK` with a message and the updated cart. An invalid product ID or quantity returns `400 Bad Request`; a product that does not exist returns `404 Not Found`.

#### Set an item's quantity

`PATCH /api/cart/items/<product-id>`

Request:

```json
{
  "quantity": 1
}
```

The quantity must be a positive integer; this replaces the current quantity rather than incrementing it. Returns `200 OK` with the updated cart. Invalid IDs or quantities return `400 Bad Request`; a missing cart or cart item returns `404 Not Found`.

#### Remove an item

`DELETE /api/cart/items/<product-id>`

Returns `200 OK` with the updated cart. An invalid product ID returns `400 Bad Request`; a missing cart or cart item returns `404 Not Found`.

#### Clear the cart

`DELETE /api/cart`

Returns `200 OK` when the cart is cleared. If the user does not yet have a cart, returns `404 Not Found`.

### Errors and current scope

Authentication failures return `401 Unauthorized`; authenticated users without the required role receive `403 Forbidden`. Other status codes are documented with their endpoints. Some controller errors include implementation details in the response; avoid treating those messages as a stable public error contract.

An order model exists in the repository, but no order routes are registered. Order creation, checkout, and order retrieval are therefore not part of the current HTTP API.
