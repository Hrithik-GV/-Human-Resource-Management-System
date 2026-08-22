import { MOCK_PAYROLL_SUMMARY, MOCK_PAYMENT_HISTORY } from '../data/payroll';

export const payrollService = {
  getSalarySummary: async () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ ...MOCK_PAYROLL_SUMMARY }), 300);
    });
  },

  getPaymentHistory: async () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...MOCK_PAYMENT_HISTORY]), 300);
    });
  },
};
