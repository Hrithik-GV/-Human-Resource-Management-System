import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { ProfileCard } from "../../components/Employee/ProfileCard";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/UI/Card";
import { Input } from "../../components/UI/Input";
import { Button } from "../../components/UI/Button";
import { Modal } from "../../components/UI/Modal";
import { FileText, Download, Phone, MapPin, User, Mail, ShieldAlert, Landmark } from "lucide-react";

export const Profile = () => {
  const { currentUser, updateProfile } = useApp();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Edit fields
  const [phone, setPhone] = useState(currentUser?.phone || "");
  const [address, setAddress] = useState(currentUser?.address || "");
  const [name, setName] = useState(currentUser?.name || "");

  if (!currentUser) return null;

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile(currentUser.id, { phone, address, name });
    setIsEditModalOpen(false);
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-slate-900">My Profile</h2>
        <p className="text-xs text-slate-400 mt-1">Manage and view your personal information, job specifications, and documents.</p>
      </div>

      <ProfileCard employee={currentUser} onEditClick={() => {
        setName(currentUser.name);
        setPhone(currentUser.phone);
        setAddress(currentUser.address);
        setIsEditModalOpen(true);
      }} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal & Job Information */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="border-b border-slate-100 pb-3 flex items-center gap-2">
              <User className="w-5 h-5 text-brand-600" />
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 pt-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Name</span>
                <p className="text-sm font-semibold text-slate-800 mt-0.5">{currentUser.name}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Work Email</span>
                <p className="text-sm font-semibold text-slate-800 mt-0.5">{currentUser.email}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phone Number</span>
                <p className="text-sm font-semibold text-slate-800 mt-0.5">{currentUser.phone || "Not Set"}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date of Birth</span>
                <p className="text-sm font-semibold text-slate-800 mt-0.5">{currentUser.dob || "N/A"}</p>
              </div>
              <div className="sm:col-span-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Residential Address</span>
                <p className="text-sm font-semibold text-slate-800 mt-0.5 leading-relaxed">{currentUser.address || "Not Set"}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b border-slate-100 pb-3 flex items-center gap-2">
              <Mail className="w-5 h-5 text-brand-600" />
              <CardTitle>Job Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 pt-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Employee ID</span>
                <p className="text-sm font-semibold text-slate-800 mt-0.5">{currentUser.id}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Department</span>
                <p className="text-sm font-semibold text-slate-800 mt-0.5">{currentUser.department}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Position</span>
                <p className="text-sm font-semibold text-slate-800 mt-0.5">{currentUser.position}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Joining Date</span>
                <p className="text-sm font-semibold text-slate-800 mt-0.5">{currentUser.joiningDate}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Employment Status</span>
                <p className="text-sm font-semibold text-slate-800 mt-0.5">{currentUser.status}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Salary & Documents */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="border-b border-slate-100 pb-3 flex items-center gap-2">
              <Landmark className="w-5 h-5 text-brand-600" />
              <CardTitle>Salary Structure</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 pt-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Basic Salary</span>
                <p className="text-sm font-semibold text-slate-800 mt-0.5">{formatCurrency(currentUser.basicSalary)}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Allowances</span>
                <p className="text-sm font-semibold text-slate-800 mt-0.5">{formatCurrency(currentUser.allowances)}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Bonus</span>
                <p className="text-sm font-semibold text-slate-800 mt-0.5">{formatCurrency(currentUser.bonus)}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Monthly Deductions</span>
                <p className="text-sm font-semibold text-slate-850 text-rose-600 mt-0.5">-{formatCurrency(currentUser.deductions)}</p>
              </div>
              <div className="sm:col-span-2 border-t border-slate-100 pt-3 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Calculated Net Salary</span>
                <span className="text-base font-extrabold text-emerald-600">
                  {formatCurrency(currentUser.basicSalary + (currentUser.allowances || 0) + (currentUser.bonus || 0) - (currentUser.deductions || 0))}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b border-slate-100 pb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-brand-600" />
              <CardTitle>Compliance Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-4">
              {[
                { name: "Resume / CV", size: "1.2 MB", format: "PDF" },
                { name: "National ID Proof", size: "2.4 MB", format: "PDF" },
                { name: "Employment Contract", size: "3.5 MB", format: "PDF" },
              ].map((doc) => (
                <div key={doc.name} className="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-brand-50 rounded-lg text-brand-600">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-800">{doc.name}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">{doc.format} • {doc.size}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="!p-1 text-slate-400 hover:text-brand-600">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Profile Details">
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Full Name"
            id="modal-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            label="Phone Number"
            id="modal-phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <Input
            label="Address"
            id="modal-address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
          <div className="flex justify-end gap-3.5 pt-4 border-t border-slate-100 mt-4">
            <Button variant="secondary" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
export default Profile;
