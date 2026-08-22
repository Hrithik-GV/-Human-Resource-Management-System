import React, { createContext, useContext, useState, useEffect } from "react";
import { initialEmployees } from "../data/employees";
import { initialAttendance } from "../data/attendance";
import { initialLeaves } from "../data/leaves";
import { initialPayroll } from "../data/payroll";

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [payroll, setPayroll] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [toasts, setToasts] = useState([]);

  // Load from localStorage or set initial data
  useEffect(() => {
    const storedEmployees = localStorage.getItem("dayflow_employees");
    if (storedEmployees) {
      setEmployees(JSON.parse(storedEmployees));
    } else {
      localStorage.setItem("dayflow_employees", JSON.stringify(initialEmployees));
      setEmployees(initialEmployees);
    }

    const storedAttendance = localStorage.getItem("dayflow_attendance");
    if (storedAttendance) {
      setAttendance(JSON.parse(storedAttendance));
    } else {
      localStorage.setItem("dayflow_attendance", JSON.stringify(initialAttendance));
      setAttendance(initialAttendance);
    }

    const storedLeaves = localStorage.getItem("dayflow_leaves");
    if (storedLeaves) {
      setLeaves(JSON.parse(storedLeaves));
    } else {
      localStorage.setItem("dayflow_leaves", JSON.stringify(initialLeaves));
      setLeaves(initialLeaves);
    }

    const storedPayroll = localStorage.getItem("dayflow_payroll");
    if (storedPayroll) {
      setPayroll(JSON.parse(storedPayroll));
    } else {
      localStorage.setItem("dayflow_payroll", JSON.stringify(initialPayroll));
      setPayroll(initialPayroll);
    }

    const sessionUser = localStorage.getItem("dayflow_current_user");
    if (sessionUser) {
      setCurrentUser(JSON.parse(sessionUser));
    }
  }, []);

  // Sync utilities
  const saveEmployees = (data) => {
    localStorage.setItem("dayflow_employees", JSON.stringify(data));
    setEmployees(data);
  };

  const saveAttendance = (data) => {
    localStorage.setItem("dayflow_attendance", JSON.stringify(data));
    setAttendance(data);
  };

  const saveLeaves = (data) => {
    localStorage.setItem("dayflow_leaves", JSON.stringify(data));
    setLeaves(data);
  };

  const savePayroll = (data) => {
    localStorage.setItem("dayflow_payroll", JSON.stringify(data));
    setPayroll(data);
  };

  // Toasts management
  const addToast = (message, type = "info") => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Auth Operations
  const login = (email, password) => {
    // Find in employees list
    const found = employees.find((emp) => emp.email.toLowerCase() === email.toLowerCase());
    if (!found) {
      addToast("Invalid email or password", "error");
      return false;
    }
    // Simple password validation for demo: any password matching rules or just non-empty
    if (password.length < 4) {
      addToast("Password must be at least 4 characters", "error");
      return false;
    }
    
    // Set current user
    setCurrentUser(found);
    localStorage.setItem("dayflow_current_user", JSON.stringify(found));
    addToast(`Welcome back, ${found.name}!`, "success");
    return found;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("dayflow_current_user");
    addToast("Logged out successfully", "info");
  };

  const register = (employeeId, name, email, password, role) => {
    // Check if employeeId or email already exists
    const idExists = employees.some((emp) => emp.id === employeeId);
    const emailExists = employees.some((emp) => emp.email.toLowerCase() === email.toLowerCase());

    if (idExists) {
      addToast("Employee ID already registered", "error");
      return false;
    }
    if (emailExists) {
      addToast("Email address already registered", "error");
      return false;
    }

    const newEmp = {
      id: employeeId,
      name,
      email,
      phone: "+91 99999 88888",
      address: "Update Address",
      dob: "1995-01-01",
      department: "Engineering",
      position: role === "admin" ? "HR Admin" : "Software Engineer",
      joiningDate: new Date().toISOString().split("T")[0],
      status: "Active",
      role: role,
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${name}`,
      basicSalary: 60000,
      allowances: 10000,
      bonus: 0,
      deductions: 3000,
    };

    const updated = [newEmp, ...employees];
    saveEmployees(updated);

    // Auto-generate starting payroll entry for the month
    const newPayroll = {
      id: `PAY-${Date.now()}`,
      employeeId: newEmp.id,
      employeeName: newEmp.name,
      department: newEmp.department,
      month: "August",
      year: 2026,
      basicSalary: newEmp.basicSalary,
      allowances: newEmp.allowances,
      bonus: 0,
      deductions: newEmp.deductions,
      netSalary: newEmp.basicSalary + newEmp.allowances - newEmp.deductions,
      paymentDate: "-",
      status: "Processing"
    };
    savePayroll([newPayroll, ...payroll]);

    addToast("Registration successful! You can now log in.", "success");
    return true;
  };

  // Profile Edit
  const updateProfile = (employeeId, { phone, address, name }) => {
    const updated = employees.map((emp) => {
      if (emp.id === employeeId) {
        const item = { ...emp, phone, address };
        if (name) item.name = name;
        if (currentUser && currentUser.id === employeeId) {
          const updatedUser = { ...currentUser, ...item };
          setCurrentUser(updatedUser);
          localStorage.setItem("dayflow_current_user", JSON.stringify(updatedUser));
        }
        return item;
      }
      return emp;
    });
    saveEmployees(updated);
    addToast("Profile updated successfully", "success");
  };

  // Check In/Out
  const checkIn = (employeeId) => {
    const todayStr = new Date().toISOString().split("T")[0];
    // Check if already checked in today
    const alreadyChecked = attendance.find(
      (att) => att.employeeId === employeeId && att.date === todayStr
    );

    if (alreadyChecked) {
      addToast("You have already checked in today", "warning");
      return;
    }

    const newRecord = {
      id: `ATT-${Date.now()}`,
      employeeId,
      date: todayStr,
      checkIn: new Date().toLocaleTimeString("en-US", { hour12: false, hour: '2-digit', minute: '2-digit' }),
      checkOut: "",
      hours: 0,
      status: "Present",
    };

    saveAttendance([newRecord, ...attendance]);
    addToast("Checked in successfully", "success");
  };

  const checkOut = (employeeId) => {
    const todayStr = new Date().toISOString().split("T")[0];
    const recordIndex = attendance.findIndex(
      (att) => att.employeeId === employeeId && att.date === todayStr
    );

    if (recordIndex === -1) {
      addToast("No check-in record found for today", "error");
      return;
    }

    const record = attendance[recordIndex];
    if (record.checkOut) {
      addToast("You have already checked out today", "warning");
      return;
    }

    const checkOutTime = new Date().toLocaleTimeString("en-US", { hour12: false, hour: '2-digit', minute: '2-digit' });
    
    // Calculate simple duration
    const [inH, inM] = record.checkIn.split(":").map(Number);
    const [outH, outM] = checkOutTime.split(":").map(Number);
    
    const minutesIn = inH * 60 + inM;
    const minutesOut = outH * 60 + outM;
    const diffMin = Math.max(0, minutesOut - minutesIn);
    const hours = parseFloat((diffMin / 60).toFixed(2));

    const updatedRecord = {
      ...record,
      checkOut: checkOutTime,
      hours,
      status: hours >= 8 ? "Present" : hours >= 4 ? "Half Day" : "Absent",
    };

    const updatedList = [...attendance];
    updatedList[recordIndex] = updatedRecord;

    saveAttendance(updatedList);
    addToast("Checked out successfully", "success");
  };

  // Leave Management
  const applyLeave = (leaveDetails) => {
    const newRequest = {
      id: `LR-${Date.now()}`,
      employeeId: currentUser.id,
      employeeName: currentUser.name,
      ...leaveDetails,
      status: "Pending",
    };

    saveLeaves([newRequest, ...leaves]);
    addToast("Leave request submitted successfully", "success");
  };

  const approveLeave = (leaveId) => {
    const updated = leaves.map((lv) => {
      if (lv.id === leaveId) {
        return { ...lv, status: "Approved" };
      }
      return lv;
    });
    saveLeaves(updated);
    addToast("Leave request approved", "success");
  };

  const rejectLeave = (leaveId, reason) => {
    const updated = leaves.map((lv) => {
      if (lv.id === leaveId) {
        return { ...lv, status: "Rejected", rejectionReason: reason };
      }
      return lv;
    });
    saveLeaves(updated);
    addToast("Leave request rejected", "info");
  };

  // Admin CRUD for Employees
  const addEmployee = (emp) => {
    const newEmp = {
      ...emp,
      role: emp.role || "employee",
      avatar: emp.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${emp.name}`,
    };
    saveEmployees([newEmp, ...employees]);

    // Create payroll template
    const newPay = {
      id: `PAY-${Date.now()}`,
      employeeId: emp.id,
      employeeName: emp.name,
      department: emp.department,
      month: "August",
      year: 2026,
      basicSalary: Number(emp.basicSalary) || 50000,
      allowances: Number(emp.allowances) || 10000,
      bonus: 0,
      deductions: Number(emp.deductions) || 2000,
      netSalary: (Number(emp.basicSalary) || 50000) + (Number(emp.allowances) || 10000) - (Number(emp.deductions) || 2000),
      paymentDate: "-",
      status: "Processing"
    };
    savePayroll([newPay, ...payroll]);

    addToast("Employee added successfully", "success");
  };

  const editEmployee = (id, updatedDetails) => {
    const updatedList = employees.map((emp) => {
      if (emp.id === id) {
        const item = { ...emp, ...updatedDetails };
        if (currentUser && currentUser.id === id) {
          const updatedUser = { ...currentUser, ...item };
          setCurrentUser(updatedUser);
          localStorage.setItem("dayflow_current_user", JSON.stringify(updatedUser));
        }
        return item;
      }
      return emp;
    });
    saveEmployees(updatedList);

    // Update corresponding payroll details if modified
    const updatedPayroll = payroll.map((pay) => {
      if (pay.employeeId === id) {
        const basic = Number(updatedDetails.basicSalary) || pay.basicSalary;
        const allowances = Number(updatedDetails.allowances) || pay.allowances;
        const deductions = Number(updatedDetails.deductions) || pay.deductions;
        const bonus = Number(updatedDetails.bonus) || pay.bonus || 0;
        return {
          ...pay,
          employeeName: updatedDetails.name || pay.employeeName,
          department: updatedDetails.department || pay.department,
          basicSalary: basic,
          allowances,
          deductions,
          bonus,
          netSalary: basic + allowances + bonus - deductions,
        };
      }
      return pay;
    });
    savePayroll(updatedPayroll);

    addToast("Employee details updated", "success");
  };

  const deleteEmployee = (id) => {
    const updated = employees.filter((emp) => emp.id !== id);
    saveEmployees(updated);
    // clean leaves and attendance
    saveLeaves(leaves.filter((lv) => lv.employeeId !== id));
    saveAttendance(attendance.filter((att) => att.employeeId !== id));
    savePayroll(payroll.filter((pay) => pay.employeeId !== id));
    addToast("Employee removed from system", "success");
  };

  // Salary Edit Modal
  const editSalary = (employeeId, { basicSalary, allowances, bonus, deductions }) => {
    // Update employee master list
    const updatedEmp = employees.map((emp) => {
      if (emp.id === employeeId) {
        return {
          ...emp,
          basicSalary: Number(basicSalary),
          allowances: Number(allowances),
          bonus: Number(bonus),
          deductions: Number(deductions),
        };
      }
      return emp;
    });
    saveEmployees(updatedEmp);

    // Update payroll logs
    const updatedPay = payroll.map((pay) => {
      if (pay.employeeId === employeeId) {
        const basic = Number(basicSalary);
        const allow = Number(allowances);
        const bon = Number(bonus);
        const ded = Number(deductions);
        return {
          ...pay,
          basicSalary: basic,
          allowances: allow,
          bonus: bon,
          deductions: ded,
          netSalary: basic + allow + bon - ded,
        };
      }
      return pay;
    });
    savePayroll(updatedPay);

    addToast("Salary details updated successfully", "success");
  };

  return (
    <AppContext.Provider
      value={{
        employees,
        attendance,
        leaves,
        payroll,
        currentUser,
        toasts,
        addToast,
        removeToast,
        login,
        logout,
        register,
        updateProfile,
        checkIn,
        checkOut,
        applyLeave,
        approveLeave,
        rejectLeave,
        addEmployee,
        editEmployee,
        deleteEmployee,
        editSalary,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
