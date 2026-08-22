# DayFlow - Human Resource Management System (HRMS)

A modern, production-ready full-stack **Human Resource Management System (HRMS)** built with **Node.js, Express, MongoDB** on the backend and **React, Vite, and TailwindCSS** on the frontend. 

DayFlow provides role-based management for both **Administrators** and **Employees**, streamlining attendance tracking, leave application workflows, payroll processing, employee directory management, and workplace analytics.

---

## ✨ Features Overview

### 🛡️ **Authentication & Access Control**
- Role-based Access Control (**Admin** and **Employee** roles).
- Secure JWT (JSON Web Token) authentication with hashed passwords (`bcryptjs`).
- Protected frontend routes and persistent authentication context.
- Built-in **Demo Quick Credentials** for immediate testing.

---

### 📊 **Admin Portal**
- **Admin Dashboard**: Real-time organizational metrics (total employees, active today, pending leave requests, monthly payroll totals) with visual charts powered by Recharts.
- **Employee Directory**: Full CRUD management of employee profiles, departments, designations, and contact details.
- **Attendance Management**: System-wide view of check-in / check-out timestamps and status logs.
- **Leave Request Control**: Review, approve, or reject employee leave applications with instant status updates.
- **Payroll Processing**: Generate and update monthly payrolls, base salaries, bonuses, and deductions.
- **System Settings**: Configurable company settings, notification preferences, and security rules.

---

### 👤 **Employee Portal**
- **Personal Dashboard**: Instant snapshot of daily check-in status, upcoming leaves, and recent payslips.
- **Attendance Tracker**: One-click daily check-in / check-out with automatic hour calculation.
- **Leave Management**: Apply for leaves (Casual, Sick, Earned, etc.), attach reason details, and track real-time approval status.
- **Payroll & Payslips**: View monthly salary breakdowns, tax deductions, bonuses, and download payslips.
- **Profile Management**: Update personal info, contact details, profile picture, and change passwords.

---

## 🛠 Tech Stack

| Domain | Technologies |
| :--- | :--- |
| **Frontend Framework** | [React 19](https://react.dev/), [Vite](https://vitejs.dev/) |
| **Styling & UI** | [TailwindCSS v4](https://tailwindcss.com/), [Lucide React Icons](https://lucide.dev/), [Framer Motion](https://www.framer.com/motion/) |
| **Routing & State** | React Router v7, React Context API, React Hook Form |
| **Feedback & Data Viz** | React Hot Toast, Recharts |
| **Backend Runtime** | [Node.js](https://nodejs.org/), [Express.js](https://expressjs.com/) |
| **Database & ODM** | [MongoDB](https://www.mongodb.com/), [Mongoose](https://mongoosejs.com/) *(With auto In-Memory Mongo fallback & auto-seeder)* |
| **Authentication & Security** | JWT (`jsonwebtoken`), `bcryptjs`, CORS middleware |
| **File Handling** | Multer file uploads |

---

## 📁 Repository Structure

```text
new/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection & auto-seeder logic
│   ├── controllers/              # Express API endpoint controllers
│   │   ├── adminController.js
│   │   ├── attendanceController.js
│   │   ├── authController.js
│   │   ├── employeeController.js
│   │   ├── leaveController.js
│   │   └── payrollController.js
│   ├── middleware/               # Auth & error handling middlewares
│   ├── models/                   # Mongoose schemas (User, Attendance, Leave, Payroll)
│   ├── routes/                   # API route declarations
│   ├── uploads/                  # Media storage for profile pictures
│   ├── app.js                    # Express app configuration & CORS setup
│   ├── server.js                 # HTTP server entrypoint
│   └── package.json
│
├── frontend/
│   ├── public/                   # Static public assets
│   ├── src/
│   │   ├── components/           # Reusable UI components & layouts
│   │   ├── context/              # AuthContext & global state providers
│   │   ├── data/                 # Demo datasets & mock fallback data
│   │   ├── layouts/              # Admin, Employee, and Auth layouts
│   │   ├── pages/                # Admin & Employee page views
│   │   ├── routes/               # AppRoutes & ProtectedRoute guards
│   │   ├── services/             # Axios API service integrations
│   │   └── App.jsx
│   ├── vite.config.js
│   └── package.json
│
└── README.md                     # Comprehensive project documentation
```

---

## 🚀 Getting Started

### 1. Prerequisites

- **Node.js** (v18+ recommended)
- **npm** or **yarn**
- *(Optional)* Local MongoDB instance running on port `27017` or a MongoDB Atlas URI. 
  *(Note: If no local Mongo service is detected, the backend will automatically spin up an in-memory database and seed demo data for seamless local development)*.

---

### 2. Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Hrithik-GV/-Human-Resource-Management-System.git
   cd -Human-Resource-Management-System
   ```

2. **Install Backend Dependencies**:
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**:
   ```bash
   cd ../frontend
   npm install
   ```

---

### 3. Environment Setup

#### **Backend (`backend/.env`)**
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/hrms_db
JWT_SECRET=hrms_super_secret_jwt_key_2026
NODE_ENV=development
```

#### **Frontend (`frontend/.env`)**
```env
VITE_API_URL=http://localhost:5000/api
```

---

### 4. Running the Application

#### **Start Backend Server**:
```bash
cd backend
npm run dev
```
*Backend will run on [http://localhost:5000](http://localhost:5000).*

#### **Start Frontend App**:
```bash
cd frontend
npm run dev
```
*Frontend will run on [http://localhost:5173](http://localhost:5173) or [http://localhost:5174](http://localhost:5174).*

---

## 🔑 Demo Quick Credentials

The login page features a **Quick Demo Credentials** switcher for fast access:

| Role | Email Address | Password |
| :--- | :--- | :--- |
| 🛡️ **Admin** | `admin@dayflow.com` | `password123` |
| 👤 **Employee** | `employee@dayflow.com` | `password123` |

---

## 🔗 API Endpoint Reference

### **Authentication (`/api/auth`)**
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public / Admin | Register new employee/user account |
| `POST` | `/api/auth/login` | Public | Authenticate user & receive JWT token |
| `GET` | `/api/auth/me` | Private | Get logged-in user profile |

### **Employee Profile (`/api/employee`)**
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/employee/profile` | Private | Get authenticated employee profile details |
| `PUT` | `/api/employee/profile` | Private | Update employee profile details |

### **Attendance (`/api/attendance`)**
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/attendance/checkin` | Private | Log daily employee check-in |
| `POST` | `/api/attendance/checkout` | Private | Log daily employee check-out |
| `GET` | `/api/attendance/my` | Private | Fetch logged-in user attendance history |
| `GET` | `/api/attendance/all` | Admin | Fetch all attendance records |

### **Leave Management (`/api/leave`)**
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/leave/apply` | Private | Submit leave request |
| `GET` | `/api/leave/my` | Private | View personal leave requests |
| `GET` | `/api/leave/all` | Admin | View all leave requests across the company |
| `PATCH` | `/api/leave/:id` | Admin | Approve or reject a leave request |

### **Payroll (`/api/payroll`)**
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/payroll/my` | Private | View personal monthly payslip history |
| `GET` | `/api/payroll` | Admin | View company-wide payroll summary |
| `PUT` | `/api/payroll/:id` | Admin | Update employee payroll details |

### **Admin Dashboard & Management (`/api/admin`)**
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/dashboard` | Admin | Retrieve organization dashboard metrics |
| `GET` | `/api/admin/users` | Admin | List all registered users |
| `DELETE` | `/api/admin/users/:id` | Admin | Remove user account |

---

## 📜 License

This project is licensed under the **ISC License**.
