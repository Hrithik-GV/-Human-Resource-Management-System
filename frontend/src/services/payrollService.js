import api, { handleApiError } from './api';

const normalizePayroll = (payroll) => ({ ...payroll, id: payroll._id, grossSalary: payroll.basicSalary + payroll.bonus, totalDeductions: payroll.deductions, netSalary: payroll.netSalary, hraAllowance: 0, specialAllowance: 0, taxDeduction: payroll.deductions, pfDeduction: 0 });

export const payrollService = {
  getSalarySummary: async () => {
    try {
      const response = await api.get('/payroll/my');
      return normalizePayroll(response.data.payroll);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch payroll summary'));
    }
  },

  getPaymentHistory: async () => {
    try {
      const response = await api.get('/payroll/my');
      const payroll = normalizePayroll(response.data.payroll);
      return [{ id: payroll.id, month: new Date(payroll.updatedAt).toLocaleString('en-US', { month: 'long', year: 'numeric' }), gross: payroll.grossSalary, deductions: payroll.totalDeductions, net: payroll.netSalary, paymentDate: payroll.updatedAt?.slice(0, 10), status: 'Paid' }];
    } catch (error) {
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
