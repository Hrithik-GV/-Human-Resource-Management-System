import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const API = "http://localhost:5000/api";

function Leave() {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [leaves, setLeaves] = useState([]);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    leaveType: "Casual",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const loadLeaves = async () => {
    try {
      const res = await axios.get(`${API}/leaves/my`, config);
      setLeaves(res.data);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to load leave requests"
      );
    }
  };

  useEffect(() => {
    loadLeaves();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await axios.post(`${API}/leaves`, form, config);

      setMessage("Leave request submitted successfully!");

      setForm({
        leaveType: "Casual",
        startDate: "",
        endDate: "",
        reason: "",
      });

      loadLeaves();
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to submit leave request"
      );
    }
  };

  return (
    <div className="app-layout">
      <Sidebar role={user.role} />

      <main className="main-content">
        <Header user={user} />

        <div className="page-title">
          <h2>Leave Requests</h2>
          <p>Apply for leave and track your request status.</p>
        </div>

        {message && <div className="attendance-message">{message}</div>}

        <div className="content-card leave-form-card">
          <h2>Apply for Leave</h2>

          <form onSubmit={handleSubmit} className="leave-form">
            <div className="leave-form-grid">
              <div>
                <label>Leave Type</label>
                <select
                  name="leaveType"
                  value={form.leaveType}
                  onChange={handleChange}
                >
                  <option value="Sick">Sick Leave</option>
                  <option value="Casual">Casual Leave</option>
                  <option value="Annual">Annual Leave</option>
                </select>
              </div>

              <div>
                <label>Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label>End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <label>Reason</label>
              <textarea
                name="reason"
                value={form.reason}
                onChange={handleChange}
                placeholder="Enter reason for leave..."
                required
              />
            </div>

            <button type="submit" className="submit-leave-btn">
              Submit Leave Request
            </button>
          </form>
        </div>

        <div className="content-card leave-history">
          <h2>My Leave Requests</h2>

          {leaves.length === 0 ? (
            <p>No leave requests yet.</p>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Reason</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {leaves.map((leave) => (
                    <tr key={leave._id}>
                      <td>{leave.leaveType}</td>
                      <td>{leave.startDate}</td>
                      <td>{leave.endDate}</td>
                      <td>{leave.reason}</td>
                      <td>
                        <span
                          className={`leave-status ${leave.status.toLowerCase()}`}
                        >
                          {leave.status}
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

export default Leave;