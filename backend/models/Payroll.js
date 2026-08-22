import mongoose from 'mongoose';

/**
 * Payroll Schema representing employee salary structure and payroll calculations
 */
const payrollSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Employee reference is required'],
    },
    basicSalary: {
      type: Number,
      required: [true, 'Basic salary is required'],
      min: [0, 'Basic salary cannot be negative'],
    },
    bonus: {
      type: Number,
      default: 0,
      min: [0, 'Bonus cannot be negative'],
    },
    deductions: {
      type: Number,
      default: 0,
      min: [0, 'Deductions cannot be negative'],
    },
    netSalary: {
      type: Number,
      default: 0,
      min: [0, 'Net salary cannot be negative'],
    },
  },
  {
    timestamps: true,
  }
);

const Payroll = mongoose.models.Payroll || mongoose.model('Payroll', payrollSchema);

export default Payroll;
