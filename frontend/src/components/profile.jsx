import React, { useState } from "react";
import {
  Edit,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Hash,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { updateUser } from "../api/user.api";
import { toast } from "react-toastify";
import { AppData } from "../context/AppContext";

const Profile = ({ refreshProfile, setActiveTab }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user } = AppData();

  // console.log(user);

  const openEditModal = () => {
    if (user) {
      setEditFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        fellowship: user.fellowship?.name || user.fellowship || "",
        address: user.address || "",
        gender: user.gender || "",
        dob: user.dob ? new Date(user.dob).toISOString().split("T")[0] : "",
        zionId: user.zionId || "",
      });
      setIsEditModalOpen(true);
    }
  };

  const closeEditModal = () => {
    setEditFormData({});
    setIsEditModalOpen(false);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser(editFormData);
      toast.success("Profile updated successfully");
      closeEditModal();
      refreshProfile();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (!user) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Classic Navbar */}
      <div className="bg-white shadow-md p-4 mb-6">
        <div className="flex justify-between items-center">
          <div className="flex flex-col md:flex-row md:items-center space-x-2">
            <h2 className="md:hidden text-xl font-bold text-blue-900">
              EVAPOD HOME
            </h2>
            <h3 className="md:text-xl font-medium md:font-bold text-blue-900 overflow-hidden">
              Profile Details Of {user?.name}!
            </h3>
          </div>

          {/* User Drop down */}
          <div className="relative">
            <button
              className="flex items-center space-x-2 focus:outline-none"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {/* down arrow icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-700"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            {/* Dropdown menu can be implemented here */}
            <div
              className={`absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg py-1 z-20 ${
                isDropdownOpen ? "" : "hidden"
              }`}
            >
              <button
                onClick={() => {
                  setActiveTab("profile");
                  setIsDropdownOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Profile
              </button>
              <button
                onClick={() => {
                  setActiveTab("settings");
                  setIsDropdownOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Settings
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end items-center mb-8 pl-4 pr-4">
        {/* <h1 className="text-3xl font-bold text-gray-900">My Profile</h1> */}
        <button
          onClick={openEditModal}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-200 flex items-center space-x-2"
        >
          <Edit size={18} />
          <span>Edit Profile</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6 pl-2 pr-2 md:pl-4 md:pr-4">
        {/* Personal Information Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 ">
          <div className="flex items-center mb-4">
            <User className="text-indigo-600 mr-3" size={24} />
            <h2 className="text-xl font-semibold text-gray-900">
              Personal Info
            </h2>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-500">Name</label>
              <p className="text-lg text-gray-900 font-medium">{user?.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="text-lg wrap-anywhere text-gray-900">
                <Mail size={16} className="mr-2 text-gray-400" />
                {user?.email || "Not provided"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Phone</label>
              <p className="text-lg text-gray-900 flex items-center">
                <Phone size={16} className="mr-2 text-gray-400" />
                {user?.phone || "Not provided"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Gender
              </label>
              <p className="text-lg text-gray-900">
                {user?.gender || "Not specified"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Date of Birth
              </label>
              <p className="text-lg text-gray-900 flex items-center">
                <Calendar size={16} className="mr-2 text-gray-400" />
                {user?.dob
                  ? new Date(user.dob).toLocaleDateString()
                  : "Not specified"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Address
              </label>
              <p className="text-lg text-gray-900">
                {user?.address || "Not provided"}
              </p>
            </div>
          </div>
        </div>

        {/* Church Information Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center mb-4">
            <MapPin className="text-green-600 mr-3" size={24} />
            <h2 className="text-xl font-semibold text-gray-900">Church Info</h2>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-500">
                Fellowship
              </label>
              <p className="text-lg text-gray-900 font-medium">
                {user?.fellowship?.name || user?.fellowship || "Not specified"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Zion ID
              </label>
              <p className="text-lg text-gray-900 flex items-center">
                <Hash size={16} className="mr-2 text-gray-400" />
                {user?.zionId || "Not assigned"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Role</label>
              <p className="text-lg text-gray-900 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Account Status Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center mb-4">
            <CheckCircle className="text-blue-600 mr-3" size={24} />
            <h2 className="text-xl font-semibold text-gray-900">
              Account Status
            </h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center">
              <label className="text-sm font-medium text-gray-500 mr-2">
                Verified:
              </label>
              {user.isVerified ? (
                <CheckCircle size={18} className="text-green-500" />
              ) : (
                <XCircle size={18} className="text-red-500" />
              )}
            </div>
            <div className="flex items-center">
              <label className="text-sm font-medium text-gray-500 mr-2">
                Blocked:
              </label>
              {user.isBlocked ? <p>Yes</p> : <p>No</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Member Since
              </label>
              <p className="text-lg text-gray-900 flex items-center">
                <Clock size={16} className="mr-2 text-gray-400" />
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Last Updated
              </label>
              <p className="text-lg text-gray-900">
                {new Date(user.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
              <button
                onClick={closeEditModal}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={editFormData.name}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={editFormData.email}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={editFormData.phone}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fellowship
                  </label>
                  <select
                    name="fellowship"
                    value={editFormData.fellowship}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="FortKochi">FortKochi</option>
                    <option value="Thevara">Thevara</option>
                    <option value="Palarivattom">Palarivattom</option>
                    <option value="Thoppumpady">Thoppumpady</option>
                    <option value="Palluruthi">Palluruthi</option>
                    <option value="Perumpadappu">Perumpadappu</option>
                    <option value="Kannamaly">Kannamaly</option>
                    <option value="Kumbalangi">Kumbalangi</option>
                    <option value="Kattiparambu">Kattiparambu</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={editFormData.address}
                    onChange={handleInputChange}
                    rows="2"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={editFormData.gender}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dob"
                    value={editFormData.dob}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Zion ID
                  </label>
                  <input
                    type="number"
                    name="zionId"
                    value={editFormData.zionId}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200"
                >
                  Update Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
