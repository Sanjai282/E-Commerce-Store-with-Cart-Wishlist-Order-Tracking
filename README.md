# E-Commerce Store with Cart, Wishlist & Order Tracking

[![Node.js](https://img.shields.io/badge/Node.js-v14+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-v4.18-blue.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-v7.0-green.svg)](https://www.mongodb.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A full-stack e-commerce backend API built with Node.js, Express, and MongoDB. Features include user authentication, product management, shopping cart, wishlist, and order tracking.

---

## Features

| Feature | Description |
|---------|-------------|
| **User Authentication** | JWT-based authentication with secure password hashing using bcryptjs |
| **Product Management** | Full CRUD operations for products with categories and stock tracking |
| **Shopping Cart** | Add, update, remove items with quantity management |
| **Wishlist** | Save products for later purchase |
| **Order Tracking** | Create orders and track status through the fulfillment process |
| **RESTful API** | Clean, well-structured REST endpoints with proper error handling |
| **CORS Enabled** | Cross-origin resource sharing for frontend integration |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Runtime** | Node.js |
| **Framework** | Express.js |
| **Database** | MongoDB |
| **ODM** | Mongoose |
| **Authentication** | JWT (jsonwebtoken) |
| **Password Hashing** | bcryptjs |
| **Environment** | dotenv |
| **Dev Tools** | Nodemon |

---

## Prerequisites

- **Node.js** v14 or higher
- **MongoDB** (local installation or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- **npm** or **yarn**

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/Sanjai282/E-Commerce-Store-with-Cart-Wishlist-Order-Tracking.git
cd E-Commerce-Store-with-Cart-Wishlist-Order-Tracking
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp ecomer.env .env
```

Edit `.env` with your configuration:

```env
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_super_secret_key_here
PORT=5002
```

### 4. Seed the database (optional)

Populate the database with sample products:

```bash
node seed.js
```

### 5. Start the server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:5002`

---

## Project Structure

```
├── controllers/            # Route handler logic
│   ├── authController.js   # Authentication controllers
│   ├── cartController.js   # Cart operations
│   ├── orderController.js  # Order management
│   ├── productController.js# Product CRUD
│   └── wishlistController.js# Wishlist operations
│
├── ecommerce-app/          # Frontend application (React)
│
├── middleware/              # Custom middleware
│   └── auth.js            # JWT authentication middleware
│
├── models/                 # Mongoose schemas
│   ├── Product.js         # Product model
│   ├── User.js            # User model
│   ├── Cart.js            # Cart model
│   ├── Order.js           # Order model
│   └── Wishlist.js        # Wishlist model
│
├── routes/                 # API route definitions
│   ├── authRoutes.js      # Auth endpoints
│   ├── ProductRoutes.js   # Product endpoints
│   ├── cartRoutes.js      # Cart endpoints
│   ├── orderRoutes.js     # Order endpoints
│   └── wishlistRoutes.js  # Wishlist endpoints
│
├── .env                    # Environment variables (create from ecomer.env)
├── ecomer.env              # Environment template
├── server.js               # Main entry point
├── seed.js                 # Database seeder
├── package.json            # Dependencies
└── README.md               # Documentation
```

---

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |

### Products

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/products` | Get all products | No |
| GET | `/api/products/:id` | Get product by ID | No |
| POST | `/api/products` | Create product | Yes |
| PUT | `/api/products/:id` | Update product | Yes |
| DELETE | `/api/products/:id` | Delete product | Yes |

### Cart

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/cart` | Get user cart | Yes |
| POST | `/api/cart` | Add item to cart | Yes |
| PUT | `/api/cart/:id` | Update cart item | Yes |
| DELETE | `/api/cart/:id` | Remove from cart | Yes |

### Wishlist

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/wishlist` | Get user wishlist | Yes |
| POST | `/api/wishlist` | Add to wishlist | Yes |
| DELETE | `/api/wishlist/:id` | Remove from wishlist | Yes |

### Orders

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/orders` | Get user orders | Yes |
| POST | `/api/orders` | Create new order | Yes |
| GET | `/api/orders/:id` | Get order details | Yes |
| PUT | `/api/orders/:id/status` | Update order status | Yes |

---

## Sample Products

The seeder includes 12 sample products across two categories:

### Electronics
| Product | Price | Stock |
|---------|-------|-------|
| Wireless Headphones | $149.99 | 50 |
| Portable Power Bank | $39.99 | 75 |
| Bluetooth Speaker Pro | $79.99 | 60 |
| Wireless Mouse | $34.99 | 100 |
| HD Webcam | $59.99 | 45 |

### Accessories
| Product | Price | Stock |
|---------|-------|-------|
| USB-C Cable | $19.99 | 200 |
| Premium Phone Case | $29.99 | 150 |
| Screen Protector Glass | $9.99 | 300 |
| Laptop Stand | $49.99 | 40 |
| HDMI Cable 4K | $14.99 | 250 |
| Cable Organizer Set | $12.99 | 180 |
| USB Hub 4-Port | $24.99 | 120 |

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/ecommerce` |
| `JWT_SECRET` | Secret key for JWT token signing | Required |
| `PORT` | Server port number | `5002` |

---

## Usage Examples

### Register a new user

```bash
curl -X POST http://localhost:5002/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

### Login

```bash
curl -X POST http://localhost:5002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

### Get all products

```bash
curl http://localhost:5002/api/products
```

### Add to cart (requires auth token)

```bash
curl -X POST http://localhost:5002/api/cart \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"productId":"PRODUCT_ID","quantity":1}'
```

---

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Contact

**Sanjai282**
- GitHub: [@Sanjai282](https://github.com/Sanjai282)
- Repository: [E-Commerce-Store-with-Cart-Wishlist-Order-Tracking](https://github.com/Sanjai282/E-Commerce-Store-with-Cart-Wishlist-Order-Tracking)

---

## Acknowledgments

- [Express.js](https://expressjs.com/) - Fast, unopinionated web framework
- [MongoDB](https://www.mongodb.com/) - NoSQL database
- [Mongoose](https://mongoosejs.com/) - MongoDB object modeling
- [JWT](https://jwt.io/) - JSON Web Tokens for authentication
