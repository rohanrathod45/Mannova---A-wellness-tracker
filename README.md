# 🌿 Mannova - Premium Mental Health & Wellness Platform

Welcome to **Mannova**, a comprehensive, full-stack mental health and wellness platform designed to guide users towards inner peace, mental clarity, and emotional well-being. Built on a modern web stack, Mannova integrates guided mindfulness exercises, analytics, therapist booking, and AI integrations.

---

## 🚀 Project Architecture

Mannova is structured as a decoupled monorepo:

```
Final_Mannova_main/
├── Backend/                    # Node.js + Express API Backend
│   └── server/
│       ├── config/             # DB & server configs
│       ├── controllers/        # Core API logic handler
│       ├── middleware/         # Auth & route protectors
│       ├── models/             # Mongoose database schemas
│       ├── routes/             # API Router endpoints
│       └── server.js           # Server startup script
│
└── Frontend/                   # React + Vite Single Page Application
    ├── public/                 # Static resources
    └── src/
        ├── api/                # Axios profile/mood requests handler
        ├── assets/             # Assets & webp images
        ├── components/         # Reusable layouts (Navbar, BottomNav, etc.)
        ├── context/            # Language (translation) & App states
        ├── pages/              # Platform pages (Mood, Exercises, Profile, etc.)
        ├── index.css           # Global custom utility styles & Dark-Mode styles
        └── main.jsx            # Application entry point
```

---

## ✨ Features

- **🛡️ Secure Authentication**: Signup, Login, and Auth Token validation using JWT and Bcrypt encryption.
- **📊 Interactive Wellness Dashboard**: Track streaks, sessions completed, and relax minutes on a customized home dashboard.
- **🎭 Mood Reflection Logging**: Log daily emotions and view history logs.
- **🧘 Guided Exercises**: Complete breathing exercises, animations, and timer-driven relaxing routines.
- **💬 Real-Time Chat & AI Support**: Leverage Gemini AI integrations for compassionate wellness guidance.
- **📈 Progress Analytics**: Interactive Recharts graphs showing mood fluctuations, streaks, and exercise metrics.
- **⚙️ Profile Customization**:
  - Update personal info (Name, Age, Gender, and Language preference).
  - 📝 **Dynamic Bio Editor**: Edit your personal bio message directly from the profile edit panel and see it reflected dynamically.
  - Upgrade membership (Standard Free vs Premium Plans).
  - Configure notification alerts and privacy rules.
  - Light & Dark theme toggle with persistent layout adjustments.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 19 + Vite (Type module)
- **Styling**: Tailwind CSS + custom glassmorphism utilities (`index.css`)
- **Navigation**: React Router DOM (v7)
- **Analytics**: Recharts, Day.js
- **Network**: Axios API services

### Backend
- **Platform**: Node.js + Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Security**: JWT tokens + Bcrypt hashing
- **AI Engine**: Google Gemini API (`@google/genai`)

---

## ⚙️ Setup & Installation

### Prerequisite Environment Variables
Before running the application, make sure the local environment configuration is established.

#### 1. Backend Config (`Backend/server/.env`)
Create a `.env` file under the `Backend/server/` directory:
```env
PORT=4000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_token
GEMINI_API_KEY=your_gemini_api_key
```

#### 2. Frontend Config (`Frontend/.env.local`)
Create a `.env.local` file under the `Frontend/` directory:
```env
VITE_API_URL=http://localhost:4000
```

---

## 🏃 Running the Application

Follow these steps to run both frontend and backend local development servers.

### Step 1: Start the Backend Server
1. Navigate to the server folder:
   ```bash
   cd Backend/server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server in hot-reload mode:
   ```bash
   npm run dev
   ```
The backend server runs on: **`http://localhost:4000`**

### Step 2: Start the Frontend Application
1. Navigate to the frontend folder:
   ```bash
   cd Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite server:
   ```bash
   npm run dev
   ```
The frontend application runs on: **`http://localhost:5173`**
