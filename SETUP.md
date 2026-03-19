# Event Management Dashboard - Full Setup Guide

This is a complete, fully-integrated Event Management Dashboard with React frontend and Node.js/MongoDB backend.

## Prerequisites

- Node.js (v14+ recommended)
- MongoDB (local or Atlas connection string)
- npm or yarn

## Quick Start

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your MongoDB URI and JWT secret
# Example:
# PORT=5000
# MONGO_URI=mongodb://localhost:27017/event_management
# JWT_SECRET=your_super_secret_jwt_key_here
```

### 2. Seed Demo Data (Optional but Recommended)

```bash
# From the backend directory
node seed.js
```

This creates demo users and events:
- **Organizer**: organizer@demo.com / password
- **User**: user@demo.com / password
- **Admin**: admin@demo.com / password

### 3. Start Backend Server

```bash
# From backend directory
npm run dev  # Development with nodemon
# or
npm start    # Production
```

Server will run on `http://localhost:5000`

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local (should already exist with API_URL)
# Verify NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 5. Start Frontend Development Server

```bash
# From frontend directory
npm run dev
```

Frontend will run on `http://localhost:3000`

## Project Architecture

### Backend Structure
```
backend/
├── config/
│   └── db.js                 # MongoDB connection
├── middleware/
│   └── auth.js              # JWT & role authorization
├── models/
│   ├── User.js              # User schema (3 roles)
│   ├── Event.js             # Event schema with virtuals
│   └── Registration.js      # Registration schema
├── routes/
│   ├── auth.js              # Auth endpoints
│   ├── events.js            # Event CRUD + filters
│   ├── registrations.js     # Register/cancel + list
│   └── notifications.js     # Notifications & broadcast
├── server.js                # Express + Socket.IO entry
├── seed.js                  # Demo data seeder
├── package.json
├── .env.example
└── README.md
```

### Frontend Structure
```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.js        # Root layout with AuthProvider
│   │   ├── page.js          # Main dashboard (with routing)
│   │   ├── login/page.js    # Login page
│   │   ├── register/page.js # Registration page
│   │   └── globals.css      # Global styles + Tailwind
│   ├── components/
│   │   ├── Navbar.jsx       # Top nav with user menu
│   │   ├── UserView.jsx     # Browse & register for events
│   │   ├── OrganizerView.jsx# Create & manage events
│   │   ├── CreateEventForm.jsx
│   │   ├── EventTable.jsx
│   │   └── AlertsDropdown.jsx
│   ├── context/
│   │   └── AuthContext.jsx  # Auth state & hooks
│   ├── lib/
│   │   └── api.js           # API service layer
│   └── .env.local           # Frontend config
├── next.config.mjs
├── tailwind.config.ts
├── package.json
└── .gitignore
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Events
- `GET /api/events` - Get all published events (filter by category, search, upcoming)
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create event (organizer/admin)
- `PUT /api/events/:id` - Update event (organizer/admin)
- `DELETE /api/events/:id` - Delete event (organizer/admin)
- `GET /api/events/organizer/my-events` - Get user's events (organizer/admin)

### Registrations
- `POST /api/registrations/:eventId` - Register for event
- `DELETE /api/registrations/:eventId` - Cancel registration
- `GET /api/registrations/my-registrations` - Get user's registrations
- `GET /api/registrations/event/:eventId` - Get event registrations (organizer/admin)

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/mark-read` - Mark all as read
- `POST /api/notifications/broadcast/:eventId` - Send notification to registrants (organizer/admin)

## Key Features Implemented

### Authentication & Authorization
- ✅ User registration with password hashing (bcryptjs)
- ✅ JWT-based authentication
- ✅ Role-based access control (user, organizer, admin)
- ✅ Session persistence with localStorage
- ✅ Protected routes with redirect to login

### Event Management
- ✅ Create, update, delete events (organizers)
- ✅ View all published events (users)
- ✅ Filter events by category, search, upcoming dates
- ✅ Event capacity tracking
- ✅ Automatic registration count updates

### User Registration
- ✅ Register for events with deadline validation
- ✅ Cancel registrations
- ✅ View my registrations
- ✅ Prevent duplicate registrations
- ✅ Automatic capacity checking

### Notifications
- ✅ In-app notifications on registration/cancellation
- ✅ Mark notifications as read
- ✅ Organizer broadcast to event registrants

### UI/UX
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Role-based view switching (User/Organizer)
- ✅ Real-time event updates (Socket.IO ready)
- ✅ Loading states & error handling
- ✅ Beautiful card-based design with Tailwind CSS

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/event_management
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Testing the Application

### 1. Create Owner Account & Events
1. Go to `http://localhost:3000`
2. Sign up with role "Event Organizer"
3. Use organizer view to create events
4. Add title, date, location, capacity, etc.

### 2. Create User Account & Register
1. Open new browser/incognito window
2. Sign up with role "Regular User"
3. View published events
4. Register for events
5. View registration in "My Registrations"

### 3. Test Real-time Updates
- Register for event as user
- Watch organizer view update registration count immediately

### 4. Test Notifications
- Register for event (you get notification)
- Go to organizer view
- Use broadcast feature to send notification to all attendees

## Common Issues & Solutions

### "API call failed" or "Cannot reach backend"
- Ensure backend is running on port 5000
- Check `.env.local` has correct `NEXT_PUBLIC_API_URL`
- Verify CORS is enabled in backend

### "MongoDB connection error"
- Check MongoDB is running
- Verify `MONGO_URI` in `.env` is correct
- For Atlas: ensure IP whitelist includes your IP

### "Auth token expired"
- Tokens last 7 days
- Logout and login again to get new token

### Port conflicts
- Backend: change `PORT` in `.env` if 5000 is in use
- Frontend: run `npm run dev -- -p 3001` for different port

## Production Deployment

### Backend (e.g., Heroku, Railway)
```bash
# Set environment variables in platform
PORT=5000
MONGO_URI=your_production_mongodb_uri
JWT_SECRET=your_production_jwt_secret_v2 # CHANGE THIS

# Deploy with npm start (production)
```

### Frontend (e.g., Vercel, Netlify)
```bash
# Set environment variable
NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api

# Deploy with npm run build
```

## Future Enhancements

- [ ] Real-time Socket.IO event updates (infrastructure ready)
- [ ] Email notifications
- [ ] Event image uploads
- [ ] Advanced search/filtering
- [ ] Event analytics dashboard
- [ ] Waitlist for full events
- [ ] User profiles & follow system
- [ ] Social sharing
- [ ] Payment integration
- [ ] Review & rating system

## Support

For issues or questions, check:
1. Backend console logs
2. Browser network tab (DevTools)
3. MongoDB data verification
4. Frontend .env configuration

---

**Built with:** Next.js 16, React 19, Node.js, Express, MongoDB, Tailwind CSS

Last Updated: March 2026
