import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import {
  Users,
  UserCheck,
  CalendarOff,
  ClipboardList,
} from "lucide-react";

function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const cards = [
    { title: "Total Employees", value: "24", icon: <Users /> },
    { title: "Present Today", value: "19", icon: <UserCheck /> },
    { title: "On Leave", value: "3", icon: <CalendarOff /> },
    { title: "Pending Requests", value: "2", icon: <ClipboardList /> },
  ];

  return (
    <div className="app-layout">
      <Sidebar role="admin" />

      <main className="main-content">
        <Header user={user} />

        <section className="stats-grid">
          {cards.map((card) => (
            <div className="stat-card" key={card.title}>
              <div>
                <p>{card.title}</p>
                <h2>{card.value}</h2>
              </div>
              <div className="stat-icon">{card.icon}</div>
            </div>
          ))}
        </section>

        <section className="dashboard-grid">
          <div className="content-card">
            <h2>Recent Leave Requests</h2>
            <p>No pending requests yet. Leave requests will appear here.</p>
          </div>

          <div className="content-card">
            <h2>Quick Overview</h2>
            <p>Manage employees, attendance, leave approvals and payroll from one place.</p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;