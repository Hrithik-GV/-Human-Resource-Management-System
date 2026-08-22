import mongoose from 'mongoose';

/**
 * Leave Schema representing employee leave applications and request statuses
 */
const leaveSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Employee reference is required'],
    },
    leaveType: {
      type: String,
      enum: {
        values: ['Paid', 'Sick', 'Unpaid'],
        message: '{VALUE} is not a valid leave type',
      },
      required: [true, 'Leave type is required'],
    },
    fromDate: {
      type: Date,
      required: [true, 'From Date is required'],
    },
    toDate: {
      type: Date,
      required: [true, 'To Date is required'],
    },
    reason: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ['Pending', 'Approved', 'Rejected'],
        message: '{VALUE} is not a valid leave status',
      },
      default: 'Pending',
    },
    adminComment: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Leave = mongoose.models.Leave || mongoose.model('Leave', leaveSchema);

export default Leave;
