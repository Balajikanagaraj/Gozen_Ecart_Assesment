# E-Commerce Platform

A complete full-stack e-commerce platform built with the MERN stack (MongoDB, Express.js, React, Node.js). This platform features dynamic pricing, advanced search functionality, user authentication, and comprehensive product management.

## Features

### Core Functionality
- **Complete CRUD Operations**: Full product, category, and user management
- **Dynamic Pricing System**: Automatic price adjustments based on user visit frequency
- **Advanced Search**: Real-time search with auto-suggestions and filtering
- **Image Management**: Support for both file uploads and URL-based images
- **User Authentication**: Secure JWT-based authentication with password encryption
- **Session Tracking**: Cookie-based session management for pricing features

### Product Management
- Create, read, update, delete products
- Category-based organization
- Stock management and tracking
- Featured products highlighting
- Product ratings and reviews
- Image gallery support
- Price history tracking

### Search & Filter System
- Live auto-suggestions while typing
- Advanced filtering by category, price, brand, availability
- Full-text search across product names, descriptions, and brands
- Sort by price, name, rating, newest

### User System
- User registration and login
- Password encryption with bcrypt
- JWT-based authentication
- User profiles and account management
- Admin and user roles
- Protected routes

### Dynamic Pricing Algorithm
- Tracks user visits per product using sessions
- Automatically increases price by 10% for every 3 visits
- Maximum price increase capped at 50%
- Visual indicators for price adjustments

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, React Router DOM
- **Backend**: Node.js, Express.js, MongoDB with Mongoose
- **Authentication**: JWT, bcrypt
- **Session Management**: express-session with MongoDB store
- **File Upload**: Multer for image handling
- **Icons**: Lucide React
- **Styling**: Tailwind CSS with responsive design

## Prerequisites

Before running this project, make sure you have the following installed:
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- VS Code (recommended)
- Git

## Installation & Setup

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd ecommerce-platform
```

### Step 2: Backend Setup
```bash
# Navigate to server directory
cd server

# Install backend dependencies
npm install

# Create environment file
cp .env.example .env
```

### Step 3: Configure Environment Variables
Create a `.env` file in the `server` directory with the following variables:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/ecommerce-platform
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/ecommerce

# JWT Secret (use a strong, random string)
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random

# Session Secret (use a strong, random string)
SESSION_SECRET=your-session-secret-key-here-also-make-it-random

# File Upload Settings
MAX_FILE_SIZE=5000000

# Server Port
PORT=5000
```

### Step 4: Frontend Setup
```bash
# Open new terminal and navigate to project root
cd ..

# Install frontend dependencies
npm install
```

### Step 5: Database Setup & Seeding
```bash
# In the server directory, run the seeding script
cd server
npm run seed
```

This will create:
- 10 product categories
- 55+ sample products across all categories
- Admin user: `admin@store.com` / `admin123`

### Step 6: Start the Application

**Terminal 1 - Backend Server:**
```bash
cd server
npm run dev
```
The backend server will start on http://localhost:5000

**Terminal 2 - Frontend Development Server:**
```bash
# From project root
npm run dev
```
The frontend will start on http://localhost:5173

### Step 7: Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **Admin Login**: admin@store.com / admin123

## Project Structure

```
ecommerce-platform/
├── server/                 # Backend Node.js/Express application
│   ├── models/            # MongoDB schemas (User, Product, Category)
│   ├── routes/            # API routes (auth, products, categories, etc.)
│   ├── middleware/        # Authentication, file upload middleware
│   ├── scripts/           # Database seeding scripts
│   ├── uploads/           # File upload directory
│   └── server.js          # Main server file
├── src/                   # Frontend React application
│   ├── components/        # Reusable React components
│   ├── pages/            # Page components (Home, Products, etc.)
│   ├── context/          # React context (Auth)
│   ├── services/         # API service functions
│   └── App.tsx           # Main App component
├── public/               # Static assets
└── README.md            # This file
```

## Development Commands

### Backend (server directory)
```bash
npm run dev        # Start development server with nodemon
npm start          # Start production server
npm run seed       # Seed database with sample data
```

### Frontend (project root)
```bash
npm run dev        # Start Vite development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

## Key Features Explained

### Dynamic Pricing System
The platform implements a sophisticated dynamic pricing algorithm:
- Tracks individual user visits to products using sessions
- Increases price by 10% for every 3 visits to the same product
- Maximum increase capped at 50% of base price
- Visual indicators show when prices have been adjusted
- Price history tracking for analytics

### Search System
Advanced search capabilities include:
- Real-time auto-suggestions as you type
- Search across product names, descriptions, brands
- Filter by category, price range, availability
- Sort by multiple criteria
- Faceted search with available filters

### Image Management
Flexible image handling supports:
- File upload with validation (JPEG, PNG, GIF, WebP)
- Direct URL input for external images
- Automatic fallback images for broken links
- File size limits and security validation

### User Authentication
Secure authentication system featuring:
- Password hashing with bcrypt (12 rounds)
- JWT tokens with 7-day expiration
- Protected routes for authenticated users
- Role-based access control (admin/user)
- Session management for pricing features

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation and sanitization
- File upload security (type and size validation)
- CORS configuration
- Session security with MongoDB store
- Protected admin routes

## Responsive Design

The application is fully responsive with:
- Mobile-first design approach
- Tailwind CSS for consistent styling
- Responsive navigation and layouts
- Touch-friendly interfaces
- Optimized for all screen sizes

## Production Deployment

### Environment Setup
1. Set up MongoDB Atlas or production MongoDB instance
2. Configure environment variables for production
3. Set up file storage (local or cloud storage)
4. Configure CORS for production domain

### Build Commands
```bash
# Build frontend
npm run build

# Start production server
cd server
npm start
```

## Troubleshooting

### Common Issues

**MongoDB Connection Error:**
- Ensure MongoDB is running locally or check Atlas connection string
- Verify network access and credentials

**Port Already in Use:**
- Change PORT in .env file or kill existing processes
- Use `lsof -ti:5000 | xargs kill -9` to free port 5000

**File Upload Issues:**
- Check file permissions in uploads directory
- Verify file size limits in configuration

**Session Issues:**
- Clear browser cookies and localStorage
- Restart both frontend and backend servers

### Getting Help
- Check the console for error messages
- Verify all environment variables are set correctly
- Ensure all dependencies are installed
- Check MongoDB connection and data

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built with the MERN Stack**

For questions or support, please open an issue on GitHub.