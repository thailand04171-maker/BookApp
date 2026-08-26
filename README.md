# BookApp

A mobile digital-library app built with **React Native (Expo)** on the front end and an **Express + MongoDB** REST API on the back end. Users register and verify their account by email OTP, then scan a QR code / enter a book code to add titles to their personal library, search their collection, and read books in-app.

> Built as part of **01418371 – Project Management and Digital Startup**.

---

## Features

- **Email + OTP authentication** — register with email/password, verify via a 6-digit OTP sent by email, then log in with a persistent server-side session (`express-session` + `connect-mongo`)
- **Add books by QR code or manual code entry** — scan a book's QR code (`expo-camera`) or type the code directly to add it to your library
- **Personal library** — books linked to a user via `BookCodes`, with a home screen listing everything you own
- **Search** — look up titles within your own collection
- **In-app reader** — open and read an added book
- **Profile & session management** — view the logged-in account and log out (destroys the server session)
- **Cloud file storage** — book covers and PDFs are uploaded via `multer` and stored on **Cloudinary**

## Tech Stack

**Mobile app**
- React Native + [Expo](https://expo.dev/)
- React Navigation (native-stack + bottom-tabs)
- `expo-camera` for QR scanning

**Backend (`/server`)**
- Node.js + Express 5
- MongoDB + Mongoose
- `express-session` with `connect-mongo` for session storage
- `bcrypt` for password hashing
- `nodemailer` for OTP emails
- `multer` + `cloudinary` for cover/PDF uploads

## Project Structure

```
BookApp/
├── App.js                  # Navigation stack (screens)
├── index.js                 # Expo entry point
├── server.js                 # Express app entry point
├── Components/               # React Native screens (Welcome, Login, Sign_in, OTP,
│                              # Main_menu, ScanQR, AddbyCode, Search, Book_Decs,
│                              # Reader, Profile, TabNavigator)
├── config/
│   ├── db.js                 # MongoDB connection
│   └── cloudinary.js         # Cloudinary config
└── server/
    ├── controllers/          # authController, bookController
    ├── middleware/            # auth (session guard), upload (multer)
    ├── models/                # User, Otp, Book, BookCodes
    ├── routes/                # authRoutes, bookRoutes
    └── utils/                 # sendOtpEmail
```

## API Overview

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Create account, sends OTP email | — |
| POST | `/api/auth/verify-otp` | Verify the OTP and activate the account | — |
| POST | `/api/auth/resend-otp` | Resend a fresh OTP | — |
| POST | `/api/auth/login` | Log in, starts a session | — |
| POST | `/api/auth/logout` | Destroy the session | Session |
| GET | `/api/auth/profile` | Get the logged-in user's email | Session |
| POST | `/api/books` | Upload a book (cover + PDF) | Session |
| GET | `/api/books` | List all books | Session |
| GET | `/api/books/my-books` | List books owned by the current user | Session |
| GET | `/api/books/search/:query` | Search within the user's own books | Session |
| GET | `/api/books/dashboard` | Totals + recent activity for the user | Session |
| DELETE | `/api/books/:id` | Delete a book (and its Cloudinary files) | Session |

## Getting Started

### Prerequisites
- Node.js
- An Android emulator/device (or iOS/web) for Expo
- A MongoDB connection string
- A Cloudinary account (for cover/PDF storage)
- A Gmail account + [app password](https://support.google.com/accounts/answer/185833) (for sending OTP emails)

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment variables
Create a `.env` file in the project root (this file is git-ignored):
```env
MONGO_URI=your_mongodb_connection_string
CLOUDINARY_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
```

### 3. Run the app
The API server and the Expo app run separately — you'll need **two terminals**:

```bash
# Terminal 1 — backend API (http://localhost:3000)
node server.js

# Terminal 2 — Expo app
npm run android   # or: npm run ios / npm run web
```

> The mobile app currently points at hardcoded local IPs (e.g. `10.0.2.2:3000` for the Android emulator) in a few screens — update these to your machine's LAN IP or the emulator loopback address as needed.

## Initial Setup (for reference)

This project was scaffolded with:
```bash
npx create-expo-app Book --template blank
npm install expo
npm install @react-navigation/native @react-navigation/native-stack
npm install @react-navigation/bottom-tabs
npx expo install react-native-screens react-native-safe-area-context
npx expo install expo-camera
npm i express mongoose dotenv bcrypt cloudinary nodemailer express-session cors connect-mongo@5 multer
```

## Course Context

This repository is a project for **01418371 – Project Management and Digital Startup**.
