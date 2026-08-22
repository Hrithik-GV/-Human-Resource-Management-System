import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { SalaryCard } from "../../components/Employee/SalaryCard";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/UI/Card";
import { Table, THead, TBody, TR, TH, TD } from "../../components/UI/Table";
import { Badge } from "../../components/UI/Badge";
import { Button } from "../../components/UI/Button";
import { Modal } from "../../components/UI/Modal";
import { Landmark, FileSpreadsheet, Eye, Download, Info } from "lucide-react";

export const Payroll = () => {
  const { currentUser, payroll } = useApp();
  const [selectedPayDetails, setSelectedPayDetails] = useState(null);

  if (!currentUser) return null;

  // Filter payroll list for this user
  const userPayroll = payroll.filter((pay) => pay.employeeId === currentUser.id);

  // Defaults if no history logged yet
  const activeSalary = {
    basicSalary: currentUser.basicSalary || 60000,
    allowances: currentUser.allowances || 10000,
    bonus: currentUser.bonus || 0,
    deductions: currentUser.deductions || 2000,
  };

  const netSalary = activeSalary.basicSalary + activeSalary.allowances + activeSalary.bonus - activeSalary.deductions;
  const grossSalary = activeSalary.basicSalary + activeSalary.allowances + activeSalary.bonus;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Payroll & Payslips</h2>
        <p className="text-xs text-slate-400 mt-1">Review your monthly salary slips, total gross earnings and deductions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Net payout */}
        <div>
          <SalaryCard
            basicSalary={activeSalary.basicSalary}
            allowances={activeSalary.allowances}
            bonus={activeSalary.bonus}
            deductions={activeSalary.deductions}
            netSalary={netSalary}
          />
        </div>

        {/* Detailed Breakdown */}
        <Card className="lg:col-span-2">
          <CardHeader className="border-b border-slate-100 pb-3">
            <CardTitle>Current Month Payout Structure</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-semibold">
              <div className="p-3.5 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block mb-1">Basic Salary</span>
                <span className="text-sm font-bold text-slate-800">{formatCurrency(activeSalary.basicSalary)}</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block mb-1">Allowances</span>
                <span className="text-sm font-bold text-slate-800">{formatCurrency(activeSalary.allowances)}</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block mb-1">Performance Bonus</span>
                <span className="text-sm font-bold text-slate-800">{formatCurrency(activeSalary.bonus)}</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block mb-1">Gross Salary</span>
                <span className="text-sm font-bold text-slate-800">{formatCurrency(grossSalary)}</span>
              </div>
              <div className="p-3.5 bg-red-50/50 rounded-xl">
                <span className="text-rose-500 block mb-1">Tax & Deductions</span>
                <span className="text-sm font-bold text-rose-600">-{formatCurrency(activeSalary.deductions)}</span>
              </div>
              <div className="p-3.5 bg-emerald-50 rounded-xl">
                <span className="text-emerald-700 block mb-1">Estimated Net Payout</span>
                <span className="text-sm font-extrabold text-emerald-600">{formatCurrency(netSalary)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Payslip logs</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <THead>
              <TR>
                <TH>Month / Year</TH>
                <TH>Gross Salary</TH>
                <TH>Deductions</TH>
                <TH>Net Payout</TH>
                <TH>Payment Date</TH>
                <TH>Status</TH>
                <TH className="text-right">Actions</TH>
              </TR>
            </THead>
            <TBody>
              {userPayroll.map((pay) => (
                <TR key={pay.id}>
                  <TD className="font-semibold text-slate-800">{pay.month} {pay.year}</TD>
                  <TD>{formatCurrency(pay.basicSalary + pay.allowances + pay.bonus)}</TD>
                  <TD className="text-rose-600">-{formatCurrency(pay.deductions)}</TD>
                  <TD className="font-bold text-slate-800">{formatCurrency(pay.netSalary)}</TD>
                  <TD>{pay.paymentDate}</TD>
                  <TD>
                    <Badge variant={pay.status === "Paid" ? "success" : "warning"}>{pay.status}</Badge>
                  </TD>
                  <TD className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedPayDetails(pay)}
                      className="!p-1.5 hover:bg-slate-100"
                      title="View Payslip"
                    >
                      <Eye className="w-4 h-4 text-slate-500" />
                    </Button>
                    {pay.status === "Paid" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="!p-1.5 hover:bg-slate-100"
                        title="Download Payslip"
                      >
                        <Download className="w-4 h-4 text-slate-500" />
                      </Button>
                    )}
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </CardContent>
      </Card>

      {/* Salary Details Modal */}
      <Modal
        isOpen={!!selectedPayDetails}
        onClose={() => setSelectedPayDetails(null)}
        title={`Payslip - ${selectedPayDetails?.month} ${selectedPayDetails?.year}`}
      >
        {selectedPayDetails && (
          <div className="space-y-6">
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Employee Name</p>
                <h4 className="text-sm font-bold text-slate-850">{selectedPayDetails.employeeName}</h4>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Employee ID</p>
                <h4 className="text-sm font-bold text-slate-850">{selectedPayDetails.employeeId}</h4>
              </div>
            </div>

            <div className="border border-slate-100 rounded-xl divide-y divide-slate-100 text-xs font-semibold">
              <div className="p-3.5 flex justify-between">
                <span className="text-slate-500">Basic Salary</span>
                <span className="text-slate-800">{formatCurrency(selectedPayDetails.basicSalary)}</span>
              </div>
              <div className="p-3.5 flex justify-between">
                <span className="text-slate-500">Allowances</span>
                <span className="text-slate-800">{formatCurrency(selectedPayDetails.allowances)}</span>
              </div>
              <div className="p-3.5 flex justify-between">
                <span className="text-slate-500">Bonus Credit</span>
                <span className="text-slate-800">{formatCurrency(selectedPayDetails.bonus)}</span>
              </div>
              <div className="p-3.5 flex justify-between bg-red-50/20">
                <span className="text-rose-500">Deductions & Taxes</span>
                <span className="text-rose-600">-{formatCurrency(selectedPayDetails.deductions)}</span>
              </div>
              <div className="p-3.5 flex justify-between bg-emerald-50/50 text-sm font-bold">
                <span className="text-emerald-700">Net credited salary</span>
                <span className="text-emerald-600">{formatCurrency(selectedPayDetails.netSalary)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs text-slate-400 bg-slate-50 p-3 rounded-lg">
              <span className="flex items-center gap-1"><Info className="w-3.5 h-3.5" /> Transfer ID: TXN-{selectedPayDetails.id}</span>
              <span>Paid on {selectedPayDetails.paymentDate}</span>
            </div>

            <div className="flex justify-end gap-3.5 pt-4 border-t border-slate-100 mt-4">
              <Button variant="secondary" onClick={() => setSelectedPayDetails(null)}>
                Close
              </Button>
              <Button variant="primary" className="flex items-center gap-1.5">
                <Download className="w-4 h-4" /> Download PDF
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
export default Payroll;
