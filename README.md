ID NUMBER: IIT2021054
hosted site links:
frontend: https://frontend1-firg.onrender.com
backend: https://backendr-14he.onrender.com

# Court Booking App

## Overview
The Court Booking App allows users to easily reserve sports courts like tennis, badminton, basketball, and more, across various cities. With an intuitive interface, users can quickly find available courts, secure their bookings.

## Features
- **Browse Courts**: Search and filter courts by sport and location.
- **Easy Booking**: Quickly select your preferred court and time slot.
- **Admin Dashboard**: Admins can manage courts, view all bookings, and create or delete bookings.

## Tech Stack
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT with custom middleware for role-based access(admin or user)
- **Frontend**: React.js 


## API Endpoints

### **Authentication Routes**
These routes handle user registration, login, and profile details:
- `POST /api/auth/signup` : Register a new user.
- `POST /api/auth/login` : Login an existing user.
- `GET /api/auth/me` : Get the logged-in user's profile (Protected).

### **Booking Routes**
These routes manage the booking operations, allowing users to create and view their bookings. Admins have the ability to manage all bookings:
- `GET /api/bookings/` : Get all bookings (Admin only, Protected).
- `DELETE /api/bookings/:id` : Delete a specific booking by ID (Admin only, Protected).
- `GET /api/bookings/mybookings` : Get bookings made by the logged-in user (Protected).
- `POST /api/bookings/create` : Create a new booking (Protected).

### **Centre and Sports Routes**
These routes allow admins to manage centers and associate sports, while both users and admins can fetch available centers and sports:
- `POST /api/centres/add` : Add a new center and associate sports (Admin only, Protected).
- `GET /api/centres/all` : Fetch all available centers (Protected).
- `GET /api/centres/:centreName/sports` : Get all sports associated with a particular center (Protected).

### **Court Routes**
These routes manage court creation by the admin and allow users to check for court availability:
- `POST /api/courts/add` : Add a new court (Admin only, Protected).
- `POST /api/courts/showcourt` : Show available courts for a center, sport, date, and time (Protected).

## Setup Instructions
1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd Booking App
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

5. Start the application:
   ```bash
   node index.js
   ```
   
Frontend Setup 
 (React.js):

Navigate to the frontend directory.

Install the frontend dependencies:
npm install
Run the frontend app:
npm run dev


