import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { StatCard } from "../../components/Dashboard/StatCard";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/UI/Card";
import { Table, THead, TBody, TR, TH, TD } from "../../components/UI/Table";
import { Badge } from "../../components/UI/Badge";
import { Button } from "../../components/UI/Button";
import { Modal } from "../../components/UI/Modal";
import { Input } from "../../components/UI/Input";
import { Avatar } from "../../components/UI/Avatar";
import { CalendarRange, ShieldAlert, CheckCircle, XCircle } from "lucide-react";

export const LeaveRequests = () => {
  const { leaves, employees, approveLeave, rejectLeave } = useApp();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectError, setRejectError] = useState("");

  const pending = leaves.filter((lv) => lv.status === "Pending");
  const approved = leaves.filter((lv) => lv.status === "Approved");
  const rejected = leaves.filter((lv) => lv.status === "Rejected");

  const getStatusVariant = (status) => {
    switch (status) {
      case "Approved":
        return "success";
      case "Pending":
        return "warning";
      case "Rejected":
      default:
        return "danger";
    }
  };

  const handleRejectClick = (req) => {
    setSelectedRequest(req);
    setRejectReason("");
    setRejectError("");
  };

  const handleRejectSubmit = (e) => {
    e.preventDefault();
    if (!rejectReason) {
      setRejectError("Rejection reason is required");
      return;
    }

    rejectLeave(selectedRequest.id, rejectReason);
    setSelectedRequest(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Leave Approvals Dashboard</h2>
        <p className="text-xs text-slate-400 mt-1">Review leave applications, view request reasonings, and approve/reject with log notes.</p>
      </div>

      {/* Leave Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Pending Review" value={pending.length} icon={CalendarRange} className="text-amber-600 bg-amber-50/5 border-amber-100/50" />
        <StatCard title="Approved Leaves" value={approved.length} icon={CheckCircle} className="text-emerald-600" />
        <StatCard title="Rejected Requests" value={rejected.length} icon={XCircle} className="text-rose-600" />
      </div>

      {/* Leave request logs */}
      <Card>
        <CardHeader>
          <CardTitle>Leave Requests Registry</CardTitle>
        </CardHeader>
        <CardContent className="!p-0">
          <Table>
            <THead>
              <TR>
                <TH>Employee</TH>
                <TH>Leave Type</TH>
                <TH>Duration</TH>
                <TH>Days</TH>
                <TH>Reason / Note</TH>
                <TH>Status</TH>
                <TH className="text-right">Actions</TH>
              </TR>
            </THead>
            <TBody>
              {leaves.map((lv) => {
                const emp = employees.find((e) => e.id === lv.employeeId) || { avatar: "" };
                return (
                  <TR key={lv.id}>
                    <TD className="flex items-center gap-3">
                      <Avatar src={emp.avatar} name={lv.employeeName} size="sm" />
                      <div>
                        <p className="font-semibold text-slate-800 leading-tight">{lv.employeeName}</p>
                        <p className="text-[10px] text-slate-400 leading-normal">ID: {lv.employeeId}</p>
                      </div>
                    </TD>
                    <TD className="font-semibold text-slate-800">{lv.leaveType}</TD>
                    <TD className="text-slate-500 text-xs font-normal">
                      {lv.startDate} to {lv.endDate}
                    </TD>
                    <TD className="font-semibold text-slate-700">{lv.days} day{lv.days > 1 ? "s" : ""}</TD>
                    <TD className="max-w-xs truncate text-xs text-slate-500 font-normal" title={lv.reason}>
                      {lv.reason}
                      {lv.rejectionReason && (
                        <span className="block text-[10px] text-red-500 font-medium mt-0.5">
                          Reject Reason: {lv.rejectionReason}
                        </span>
                      )}
                    </TD>
                    <TD>
                      <Badge variant={getStatusVariant(lv.status)}>{lv.status}</Badge>
                    </TD>
                    <TD className="text-right space-x-1">
                      {lv.status === "Pending" ? (
                        <>
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => approveLeave(lv.id)}
                            className="text-xs py-1"
                          >
                            Approve
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleRejectClick(lv)}
                            className="text-xs py-1"
                          >
                            Reject
                          </Button>
                        </>
                      ) : (
                        <span className="text-xs text-slate-400 font-semibold italic">Reviewed</span>
                      )}
                    </TD>
                  </TR>
                );
              })}
            </TBody>
          </Table>
        </CardContent>
      </Card>

      {/* Reject Modal */}
      <Modal
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        title="Reject Leave Request"
      >
        <form onSubmit={handleRejectSubmit} className="space-y-4">
          <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-rose-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-rose-800 leading-normal">
                You are rejecting the leave request of <strong>{selectedRequest?.employeeName}</strong>.
              </p>
              <p className="text-[10px] text-rose-500 mt-0.5">
                Please specify a clear rejection note that will be logged in their portal logs.
              </p>
            </div>
          </div>

          <Input
            label="Rejection Reason"
            id="rejectReason"
            placeholder="e.g. Critical project deadline or overlap with other team leaves..."
            value={rejectReason}
            onChange={(e) => {
              setRejectReason(e.target.value);
              setRejectError("");
            }}
            error={rejectError}
            required
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-4">
            <Button variant="secondary" onClick={() => setSelectedRequest(null)}>Cancel</Button>
            <Button variant="danger" type="submit">Confirm Reject</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
export default LeaveRequests;
