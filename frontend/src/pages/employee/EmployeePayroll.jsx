import React, { useState, useEffect } from 'react';
import { CreditCard, DollarSign, Download, Eye, FileText, CheckCircle2, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { PageContainer } from '../../components/common/PageContainer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Modal } from '../../components/ui/Modal';
import { SkeletonLoader } from '../../components/ui/SkeletonLoader';
import { EmptyState } from '../../components/ui/EmptyState';
import { payrollService } from '../../services/payrollService';

export const EmployeePayroll = () => {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [history, setHistory] = useState([]);
  const [selectedPayslip, setSelectedPayslip] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  useEffect(() => {
    fetchPayrollData();
  }, []);

  const fetchPayrollData = async () => {
    try {
      setLoading(true);
      const [sumData, histData] = await Promise.all([
        payrollService.getSalarySummary(),
        payrollService.getPaymentHistory(),
      ]);
      setSummary(sumData);
      setHistory(histData);
    } catch (err) {
      toast.error('Failed to load payroll details.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewPayslip = (row) => {
    setSelectedPayslip(row);
    setIsDetailsModalOpen(true);
  };

  if (loading) {
    return (
      <PageContainer title="Payroll & Payslips" description="View salary breakdown and payment transaction history.">
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <SkeletonLoader variant="card" count={5} className="h-24" />
          </div>
          <SkeletonLoader variant="card" className="h-80" />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Payroll & Payslips"
      description="View salary breakdown and payment transaction history."
    >
      <div className="space-y-6">
        {/* 5 Salary Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <Card className="hover:border-indigo-200 transition-all">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-slate-500 uppercase">Gross Salary</p>
                <h3 className="text-lg font-extrabold text-slate-900">${summary?.grossSalary.toLocaleString()}</h3>
              </div>
              <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <DollarSign className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:border-indigo-200 transition-all">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-slate-500 uppercase">Basic Salary</p>
                <h3 className="text-lg font-extrabold text-slate-900">${summary?.basicSalary.toLocaleString()}</h3>
              </div>
              <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:border-emerald-200 transition-all">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-slate-500 uppercase">Bonus</p>
                <h3 className="text-lg font-extrabold text-emerald-600">+${summary?.bonus.toLocaleString()}</h3>
              </div>
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <DollarSign className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:border-rose-200 transition-all">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-slate-500 uppercase">Deductions</p>
                <h3 className="text-lg font-extrabold text-rose-600">-${summary?.totalDeductions.toLocaleString()}</h3>
              </div>
              <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-2 sm:col-span-1 border-indigo-200 bg-indigo-50/30">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-indigo-700 uppercase">Net Salary</p>
                <h3 className="text-lg font-extrabold text-indigo-900">${summary?.netSalary.toLocaleString()}</h3>
              </div>
              <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Salary Breakdown Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" /> Itemized Salary Structure Breakdown
            </CardTitle>
            <CardDescription>Monthly earnings, allowances, and statutory tax deductions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Earnings Column */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200 pb-2">
                  Earnings & Allowances
                </h4>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600">Basic Pay</span>
                  <span className="font-semibold text-slate-900">${summary?.basicSalary.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600">House Rent Allowance (HRA)</span>
                  <span className="font-semibold text-slate-900">${summary?.hraAllowance.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600">Special Allowance</span>
                  <span className="font-semibold text-slate-900">${summary?.specialAllowance.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600">Performance Bonus</span>
                  <span className="font-semibold text-emerald-600">+${summary?.bonus.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold pt-2 border-t border-slate-200">
                  <span className="text-slate-900">Total Gross Earnings</span>
                  <span className="text-indigo-600">${summary?.grossSalary.toLocaleString()}</span>
                </div>
              </div>

              {/* Deductions Column */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200 pb-2">
                  Deductions & Taxes
                </h4>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600">Provident Fund (PF)</span>
                  <span className="font-semibold text-slate-900">${summary?.pfDeduction.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600">Income Tax Deduction</span>
                  <span className="font-semibold text-slate-900">${summary?.taxDeduction.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold pt-6 border-t border-slate-200">
                  <span className="text-slate-900">Total Deductions</span>
                  <span className="text-rose-600">-${summary?.totalDeductions.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment History Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Payment History & Downloadable Payslips</CardTitle>
            <CardDescription>Historical monthly salary disbursemets</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {history.length === 0 ? (
              <EmptyState title="No Payment Records Found" description="Payment transaction history will appear here." />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead>Gross Salary</TableHead>
                    <TableHead>Deductions</TableHead>
                    <TableHead>Net Salary</TableHead>
                    <TableHead>Payment Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="font-semibold text-slate-900">{row.month}</TableCell>
                      <TableCell>{row.gross}</TableCell>
                      <TableCell className="text-rose-600">{row.deductions}</TableCell>
                      <TableCell className="font-bold text-slate-900">{row.net}</TableCell>
                      <TableCell className="text-xs text-slate-500">{row.paymentDate}</TableCell>
                      <TableCell>
                        <Badge variant="success" dot size="sm">
                          {row.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          leftIcon={<Eye className="w-3.5 h-3.5" />}
                          onClick={() => handleViewPayslip(row)}
                          className="text-xs text-indigo-600 hover:text-indigo-700"
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Payslip Details Modal */}
        <Modal
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          title={`Payslip Details — ${selectedPayslip?.month}`}
          description={`Payment confirmation reference ${selectedPayslip?.id}`}
        >
          {selectedPayslip && (
            <div className="space-y-4">
              <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 block">Total Net Disbursed</span>
                  <span className="text-2xl font-extrabold text-indigo-900">{selectedPayslip.net}</span>
                </div>
                <Badge variant="success" size="md">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Paid on {selectedPayslip.paymentDate}
                </Badge>
              </div>

              <div className="space-y-2 text-xs divide-y divide-slate-100">
                <div className="flex justify-between pt-2">
                  <span className="text-slate-500">Gross Salary</span>
                  <span className="font-semibold text-slate-800">{selectedPayslip.gross}</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-slate-500">Total Deductions</span>
                  <span className="font-semibold text-rose-600">{selectedPayslip.deductions}</span>
                </div>
                <div className="flex justify-between pt-2 font-bold text-sm">
                  <span className="text-slate-900">Net Take-Home Salary</span>
                  <span className="text-indigo-600">{selectedPayslip.net}</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <Button
                  variant="outline"
                  size="md"
                  leftIcon={<Download className="w-4 h-4" />}
                  onClick={() => toast.success(`Downloading PDF Payslip for ${selectedPayslip.month}...`)}
                >
                  Download PDF
                </Button>
                <Button variant="primary" size="md" onClick={() => setIsDetailsModalOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </PageContainer>
  );
};
