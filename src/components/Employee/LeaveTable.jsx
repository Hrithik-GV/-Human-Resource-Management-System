import React from "react";
import { Table, THead, TBody, TR, TH, TD } from "../UI/Table";
import { Badge } from "../UI/Badge";
import { EmptyState } from "../UI/EmptyState";
import { CalendarRange } from "lucide-react";

export const LeaveTable = ({ leaves = [] }) => {
  if (leaves.length === 0) {
    return <EmptyState icon={CalendarRange} title="No leave history" description="You have not applied for any leave requests." />;
  }

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

  return (
    <Table>
      <THead>
        <TR>
          <TH>Leave Type</TH>
          <TH>Start Date</TH>
          <TH>End Date</TH>
          <TH>Days</TH>
          <TH>Reason</TH>
          <TH>Status</TH>
        </TR>
      </THead>
      <TBody>
        {leaves.map((lv) => (
          <TR key={lv.id}>
            <TD className="font-semibold text-slate-800">{lv.leaveType}</TD>
            <TD>{lv.startDate}</TD>
            <TD>{lv.endDate}</TD>
            <TD className="text-slate-600 font-semibold">{lv.days} day{lv.days > 1 ? "s" : ""}</TD>
            <TD className="text-slate-500 font-normal max-w-xs truncate" title={lv.reason}>
              {lv.reason}
              {lv.rejectionReason && (
                <span className="block text-[10px] text-red-500 font-medium mt-0.5">
                  HR Note: {lv.rejectionReason}
                </span>
              )}
            </TD>
            <TD>
              <Badge variant={getStatusVariant(lv.status)}>{lv.status}</Badge>
            </TD>
          </TR>
        ))}
      </TBody>
    </Table>
  );
};
