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

export const MOCK_ADMIN_PROFILE = {
  id: 'ADM-2001',
  employeeId: 'ADM-2001',
  fullName: 'Marcus Vance',
  email: 'admin@dayflow.com',
  phone: '+1 (555) 345-6789',
  address: '100 Executive Boulevard, Suite 500, San Francisco, CA 94105',
  dateOfBirth: '1985-11-24',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',

  // Job Information
  department: 'Human Resources',
  position: 'HR Director',
  joiningDate: '2020-01-10',
  status: 'Active',
  manager: 'Board of Directors',
  workLocation: 'HQ - San Francisco',

  // Salary Information
  basicSalary: 9000,
  allowances: 1500,
  bonus: 1000,
  deductions: 500,
  netSalary: 11000,

  // Documents
  documents: [
    { name: 'Executive_Contract_Marcus_Vance.pdf', size: '2.1 MB', type: 'PDF', date: '2020-01-08' },
    { name: 'HR_Compliance_Certification.pdf', size: '1.8 MB', type: 'PDF', date: '2021-04-15' },
    { name: 'ID_Proof_Passport.pdf', size: '3.4 MB', type: 'PDF', date: '2020-01-05' },
  ],
};
