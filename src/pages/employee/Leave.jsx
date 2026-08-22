import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../hooks/useAuth";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/UI/Card";
import { Table, THead, TBody, TR, TH, TD } from "../../components/UI/Table";
import { Input } from "../../components/UI/Input";
import { Select } from "../../components/UI/Select";
import { Button } from "../../components/UI/Button";
import { Badge } from "../../components/UI/Badge";
import { Modal } from "../../components/UI/Modal";
import { CalendarRange, Plus } from "lucide-react";

export const Leave = () => {
  const { currentUser } = useAuth();
  const { leaves, applyLeave } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Leave Form
  const [leaveType, setLeaveType] = useState("Paid Leave");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");

  if (!currentUser) return null;

  const myLeaves = leaves.filter((lv) => lv.employeeId === currentUser.id);

  const handleSubmit = (e) => {
    e.preventDefault();
    applyLeave({ leaveType, startDate, endDate, reason }, currentUser.id, currentUser.name);
    setIsModalOpen(false);
    setReason("");
    setStartDate("");
    setEndDate("");
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Approved":
        return <Badge variant="success">Approved</Badge>;
      case "Pending":
        return <Badge variant="warning">Pending</Badge>;
      case "Rejected":
        return <Badge variant="danger">Rejected</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  const leaveOptions = [
    { value: "Paid Leave", label: "Paid Leave" },
    { value: "Sick Leave", label: "Sick Leave" },
    { value: "Unpaid Leave", label: "Unpaid Leave" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Leave Management</h2>
          <p className="text-xs text-slate-400 mt-1">Apply for paid/sick leaves, and track previous requests logs.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-1.5 py-2">
          <Plus className="w-4 h-4" /> Request Leave
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Leave Requests</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <THead>
                <TR>
                  <TH>Leave Type</TH>
                  <TH>Start Date</TH>
                  <TH>End Date</TH>
                  <TH>Reason</TH>
                  <TH>Status</TH>
                </TR>
              </THead>
              <TBody>
                {myLeaves.length === 0 ? (
                  <TR>
                    <TD colSpan="5" className="text-center py-8 text-slate-400 font-medium">
                      No leave requests submitted yet
                    </TD>
                  </TR>
                ) : (
                  myLeaves.map((row) => (
                    <TR key={row.id}>
                      <TD className="font-semibold text-slate-800">{row.leaveType}</TD>
                      <TD className="text-slate-600">{row.startDate}</TD>
                      <TD className="text-slate-600">{row.endDate}</TD>
                      <TD className="text-slate-500 font-medium max-w-[200px] truncate" title={row.reason}>
                        {row.reason}
                        {row.status === "Rejected" && row.rejectionReason && (
                          <span className="block text-[10px] font-bold text-red-500 mt-0.5">
                            Rejection Reason: {row.rejectionReason}
                          </span>
                        )}
                      </TD>
                      <TD>{getStatusBadge(row.status)}</TD>
                    </TR>
                  ))
                )}
              </TBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Apply for Leave">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Leave Type"
            id="leave-type"
            value={leaveType}
            onChange={(e) => setLeaveType(e.target.value)}
            options={leaveOptions}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Date"
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
            <Input
              label="End Date"
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
          <Input
            label="Reason for Leave"
            id="reason"
            placeholder="Please detail your reason for leave request"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />
          <div className="flex justify-end gap-3.5 pt-4 border-t border-slate-100 mt-4">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex items-center gap-1">
              Submit Application
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
export default Leave;
