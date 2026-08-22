# HRMS Backend API

Production-ready backend project structure for a Human Resource Management System (HRMS) built with Node.js, Express.js, and MongoDB (Mongoose).

---

## 🛠 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **ODM:** Mongoose
- **Authentication:** JWT (JSON Web Tokens) & bcryptjs
- **Middleware:** CORS, dotenv, Multer
- **Development Tooling:** Nodemon

---

## 📁 Project Architecture & Folder Structure

```text
backend/
│
├── config/
│   └── db.js                 # MongoDB connection configuration
│
├── controllers/
│   ├── authController.js       # Auth endpoint controllers
│   ├── employeeController.js   # Employee profile controllers
│   ├── attendanceController.js # Attendance tracking controllers
│   ├── leaveController.js      # Leave management controllers
│   ├── payrollController.js    # Payroll processing controllers
│   └── adminController.js      # Admin dashboard & management controllers
│
├── middleware/
│   ├── authMiddleware.js       # JWT authentication check
│   ├── roleMiddleware.js       # Role-based access control (Admin / Employee)
│   ├── errorMiddleware.js      # Global 404 & centralized error handlers
│   └── uploadMiddleware.js     # Multer file upload storage configuration
│
├── models/
│   ├── User.js                 # User schema (Employee & Admin)
│   ├── Attendance.js           # Attendance schema
│   ├── Leave.js                # Leave request schema
│   └── Payroll.js              # Payroll schema
│
├── routes/
│   ├── authRoutes.js           # /api/auth routes
│   ├── employeeRoutes.js       # /api/employee routes
│   ├── attendanceRoutes.js     # /api/attendance routes
│   ├── leaveRoutes.js          # /api/leave routes
│   ├── payrollRoutes.js        # /api/payroll routes
│   └── adminRoutes.js          # /api/admin routes
│
├── utils/
│   ├── generateToken.js        # JWT token helper utility
│   └── asyncHandler.js         # Higher-order wrapper for async controllers
│
├── .env.example                # Environment variables template
├── app.js                      # Express application setup
├── server.js                   # Application entry point
├── package.json                # Project dependencies & scripts
└── README.md                   # Documentation
```

---

## 🚀 Getting Started

### 1. Prerequisites

- Node.js (v18+ recommended)
- MongoDB server running locally or MongoDB Atlas connection string

### 2. Installation

Navigate to the `backend` folder and install dependencies:

```bash
cd backend
npm install
```

### 3. Environment Configuration

Copy `.env.example` to create a `.env` file:

```bash
cp .env.example .env
```

Set appropriate values in `.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/hrms_db
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

### 4. Running the Application

- **Development Mode:**
  ```bash
  npm run dev
  ```

- **Production Mode:**
  ```bash
  npm start
  ```

---

## 🔗 API Endpoint Definitions

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public/Admin | Register new user/employee |
| `POST` | `/api/auth/login` | Public | Authenticate user & get JWT token |
| `GET` | `/api/auth/me` | Private | Get authenticated user info |

### Employee (`/api/employee`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/employee/profile` | Private | Get profile details |
| `PUT` | `/api/employee/profile` | Private | Update profile details |

### Attendance (`/api/attendance`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/attendance/checkin` | Private | Employee check-in |
| `POST` | `/api/attendance/checkout` | Private | Employee check-out |
| `GET` | `/api/attendance/my` | Private | Get logged-in user attendance history |
| `GET` | `/api/attendance/all` | Admin | Get attendance records for all employees |

### Leave Management (`/api/leave`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/leave/apply` | Private | Submit leave request |
| `GET` | `/api/leave/my` | Private | Get logged-in user leave applications |
| `GET` | `/api/leave/all` | Admin | Get all leave applications |
| `PATCH` | `/api/leave/:id` | Admin | Approve / Reject leave application |

### Payroll (`/api/payroll`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/payroll/my` | Private | View personal payroll details |
| `GET` | `/api/payroll` | Admin | Get all payroll records |
| `PUT` | `/api/payroll/:id` | Admin | Update employee payroll record |

### Admin (`/api/admin`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/dashboard` | Admin | Get admin dashboard metrics |
| `GET` | `/api/admin/users` | Admin | Get all users |
| `DELETE` | `/api/admin/users/:id` | Admin | Delete user account |
