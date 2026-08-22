import { MOCK_LEAVE_BALANCES, MOCK_LEAVE_HISTORY } from '../data/leave';

let currentBalances = { ...MOCK_LEAVE_BALANCES };
let currentHistory = [...MOCK_LEAVE_HISTORY];

export const leaveService = {
  getBalances: async () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ ...currentBalances }), 300);
    });
  },

  getHistory: async () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...currentHistory]), 300);
    });
  },

  applyLeave: async (leaveData) => {
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
      }, 500);
    });
  },
};
