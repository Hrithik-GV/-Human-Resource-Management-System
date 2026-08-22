import mongoose from 'mongoose';

/**
 * User Schema representing employees and administrators in the HRMS
 */
const userSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: [true, 'Employee ID is required'],
      unique: true,
      trim: true,
      minlength: [2, 'Employee ID must be at least 2 characters long'],
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
    },
    role: {
      type: String,
      enum: {
        values: ['Employee', 'Admin'],
        message: '{VALUE} is not a valid role',
      },
      default: 'Employee',
    },
    department: {
      type: String,
      default: 'General',
      trim: true,
    },
    designation: {
      type: String,
      default: 'Employee',
      trim: true,
    },
    phone: {
      type: String,
      default: '0000000000',
      trim: true,
    },
    address: {
      type: String,
      default: 'Not provided',
      trim: true,
    },
    profilePicture: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
