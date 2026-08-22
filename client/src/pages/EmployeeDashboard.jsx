import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import {
  Clock,
  CalendarCheck,
  Wallet,
  Activity,
} from "lucide-react";

function EmployeeDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const cards = [
    {
      title: "Today's Status",
      value: "Not Checked In",
      icon: <Clock />,
    },
    {
      title: "This Month",
      value: "18 Days",
      icon: <CalendarCheck />,
    },
    {
      title: "Leave Balance",
      value: "12 Days",
      icon: <Activity />,
    },
    {
      title: "Monthly Salary",
      value: "₹45,000",
      icon: <Wallet />,
    },
  ];

  return (
    <div className="app-layout">
      <Sidebar role="employee" />

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
            <h2>Today's Attendance</h2>
            <p>You haven't checked in yet.</p>

            <div className="attendance-actions">
              <button>Check In</button>
              <button className="secondary-btn">Check Out</button>
            </div>
          </div>

          <div className="content-card">
            <h2>Recent Activity</h2>

            <div className="activity">
              <span></span>
              <div>
                <b>Welcome to Dayflow</b>
                <p>Your HR workspace is ready.</p>
              </div>
            </div>

            <div className="activity">
              <span></span>
              <div>
                <b>Profile created</b>
                <p>Your employee account is active.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default EmployeeDashboard;