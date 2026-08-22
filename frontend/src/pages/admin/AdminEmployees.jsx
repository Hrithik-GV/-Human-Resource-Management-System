import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Users,
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  Eye,
  Mail,
  Phone,
  Building,
  Briefcase,
  Calendar,
  DollarSign,
  IdCard,
  MapPin
} from 'lucide-react';
import toast from 'react-hot-toast';
import { PageContainer } from '../../components/common/PageContainer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Modal } from '../../components/ui/Modal';
import { ConfirmationDialog } from '../../components/ui/ConfirmationDialog';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { SkeletonLoader } from '../../components/ui/SkeletonLoader';
import { EmptyState } from '../../components/ui/EmptyState';
import { adminService } from '../../services/adminService';

export const AdminEmployees = () => {
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Forms
  const addForm = useForm();
  const editForm = useForm();

  useEffect(() => {
    fetchEmployees();
  }, [search, deptFilter, statusFilter]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await adminService.getEmployees({
        search,
        department: deptFilter,
        status: statusFilter,
      });
      setEmployees(data);
    } catch (err) {
      toast.error('Failed to load employees.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubmit = async (data) => {
    try {
      await adminService.addEmployee(data);
      toast.success(`Employee ${data.fullName} added successfully!`);
      setIsAddModalOpen(false);
      addForm.reset();
      fetchEmployees();
    } catch (err) {
      toast.error('Failed to add employee.');
    }
  };

  const handleOpenEdit = (emp) => {
    setSelectedEmp(emp);
    editForm.reset({
      phone: emp.phone,
      department: emp.department,
      position: emp.position,
      status: emp.status,
      salary: emp.salary,
      avatar: emp.avatar,
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (formData) => {
    try {
      await adminService.updateEmployee(selectedEmp.id, formData);
      toast.success(`Updated ${selectedEmp.fullName}'s profile details.`);
      setIsEditModalOpen(false);
      fetchEmployees();
    } catch (err) {
      toast.error('Failed to update employee.');
    }
  };

  const handleOpenDelete = (emp) => {
    setSelectedEmp(emp);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setDeleteLoading(true);
      await adminService.deleteEmployee(selectedEmp.id);
      toast.success(`Removed ${selectedEmp.fullName} from directory.`);
      setIsDeleteDialogOpen(false);
      fetchEmployees();
    } catch (err) {
      toast.error('Failed to delete employee.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleOpenView = (emp) => {
    setSelectedEmp(emp);
    setIsViewModalOpen(true);
  };

  return (
    <PageContainer
      title="Employees Directory"
      description="Manage organization staff, add new team members, edit designations, and update employee status."
      actions={
        <Button
          variant="primary"
          size="md"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => {
            addForm.reset();
            setIsAddModalOpen(true);
          }}
        >
          Add Employee
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Search & Multi-Filters */}
        <Card>
          <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, email, or ID..."
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="w-full sm:w-44">
                <Select
                  options={[
                    { label: 'All Departments', value: 'All' },
                    { label: 'Engineering', value: 'Engineering' },
                    { label: 'Human Resources', value: 'Human Resources' },
                    { label: 'Design', value: 'Design' },
                    { label: 'Marketing', value: 'Marketing' },
                    { label: 'Finance', value: 'Finance' },
                  ]}
                  value={deptFilter}
                  onChange={(e) => setDeptFilter(e.target.value)}
                />
              </div>

              <div className="w-full sm:w-36">
                <Select
                  options={[
                    { label: 'All Statuses', value: 'All' },
                    { label: 'Active', value: 'Active' },
                    { label: 'On Leave', value: 'On Leave' },
                    { label: 'Inactive', value: 'Inactive' },
                  ]}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Employee Table */}
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-6">
                <SkeletonLoader variant="rectangular" className="h-48" />
              </div>
            ) : employees.length === 0 ? (
              <EmptyState title="No Employees Found" description="No staff members matched your current filter criteria." />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((emp) => (
                    <TableRow key={emp.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar src={emp.avatar} name={emp.fullName} size="sm" />
                          <div>
                            <p className="text-xs font-semibold text-slate-900">{emp.fullName}</p>
                            <p className="text-[11px] text-slate-500">{emp.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs font-semibold">{emp.employeeId}</TableCell>
                      <TableCell>{emp.department}</TableCell>
                      <TableCell>{emp.position}</TableCell>
                      <TableCell>
                        <Badge
                          variant={emp.status === 'Active' ? 'success' : emp.status === 'On Leave' ? 'warning' : 'neutral'}
                          dot
                          size="sm"
                        >
                          {emp.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenView(emp)}
                            className="p-1.5 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                            title="View Employee Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(emp)}
                            className="p-1.5 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                            title="Edit Employee"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenDelete(emp)}
                            className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete Employee"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Add Employee Modal */}
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Add New Employee"
          description="Enter credentials and employment details to onboard a new team member."
        >
          <form onSubmit={addForm.handleSubmit(handleAddSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Employee ID"
                placeholder="EMP-1010"
                error={addForm.formState.errors.employeeId?.message}
                {...addForm.register('employeeId', { required: 'Employee ID is required' })}
              />

              <Input
                label="Full Name"
                placeholder="John Smith"
                error={addForm.formState.errors.fullName?.message}
                {...addForm.register('fullName', { required: 'Full name is required' })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="john.smith@dayflow.com"
                error={addForm.formState.errors.email?.message}
                {...addForm.register('email', { required: 'Email address is required' })}
              />

              <Input
                label="Phone Number"
                placeholder="+1 (555) 000-0000"
                error={addForm.formState.errors.phone?.message}
                {...addForm.register('phone')}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Department"
                options={[
                  { label: 'Engineering', value: 'Engineering' },
                  { label: 'Human Resources', value: 'Human Resources' },
                  { label: 'Design', value: 'Design' },
                  { label: 'Marketing', value: 'Marketing' },
                  { label: 'Finance', value: 'Finance' },
                ]}
                {...addForm.register('department')}
              />

              <Input
                label="Designation / Position"
                placeholder="Software Engineer"
                error={addForm.formState.errors.position?.message}
                {...addForm.register('position', { required: 'Position is required' })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Monthly Salary ($)"
                type="number"
                placeholder="7500"
                error={addForm.formState.errors.salary?.message}
                {...addForm.register('salary', { required: 'Salary is required' })}
              />

              <Input
                label="Joining Date"
                type="date"
                {...addForm.register('joiningDate')}
              />

              <Select
                label="Status"
                options={[
                  { label: 'Active', value: 'Active' },
                  { label: 'On Leave', value: 'On Leave' },
                  { label: 'Inactive', value: 'Inactive' },
                ]}
                {...addForm.register('status')}
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <Button variant="outline" size="md" onClick={() => setIsAddModalOpen(false)} type="button">
                Cancel
              </Button>
              <Button variant="primary" size="md" type="submit" isLoading={addForm.formState.isSubmitting}>
                Save Employee
              </Button>
            </div>
          </form>
        </Modal>

        {/* Edit Employee Modal */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title={`Edit Employee — ${selectedEmp?.fullName}`}
          description="Update employee contact, department, status, and salary information."
        >
          <form onSubmit={editForm.handleSubmit(handleEditSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Phone Number"
                error={editForm.formState.errors.phone?.message}
                {...editForm.register('phone')}
              />

              <Select
                label="Department"
                options={[
                  { label: 'Engineering', value: 'Engineering' },
                  { label: 'Human Resources', value: 'Human Resources' },
                  { label: 'Design', value: 'Design' },
                  { label: 'Marketing', value: 'Marketing' },
                  { label: 'Finance', value: 'Finance' },
                ]}
                {...editForm.register('department')}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Designation / Position"
                error={editForm.formState.errors.position?.message}
                {...editForm.register('position')}
              />

              <Select
                label="Employment Status"
                options={[
                  { label: 'Active', value: 'Active' },
                  { label: 'On Leave', value: 'On Leave' },
                  { label: 'Inactive', value: 'Inactive' },
                ]}
                {...editForm.register('status')}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Monthly Salary ($)"
                type="number"
                error={editForm.formState.errors.salary?.message}
                {...editForm.register('salary')}
              />

              <Input
                label="Profile Picture URL"
                type="url"
                error={editForm.formState.errors.avatar?.message}
                {...editForm.register('avatar')}
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <Button variant="outline" size="md" onClick={() => setIsEditModalOpen(false)} type="button">
                Cancel
              </Button>
              <Button variant="primary" size="md" type="submit" isLoading={editForm.formState.isSubmitting}>
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>

        {/* View Employee Details Modal */}
        <Modal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          title="Employee Profile Details"
          description={`Record summary for ${selectedEmp?.employeeId}`}
        >
          {selectedEmp && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <Avatar src={selectedEmp.avatar} name={selectedEmp.fullName} size="lg" />
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedEmp.fullName}</h3>
                  <p className="text-xs text-indigo-600 font-semibold">{selectedEmp.position}</p>
                  <p className="text-[11px] text-slate-500">{selectedEmp.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 font-medium block">Employee ID</span>
                  <span className="font-bold text-slate-800">{selectedEmp.employeeId}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium block">Department</span>
                  <span className="font-bold text-slate-800">{selectedEmp.department}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium block">Phone</span>
                  <span className="font-bold text-slate-800">{selectedEmp.phone}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium block">Joining Date</span>
                  <span className="font-bold text-slate-800">{selectedEmp.joiningDate}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium block">Current Salary</span>
                  <span className="font-bold text-slate-800">${selectedEmp.salary?.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium block">Status</span>
                  <Badge variant={selectedEmp.status === 'Active' ? 'success' : 'neutral'} size="sm">
                    {selectedEmp.status}
                  </Badge>
                </div>
              </div>

              <div className="flex justify-end pt-3 border-t border-slate-100">
                <Button variant="outline" size="md" onClick={() => setIsViewModalOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </Modal>

        {/* Delete Confirmation Dialog */}
        <ConfirmationDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Remove Employee"
          message={`Are you sure you want to delete ${selectedEmp?.fullName} (${selectedEmp?.employeeId}) from the staff directory? This action cannot be undone.`}
          confirmText="Delete Employee"
          isDanger
          isLoading={deleteLoading}
        />
      </div>
    </PageContainer>
  );
};
