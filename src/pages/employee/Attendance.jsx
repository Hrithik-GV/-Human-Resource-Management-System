import React from "react";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../hooks/useAuth";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/UI/Card";
import { Table, THead, TBody, TR, TH, TD } from "../../components/UI/Table";
import { Badge } from "../../components/UI/Badge";

export const Attendance = () => {
  const { currentUser } = useAuth();
  const { attendance } = useApp();

  if (!currentUser) return null;

  const records = attendance.filter((att) => att.employeeId === currentUser.id);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Present":
        return <Badge variant="success">Present</Badge>;
      case "Half Day":
        return <Badge variant="warning">Half Day</Badge>;
      case "Absent":
        return <Badge variant="danger">Absent</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-slate-900">My Attendance Records</h2>
        <p className="text-xs text-slate-400 mt-1">Review your historical daily working logs, check-in schedules, and active statuses.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Attendance History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <THead>
                <TR>
                  <TH>Date</TH>
                  <TH>Check In</TH>
                  <TH>Check Out</TH>
                  <TH>Hours Logged</TH>
                  <TH>Status</TH>
                </TR>
              </THead>
              <TBody>
                {records.length === 0 ? (
                  <TR>
                    <TD colSpan="5" className="text-center py-8 text-slate-400 font-medium">
                      No attendance records found in system database
                    </TD>
                  </TR>
                ) : (
                  records.map((row) => (
                    <TR key={row.id}>
                      <TD className="font-semibold text-slate-800">{row.date}</TD>
                      <TD className="text-slate-600">{row.checkIn || "-"}</TD>
                      <TD className="text-slate-600">{row.checkOut || "-"}</TD>
                      <TD className="font-bold text-slate-700">{row.hours ? `${row.hours} hrs` : "-"}</TD>
                      <TD>{getStatusBadge(row.status)}</TD>
                    </TR>
                  ))
                )}
              </TBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default Attendance;
