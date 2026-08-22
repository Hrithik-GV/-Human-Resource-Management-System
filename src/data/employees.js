export const MOCK_EMPLOYEE_PROFILE = {
  id: 'EMP-1001',
  employeeId: 'EMP-1001',
  fullName: 'Sarah Jenkins',
  email: 'employee@dayflow.com',
  phone: '+1 (555) 234-5678',
  address: '742 Evergreen Terrace, Springfield, OR 97477',
  dateOfBirth: '1992-06-15',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
  
  // Job Information
  department: 'Engineering',
  position: 'Frontend Engineer',
  joiningDate: '2022-03-15',
  status: 'Active',
  manager: 'Marcus Vance',
  workLocation: 'HQ - San Francisco',

  // Salary Information
  basicSalary: 6500,
  allowances: 1200,
  bonus: 800,
  deductions: 500,
  netSalary: 8000,

  // Documents
  documents: [
    { name: 'Resume_Sarah_Jenkins.pdf', size: '1.2 MB', type: 'PDF', date: '2022-03-10' },
    { name: 'National_ID_Proof.pdf', size: '2.4 MB', type: 'PDF', date: '2022-03-11' },
    { name: 'Employment_Contract_Signed.pdf', size: '3.1 MB', type: 'PDF', date: '2022-03-12' },
  ],
};
