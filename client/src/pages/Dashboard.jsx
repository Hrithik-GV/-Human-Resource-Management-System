import { Navigate } from "react-router-dom";
import EmployeeDashboard from "./EmployeeDashboard";
import AdminDashboard from "./AdminDashboard";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return <Navigate to="/login" />;

  return user.role === "admin" ? (
    <AdminDashboard />
  ) : (
    <EmployeeDashboard />
  );
}

export default Dashboard;