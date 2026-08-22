import api, { handleApiError } from './api';
import { MOCK_PAYROLL_SUMMARY, MOCK_PAYMENT_HISTORY } from '../data/payroll';

let currentPayrollSummary = { ...MOCK_PAYROLL_SUMMARY };

export const payrollService = {
  getSalarySummary: async () => {
    try {
      // Future Axios: const response = await api.get('/payroll/summary'); return response.data;
      return new Promise((resolve) => setTimeout(() => resolve({ ...currentPayrollSummary }), 300));
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch payroll summary'));
    }
  },

  getPaymentHistory: async () => {
    try {
      // Future Axios: const response = await api.get('/payroll/history'); return response.data;
      return new Promise((resolve) => setTimeout(() => resolve([...MOCK_PAYMENT_HISTORY]), 300));
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch payment history'));
    }
  },

  getPayroll: async () => {
    return payrollService.getSalarySummary();
  },

  updatePayroll: async (payrollData) => {
    try {
      // Future Axios: const response = await api.put('/payroll', payrollData); return response.data;
      return new Promise((resolve) => {
        setTimeout(() => {
          currentPayrollSummary = { ...currentPayrollSummary, ...payrollData };
          resolve({ ...currentPayrollSummary });
        }, 300);
      });
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to update payroll'));
    }
  },
};
