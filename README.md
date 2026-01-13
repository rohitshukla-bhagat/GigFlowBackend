# GigFlow Server

GigFlow Server is the backend REST API for the GigFlow platform, built with Node.js and Express. It provides authentication, gig management, and bidding functionality using MongoDB as the database.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (via Mongoose)
- **Authentication**: JWT (JSON Web Tokens) & Cookies
- **Security**: bcryptjs, CORS

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB (Local instance or MongoDB Atlas URI)

### Installation

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Environment Variables

Create a `.env` file in the root of the `server` directory and add the following configuration:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

| Variable | Description |
| - | - |
| `PORT` | The port the server listens on (default: 5000) |
| `MONGO_URI` | Connection string for MongoDB |
| `JWT_SECRET` | Secret key for signing JSON Web Tokens |
| `FRONTEND_URL` | URL of the frontend application (for CORS) |
| `NODE_ENV` | Environment mode (`development` or `production`) |

### Running the Server

Start the server in development mode (with hot reloading via nodemon):

```bash
npm run dev
```

Start the server in production mode:

```bash
npm start
```

The server will run on [https://gigflowbackend.onrender.com](https://gigflowbackend.onrender.com) (or the port specified in `.env`).

## API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register a new user
- `POST /login` - Login user
- `POST /logout` - Logout user

### Gigs (`/api/gigs`)
- `GET /` - Get all gigs
- `POST /` - Create a new gig
- `GET /:id` - Get gig details

### Bids (`/api/bids`)
- `POST /` - Place a bid on a gig
- `GET /gig/:gigId` - Get bids for a specific gig

## Project Structure

- `config/` - Database connection and configuration.
- `models/` - Mongoose schemas (User, Gig, Bid).
- `routes/` - API route definitions.
- `controllers/` - Request logic and handlers.
- `middleware/` - Auth and error handling middleware.
- `utils/` - Helper functions.
