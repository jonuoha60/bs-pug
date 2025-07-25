# 📚 Book Store App

A full-featured **online book store** built with **Node.js**, **Express**, and **MongoDB**, featuring secure **user authentication with Passport.js**.

---

## Features

 **User authentication** with `passport-local`
  - Register with email and password
  - Login/logout with session support
-  **User session tracking**
-  **Book listing and browsing**
-  **MongoDB/Mongoose** for data modeling
-  **Pug** templating engine for clean UI rendering
-  Modular routing (`/users`, `/books`)
-  Environment config with `.env` support

---

## 🗂️ Tech Stack

| Layer        | Tech                       |
|--------------|----------------------------|
| Backend      | Node.js, Express.js        |
| Database     | MongoDB + Mongoose         |
| Auth         | Passport.js + bcrypt       |
| Views        | Pug (Jade)                 |
| Session Mgmt | express-session            |
| Env Config   | dotenv                     |

---

## Getting Started

### 1. Clone the repo


git clone https://github.com/jonuoha60/bs-pug.git
cd book-store-auth

### 2. Clone the repo

npm install

### 3. Setup environment variables
Create a .env file in the root directory:

MONGO_URI=mongodb://127.0.0.1:27017/bookstore
SESSION_SECRET=your_strong_secret_key
PORT=3000

npm start
http://localhost:3000
