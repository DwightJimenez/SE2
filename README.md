🧩 Organization Automation System

  A full-stack web application for managing events, documents, evaluations, chats, and more—built with React, Express, and MySQL.
  
  
🚀 Features

  User Authentication (Login, Logout, First Visit Setup)
  
  Role-Based Access Control (Admin, Moderator, User)
  
  Event Calendar & Archive
  
  Document Management & Rich Text Editing
  
  Evaluation Forms & Rating
  
  Audit Logs
  
  Real-time Chat
  
  Public Post & Viewing System


🧱 Tech Stack

  Frontend: React (Vite), TailwindCSS, ShadCN UI, Framer Motion, React Router
  
  Backend: Node.js, Express.js, MySQL
  
  Authentication: JWT + Cookies
  
  API Handling: Axios + React Query


📦 Prerequisites

  Node.js (v18+ recommended)

  npm or yarn

  MySQL Server (or XAMPP)

  .env file with environment variables


⚙️ Setup Instructions
  1. Clone the Repository
    
    git clone https://github.com/your-username/your-project.git
    cd your-project
    
  2. Install Dependencies
    Frontend
    
    cd client
    npm install
    
    Backend
    
    cd ../server
    npm install
    
  3. Configure Environment Variables
  Frontend (client/.env)
    
    VITE_API_URL=http://localhost:4001
    
  Backend (server/.env)
    
    PORT=4001
    DB_HOST=localhost
    DB_USER=your_mysql_user
    DB_PASSWORD=your_mysql_password
    DB_NAME=your_database
    JWT_SECRET=your_jwt_secret
    COOKIE_SECRET=your_cookie_secret
    
  4. Set Up the Database
    
    Run your MySQL server and import the schema:
    
    CREATE DATABASE your_database;
    -- Import schema.sql if available
    
    You may need to run a seed script or manually create tables depending on your setup.
  5. Run the App
  Start Backend
    
    cd server
    npm run dev
    
  Start Frontend (in another terminal)
    
    cd client
    npm run dev
    
    Open http://localhost:5173 in your browser.


📁 Folder Structure
    
    client/     → React frontend (Vite)
    server/     → Express backend API
    .env        → Environment configs

🛠 Common Issues

    CORS Errors: Make sure CORS is enabled in your backend (server/index.js).

    Auth Fails: Ensure withCredentials: true is set in Axios and cookies are not blocked.

    DB Connection Error: Check .env DB credentials and that MySQL is running.
