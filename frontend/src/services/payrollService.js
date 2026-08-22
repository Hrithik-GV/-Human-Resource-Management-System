import api, { handleApiError } from './api';

const normalizePayroll = (payroll) => ({
  ...payroll,
  id: payroll._id,
  grossSalary: (payroll.basicSalary || 0) + (payroll.bonus || 0),
  totalDeductions: payroll.deductions || 0,
  netSalary: payroll.netSalary || 0,
  hraAllowance: 0,
  specialAllowance: 0,
  taxDeduction: payroll.deductions || 0,
  pfDeduction: 0,
});

const emptyPayroll = {
  id: null,
  basicSalary: 0,
  bonus: 0,
  deductions: 0,
  netSalary: 0,
  grossSalary: 0,
  totalDeductions: 0,
  hraAllowance: 0,
  specialAllowance: 0,
  taxDeduction: 0,
  pfDeduction: 0,
  lastPaymentDate: null,
};

export const payrollService = {
  getSalarySummary: async () => {
    try {
      const response = await api.get('/payroll/my');
      return normalizePayroll(response.data.payroll);
    } catch (error) {
      // If 404 (no payroll assigned yet), return empty structure instead of throwing
      if (error.response?.status === 404) {
        return emptyPayroll;
      }
      throw new Error(handleApiError(error, 'Failed to fetch payroll summary'));
    }
  },

  getPaymentHistory: async () => {
    try {
      const response = await api.get('/payroll/my');
      const payroll = normalizePayroll(response.data.payroll);
      return [
        {
          id: payroll.id,
          month: new Date(response.data.payroll.updatedAt).toLocaleString('en-US', {
            month: 'long',
            year: 'numeric',
          }),
          gross: payroll.grossSalary,
          deductions: payroll.totalDeductions,
          net: payroll.netSalary,
          paymentDate: response.data.payroll.updatedAt?.slice(0, 10),
          status: 'Paid',
        },
      ];
    } catch (error) {
      if (error.response?.status === 404) {
        return [];
      }
      throw new Error(handleApiError(error, 'Failed to fetch payment history'));
    }
  },

  getPayroll: async () => {
    return payrollService.getSalarySummary();
  },

  updatePayroll: async (payrollData) => {
    try {
      const response = await api.put(`/payroll/${payrollData.id}`, payrollData);
      return normalizePayroll(response.data.payroll);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to update payroll'));
    }
  },
};
