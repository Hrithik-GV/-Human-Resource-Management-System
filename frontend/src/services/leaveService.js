import api, { handleApiError } from './api';

const normalizeLeave = (leave) => ({ ...leave, id: leave._id, startDate: leave.fromDate?.slice(0, 10), endDate: leave.toDate?.slice(0, 10), appliedOn: leave.createdAt?.slice(0, 10), days: Math.ceil((new Date(leave.toDate) - new Date(leave.fromDate)) / 86400000) + 1 });

export const leaveService = {
  getBalances: async () => {
    try {
      const leaves = await leaveService.getMyLeaves();
      return { paidLeave: 0, sickLeave: 0, unpaidLeave: 0, pendingRequests: leaves.filter((leave) => leave.status === 'Pending').length, approvedRequests: leaves.filter((leave) => leave.status === 'Approved').length };
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch leave balances'));
    }
  },

  getMyLeaves: async () => {
    try {
      const response = await api.get('/leave/my');
      return response.data.leaves.map(normalizeLeave);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch my leave requests'));
    }
  },

  getHistory: async () => {
    return leaveService.getMyLeaves();
  },

  getAllLeaves: async (filters = {}) => {
    try {
      const response = await api.get('/leave/all', { params: filters });
      return response.data.leaves.map(normalizeLeave);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch all leave requests'));
    }
  },

  applyLeave: async (leaveData) => {
    try {
      const response = await api.post('/leave/apply', { ...leaveData, leaveType: leaveData.leaveType.replace(' Leave', '') });
      return normalizeLeave(response.data.leave);
    } catch (error) {
      throw new Error(handleApiError(error, 'Leave application failed'));
    }
  },

  approveLeave: async (id) => {
    try {
      await api.patch(`/leave/${id}`, { status: 'Approved' });
      return true;
    } catch (error) {
      throw new Error(handleApiError(error, 'Approval failed'));
    }
  },

  rejectLeave: async (id, reason) => {
    try {
      await api.patch(`/leave/${id}`, { status: 'Rejected', adminComment: reason });
      return true;
    } catch (error) {
      throw new Error(handleApiError(error, 'Rejection failed'));
    }
  },
};
