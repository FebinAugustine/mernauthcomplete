import React, { useState, useEffect } from "react";
import {
  createFellowship,
  getAllFellowships,
  updateFellowship,
  deleteFellowship,
} from "../api/admin.api";
import { toast } from "react-toastify";
import { Edit, Trash2 } from "lucide-react";

const AddFellowship = () => {
  const [formData, setFormData] = useState({
    name: "",
    zone: "Kochi",
    subzone: "Thevara",
    coordinator: "",
    evngCoordinator: "",
    zonalCoordinator: "",
    totalMembers: 0,
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [fellowships, setFellowships] = useState([]);
  const [fellowshipsLoading, setFellowshipsLoading] = useState(true);
  const [editingFellowship, setEditingFellowship] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    zone: "Kochi",
    subzone: "Thevara",
    coordinator: "",
    evngCoordinator: "",
    zonalCoordinator: "",
    totalMembers: 0,
    address: "",
  });
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    const fetchFellowships = async () => {
      try {
        const data = await getAllFellowships();
        setFellowships(data.fellowships || []);
      } catch (error) {
        console.error("Failed to fetch fellowships", error);
        toast.error("Failed to load fellowships");
      } finally {
        setFellowshipsLoading(false);
      }
    };
    fetchFellowships();
  }, []);

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
      if (
        !dataToSend.evngCoordinator.trim() ||
        dataToSend.evngCoordinator === "0"
      )
        delete dataToSend.evngCoordinator;
      if (
        !dataToSend.zonalCoordinator.trim() ||
        dataToSend.zonalCoordinator === "0"
      )
        delete dataToSend.zonalCoordinator;

      const result = await createFellowship(dataToSend);
      toast.success("Fellowship added successfully!");
      setFormData({
        name: "",
        zone: "Kochi",
        subzone: "Thevara",
        coordinator: "",
        evngCoordinator: "",
        zonalCoordinator: "",
        totalMembers: 0,
        address: "",
      });
      // Update cache with new fellowship
      if (result.fellowship) {
        setFellowships((prev) => [...prev, result.fellowship]);
      }
    } catch (error) {
      toast.error(error.data?.message || "Failed to add fellowship");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (fellowship) => {
    setEditingFellowship(fellowship);
    setEditFormData({
      name: fellowship.name,
      zone: fellowship.zone,
      subzone: fellowship.subzone,
      coordinator: fellowship.coordinator?.zionId || "",
      evngCoordinator: fellowship.evngCoordinator?.zionId || "",
      zonalCoordinator: fellowship.zonalCoordinator?.zionId || "",
      totalMembers: fellowship.totalMembers,
      address: fellowship.address || "",
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      const dataToSend = { ...editFormData };
      if (
        !String(dataToSend.evngCoordinator).trim() ||
        dataToSend.evngCoordinator === "0" ||
        dataToSend.evngCoordinator === 0
      )
        delete dataToSend.evngCoordinator;
      if (
        !String(dataToSend.zonalCoordinator).trim() ||
        dataToSend.zonalCoordinator === "0" ||
        dataToSend.zonalCoordinator === 0
      )
        delete dataToSend.zonalCoordinator;

      const result = await updateFellowship(editingFellowship._id, dataToSend);
      toast.success("Fellowship updated successfully!");
      setEditingFellowship(null);
      // Update cache with updated fellowship
      if (result.fellowship) {
        setFellowships((prev) =>
          prev.map((fellowship) =>
            fellowship._id === editingFellowship._id
              ? result.fellowship
              : fellowship
          )
        );
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to update fellowship"
      );
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this fellowship?"))
      return;
    try {
      await deleteFellowship(id);
      toast.success("Fellowship deleted successfully!");
      // Update cache by removing deleted fellowship
      setFellowships((prev) =>
        prev.filter((fellowship) => fellowship._id !== id)
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete fellowship");
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Add Fellowship</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Fellowship Name *
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

            {/* Zone */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Zone *
              </label>
              <select
                name="zone"
                value={formData.zone}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              >
                <option value="Kochi">Kochi</option>
                <option value="Ernakulam">Ernakulam</option>
                <option value="Varappuzha">Varappuzha</option>
                <option value="Pala">Pala</option>
                <option value="Zion">Zion</option>
              </select>
            </div>

            {/* Subzone */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Subzone *
              </label>
              <select
                name="subzone"
                value={formData.subzone}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              >
                <option value="Thevara">Thevara</option>
                <option value="FortKochi">FortKochi</option>
                <option value="Ernakulam1">Ernakulam1</option>
                <option value="Ernakulam2">Ernakulam2</option>
                <option value="Varappuzha1">Varappuzha1</option>
                <option value="Varappuzha2">Varappuzha2</option>
                <option value="Pala1">Pala1</option>
                <option value="Pala2">Pala2</option>
                <option value="Zion1">Zion1</option>
                <option value="Zion2">Zion2</option>
              </select>
            </div>

            {/* Coordinator */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Coordinator Zion ID *
              </label>
              <input
                type="number"
                name="coordinator"
                value={formData.coordinator}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>

            {/* Evangelism Coordinator */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Evangelism Coordinator Zion ID
              </label>
              <input
                type="number"
                name="evngCoordinator"
                value={formData.evngCoordinator}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>

            {/* Zonal Coordinator */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Zonal Coordinator Zion ID
              </label>
              <input
                type="number"
                name="zonalCoordinator"
                value={formData.zonalCoordinator}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>

            {/* Total Members */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Total Members *
              </label>
              <input
                type="number"
                name="totalMembers"
                value={formData.totalMembers}
                onChange={handleChange}
                min="0"
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
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? "Adding Fellowship..." : "Add Fellowship"}
            </button>
          </div>
        </form>
      </div>

      {/* Fellowships List */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Existing Fellowships
        </h2>
        {fellowshipsLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : fellowships.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No fellowships found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fellowships.map((fellowship) => (
              <div
                key={fellowship._id}
                className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {fellowship.name}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {fellowship.zone}
                    </span>
                    <button
                      onClick={() => handleEdit(fellowship)}
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Edit fellowship"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(fellowship._id)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete fellowship"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium w-24">Subzone:</span>
                    <span>{fellowship.subzone}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium w-24">Coordinator:</span>
                    <span>{fellowship.coordinator?.name || "N/A"}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium w-24">Evng Coord:</span>
                    <span>{fellowship.evngCoordinator?.name || "N/A"}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium w-24">Zonal Coord:</span>
                    <span>{fellowship.zonalCoordinator?.name || "N/A"}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium w-24">Members:</span>
                    <span>{fellowship.totalMembers || 0}</span>
                  </div>
                  {fellowship.address && (
                    <div className="flex items-start text-sm text-gray-600">
                      <span className="font-medium w-24">Address:</span>
                      <span className="flex-1">{fellowship.address}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="text-xs text-gray-500">
                    Created:{" "}
                    {new Date(fellowship.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingFellowship && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Edit Fellowship
              </h3>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Fellowship Name *
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
                      Zone *
                    </label>
                    <select
                      name="zone"
                      value={editFormData.zone}
                      onChange={handleEditChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      required
                    >
                      <option value="Kochi">Kochi</option>
                      <option value="Ernakulam">Ernakulam</option>
                      <option value="Varappuzha">Varappuzha</option>
                      <option value="Pala">Pala</option>
                      <option value="Zion">Zion</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Subzone *
                    </label>
                    <select
                      name="subzone"
                      value={editFormData.subzone}
                      onChange={handleEditChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      required
                    >
                      <option value="Thevara">Thevara</option>
                      <option value="FortKochi">FortKochi</option>
                      <option value="Ernakulam1">Ernakulam1</option>
                      <option value="Ernakulam2">Ernakulam2</option>
                      <option value="Varappuzha1">Varappuzha1</option>
                      <option value="Varappuzha2">Varappuzha2</option>
                      <option value="Pala1">Pala1</option>
                      <option value="Pala2">Pala2</option>
                      <option value="Zion1">Zion1</option>
                      <option value="Zion2">Zion2</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Coordinator Zion ID *
                    </label>
                    <input
                      type="number"
                      name="coordinator"
                      value={editFormData.coordinator}
                      onChange={handleEditChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Evangelism Coordinator Zion ID
                    </label>
                    <input
                      type="number"
                      name="evngCoordinator"
                      value={editFormData.evngCoordinator}
                      onChange={handleEditChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Zonal Coordinator Zion ID
                    </label>
                    <input
                      type="number"
                      name="zonalCoordinator"
                      value={editFormData.zonalCoordinator}
                      onChange={handleEditChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Total Members *
                    </label>
                    <input
                      type="number"
                      name="totalMembers"
                      value={editFormData.totalMembers}
                      onChange={handleEditChange}
                      min="0"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      required
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
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setEditingFellowship(null)}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={editLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {editLoading ? "Updating..." : "Update Fellowship"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddFellowship;
