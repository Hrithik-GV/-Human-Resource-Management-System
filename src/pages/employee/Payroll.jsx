import React from "react";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../hooks/useAuth";
import { formatCurrency } from "../../utils/format";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/UI/Card";
import { Table, THead, TBody, TR, TH, TD } from "../../components/UI/Table";
import { Badge } from "../../components/UI/Badge";
import { Button } from "../../components/UI/Button";
import { Download, Landmark } from "lucide-react";

export const Payroll = () => {
  const { currentUser } = useAuth();
  const { payroll } = useApp();

  if (!currentUser) return null;

  const records = payroll.filter((pay) => pay.employeeId === currentUser.id);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Paid":
        return <Badge variant="success">Paid</Badge>;
      case "Processing":
        return <Badge variant="warning">Processing</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-slate-900">My Payroll Logs</h2>
        <p className="text-xs text-slate-400 mt-1">Access monthly salary logs, tax statements, and download generated payslips.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payslips Directory</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <THead>
                <TR>
                  <TH>Month / Year</TH>
                  <TH>Basic Salary</TH>
                  <TH>Allowances</TH>
                  <TH>Deductions</TH>
                  <TH>Net Credited</TH>
                  <TH>Payment Date</TH>
                  <TH>Status</TH>
                  <TH className="text-right">Actions</TH>
                </TR>
              </THead>
              <TBody>
                {records.length === 0 ? (
                  <TR>
                    <TD colSpan="8" className="text-center py-8 text-slate-400 font-medium">
                      No payroll records processed for this employee account
                    </TD>
                  </TR>
                ) : (
                  records.map((row) => (
                    <TR key={row.id}>
                      <TD className="font-semibold text-slate-800">{row.month} {row.year}</TD>
                      <TD className="text-slate-600">{formatCurrency(row.basicSalary)}</TD>
                      <TD className="text-slate-600">{formatCurrency(row.allowances)}</TD>
                      <TD className="text-rose-600 font-medium">-{formatCurrency(row.deductions)}</TD>
                      <TD className="font-bold text-emerald-600">{formatCurrency(row.netSalary)}</TD>
                      <TD className="text-slate-500 font-medium">{row.paymentDate || "-"}</TD>
                      <TD>{getStatusBadge(row.status)}</TD>
                      <TD className="text-right">
                        {row.status === "Paid" ? (
                          <Button variant="ghost" size="sm" className="inline-flex items-center gap-1">
                            <Download className="w-3.5 h-3.5" /> Download PDF
                          </Button>
                        ) : (
                          <span className="text-[10px] uppercase font-bold text-slate-450 tracking-wider">Processing</span>
                        )}
                      </TD>
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
export default Payroll;
