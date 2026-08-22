import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/UI/Card";
import { Table, THead, TBody, TR, TH, TD } from "../../components/UI/Table";
import { Badge } from "../../components/UI/Badge";
import { Button } from "../../components/UI/Button";
import { Modal } from "../../components/UI/Modal";
import { Input } from "../../components/UI/Input";
import { Select } from "../../components/UI/Select";
import { Avatar } from "../../components/UI/Avatar";
import { Search, UserPlus, Edit2, Trash2, Eye, HelpCircle } from "lucide-react";

export const Employees = () => {
  const { employees, addEmployee, editEmployee, deleteEmployee } = useApp();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Focus employee state
  const [selectedEmp, setSelectedEmp] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    department: "Engineering",
    position: "",
    basicSalary: 50000,
    allowances: 10000,
    deductions: 2000,
    joiningDate: "",
    status: "Active",
  });
  const [errors, setErrors] = useState({});

  // Filter logic
  const filtered = employees.filter((emp) => {
    const matchSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchDept = filterDept ? emp.department === filterDept : true;
    const matchStatus = filterStatus ? emp.status === filterStatus : true;

    return matchSearch && matchDept && matchStatus;
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const validateForm = () => {
    const tempErrors = {};
    if (!formData.id) tempErrors.id = "Employee ID is required (e.g. EMP-100)";
    if (!formData.name) tempErrors.name = "Full name is required";
    if (!formData.email) tempErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) tempErrors.email = "Invalid email";
    if (!formData.position) tempErrors.position = "Position role is required";
    if (!formData.joiningDate) tempErrors.joiningDate = "Joining Date is required";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Check if ID already exists
    if (employees.some((emp) => emp.id === formData.id)) {
      setErrors((prev) => ({ ...prev, id: "Employee ID already exists" }));
      return;
    }

    addEmployee(formData);
    setIsAddModalOpen(false);
    resetForm();
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    editEmployee(selectedEmp.id, formData);
    setIsEditModalOpen(false);
    resetForm();
  };

  const handleDeleteConfirm = () => {
    if (selectedEmp) {
      deleteEmployee(selectedEmp.id);
      setIsDeleteModalOpen(false);
      setSelectedEmp(null);
    }
  };

  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      email: "",
      phone: "",
      department: "Engineering",
      position: "",
      basicSalary: 50000,
      allowances: 10000,
      deductions: 2000,
      joiningDate: "",
      status: "Active",
    });
    setErrors({});
  };

  const openAdd = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const openEdit = (emp) => {
    setSelectedEmp(emp);
    setFormData({
      id: emp.id,
      name: emp.name,
      email: emp.email,
      phone: emp.phone,
      department: emp.department,
      position: emp.position,
      basicSalary: emp.basicSalary,
      allowances: emp.allowances,
      deductions: emp.deductions,
      joiningDate: emp.joiningDate,
      status: emp.status,
    });
    setIsEditModalOpen(true);
  };

  const openDelete = (emp) => {
    setSelectedEmp(emp);
    setIsDeleteModalOpen(true);
  };

  const openView = (emp) => {
    setSelectedEmp(emp);
    setIsViewModalOpen(true);
  };

  const departmentOptions = [
    { value: "Engineering", label: "Engineering" },
    { value: "Human Resources", label: "Human Resources" },
    { value: "Design", label: "Design" },
    { value: "Marketing", label: "Marketing" },
    { value: "Finance", label: "Finance" },
    { value: "Sales", label: "Sales" },
  ];

  const statusOptions = [
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Manage Employees</h2>
          <p className="text-xs text-slate-400 mt-1">Audit employee profile parameters, status, and compliance data files.</p>
        </div>
        <Button variant="primary" onClick={openAdd} className="flex items-center gap-1.5 self-start">
          <UserPlus className="w-4 h-4" /> Add Employee
        </Button>
      </div>

      {/* Filters & search */}
      <Card className="!p-4 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by ID, name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm text-slate-900 border border-slate-200 rounded-lg w-full focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
          />
        </div>
        <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
          <Select
            id="filter-dept"
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            options={departmentOptions}
            placeholder="All Departments"
            className="!min-w-[150px]"
          />
          <Select
            id="filter-status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            options={statusOptions}
            placeholder="All Statuses"
            className="!min-w-[150px]"
          />
        </div>
      </Card>

      {/* Employees list */}
      <Card>
        <CardContent className="!p-0">
          <Table>
            <THead>
              <TR>
                <TH>Employee</TH>
                <TH>Employee ID</TH>
                <TH>Department</TH>
                <TH>Position</TH>
                <TH>Status</TH>
                <TH className="text-right">Actions</TH>
              </TR>
            </THead>
            <TBody>
              {filtered.map((emp) => (
                <TR key={emp.id}>
                  <TD className="flex items-center gap-3">
                    <Avatar src={emp.avatar} name={emp.name} size="sm" />
                    <div>
                      <p className="font-semibold text-slate-800 leading-tight">{emp.name}</p>
                      <p className="text-[10px] text-slate-400 leading-normal">{emp.email}</p>
                    </div>
                  </TD>
                  <TD>{emp.id}</TD>
                  <TD>{emp.department}</TD>
                  <TD className="text-slate-500">{emp.position}</TD>
                  <TD>
                    <Badge variant={emp.status === "Active" ? "success" : "neutral"}>{emp.status}</Badge>
                  </TD>
                  <TD className="text-right space-x-1.5">
                    <Button variant="ghost" size="sm" className="!p-1.5 text-slate-400 hover:text-brand-600" onClick={() => openView(emp)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="!p-1.5 text-slate-400 hover:text-brand-600" onClick={() => openEdit(emp)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="!p-1.5 text-slate-400 hover:text-red-650" onClick={() => openDelete(emp)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Employee Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Employee">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Employee ID" id="id" placeholder="EMP-011" value={formData.id} onChange={handleInputChange} error={errors.id} required />
            <Input label="Full Name" id="name" placeholder="Aarav Sharma" value={formData.name} onChange={handleInputChange} error={errors.name} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Email" id="email" type="email" placeholder="aarav@dayflow.com" value={formData.email} onChange={handleInputChange} error={errors.email} required />
            <Input label="Phone" id="phone" placeholder="+91 99999 88888" value={formData.phone} onChange={handleInputChange} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select label="Department" id="department" value={formData.department} onChange={handleInputChange} options={departmentOptions} required />
            <Input label="Position" id="position" placeholder="Frontend Engineer" value={formData.position} onChange={handleInputChange} error={errors.position} required />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Input label="Basic Salary (INR)" id="basicSalary" type="number" value={formData.basicSalary} onChange={handleInputChange} />
            <Input label="Allowances (INR)" id="allowances" type="number" value={formData.allowances} onChange={handleInputChange} />
            <Input label="Deductions (INR)" id="deductions" type="number" value={formData.deductions} onChange={handleInputChange} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Joining Date" id="joiningDate" type="date" value={formData.joiningDate} onChange={handleInputChange} error={errors.joiningDate} required />
            <Select label="Status" id="status" value={formData.status} onChange={handleInputChange} options={statusOptions} required />
          </div>

          <div className="flex justify-end gap-3.5 pt-4 border-t border-slate-100 mt-4">
            <Button variant="secondary" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Employee Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title={`Edit Employee - ${selectedEmp?.name}`}>
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Employee ID" id="id" value={formData.id} disabled className="opacity-60" />
            <Input label="Full Name" id="name" value={formData.name} onChange={handleInputChange} error={errors.name} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Email" id="email" type="email" value={formData.email} onChange={handleInputChange} error={errors.email} required />
            <Input label="Phone" id="phone" value={formData.phone} onChange={handleInputChange} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select label="Department" id="department" value={formData.department} onChange={handleInputChange} options={departmentOptions} required />
            <Input label="Position" id="position" value={formData.position} onChange={handleInputChange} error={errors.position} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Joining Date" id="joiningDate" type="date" value={formData.joiningDate} onChange={handleInputChange} error={errors.joiningDate} required />
            <Select label="Status" id="status" value={formData.status} onChange={handleInputChange} options={statusOptions} required />
          </div>

          <div className="flex justify-end gap-3.5 pt-4 border-t border-slate-100 mt-4">
            <Button variant="secondary" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Removal">
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-xl text-red-700">
            <HelpCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-xs font-semibold leading-relaxed">
              Are you sure you want to delete <strong>{selectedEmp?.name}</strong>? This action will permanently wipe their attendance profiles, leave registers, and payslip data from localStorage.
            </p>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDeleteConfirm}>Remove Employee</Button>
          </div>
        </div>
      </Modal>

      {/* View Details Modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title={`Profile Info - ${selectedEmp?.name}`}>
        {selectedEmp && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
              <Avatar src={selectedEmp.avatar} name={selectedEmp.name} size="lg" />
              <div>
                <h4 className="text-base font-bold text-slate-900">{selectedEmp.name}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{selectedEmp.position} • {selectedEmp.department}</p>
                <Badge variant={selectedEmp.status === "Active" ? "success" : "neutral"} className="mt-2">{selectedEmp.status}</Badge>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-600">
              <div>
                <span className="text-slate-400 block mb-0.5">Work Email</span>
                <span className="text-slate-800 font-bold">{selectedEmp.email}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Phone Number</span>
                <span className="text-slate-800 font-bold">{selectedEmp.phone || "-"}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Joined Date</span>
                <span className="text-slate-800 font-bold">{selectedEmp.joiningDate}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Employee ID</span>
                <span className="text-slate-800 font-bold">{selectedEmp.id}</span>
              </div>
            </div>
            <div className="flex justify-end pt-4 border-t border-slate-100">
              <Button variant="secondary" onClick={() => setIsViewModalOpen(false)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
export default Employees;
