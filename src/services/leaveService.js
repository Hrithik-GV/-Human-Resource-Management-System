import api, { handleApiError } from './api';
import { MOCK_LEAVE_BALANCES, MOCK_LEAVE_HISTORY } from '../data/leave';

let currentBalances = { ...MOCK_LEAVE_BALANCES };
let currentHistory = [...MOCK_LEAVE_HISTORY];

export const leaveService = {
  getBalances: async () => {
    try {
      // Future Axios: const response = await api.get('/leave/balances'); return response.data;
      return new Promise((resolve) => setTimeout(() => resolve({ ...currentBalances }), 300));
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch leave balances'));
    }
  },

  getMyLeaves: async () => {
    try {
      // Future Axios: const response = await api.get('/leave/my-leaves'); return response.data;
      return new Promise((resolve) => setTimeout(() => resolve([...currentHistory]), 300));
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch my leave requests'));
    }
  },

  getHistory: async () => {
    return leaveService.getMyLeaves();
  },

  getAllLeaves: async (filters = {}) => {
    try {
      // Future Axios: const response = await api.get('/leave/all', { params: filters }); return response.data;
      return new Promise((resolve) => setTimeout(() => resolve([...currentHistory]), 300));
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch all leave requests'));
    }
  },

  applyLeave: async (leaveData) => {
    try {
      // Future Axios: const response = await api.post('/leave/apply', leaveData); return response.data;
      return new Promise((resolve) => {
        setTimeout(() => {
          const newRecord = {
            id: `LV-${Math.floor(100 + Math.random() * 900)}`,
            leaveType: leaveData.leaveType,
            startDate: leaveData.startDate,
            endDate: leaveData.endDate,
            days: Number(leaveData.days),
            reason: leaveData.reason,
            status: 'Pending',
            appliedOn: new Date().toISOString().split('T')[0],
          };

          currentHistory = [newRecord, ...currentHistory];
          currentBalances = {
            ...currentBalances,
            pendingRequests: currentBalances.pendingRequests + 1,
          };

          resolve(newRecord);
        }, 300);
      });
    } catch (error) {
      throw new Error(handleApiError(error, 'Leave application failed'));
    }
  },

  approveLeave: async (id) => {
    try {
      // Future Axios: const response = await api.patch(`/leave/${id}/approve`); return response.data;
      return new Promise((resolve) => {
        setTimeout(() => {
          currentHistory = currentHistory.map((l) => (l.id === id ? { ...l, status: 'Approved' } : l));
          resolve(true);
        }, 300);
      });
    } catch (error) {
      throw new Error(handleApiError(error, 'Approval failed'));
    }
  },

  rejectLeave: async (id, reason) => {
    try {
      // Future Axios: const response = await api.patch(`/leave/${id}/reject`, { reason }); return response.data;
      return new Promise((resolve) => {
        setTimeout(() => {
          currentHistory = currentHistory.map((l) => (l.id === id ? { ...l, status: 'Rejected', rejectionReason: reason } : l));
          resolve(true);
        }, 300);
      });
    } catch (error) {
      throw new Error(handleApiError(error, 'Rejection failed'));
    }
  },
};
