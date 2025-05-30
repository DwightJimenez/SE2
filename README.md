# 🧩 Organization Automation System

A full-stack web application for managing events, documents, evaluations, chats, and more—built with **React**, **Express**, and **MySQL**.

---

## 🚀 Features

- User Authentication (Login, Logout, First Visit Setup)  
- Role-Based Access Control (Admin, Moderator, User)  
- Event Calendar & Archive  
- Document Management with Rich Text Editing  
- Evaluation Forms & Rating System  
- Audit Logs  
- Public Posting & Viewing System  

---

## 🧱 Tech Stack

**Frontend**  
- React (Vite)  
- TailwindCSS  
- ShadCN UI  
- Framer Motion  
- React Router  

**Backend**  
- Node.js  
- Express.js  
- MySQL  

**Others**  
- Authentication: JWT + Cookies  
- API Handling: Axios + React Query  

---

## 📦 Prerequisites

- Node.js (v18+ recommended)  
- npm or yarn  
- MySQL Server (or XAMPP)  
- `.env` file with required environment variables  

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/DwightJimenez/SE2.git
cd SE2
```

### 2. Install Dependencies

**Frontend**

```bash
cd client
npm install
```

**Backend**

```bash
cd ../server
npm install
```

### 3. Configure Environment Variables

**Frontend: `client/.env`**
```env
VITE_API_URL=http://localhost:4001
```

**Backend: `server/.env`**
```env
PORT=4001
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=your_database
JWT_SECRET=your_jwt_secret
COOKIE_SECRET=your_cookie_secret
```

### 4. Set Up the Database

Start your MySQL server and create the database:

```sql
CREATE DATABASE your_database;
```

> Import `schema.sql` if provided. You may need to run seed scripts or manually create tables based on your setup.

### 5. Run the App

**Start Backend**
```bash
cd server
npm run dev
```

**Start Frontend (in another terminal)**
```bash
cd client
npm run dev
```

Then, open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📁 Folder Structure

```
client/     → React frontend (Vite)
server/     → Express backend API
```

---

## 🛠 Common Issues

- **CORS Errors**  
  Ensure CORS is enabled in your backend (`server/index.js`).

- **Authentication Fails**  
  Set `withCredentials: true` in Axios. Make sure cookies are allowed.

- **Database Connection Errors**  
  Double-check your `.env` DB credentials and verify that MySQL is running.
