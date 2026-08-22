import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    employeeId: "",
    name: "",
    email: "",
    password: "",
    department: "",
    jobTitle: "",
  });

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/employees",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to fetch employees");
        return;
      }

      setEmployees(data);
    } catch (error) {
      setMessage("Server connection failed");
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/employees",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to create employee");
        return;
      }

      setMessage("Employee created successfully!");

      setFormData({
        employeeId: "",
        name: "",
        email: "",
        password: "",
        department: "",
        jobTitle: "",
      });

      fetchEmployees();
    } catch (error) {
      setMessage("Server connection failed");
    }
  };

  return (
    <div className="app-layout">
      <Sidebar role={user?.role} />

      <main className="main-content">
        <div className="top-header">
          <div>
            <p className="header-label">DAYFLOW HRMS</p>
            <h1>Employee Management</h1>
            <p>View and manage employee information.</p>
          </div>

          <div className="user-avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </div>

        {message && (
          <div className="attendance-message">
            {message}
          </div>
        )}

        <section className="content-card employee-form-card">
          <h2>Add Employee</h2>

          <form onSubmit={handleSubmit} className="employee-form">
            <div className="employee-grid">
              <div>
                <label>Employee ID</label>
                <input
                  type="text"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  placeholder="Enter employee ID"
                  required
                />
              </div>

              <div>
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div>
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  required
                />
              </div>

              <div>
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create password"
                  required
                />
              </div>

              <div>
                <label>Department</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="Enter department"
                />
              </div>

              <div>
                <label>Job Title</label>
                <input
                  type="text"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  placeholder="Enter job title"
                />
              </div>
            </div>

            <button type="submit" className="add-employee-btn">
              Add Employee
            </button>
          </form>
        </section>

        <section className="content-card">
          <h2>Employees</h2>

          {employees.length === 0 ? (
            <p>No employees found.</p>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Employee ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Department</th>
                    <th>Job Title</th>
                    <th>Role</th>
                  </tr>
                </thead>

                <tbody>
                  {employees.map((employee) => (
                    <tr key={employee._id}>
                      <td>{employee.employeeId || "-"}</td>
                      <td>{employee.name}</td>
                      <td>{employee.email}</td>
                      <td>{employee.department || "-"}</td>
                      <td>{employee.jobTitle || "-"}</td>
                      <td>
                        <span className="status-badge">
                          {employee.role}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Employees;