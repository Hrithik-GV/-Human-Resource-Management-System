import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/UI/Card";
import { Table, THead, TBody, TR, TH, TD } from "../../components/UI/Table";
import { Button } from "../../components/UI/Button";
import { Badge } from "../../components/UI/Badge";
import { Modal } from "../../components/UI/Modal";
import { Input } from "../../components/UI/Input";
import { Select } from "../../components/UI/Select";
import { Landmark, Users, User, ArrowRight, Plus, Edit2 } from "lucide-react";

export const Departments = () => {
  const { employees } = useApp();
  
  // Local state for departments list
  const [departments, setDepartments] = useState([
    { id: "DEPT-01", name: "Engineering", head: "Vikram Malhotra", code: "ENG" },
    { id: "DEPT-02", name: "Human Resources", head: "Neha Patel", code: "HR" },
    { id: "DEPT-03", name: "Design", head: "Ananya Rao", code: "DSN" },
    { id: "DEPT-04", name: "Marketing", head: "Rohan Das", code: "MKT" },
    { id: "DEPT-05", name: "Finance", head: "Priya Nair", code: "FIN" },
    { id: "DEPT-06", name: "Sales", head: "Kabir Mehta", code: "SLS" },
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState(null);

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [head, setHead] = useState("");

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!name || !code || !head) return;
    const newDept = {
      id: `DEPT-0${departments.length + 1}`,
      name,
      code: code.toUpperCase(),
      head,
    };
    setDepartments([...departments, newDept]);
    setIsAddModalOpen(false);
    setName("");
    setCode("");
    setHead("");
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!name || !code || !head) return;
    setDepartments(
      departments.map((d) => (d.id === selectedDept.id ? { ...d, name, code: code.toUpperCase(), head } : d))
    );
    setIsEditModalOpen(false);
  };

  const openEdit = (dept) => {
    setSelectedDept(dept);
    setName(dept.name);
    setCode(dept.code);
    setHead(dept.head);
    setIsEditModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Departments</h2>
          <p className="text-xs text-slate-400 mt-1">Manage corporate organizational units, departmental heads, and headcount stats.</p>
        </div>
        <Button variant="primary" onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> Add Department
        </Button>
      </div>

      <Card>
        <CardContent className="!p-0">
          <Table>
            <THead>
              <TR>
                <TH>Dept Code</TH>
                <TH>Department Name</TH>
                <TH>Department Head</TH>
                <TH>Employee Count</TH>
                <TH className="text-right">Actions</TH>
              </TR>
            </THead>
            <TBody>
              {departments.map((dept) => {
                const count = employees.filter((emp) => emp.department === dept.name).length;
                return (
                  <TR key={dept.id}>
                    <TD className="font-bold text-brand-600">{dept.code}</TD>
                    <TD className="font-semibold text-slate-800">{dept.name}</TD>
                    <TD>{dept.head}</TD>
                    <TD>
                      <Badge variant="info">{count} Employee{count !== 1 ? "s" : ""}</Badge>
                    </TD>
                    <TD className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(dept)} className="!p-1.5 hover:bg-slate-100">
                        <Edit2 className="w-4 h-4 text-slate-500" />
                      </Button>
                    </TD>
                  </TR>
                );
              })}
            </TBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Department Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add Department">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <Input label="Department Name" id="name" placeholder="e.g. Operations" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input label="Code" id="code" placeholder="e.g. OPS" value={code} onChange={(e) => setCode(e.target.value)} required />
          <Input label="Department Head" id="head" placeholder="e.g. Rahul Verma" value={head} onChange={(e) => setHead(e.target.value)} required />
          
          <div className="flex justify-end gap-3.5 pt-4 border-t border-slate-100 mt-4">
            <Button variant="secondary" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Department Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title={`Edit Department - ${selectedDept?.name}`}>
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <Input label="Department Name" id="edit-name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input label="Code" id="edit-code" value={code} onChange={(e) => setCode(e.target.value)} required />
          <Input label="Department Head" id="edit-head" value={head} onChange={(e) => setHead(e.target.value)} required />

          <div className="flex justify-end gap-3.5 pt-4 border-t border-slate-100 mt-4">
            <Button variant="secondary" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
export default Departments;
