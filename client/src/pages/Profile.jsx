import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: user?.name || "",
    employeeId: user?.employeeId || "EMP001",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    department: user?.department || "Engineering",
    jobTitle: user?.jobTitle || "Software Developer",
  });

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const saveProfile = () => {
    localStorage.setItem(
      "user",
      JSON.stringify({
        ...user,
        phone: profile.phone,
        address: profile.address,
      })
    );

    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  return (
    <div className="app-layout">
      <Sidebar role={user.role} />

      <main className="main-content">
        <Header user={user} />

        <div className="profile-page">
          <div className="profile-card">
            <div className="profile-top">
              <div className="profile-large-avatar">
                {user.name?.charAt(0).toUpperCase()}
              </div>

              <div>
                <h2>{profile.name}</h2>
                <p>{profile.jobTitle}</p>
                <p>{profile.department}</p>
              </div>

              <button
                className="edit-btn"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </button>
            </div>

            <hr />

            <div className="profile-section">
              <h2>Personal Details</h2>

              <div className="profile-grid">
                <div>
                  <label>Employee ID</label>
                  <p>{profile.employeeId}</p>
                </div>

                <div>
                  <label>Full Name</label>
                  <p>{profile.name}</p>
                </div>

                <div>
                  <label>Email</label>
                  <p>{profile.email}</p>
                </div>

                <div>
                  <label>Phone</label>
                  {isEditing ? (
                    <input
                      name="phone"
                      value={profile.phone}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                    />
                  ) : (
                    <p>{profile.phone || "Not added"}</p>
                  )}
                </div>

                <div>
                  <label>Address</label>
                  {isEditing ? (
                    <input
                      name="address"
                      value={profile.address}
                      onChange={handleChange}
                      placeholder="Enter address"
                    />
                  ) : (
                    <p>{profile.address || "Not added"}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="profile-section">
              <h2>Job Details</h2>

              <div className="profile-grid">
                <div>
                  <label>Department</label>
                  <p>{profile.department}</p>
                </div>

                <div>
                  <label>Job Title</label>
                  <p>{profile.jobTitle}</p>
                </div>
              </div>
            </div>

            <div className="profile-section">
              <h2>Salary Structure</h2>

              <div className="profile-grid">
                <div>
                  <label>Basic Salary</label>
                  <p>₹35,000</p>
                </div>

                <div>
                  <label>Allowances</label>
                  <p>₹10,000</p>
                </div>

                <div>
                  <label>Net Salary</label>
                  <p>₹45,000</p>
                </div>
              </div>
            </div>

            {isEditing && (
              <button className="save-profile-btn" onClick={saveProfile}>
                Save Changes
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Profile;