import React, { useState, useEffect } from "react";
import { AppData } from "../../context/AppContext";
import {
  createNewUser,
  getUsersPaginated,
  updateUser,
  deleteUser,
} from "../../api/admin.api";
import { getReportsByUserId } from "../../api/report.api";
import { toast } from "react-toastify";
import {
  Edit,
  Trash2,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const AddUser = () => {
  const { user } = AppData();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    fellowship: user?.fellowship?._id || "",
    phone: "",
    address: "",
    gender: "",
    dob: "",
    zionId: "",
    subZone: user?.subZone?._id || "",
    zone: user?.zone?._id || "",
    region: user?.region?._id || "",
  });
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    role: "user",
    fellowship: user?.fellowship?._id || "",
    phone: "",
    address: "",
    gender: "",
    dob: "",
    zionId: "",
    subZone: user?.subZone?._id || "",
    zone: user?.zone?._id || "",
    region: user?.region?._id || "",
  });
  const [editLoading, setEditLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [showReportsModal, setShowReportsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userReports, setUserReports] = useState([]);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [userCurrentPage, setUserCurrentPage] = useState(1);
  const [userTotalPages, setUserTotalPages] = useState(1);
  const [searchTimeout, setSearchTimeout] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const dataToSend = { ...formData };
      if (!dataToSend.subZone.trim()) delete dataToSend.subZone;
      const result = await createNewUser(dataToSend);
      toast.success("User created successfully!");
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "user",
        fellowship: user?.fellowship?._id || "",
        phone: "",
        address: "",
        gender: "",
        dob: "",
        zionId: "",
        subZone: user?.subZone?._id || "",
        zone: user?.zone?._id || "",
        region: user?.region?._id || "",
      });
      // Update cache with new user
      if (result.user) {
        setUsers((prev) => [...prev, result.user]);
        fetchUsers(userCurrentPage); // Refetch to update pagination and list
      }
    } catch (error) {
      console.error(error.data);
      toast.error(error.data.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(userCurrentPage, search);
  }, [userCurrentPage]);

  useEffect(() => {
    return () => {
      if (searchTimeout) clearTimeout(searchTimeout);
    };
  }, [searchTimeout]);

  const fetchUsers = async (page = 1, searchParam = search) => {
    setUsersLoading(true);
    try {
      const data = await getUsersPaginated(page, 6, searchParam);
      // Filter users to only those in the user's fellowship
      const filteredUsers = (data.users || []).filter(
        (u) => u.fellowship?._id === user?.fellowship?._id
      );
      setUsers(filteredUsers);
      setUserTotalPages(data.pages || 1);
      setUserCurrentPage(data.page || 1);
    } catch (error) {
      console.error("Failed to fetch users", error);
      toast.error("Failed to load users");
    } finally {
      setUsersLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setEditFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      fellowship: user.fellowship?._id || "",
      phone: user.phone,
      address: user.address || "",
      gender: user.gender || "",
      dob: user.dob ? new Date(user.dob).toISOString().split("T")[0] : "",
      zionId: user.zionId,
      subZone: user.subZone?._id || "",
      zone: user.zone?._id || "",
      region: user.region?._id || "",
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      const dataToSend = { ...editFormData };
      if (!dataToSend.subZone.trim()) delete dataToSend.subZone;

      const result = await updateUser(editingUser._id, dataToSend);
      toast.success("User updated successfully!");
      setEditingUser(null);
      // Update cache with updated user
      if (result.user) {
        setUsers((prev) =>
          prev.map((user) =>
            user._id === editingUser._id ? result.user : user
          )
        );
        fetchUsers(userCurrentPage); // Refetch to update pagination and list
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update user");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(id);
      toast.success("User deleted successfully!");
      // Update cache by removing deleted user
      setUsers((prev) => {
        const newUsers = prev.filter((user) => user._id !== id);
        if (newUsers.length === 0 && userCurrentPage > 1) {
          setUserCurrentPage(userCurrentPage - 1);
        } else {
          fetchUsers(userCurrentPage);
        }
        return newUsers;
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete user");
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleViewReports = async (user) => {
    setSelectedUser(user);
    setShowReportsModal(true);
    setCurrentPage(1);
    await fetchUserReports(user._id, 1);
  };

  const fetchUserReports = async (userId, page) => {
    setReportsLoading(true);
    try {
      const data = await getReportsByUserId(userId, page, 5);
      setUserReports(data.reports || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setCurrentPage(data.pagination?.currentPage || 1);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load reports");
      setUserReports([]);
      setTotalPages(1);
    } finally {
      setReportsLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      fetchUserReports(selectedUser._id, newPage);
    }
  };

  // No need for client-side filtering since we use server-side search
  const filteredUsers = users;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Add New User</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
            {/* Role - Fixed */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <input
                type="text"
                value="User"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-100"
                readOnly
              />
            </div>

            {/* Region - Fixed */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Region
              </label>
              <input
                type="text"
                value={user?.region?.name || ""}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-100"
                readOnly
              />
            </div>

            {/* Zone - Fixed */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Zone
              </label>
              <input
                type="text"
                value={user?.zone?.name || ""}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-100"
                readOnly
              />
            </div>

            {/* SubZone - Fixed */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                SubZone
              </label>
              <input
                type="text"
                value={user?.subZone?.name || ""}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-100"
                readOnly
              />
            </div>

            {/* Fellowship - Fixed */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Fellowship
              </label>
              <input
                type="text"
                value={user?.fellowship?.name || ""}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-100"
                readOnly
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone *
              </label>
              <input
                type="number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date of Birth
              </label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>

            {/* Zion ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Zion ID *
              </label>
              <input
                type="number"
                name="zionId"
                value={formData.zionId}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? "Creating User..." : "Create User"}
            </button>
          </div>
        </form>
      </div>

      {/* Users List */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Existing Users
        </h2>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search users by name, email, phone, or Zion ID..."
            value={search}
            onChange={(e) => {
              const value = e.target.value;
              setSearch(value);
              setUserCurrentPage(1); // Reset to first page on search
              if (searchTimeout) clearTimeout(searchTimeout);
              if (value === "") {
                fetchUsers(1, value);
              } else {
                const timeout = setTimeout(() => {
                  fetchUsers(1, value);
                }, 500);
                setSearchTimeout(timeout);
              }
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        {usersLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No users found.</div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No users match your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex flex-col items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {user.name}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === "admin"
                          ? "bg-red-100 text-red-800"
                          : user.role === "zonal"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {user.role}
                    </span>
                    <button
                      onClick={() => handleEdit(user)}
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Edit user"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete user"
                    >
                      <Trash2 size={16} />
                    </button>
                    <button
                      onClick={() => handleViewReports(user)}
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                      title="View user reports"
                    >
                      <FileText size={16} />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium w-20">Email:</span>
                    <span className="overflow-hidden wrap-anywhere">
                      {user.email}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium w-20">Phone:</span>
                    <span>{user.phone}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium w-20">Fellowship:</span>
                    <span>{user.fellowship?.name || "N/A"}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium w-20">SubZone:</span>
                    <span>{user.subZone?.name || "N/A"}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium w-20">Zone:</span>
                    <span>{user.zone?.name || "N/A"}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium w-20">Region:</span>
                    <span>{user.region?.name || "N/A"}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium w-20">Zion ID:</span>
                    <span>{user.zionId}</span>
                  </div>
                  {user.address && (
                    <div className="flex items-start text-sm text-gray-600">
                      <span className="font-medium w-20">Address:</span>
                      <span className="flex-1">{user.address}</span>
                    </div>
                  )}
                  {user.gender && (
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium w-20">Gender:</span>
                      <span>{user.gender}</span>
                    </div>
                  )}
                  {user.dob && (
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium w-20">DOB:</span>
                      <span>{new Date(user.dob).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="text-xs text-gray-500">
                    Created: {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {userTotalPages > 1 && (
          <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={() => setUserCurrentPage(userCurrentPage - 1)}
              disabled={userCurrentPage === 1}
              className="flex items-center px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} className="mr-1" />
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {userCurrentPage} of {userTotalPages}
            </span>
            <button
              onClick={() => setUserCurrentPage(userCurrentPage + 1)}
              disabled={userCurrentPage === userTotalPages}
              className="flex items-center px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Edit User
              </h3>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={editFormData.name}
                      onChange={handleEditChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={editFormData.email}
                      onChange={handleEditChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Role
                    </label>
                    <input
                      type="text"
                      value="User"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-100"
                      readOnly
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Region
                    </label>
                    <input
                      type="text"
                      value={user?.region?.name || ""}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-100"
                      readOnly
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Zone
                    </label>
                    <input
                      type="text"
                      value={user?.zone?.name || ""}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-100"
                      readOnly
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      SubZone
                    </label>
                    <input
                      type="text"
                      value={user?.subZone?.name || ""}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-100"
                      readOnly
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Fellowship
                    </label>
                    <input
                      type="text"
                      value={user?.fellowship?.name || ""}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-100"
                      readOnly
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phone
                    </label>
                    <input
                      type="number"
                      name="phone"
                      value={editFormData.phone}
                      onChange={handleEditChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={editFormData.address}
                      onChange={handleEditChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={editFormData.gender}
                      onChange={handleEditChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dob"
                      value={editFormData.dob}
                      onChange={handleEditChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Zion ID *
                    </label>
                    <input
                      type="number"
                      name="zionId"
                      value={editFormData.zionId}
                      onChange={handleEditChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={editLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {editLoading ? "Updating..." : "Update User"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Reports Modal */}
      {showReportsModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Reports by {selectedUser.name}
                </h3>
                <button
                  onClick={() => setShowReportsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              {reportsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              ) : userReports.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No reports found for this user.
                </div>
              ) : (
                <>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {/* console.log(userReports); */}
                    {userReports.map((report) => (
                      <div
                        key={report._id}
                        className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-900">
                            {report.typeOfReport || "Untitled"} Report
                          </h4>
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              report.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : report.status === "approved"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {report.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {report.hearerName || "No description"}
                        </p>
                        <div className="text-xs text-gray-500">
                          Fellowship: {report.fellowship || "N/A"} | Created:{" "}
                          {new Date(report.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          Mobile: {report.mobileNumber || "N/A"}
                        </div>
                      </div>
                    ))}
                  </div>
                  {totalPages > 1 && (
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="flex items-center px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft size={16} className="mr-1" />
                        Previous
                      </button>
                      <span className="text-sm text-gray-600">
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="flex items-center px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                        <ChevronRight size={16} className="ml-1" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddUser;
