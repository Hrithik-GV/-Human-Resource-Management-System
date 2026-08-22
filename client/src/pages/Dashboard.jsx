import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    navigate("/login");
    return null;
  }

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="dashboard">
      <h1>DAYFLOW HRMS</h1>

      <h2>Welcome, {user.name} 👋</h2>

      <div className="role-card">
        Logged in as: <b>{user.role === "admin" ? "Admin / HR" : "Employee"}</b>
      </div>

      {user.role === "admin" ? (
        <div>
          <h3>Admin Dashboard</h3>
          <p>Manage Employees, Attendance, Leave and Payroll.</p>
        </div>
      ) : (
        <div>
          <h3>Employee Dashboard</h3>
          <p>Manage Profile, Attendance, Leave and Payroll.</p>
        </div>
      )}

      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default Dashboard;