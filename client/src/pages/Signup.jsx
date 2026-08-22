import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:5000/api";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    employeeId: "",
    name: "",
    email: "",
    password: "",
    role: "employee",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await axios.post(`${API}/auth/register`, form);

      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Registration failed"
      );
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>DAYFLOW</h1>
        <p>Create your HRMS account</p>

        <h2>Sign Up</h2>

        {message && <div className="error">{message}</div>}

        <form onSubmit={handleSignup}>
          <input
            name="employeeId"
            placeholder="Employee ID"
            required
            onChange={handleChange}
          />

          <input
            name="name"
            placeholder="Full Name"
            required
            onChange={handleChange}
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            onChange={handleChange}
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            onChange={handleChange}
          />

          <select name="role" onChange={handleChange}>
            <option value="employee">Employee</option>
            <option value="admin">Admin / HR</option>
          </select>

          <button type="submit">Create Account</button>
        </form>

        <p>
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;