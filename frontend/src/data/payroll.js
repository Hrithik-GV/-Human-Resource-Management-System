export const MOCK_PAYROLL_SUMMARY = {
  grossSalary: 8500,
  basicSalary: 6500,
  hraAllowance: 1200,
  specialAllowance: 800,
  bonus: 500,
  taxDeduction: 600,
  pfDeduction: 400,
  totalDeductions: 1000,
  netSalary: 8000,
  lastPaymentDate: '2026-07-31',
  currency: 'USD',
};

export const MOCK_PAYMENT_HISTORY = [
  { id: 'PAY-2026-07', month: 'July 2026', gross: '$8,500.00', deductions: '$1,000.00', net: '$7,500.00', paymentDate: '2026-07-31', status: 'Paid' },
  { id: 'PAY-2026-06', month: 'June 2026', gross: '$8,500.00', deductions: '$1,000.00', net: '$7,500.00', paymentDate: '2026-06-30', status: 'Paid' },
  { id: 'PAY-2026-05', month: 'May 2026', gross: '$8,500.00', deductions: '$1,000.00', net: '$7,500.00', paymentDate: '2026-05-31', status: 'Paid' },
  { id: 'PAY-2026-04', month: 'April 2026', gross: '$8,500.00', deductions: '$1,000.00', net: '$7,500.00', paymentDate: '2026-04-30', status: 'Paid' },
  { id: 'PAY-2026-03', month: 'March 2026', gross: '$8,500.00', deductions: '$1,000.00', net: '$7,500.00', paymentDate: '2026-03-31', status: 'Paid' },
];
