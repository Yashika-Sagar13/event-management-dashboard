# Event Management Dashboard (Frontend)

## Features Overview

### General Features
- Dual-role authentication (User and Organizer)
- Role-based redirection after login
- Live data synchronization across dashboards

<img width="1532" height="735" alt="image" src="https://github.com/user-attachments/assets/f1b7ef7a-b005-4944-ae6e-c9567eb563a1" />
<img width="1596" height="743" alt="image" src="https://github.com/user-attachments/assets/9c2137a3-7c48-4cef-9480-ac149cb228d8" />
<img width="1453" height="691" alt="image" src="https://github.com/user-attachments/assets/7b2be65e-4ee0-4c5b-ac1c-b0f82b3b94ac" />
<img width="1456" height="703" alt="image" src="https://github.com/user-attachments/assets/a219e9d2-d3dc-406a-bae1-70f7428ab610" />




### User Side
- Editorial layout with featured event highlight
- Interactive event cards with hover effects
- One-click register and cancel functionality
- Live capacity progress bars
- Alerts dropdown for event reminders
- Fully responsive design

### Organizer Side
- Bento-style statistics dashboard
- Create event form with validation and loader
- Live event table with real-time updates
- Delete event functionality
- Mobile-friendly card-based layout

---

## Contributions

### Vishakha — User Side Frontend
- Designed editorial event layout with featured card
- Built dynamic event cards with styling and hover effects
- Implemented register and cancel interaction logic
- Developed live capacity progress indicators
- Created alerts dropdown using React hooks
- Ensured responsive UI across devices

### Yashika Sagar — Organizer Side and Authentication
- Built authentication flow with role selection
- Implemented role-based navigation and rendering
- Developed bento-style statistics section
- Added sparkline visualization for registrations
- Created event creation form with validation and loader
- Built live event table with update logic
- Implemented delete event functionality
- Designed responsive mobile dashboard

### Sona Antony - Backend Development - Core Infrastructure & Authentication

- Implemented Express.js server with Socket.IO for real-time updates
- Set up MongoDB connection with error handling
- Implemented JWT-based authentication system with 7-day token expiration
- Created role-based authorization middleware (user, organizer, admin)
- Built user registration with bcryptjs password hashing
- Implemented login with secure password verification
- Created authentication endpoints (register, login, get current user)
- Set up CORS and request/response handling

### Tanu Raman - Backend Development - Features & Business Logic

- Implemented event management system (CRUD operations)
- Built event filtering by category, search, and upcoming dates
- Created user registration system with capacity checking
- Implemented duplicate registration prevention
- Built registration cancellation with count management
- Implemented notification system with user notifications
- Created organizer broadcast functionality
- Integrated real-time Socket.IO updates for event registrations
- Created database seeding script with demo data


###  Tapashya : Database Implementation (MongoDB)

- Designed the backend database using **MongoDB** with **Mongoose** for schema modeling and validation.
- Implemented core collections: **Users**, **Events**, and **Registrations** to support the event management workflow.
- Defined structured schemas with validation rules to ensure consistent and reliable data storage.
- Established relationships between collections using **ObjectId references** (e.g., user-to-event registrations).
- Implemented registration logic allowing users to register for events through the `Registrations` collection.
- Added **timestamps** to track creation and update history of database records.
- Structured the backend database layer with a modular folder organization (`config`, `models`).
- Enabled scalable data storage suitable for handling multiple events and participants.
- Integrated the database with backend APIs to support event creation, user management, and event registrations.
