# Event Management Dashboard - Backend API

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Auth**: JWT (JSON Web Tokens)
- **Real-time**: Socket.IO
- **Password Hashing**: bcryptjs

---

## Project Structure
```
event-management/
├── config/
│   └── db.js              # MongoDB connection
├── middleware/
│   └── auth.js            # JWT protect + role authorize
├── models/
│   ├── User.js            # User schema (roles: user, organizer, admin)
│   ├── Event.js           # Event schema
│   └── Registration.js    # Registration schema
├── routes/
│   ├── auth.js            # /api/auth
│   ├── events.js          # /api/events
│   ├── registrations.js   # /api/registrations
│   └── notifications.js   # /api/notifications
├── server.js              # Entry point + Socket.IO
├── .env.example
└── package.json
```

---

## Setup & Run

```bash
# 1. Install dependencies
npm install

# 2. Create .env file
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# 3. Start server (development)
npm run dev

# 4. Start server (production)
npm start
```

---

## Database Schema

### User
| Field         | Type     | Description                        |
|---------------|----------|------------------------------------|
| name          | String   | Full name                          |
| email         | String   | Unique email                       |
| password      | String   | Hashed password                    |
| role          | String   | user / organizer / admin           |
| notifications | Array    | In-app notification messages       |

### Event
| Field                | Type     | Description                      |
|----------------------|----------|----------------------------------|
| title                | String   | Event title                      |
| description          | String   | Full description                 |
| category             | String   | conference/workshop/etc          |
| date                 | Date     | Event date                       |
| registrationDeadline | Date     | Last date to register            |
| location             | String   | Venue / Online link              |
| isOnline             | Boolean  | Online or physical               |
| maxCapacity          | Number   | Max attendees                    |
| registrationCount    | Number   | Live count of registrations      |
| organizer            | ObjectId | Ref → User                       |
| status               | String   | draft/published/cancelled/completed |
| tags                 | Array    | Tag strings                      |

### Registration
| Field        | Type     | Description                        |
|--------------|----------|------------------------------------|
| user         | ObjectId | Ref → User                         |
| event        | ObjectId | Ref → Event                        |
| status       | String   | confirmed / cancelled / waitlisted |
| registeredAt | Date     | Registration timestamp             |
| cancelledAt  | Date     | Cancellation timestamp             |

---

## API Endpoints

### Auth
| Method | Endpoint           | Description        | Access  |
|--------|--------------------|--------------------|---------|
| POST   | /api/auth/register | Register user      | Public  |
| POST   | /api/auth/login    | Login user         | Public  |
| GET    | /api/auth/me       | Get current user   | Private |

### Events
| Method | Endpoint                        | Description               | Access          |
|--------|---------------------------------|---------------------------|-----------------|
| GET    | /api/events                     | List all events           | Public          |
| GET    | /api/events/:id                 | Get single event          | Public          |
| POST   | /api/events                     | Create event              | Organizer/Admin |
| PUT    | /api/events/:id                 | Update event              | Organizer/Admin |
| DELETE | /api/events/:id                 | Delete event              | Organizer/Admin |
| GET    | /api/events/organizer/my-events | Get organizer's events    | Organizer/Admin |

### Registrations
| Method | Endpoint                          | Description                    | Access          |
|--------|-----------------------------------|--------------------------------|-----------------|
| POST   | /api/registrations/:eventId       | Register for an event          | Private         |
| DELETE | /api/registrations/:eventId       | Cancel registration            | Private         |
| GET    | /api/registrations/my-registrations | Get user's registrations     | Private         |
| GET    | /api/registrations/event/:eventId | Get all registrations for event | Organizer/Admin |

### Notifications
| Method | Endpoint                                 | Description                    | Access          |
|--------|------------------------------------------|--------------------------------|-----------------|
| GET    | /api/notifications                       | Get user notifications         | Private         |
| PUT    | /api/notifications/mark-read             | Mark all as read               | Private         |
| POST   | /api/notifications/broadcast/:eventId    | Broadcast to all attendees     | Organizer/Admin |

---

## Real-time Updates (Socket.IO)
When a user registers or cancels, the server emits:
```
event:<eventId>:update  →  { registrationCount, spotsRemaining }
```
Frontend can listen to this event to update the UI in real time.
