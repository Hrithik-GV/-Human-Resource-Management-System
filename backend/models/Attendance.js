import mongoose from 'mongoose';

/**
 * Attendance Schema representing employee daily check-in and check-out tracking
 */
const attendanceSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Employee reference is required'],
    },
    date: {
      type: Date,
      required: [true, 'Attendance date is required'],
    },
    checkIn: {
      type: Date,
    },
    checkOut: {
      type: Date,
    },
    status: {
      type: String,
      enum: {
        values: ['Present', 'Absent', 'Half Day', 'Leave'],
        message: '{VALUE} is not a valid attendance status',
      },
      default: 'Present',
    },
  },
  {
    timestamps: true,
  }
);

const Attendance =
  mongoose.models.Attendance || mongoose.model('Attendance', attendanceSchema);

export default Attendance;
