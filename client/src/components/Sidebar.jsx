import {
  LayoutDashboard,
  User,
  CalendarDays,
  FileText,
  Wallet,
  Users,
  ClipboardCheck,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function Sidebar({ role }) {
  const navigate = useNavigate();

  const employeeMenu = [
    { name: "Dashboard", icon: <LayoutDashboard />, path: "/dashboard" },
    { name: "My Profile", icon: <User />, path: "/profile" },
    { name: "Attendance", icon: <CalendarDays />, path: "/attendance" },
    { name: "Leave Requests", icon: <FileText />, path: "/leave" },
    { name: "Payroll", icon: <Wallet />, path: "/payroll" },
  ];

  const adminMenu = [
    { name: "Dashboard", icon: <LayoutDashboard />, path: "/dashboard" },
    { name: "Employees", icon: <Users />, path: "/employees" },
    { name: "Attendance", icon: <CalendarDays />, path: "/attendance" },
    { name: "Leave Approvals", icon: <ClipboardCheck />, path: "/leave" },
    { name: "Payroll", icon: <Wallet />, path: "/payroll" },
  ];

  const menu = role === "admin" ? adminMenu : employeeMenu;

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <div>
        <div className="brand">
          <div className="brand-icon">D</div>
          <div>
            <h2>DAYFLOW</h2>
            <span>HR MANAGEMENT</span>
          </div>
        </div>

        <nav>
          {menu.map((item) => (
            <button
              className="nav-item"
              key={item.name}
              onClick={() => navigate(item.path)}
            >
              {item.icon}
              <span>{item.name}</span>
            </button>
          ))}
        </nav>
      </div>

      <button className="logout-btn" onClick={logout}>
        <LogOut size={20} />
        Logout
      </button>
    </aside>
  );
}

export default Sidebar;