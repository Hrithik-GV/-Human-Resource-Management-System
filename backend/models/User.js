import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['Employee', 'Admin'],
      default: 'Employee',
    },
    department: {
      type: String,
      trim: true,
    },
    designation: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    profilePicture: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// TODO: Add bcrypt password hashing pre-save hook and password comparison method in future implementation

const User = mongoose.model('User', userSchema);

export default User;
