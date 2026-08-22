import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { CreditCard, DollarSign, Edit3, Eye, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { PageContainer } from '../../components/common/PageContainer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { SkeletonLoader } from '../../components/ui/SkeletonLoader';
import { EmptyState } from '../../components/ui/EmptyState';
import { adminService } from '../../services/adminService';

export const AdminPayroll = () => {
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState('');

  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const basicSalary = watch('basicSalary') || 0;
  const bonus = watch('bonus') || 0;
  const allowances = watch('allowances') || 0;
  const deductions = watch('deductions') || 0;

  const computedNet = Number(basicSalary) + Number(bonus) + Number(allowances) - Number(deductions);

  useEffect(() => {
    fetchPayroll();
  }, [search]);

  const fetchPayroll = async () => {
    try {
      setLoading(true);
      const data = await adminService.getPayrollRecords({ search });
      setRecords(data);
    } catch (err) {
      toast.error('Failed to load payroll records.');
    } finally {
      setLoading(false);
    }
  };

  const totalMonthlyPayroll = records.reduce((sum, r) => sum + (r.salary || 0), 0);
  const avgSalary = records.length > 0 ? Math.round(totalMonthlyPayroll / records.length) : 0;
  const totalBonus = records.reduce((sum, r) => sum + (r.bonus || 0), 0);
  const totalDeductions = records.reduce((sum, r) => sum + (r.deductions || 0), 0);

  const handleOpenEdit = (emp) => {
    setSelectedEmp(emp);
    reset({
      basicSalary: emp.basicSalary || 6000,
      bonus: emp.bonus || 500,
      allowances: emp.allowances || 1000,
      deductions: emp.deductions || 400,
    });
    setIsEditModalOpen(true);
  };

  const handleEditSalarySubmit = async (formData) => {
    try {
      await adminService.updateSalaryStructure(selectedEmp.id, formData);
      toast.success(`Salary structure updated for ${selectedEmp.fullName}.`);
      setIsEditModalOpen(false);
      fetchPayroll();
    } catch (err) {
      toast.error('Failed to update salary structure.');
    }
  };

  const handleOpenView = (emp) => {
    setSelectedEmp(emp);
    setIsViewModalOpen(true);
  };

  return (
    <PageContainer
      title="Payroll Management"
      description="Manage employee salary structures, bonuses, deductions, and monthly payroll disbursemets."
    >
      <div className="space-y-6">
        {/* 4 Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="hover:border-indigo-200 transition-all">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-slate-500 uppercase">Monthly Payroll</p>
                <h3 className="text-xl font-bold text-slate-900">${totalMonthlyPayroll.toLocaleString()}</h3>
              </div>
              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:border-emerald-200 transition-all">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-slate-500 uppercase">Average Salary</p>
                <h3 className="text-xl font-bold text-slate-900">${avgSalary.toLocaleString()}</h3>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <DollarSign className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:border-amber-200 transition-all">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-slate-500 uppercase">Bonus Pool</p>
                <h3 className="text-xl font-bold text-emerald-600">${totalBonus.toLocaleString()}</h3>
              </div>
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <DollarSign className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:border-rose-200 transition-all">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-slate-500 uppercase">Total Deductions</p>
                <h3 className="text-xl font-bold text-rose-600">${totalDeductions.toLocaleString()}</h3>
              </div>
              <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Table & Search */}
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base">Payroll Master Register</CardTitle>
              <CardDescription>Salary breakdown and disbursement controls</CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search employee or department..."
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {loading ? (
              <div className="p-6">
                <SkeletonLoader variant="rectangular" className="h-48" />
              </div>
            ) : records.length === 0 ? (
              <EmptyState title="No Payroll Records Found" description="No payroll entries matched your search term." />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Basic Salary</TableHead>
                    <TableHead>Bonus</TableHead>
                    <TableHead>Deductions</TableHead>
                    <TableHead>Net Salary</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar src={row.avatar} name={row.fullName} size="sm" />
                          <div>
                            <p className="text-xs font-semibold text-slate-900">{row.fullName}</p>
                            <p className="text-[10px] text-slate-400 font-mono">{row.employeeId}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{row.department}</TableCell>
                      <TableCell>${(row.basicSalary || 6000).toLocaleString()}</TableCell>
                      <TableCell className="text-emerald-600">+${(row.bonus || 500).toLocaleString()}</TableCell>
                      <TableCell className="text-rose-600">-${(row.deductions || 400).toLocaleString()}</TableCell>
                      <TableCell className="font-bold text-slate-900">${(row.salary || 7500).toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenView(row)}
                            className="p-1.5 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                            title="View Salary Breakdown"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(row)}
                            className="p-1.5 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                            title="Edit Salary Structure"
                          >
                            <Edit3 className="w-4 h-4" />
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

        {/* Edit Salary Modal */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title={`Edit Salary Structure — ${selectedEmp?.fullName}`}
          description="Adjust basic salary, performance bonuses, allowances, and statutory deductions."
        >
          <form onSubmit={handleSubmit(handleEditSalarySubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Basic Salary ($)"
                type="number"
                error={errors.basicSalary?.message}
                {...register('basicSalary', { required: 'Basic salary is required' })}
              />

              <Input
                label="Bonus ($)"
                type="number"
                error={errors.bonus?.message}
                {...register('bonus')}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Allowances ($)"
                type="number"
                error={errors.allowances?.message}
                {...register('allowances')}
              />

              <Input
                label="Deductions ($)"
                type="number"
                error={errors.deductions?.message}
                {...register('deductions')}
              />
            </div>

            <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase block">Calculated Net Salary</span>
                <span className="text-xs text-slate-400">Basic + Bonus + Allowances - Deductions</span>
              </div>
              <span className="text-2xl font-extrabold text-indigo-900">${computedNet.toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <Button variant="outline" size="md" onClick={() => setIsEditModalOpen(false)} type="button">
                Cancel
              </Button>
              <Button variant="primary" size="md" type="submit" isLoading={isSubmitting}>
                Save Salary Structure
              </Button>
            </div>
          </form>
        </Modal>

        {/* View Salary Breakdown Modal */}
        <Modal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          title={`Salary Details — ${selectedEmp?.fullName}`}
          description={`Employee ID: ${selectedEmp?.employeeId} • ${selectedEmp?.department}`}
        >
          {selectedEmp && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Basic Pay</span>
                  <span className="font-semibold text-slate-800">${(selectedEmp.basicSalary || 6000).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Allowances</span>
                  <span className="font-semibold text-slate-800">${(selectedEmp.allowances || 1000).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Performance Bonus</span>
                  <span className="font-semibold text-emerald-600">+${(selectedEmp.bonus || 500).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Deductions</span>
                  <span className="font-semibold text-rose-600">-${(selectedEmp.deductions || 400).toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-2 font-bold text-sm border-t border-slate-200">
                  <span className="text-slate-900">Total Net Salary</span>
                  <span className="text-indigo-600">${(selectedEmp.salary || 7500).toLocaleString()}</span>
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
      </div>
    </PageContainer>
  );
};
