import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { LeaveTable } from "../../components/Employee/LeaveTable";
import { StatCard } from "../../components/Dashboard/StatCard";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/UI/Card";
import { Button } from "../../components/UI/Button";
import { Modal } from "../../components/UI/Modal";
import { Input } from "../../components/UI/Input";
import { Select } from "../../components/UI/Select";
import { CalendarRange, Sparkles, Send } from "lucide-react";

export const Leave = () => {
  const { currentUser, leaves, applyLeave } = useApp();
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  // Apply Form State
  const [leaveType, setLeaveType] = useState("Paid Leave");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [days, setDays] = useState(1);
  const [reason, setReason] = useState("");
  const [errors, setErrors] = useState({});

  if (!currentUser) return null;

  const userLeaves = leaves.filter((lv) => lv.employeeId === currentUser.id);

  // Leave balances (Total available minus approved)
  const approvedPaid = userLeaves.filter((l) => l.leaveType === "Paid Leave" && l.status === "Approved").reduce((a, c) => a + c.days, 0);
  const approvedSick = userLeaves.filter((l) => l.leaveType === "Sick Leave" && l.status === "Approved").reduce((a, c) => a + c.days, 0);
  const approvedUnpaid = userLeaves.filter((l) => l.leaveType === "Unpaid Leave" && l.status === "Approved").reduce((a, c) => a + c.days, 0);

  const paidAvailable = Math.max(0, 12 - approvedPaid);
  const sickAvailable = Math.max(0, 8 - approvedSick);

  const handleValidation = () => {
    const tempErrors = {};
    if (!startDate) tempErrors.startDate = "Start date is required";
    if (!endDate) tempErrors.endDate = "End date is required";
    if (!reason) tempErrors.reason = "Reason for leave is required";
    if (days <= 0) tempErrors.days = "Days must be greater than 0";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleApply = (e) => {
    e.preventDefault();
    if (!handleValidation()) return;

    applyLeave({
      leaveType,
      startDate,
      endDate,
      days: Number(days),
      reason,
    });

    // Reset Form
    setStartDate("");
    setEndDate("");
    setDays(1);
    setReason("");
    setErrors({});
    setIsApplyModalOpen(false);
  };

  const leaveOptions = [
    { value: "Paid Leave", label: "Paid Leave" },
    { value: "Sick Leave", label: "Sick Leave" },
    { value: "Unpaid Leave", label: "Unpaid Leave" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Leave Management</h2>
          <p className="text-xs text-slate-400 mt-1">Submit new leave requests, monitor balances and view history.</p>
        </div>
        <Button variant="primary" onClick={() => setIsApplyModalOpen(true)} className="flex items-center gap-1.5 self-start">
          <CalendarRange className="w-4 h-4" /> Apply Leave
        </Button>
      </div>

      {/* Leave Balance Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Paid Leave Balance" value={`${paidAvailable} / 12 Days`} icon={Sparkles} description="Renewed annually" />
        <StatCard title="Sick Leave Balance" value={`${sickAvailable} / 8 Days`} icon={Sparkles} description="Sick & emergency leaves" />
        <StatCard title="Unpaid Leaves Logged" value={`${approvedUnpaid} Days`} icon={Sparkles} description="Loss of pay tracker" />
      </div>

      {/* Leave logs */}
      <Card>
        <CardHeader>
          <CardTitle>Leave Application History</CardTitle>
        </CardHeader>
        <CardContent>
          <LeaveTable leaves={userLeaves} />
        </CardContent>
      </Card>

      {/* Apply Leave Modal */}
      <Modal isOpen={isApplyModalOpen} onClose={() => setIsApplyModalOpen(false)} title="Apply for Leave">
        <form onSubmit={handleApply} className="space-y-4">
          <Select
            label="Leave Type"
            id="leaveType"
            value={leaveType}
            onChange={(e) => setLeaveType(e.target.value)}
            options={leaveOptions}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Date"
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              error={errors.startDate}
              required
            />
            <Input
              label="End Date"
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              error={errors.endDate}
              required
            />
          </div>

          <Input
            label="Total Days"
            id="days"
            type="number"
            min="1"
            max="30"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            error={errors.days}
            required
          />

          <Input
            label="Reason for Leave"
            id="reason"
            placeholder="Please detail your request reason..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            error={errors.reason}
            required
          />

          <div className="flex justify-end gap-3.5 pt-4 border-t border-slate-100 mt-4">
            <Button variant="secondary" onClick={() => setIsApplyModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex items-center gap-1.5">
              <Send className="w-4 h-4" /> Submit Request
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
export default Leave;
