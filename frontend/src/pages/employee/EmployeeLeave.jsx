import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Calendar, Plus, Clock, FileText, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { PageContainer } from '../../components/common/PageContainer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { Modal } from '../../components/ui/Modal';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { SkeletonLoader } from '../../components/ui/SkeletonLoader';
import { EmptyState } from '../../components/ui/EmptyState';
import { leaveService } from '../../services/leaveService';

export const EmployeeLeave = () => {
  const [loading, setLoading] = useState(true);
  const [balances, setBalances] = useState(null);
  const [history, setHistory] = useState([]);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      leaveType: 'Paid Leave',
      startDate: '',
      endDate: '',
      days: 1,
      reason: '',
    },
  });

  const startDate = watch('startDate');
  const endDate = watch('endDate');

  useEffect(() => {
    fetchLeaveData();
  }, []);

  // Calculate days difference automatically when dates change
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (end >= start) {
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        setValue('days', diffDays);
      }
    }
  }, [startDate, endDate, setValue]);

  const fetchLeaveData = async () => {
    try {
      setLoading(true);
      const [balData, histData] = await Promise.all([
        leaveService.getBalances(),
        leaveService.getHistory(),
      ]);
      setBalances(balData);
      setHistory(histData);
    } catch (err) {
      toast.error('Failed to load leave records.');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyLeaveSubmit = async (formData) => {
    try {
      await leaveService.applyLeave(formData);
      toast.success('Leave application submitted successfully for review!');
      setIsApplyModalOpen(false);
      reset();
      fetchLeaveData();
    } catch (err) {
      toast.error('Failed to submit leave application.');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return <Badge variant="success" dot size="sm">Approved</Badge>;
      case 'Pending':
        return <Badge variant="warning" dot size="sm">Pending</Badge>;
      case 'Rejected':
        return <Badge variant="error" dot size="sm">Rejected</Badge>;
      default:
        return <Badge variant="neutral" size="sm">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <PageContainer title="Leave Management" description="Request time off and track your leave quota balances.">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SkeletonLoader variant="card" count={3} className="h-28" />
          </div>
          <SkeletonLoader variant="card" className="h-80" />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Leave Management"
      description="Request time off and track your leave quota balances."
      actions={
        <Button
          variant="primary"
          size="md"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setIsApplyModalOpen(true)}
        >
          Apply Leave
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Leave Balance Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="hover:border-indigo-200 transition-all">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-500 uppercase">Paid Leave</p>
                <h3 className="text-2xl font-extrabold text-slate-900">{balances?.paidLeave} Days Available</h3>
                <p className="text-[11px] text-slate-500">Annual Quota</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Calendar className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:border-amber-200 transition-all">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-500 uppercase">Sick Leave</p>
                <h3 className="text-2xl font-extrabold text-slate-900">{balances?.sickLeave} Days Available</h3>
                <p className="text-[11px] text-slate-500">Medical Quota</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:border-slate-300 transition-all">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-500 uppercase">Unpaid Leave</p>
                <h3 className="text-2xl font-extrabold text-slate-900">{balances?.unpaidLeave} Days Available</h3>
                <p className="text-[11px] text-slate-500">Without Pay Quota</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Leave History Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Leave Application History</CardTitle>
            <CardDescription>View status of current and past time-off requests</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {history.length === 0 ? (
              <EmptyState title="No Leave Applications" description="You have not submitted any leave requests yet." />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Leave Type</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Applied On</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="font-semibold text-slate-900">{row.leaveType}</TableCell>
                      <TableCell>{row.startDate}</TableCell>
                      <TableCell>{row.endDate}</TableCell>
                      <TableCell className="font-mono text-xs">{row.days} {row.days === 1 ? 'day' : 'days'}</TableCell>
                      <TableCell className="max-w-xs truncate text-xs text-slate-600">{row.reason}</TableCell>
                      <TableCell className="text-xs text-slate-500">{row.appliedOn}</TableCell>
                      <TableCell>{getStatusBadge(row.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Apply Leave Modal */}
        <Modal
          isOpen={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
          title="Apply for Time Off"
          description="Fill out the leave request form for manager review."
        >
          <form onSubmit={handleSubmit(handleApplyLeaveSubmit)} className="space-y-4">
            <Select
              label="Leave Type"
              options={[
                { label: 'Paid Leave', value: 'Paid Leave' },
                { label: 'Sick Leave', value: 'Sick Leave' },
                { label: 'Unpaid Leave', value: 'Unpaid Leave' },
                { label: 'Casual Leave', value: 'Casual Leave' },
              ]}
              error={errors.leaveType?.message}
              {...register('leaveType', { required: 'Please select a leave type' })}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Start Date"
                type="date"
                error={errors.startDate?.message}
                {...register('startDate', { required: 'Start date is required' })}
              />

              <Input
                label="End Date"
                type="date"
                error={errors.endDate?.message}
                {...register('endDate', { required: 'End date is required' })}
              />
            </div>

            <Input
              label="Number of Days"
              type="number"
              min="1"
              error={errors.days?.message}
              {...register('days', { required: 'Days count is required' })}
            />

            <Textarea
              label="Reason for Leave"
              placeholder="Provide context or details for your manager..."
              rows={3}
              error={errors.reason?.message}
              {...register('reason', { required: 'Reason is required' })}
            />

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <Button variant="outline" size="md" onClick={() => setIsApplyModalOpen(false)} type="button">
                Cancel
              </Button>
              <Button variant="primary" size="md" type="submit" isLoading={isSubmitting}>
                Submit Application
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </PageContainer>
  );
};
