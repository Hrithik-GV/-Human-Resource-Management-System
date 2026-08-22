import React from "react";
import { Table, THead, TBody, TR, TH, TD } from "../UI/Table";
import { Badge } from "../UI/Badge";
import { EmptyState } from "../UI/EmptyState";
import { Calendar } from "lucide-react";

export const AttendanceTable = ({ records = [] }) => {
  if (records.length === 0) {
    return <EmptyState icon={Calendar} title="No attendance records" description="You have no logged attendance for the selected date range." />;
  }

  const getStatusVariant = (status) => {
    switch (status) {
      case "Present":
        return "success";
      case "Half Day":
        return "warning";
      case "Leave":
        return "info";
      case "Absent":
      default:
        return "danger";
    }
  };

  const getDayOfWeek = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { weekday: "long" });
  };

  return (
    <Table>
      <THead>
        <TR>
          <TH>Date</TH>
          <TH>Day</TH>
          <TH>Check In</TH>
          <TH>Check Out</TH>
          <TH>Working Hours</TH>
          <TH>Status</TH>
        </TR>
      </THead>
      <TBody>
        {records.map((rec) => (
          <TR key={rec.id}>
            <TD>{rec.date}</TD>
            <TD className="text-slate-500 font-normal">{getDayOfWeek(rec.date)}</TD>
            <TD className="font-semibold text-slate-800">{rec.checkIn || "-"}</TD>
            <TD className="font-semibold text-slate-800">{rec.checkOut || "-"}</TD>
            <TD className="text-slate-600 font-semibold">{rec.hours ? `${rec.hours} hrs` : "-"}</TD>
            <TD>
              <Badge variant={getStatusVariant(rec.status)}>{rec.status}</Badge>
            </TD>
          </TR>
        ))}
      </TBody>
    </Table>
  );
};
