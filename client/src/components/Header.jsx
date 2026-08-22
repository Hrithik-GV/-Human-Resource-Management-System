import { Bell } from "lucide-react";

function Header({ user }) {
  return (
    <header className="top-header">
      <div>
        <p className="header-label">DAYFLOW HRMS</p>
        <h1>Welcome back, {user.name} 👋</h1>
      </div>

      <div className="header-actions">
        <button className="notification-btn">
          <Bell size={21} />
          <span className="notification-dot"></span>
        </button>

        <div className="user-avatar">
          {user.name?.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
}

export default Header;