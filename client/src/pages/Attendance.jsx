import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const API = "http://localhost:5000/api";

function Attendance() {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [records, setRecords] = useState([]);
  const [today, setToday] = useState(null);
  const [message, setMessage] = useState("");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const loadAttendance = async () => {
    try {
      const res = await axios.get(`${API}/attendance/my`, config);
      setRecords(res.data);

      const todayDate = new Date().toISOString().split("T")[0];
      const todayRecord = res.data.find(
        (record) => record.date === todayDate
      );

      setToday(todayRecord || null);
    } catch (error) {
      setMessage("Failed to load attendance");
    }
  };

  useEffect(() => {
    loadAttendance();
  }, []);

  const handleCheckIn = async () => {
    setMessage("");

    try {
      await axios.post(`${API}/attendance/check-in`, {}, config);
      setMessage("Checked in successfully!");
      loadAttendance();
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Check-in failed"
      );
    }
  };

  const handleCheckOut = async () => {
    setMessage("");

    try {
      await axios.put(`${API}/attendance/check-out`, {}, config);
      setMessage("Checked out successfully!");
      loadAttendance();
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Check-out failed"
      );
    }
  };

  const formatTime = (time) => {
    if (!time) return "-";

    return new Date(time).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="app-layout">
      <Sidebar role={user.role} />

      <main className="main-content">
        <Header user={user} />

        <div className="page-title">
          <h2>Attendance</h2>
          <p>Track your daily work attendance.</p>
        </div>

        {message && <div className="attendance-message">{message}</div>}

        <div className="content-card attendance-today-card">
          <h2>Today's Attendance</h2>

          <div className="today-status">
            <div>
              <span>Status</span>
              <b>{today ? today.status : "Not Checked In"}</b>
            </div>

            <div>
              <span>Check In</span>
              <b>{today?.checkIn ? formatTime(today.checkIn) : "-"}</b>
            </div>

            <div>
              <span>Check Out</span>
              <b>{today?.checkOut ? formatTime(today.checkOut) : "-"}</b>
            </div>
          </div>

          <div className="attendance-actions">
            {!today && (
              <button onClick={handleCheckIn}>
                Check In
              </button>
            )}

            {today && !today.checkOut && (
              <button onClick={handleCheckOut}>
                Check Out
              </button>
            )}

            {today?.checkOut && (
              <button disabled className="completed-btn">
                Attendance Completed
              </button>
            )}
          </div>
        </div>

        <div className="content-card attendance-history">
          <h2>Attendance History</h2>

          {records.length === 0 ? (
            <p>No attendance records yet.</p>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {records.map((record) => (
                    <tr key={record._id}>
                      <td>{record.date}</td>
                      <td>{formatTime(record.checkIn)}</td>
                      <td>{formatTime(record.checkOut)}</td>
                      <td>
                        <span className="status-badge">
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Attendance;