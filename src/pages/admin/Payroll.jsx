import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/UI/Card";
import { Table, THead, TBody, TR, TH, TD } from "../../components/UI/Table";
import { Button } from "../../components/UI/Button";
import { Badge } from "../../components/UI/Badge";
import { Modal } from "../../components/UI/Modal";
import { Input } from "../../components/UI/Input";
import { Avatar } from "../../components/UI/Avatar";
import { CreditCard, Landmark, Edit2, ShieldAlert } from "lucide-react";

export const Payroll = () => {
  const { employees, payroll, editSalary } = useApp();

  const [selectedEmp, setSelectedEmp] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Edit salary form states
  const [basicSalary, setBasicSalary] = useState(0);
  const [allowances, setAllowances] = useState(0);
  const [bonus, setBonus] = useState(0);
  const [deductions, setDeductions] = useState(0);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  const handleEditClick = (emp) => {
    setSelectedEmp(emp);
    setBasicSalary(emp.basicSalary || 50000);
    setAllowances(emp.allowances || 10000);
    setBonus(emp.bonus || 0);
    setDeductions(emp.deductions || 2000);
    setIsEditModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    editSalary(selectedEmp.id, {
      basicSalary,
      allowances,
      bonus,
      deductions,
    });
    setIsEditModalOpen(false);
  };

  const calculatedNet = Number(basicSalary) + Number(allowances) + Number(bonus) - Number(deductions);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Workforce Payroll Registry</h2>
        <p className="text-xs text-slate-400 mt-1">Adjust core salary structures, award bonuses, log compliance deductions and oversee total costs.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Salary Log ledger</CardTitle>
        </CardHeader>
        <CardContent className="!p-0">
          <Table>
            <THead>
              <TR>
                <TH>Employee</TH>
                <TH>Department</TH>
                <TH>Basic Salary</TH>
                <TH>Allowances</TH>
                <TH>Bonus</TH>
                <TH>Deductions</TH>
                <TH>Net Payout</TH>
                <TH className="text-right">Actions</TH>
              </TR>
            </THead>
            <TBody>
              {employees.map((emp) => {
                const basic = emp.basicSalary || 50000;
                const allow = emp.allowances || 10000;
                const bon = emp.bonus || 0;
                const ded = emp.deductions || 2000;
                const net = basic + allow + bon - ded;

                return (
                  <TR key={emp.id}>
                    <TD className="flex items-center gap-3">
                      <Avatar src={emp.avatar} name={emp.name} size="sm" />
                      <div>
                        <p className="font-semibold text-slate-800 leading-tight">{emp.name}</p>
                        <p className="text-[10px] text-slate-400 leading-normal">ID: {emp.id}</p>
                      </div>
                    </TD>
                    <TD>{emp.department}</TD>
                    <TD>{formatCurrency(basic)}</TD>
                    <TD>{formatCurrency(allow)}</TD>
                    <TD>{formatCurrency(bon)}</TD>
                    <TD className="text-rose-600">-{formatCurrency(ded)}</TD>
                    <TD className="font-bold text-slate-800">{formatCurrency(net)}</TD>
                    <TD className="text-right">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleEditClick(emp)}
                        className="text-xs py-1"
                      >
                        Adjust Salary
                      </Button>
                    </TD>
                  </TR>
                );
              })}
            </TBody>
          </Table>
        </CardContent>
      </Card>

      {/* Salary Adjust Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`Adjust Payout Structure - ${selectedEmp?.name}`}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Basic Salary (INR)"
              id="modal-basic"
              type="number"
              value={basicSalary}
              onChange={(e) => setBasicSalary(e.target.value)}
              required
            />
            <Input
              label="Allowances (INR)"
              id="modal-allow"
              type="number"
              value={allowances}
              onChange={(e) => setAllowances(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Performance Bonus (INR)"
              id="modal-bonus"
              type="number"
              value={bonus}
              onChange={(e) => setBonus(e.target.value)}
              required
            />
            <Input
              label="Tax & Deductions (INR)"
              id="modal-deductions"
              type="number"
              value={deductions}
              onChange={(e) => setDeductions(e.target.value)}
              required
            />
          </div>

          <div className="p-4 bg-emerald-50 rounded-xl flex items-center justify-between border border-emerald-100">
            <div>
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Calculated Net Payout</span>
              <p className="text-xs text-slate-400 mt-0.5">Basic + Allowances + Bonus - Deductions</p>
            </div>
            <span className="text-lg font-extrabold text-emerald-600">
              {formatCurrency(calculatedNet)}
            </span>
          </div>

          <div className="flex justify-end gap-3.5 pt-4 border-t border-slate-100 mt-4">
            <Button variant="secondary" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button type="submit">Apply Adjustments</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
export default Payroll;
