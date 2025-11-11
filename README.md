# mIP API

![miP app logo](https://mip-web.vercel.app/app-logo.png)

An API for a geolocation tracking app that allows users search IP addresses for geolocation data, and maintain a history of searches.

## Features

### Authentication

- ✅ Simple login form with email/password validation
- ✅ Password hashing with bcrypt
- ✅ JWT token-based authentication
- ✅ User seeder for testing

### Geolocation & History

- ✅ Store geolocation data in history
- ✅ Retrieve user's search history
- ✅ Get individual history records
- ✅ Delete multiple history records
- ✅ User-specific data isolation

## Tech Stack

- **Backend**: Node.js, Express, TypeScript
- **Database**: Supabase/PostgreSQL with Drizzle ORM
- **Authentication**: JWT, bcrypt
- **Validation**: Zod schemas
- **Deployment**: Vercel

## Project Structure

```
├── src/
│   ├── app.ts                 # Express app configuration
│   ├── index.ts              # Server entry point
│   ├── controllers/
│   │   ├── authController.ts  # Login/signup logic
│   │   └── historyController.ts # History CRUD operations
│   ├── routes/
│   │   ├── auth.ts           # Authentication routes
│   │   └── history.ts        # History routes
│   ├── drizzle/
│   │   ├── index.ts          # Database connection
│   │   └── schema.ts         # Database tables
│   ├── lib/
│   │   ├── seed.ts           # User seeder script
│   │   └── token.ts          # JWT utilities
│   ├── schema/
│   │   └── index.ts          # Zod validation schemas
│   └── types/
│       └── token.ts          # TypeScript interfaces
├── package.json
├── tsconfig.json
└── vercel.json
```

## Setup

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd mip-api
```

2. Install dependencies:

```bash
npm install
```

3. Environment setup:
   Create a `.env.local` file in the root directory:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development
APP_URL=http://localhost:3000
```

4. Database setup:

```bash
# Run database migrations (if using drizzle-kit)
npx drizzle-kit push

# Seed test user
npm run seed
```

5. Start the development server:

```bash
npm run dev
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Base URL

- Development: `http://localhost:8000`
- Production: Your Vercel deployment URL

### Authentication

#### POST `/api/login`

Login with email and password.

**Request Body:**

```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "message": "Login successful",
  "data": {
    "token": "jwt-token-here",
    "user": {
      "id": "user-uuid",
      "email": "test@example.com"
    }
  },
  "statusCode": 200
}
```

**Error Responses:**

- `400` - Missing email or password
- `404` - User not found
- `401` - Invalid password

### History Management

All history endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

#### GET `/api/history`

Retrieve all history records for the authenticated user.

**Response:**

```json
{
  "message": "Histories retrieved successfully",
  "data": [
    {
      "id": "history-uuid",
      "userId": "user-uuid",
      "geolocationData": {
        "ip": "8.8.8.8",
        "hostname": "dns.google",
        "city": "Mountain View",
        "region": "California",
        "country": "US",
        "loc": "37.4056,-122.0775",
        "org": "AS15169 Google LLC",
        "postal": "94043",
        "timezone": "America/Los_Angeles",
        "asn": "AS15169",
        "as_name": "Google LLC",
        "as_domain": "google.com",
        "country_code": "US",
        "continent_code": "NA",
        "continent": "North America"
      },
      "createdAt": "2025-11-12T10:30:00Z"
    }
  ],
  "statusCode": 200
}
```

#### POST `/api/history`

Save a new geolocation search to history.

**Request Body:**

```json
{
  "geolocationData": {
    "ip": "8.8.8.8",
    "hostname": "dns.google",
    "city": "Mountain View",
    "region": "California",
    "country": "US",
    "loc": "37.4056,-122.0775",
    "org": "AS15169 Google LLC",
    "postal": "94043",
    "timezone": "America/Los_Angeles",
    "asn": "AS15169",
    "as_name": "Google LLC",
    "as_domain": "google.com",
    "country_code": "US",
    "continent_code": "NA",
    "continent": "North America"
  }
}
```

#### GET `/api/history/single/:historyId`

Retrieve a specific history record by ID.

**Response:**

```json
{
  "message": "History retrieved successfully",
  "data": {
    "id": "history-uuid",
    "userId": "user-uuid",
    "geolocationData": {
      /* ... */
    },
    "createdAt": "2025-11-12T10:30:00Z"
  },
  "statusCode": 200
}
```

#### DELETE `/api/history`

Delete multiple history records by IDs.

**Request Body:**

```json
{
  "ids": ["history-uuid-1", "history-uuid-2"]
}
```

## Database Schema

### Users Table

```sql
CREATE TABLE "user" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### History Table

```sql
CREATE TABLE "history" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES "user"(id),
  geolocation_data JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run build` - Build TypeScript to JavaScript
- `npm run seed` - Seed test user to database

## Test User

After running the seeder (`npm run seed`), you can login with:

- **Email**: `test@example.com`
- **Password**: `password123`

## Requirements Assessment

This API fulfills the following internship assessment requirements:

### ✅ Completed Requirements

- **Login Form**: POST `/api/login` with email/password validation
- **Database Validation**: Credentials checked against PostgreSQL database
- **User Seeder**: Available via `npm run seed`
- **JWT Authentication**: Token-based authentication implemented
- **History Storage**: Geolocation data saved per user
- **History Retrieval**: List all searches for authenticated user
- **History Deletion**: Multiple record deletion supported
- **Individual History**: Get specific history by ID

### ⚠️ Frontend Requirements (Not in API)

This is a backend API only. The frontend would need to implement:

- Login form UI with redirect functionality
- IP geolocation lookup (using external API like ipinfo.io)
- IP address validation
- Clear search functionality
- History list display with clickable items
- Checkbox selection for multi-delete
- Map integration for location visualization

## Security Features

- Password hashing with bcrypt (10 salt rounds)
- JWT token expiration (7 days)
- CORS protection
- Helmet security headers
- User data isolation (users only see their own data)
- Input validation with Zod schemas

## Deployment

The API is configured for Vercel deployment:

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is for internship assessment purposes.
