# 🎫 MeetPass – Smart Meeting Scheduler

MeetPass is a web application designed to simplify and organize student–staff meetings in colleges using a smart token-based system.  
It helps students request meetings efficiently while allowing staff to approve, manage, and track meetings easily.

---

## 🗂 Project Structure

```
meetpass-webapp/
│
├── meetpass-backend/        # Node.js + Express backend
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   └── server.js
│
├── meetpass-frontend/       # React frontend
│   ├── src/
│   ├── components/
│   ├── pages/
│   └── App.js
│
└── README.md
```

---

## ⚙️ Tech Stack

### Frontend
- React
- HTML
- CSS
- JavaScript

### Backend
- Node.js
- Express.js

### Database
- SQL Database

---

## ✨ Features

- Students can request meetings with staff members
- Staff can accept or decline meeting requests
- Token-based meeting scheduling system
- Group meeting support
- Offline token generation
- Real-time reminders
- Meeting history tracking
- Basic analytics for meeting management

---

## 🚀 Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/sweetyp18/meetpass-webapp.git
cd meetpass-webapp
```

---

### 2️⃣ Backend Setup

```bash
cd meetpass-backend
npm install
npm start
```

Backend runs on:

```
http://localhost:5000
```

---

### 3️⃣ Frontend Setup

```bash
cd meetpass-frontend
npm install
npm start
```

Frontend runs on:

```
http://localhost:3000
```

---

## 🔄 System Architecture

```
React Frontend
       │
       │ REST API
       ▼
Node.js + Express Backend
       │
       ▼
SQL Database
```

The React frontend communicates with the backend through REST APIs.  
The backend processes meeting requests, manages approvals, and stores the data in the SQL database.

---

## 🔮 Future Improvements

- Email notifications for meeting approvals
- Calendar integration for scheduling
- Admin dashboard for monitoring meetings
- Advanced analytics for meeting statistics
- Mobile application version

---## 📸 Screenshots

### 🔐 Login Page
![login](https://github.com/user-attachments/assets/e5ed78bc-030a-45dd-81c4-c5ebb80aae3b)

---

### 📝 Signup Page
![signup](https://github.com/user-attachments/assets/5ac194bc-01a5-4a8f-af84-36aa57d64901)

---

### 🔑 Forgot Password
![forget-password](https://github.com/user-attachments/assets/3c983011-9ee8-4f6a-acb4-ddba028bd82d)

---

### 🏠 Home Page
![Home](https://github.com/user-attachments/assets/84ac78bf-9f13-4977-8d89-937bb2d986e7)

---

### 📅 Schedule Meeting
![Schedule Meeting](https://github.com/user-attachments/assets/83b2f752-9352-494d-8ecd-ef353ec09a78)

---

### 📋 View Meetings
![View meeting](https://github.com/user-attachments/assets/019cca53-319d-41be-b47e-c856d4eb4ba7)
