import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FileCheck, CheckCircle2, XCircle, Clock, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { PageContainer } from '../../components/common/PageContainer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { Modal } from '../../components/ui/Modal';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { SkeletonLoader } from '../../components/ui/SkeletonLoader';
import { EmptyState } from '../../components/ui/EmptyState';
import { adminService } from '../../services/adminService';

export const AdminLeaves = () => {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');

  // Reject Modal state
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedReq, setSelectedReq] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    fetchRequests();
  }, [statusFilter]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await adminService.getLeaveRequests({ status: statusFilter });
      setRequests(data);
    } catch (err) {
      toast.error('Failed to load leave requests.');
    } finally {
      setLoading(false);
    }
  };

  const pendingCount = requests.filter((r) => r.status === 'Pending').length;
  const approvedCount = requests.filter((r) => r.status === 'Approved').length;
  const rejectedCount = requests.filter((r) => r.status === 'Rejected').length;

  const handleApprove = async (id, name) => {
    try {
      await adminService.approveLeaveRequest(id);
      toast.success(`Leave request for ${name} has been approved.`);
      fetchRequests();
    } catch (err) {
      toast.error('Failed to approve request.');
    }
  };

  const handleOpenReject = (req) => {
    setSelectedReq(req);
    reset({ reason: '' });
    setIsRejectModalOpen(true);
  };

  const handleRejectSubmit = async (formData) => {
    try {
      await adminService.rejectLeaveRequest(selectedReq.id, formData.reason);
      toast.success(`Leave request for ${selectedReq.name} rejected.`);
      setIsRejectModalOpen(false);
      fetchRequests();
    } catch (err) {
      toast.error('Failed to reject leave request.');
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

  return (
    <PageContainer
      title="Leave Requests"
      description="Review employee leave applications, approve requests, or reject with comments."
    >
      <div className="space-y-6">
        {/* 3 Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="hover:border-amber-200 transition-all">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-500 uppercase">Pending Requests</p>
                <h3 className="text-2xl font-extrabold text-amber-600">{pendingCount} Applications</h3>
                <p className="text-[11px] text-slate-500">Requires Admin Action</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:border-emerald-200 transition-all">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-500 uppercase">Approved Leaves</p>
                <h3 className="text-2xl font-extrabold text-emerald-600">{approvedCount} Applications</h3>
                <p className="text-[11px] text-slate-500">Current Period</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:border-rose-200 transition-all">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-500 uppercase">Rejected Leaves</p>
                <h3 className="text-2xl font-extrabold text-rose-600">{rejectedCount} Applications</h3>
                <p className="text-[11px] text-slate-500">Declined Requests</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <XCircle className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Requests Table */}
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base">Leave Applications Queue</CardTitle>
              <CardDescription>Review time-off requests submitted by employees</CardDescription>
            </div>
            <div className="w-full sm:w-44">
              <Select
                options={[
                  { label: 'All Statuses', value: 'All' },
                  { label: 'Pending', value: 'Pending' },
                  { label: 'Approved', value: 'Approved' },
                  { label: 'Rejected', value: 'Rejected' },
                ]}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              />
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {loading ? (
              <div className="p-6">
                <SkeletonLoader variant="rectangular" className="h-48" />
              </div>
            ) : requests.length === 0 ? (
              <EmptyState title="No Leave Requests Found" description="There are no leave applications in the selected category." />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Leave Type</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar src={row.avatar} name={row.name} size="sm" />
                          <div>
                            <p className="text-xs font-semibold text-slate-900">{row.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono">{row.employeeId} • {row.department}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-slate-800">{row.leaveType}</TableCell>
                      <TableCell className="text-xs">{row.startDate} to {row.endDate}</TableCell>
                      <TableCell className="font-mono text-xs font-semibold">{row.days} {row.days === 1 ? 'day' : 'days'}</TableCell>
                      <TableCell className="max-w-xs truncate text-xs text-slate-600">{row.reason}</TableCell>
                      <TableCell>{getStatusBadge(row.status)}</TableCell>
                      <TableCell className="text-right">
                        {row.status === 'Pending' ? (
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleApprove(row.id, row.name)}
                              className="text-xs"
                            >
                              Approve
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleOpenReject(row)}
                              className="text-xs"
                            >
                              Reject
                            </Button>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 font-medium">Processed</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Reject Leave Modal */}
        <Modal
          isOpen={isRejectModalOpen}
          onClose={() => setIsRejectModalOpen(false)}
          title={`Reject Leave Application — ${selectedReq?.name}`}
          description="Provide an explanation for declining this leave request."
        >
          <form onSubmit={handleSubmit(handleRejectSubmit)} className="space-y-4">
            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-800 space-y-1">
              <p className="font-bold flex items-center gap-1">
                <AlertTriangle className="w-4 h-4 text-amber-600" /> Request Details
              </p>
              <p>{selectedReq?.leaveType} for {selectedReq?.days} days ({selectedReq?.startDate} to {selectedReq?.endDate})</p>
              <p className="text-slate-600">Reason: "{selectedReq?.reason}"</p>
            </div>

            <Textarea
              label="Rejection Reason"
              placeholder="State reason for rejection (e.g., high workload, team availability)..."
              rows={3}
              error={errors.reason?.message}
              {...register('reason', { required: 'Rejection reason is required' })}
            />

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <Button variant="outline" size="md" onClick={() => setIsRejectModalOpen(false)} type="button">
                Cancel
              </Button>
              <Button variant="danger" size="md" type="submit" isLoading={isSubmitting}>
                Confirm Rejection
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </PageContainer>
  );
};
