# Boost Marketplace

A full-stack marketplace platform connecting gamers with professional boosters and coaches, built with Next.js and NestJS.

## Tech Stack

### Frontend
- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **Radix UI** - UI components
- **Lucide React** - Icons

### Backend
- **NestJS** - Node.js framework
- **Prisma** - ORM
- **PostgreSQL** - Database
- **JWT** - Authentication
- **Passport** - Auth middleware

## Features

- 🎮 Browse and purchase boosting services
- 👤 User authentication (JWT)
- 💼 Booster profiles and ratings
- 📝 Service listings (rank boost, coaching, etc.)
- 🛒 Order management
- 💳 Payment integration (ready for Stripe/PayPal)
- ⭐ Review system
- 📱 Responsive design

## Project Structure

```
boost/
├── src/                    # Next.js frontend
│   ├── app/               # App router pages
│   ├── components/        # React components
│   ├── contexts/          # React contexts
│   ├── lib/               # Utilities
│   └── types/             # TypeScript types
├── backend/               # NestJS backend
│   ├── src/
│   │   ├── auth/          # Authentication module
│   │   ├── users/         # Users module
│   │   ├── services/      # Services module
│   │   ├── orders/        # Orders module
│   │   ├── payment/       # Payment module
│   │   ├── reviews/       # Reviews module
│   │   ├── upload/        # File upload module
│   │   └── prisma/        # Prisma service
│   └── prisma/
│       └── schema.prisma  # Database schema
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   cd C:\Users\Admin\Desktop\boost
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

4. **Set up environment variables**
   ```bash
   # In backend folder
   cp .env.example .env
   ```
   
   Edit `.env` and add your database URL and other configurations:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/boost_marketplace"
   JWT_SECRET="your-secret-key"
   ```

5. **Set up the database**
   ```bash
   cd backend
   npm run prisma:migrate
   npm run prisma:generate
   ```

### Running the Application

1. **Start the backend** (from backend folder)
   ```bash
   npm run start:dev
   ```
   Backend will run on http://localhost:3001

2. **Start the frontend** (from root folder)
   ```bash
   npm run dev
   ```
   Frontend will run on http://localhost:3000

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user

### Users
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `PATCH /users/profile` - Update user profile

### Services
- `GET /services` - Get all services
- `GET /services/:id` - Get service by ID
- `POST /services` - Create service (booster only)
- `PATCH /services/:id` - Update service
- `DELETE /services/:id` - Delete service

### Orders
- `GET /orders` - Get user orders
- `GET /orders/:id` - Get order by ID
- `POST /orders` - Create new order
- `PATCH /orders/:id/status` - Update order status

### Reviews
- `GET /reviews/service/:serviceId` - Get service reviews
- `GET /reviews/booster/:boosterId` - Get booster reviews
- `POST /reviews` - Create review

### Payment
- `POST /payment` - Create payment
- `GET /payment/:orderId` - Get payment by order ID

## Database Schema

The application uses the following main models:

- **User** - User accounts (buyers, boosters, admins)
- **BoosterProfile** - Additional booster information
- **Service** - Boosting services offered
- **Order** - Service orders
- **Payment** - Payment records
- **Review** - Service reviews

## Development

### Database Migrations

```bash
cd backend
npm run prisma:migrate     # Create and apply migration
npm run prisma:studio      # Open Prisma Studio GUI
npm run prisma:generate    # Generate Prisma Client
```

### Build for Production

**Frontend:**
```bash
npm run build
npm start
```

**Backend:**
```bash
cd backend
npm run build
npm run start:prod
```

## Next Steps

- [ ] Integrate payment gateway (Stripe/PayPal)
- [ ] Add email notifications
- [ ] Implement real-time chat
- [ ] Add admin dashboard
- [ ] Integrate Cloudinary for image uploads
- [ ] Add more games and categories
- [ ] Implement dispute resolution system
- [ ] Add social media authentication
- [ ] Create mobile app

## License

Private project - All rights reserved
