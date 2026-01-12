import React, { useState, useEffect } from "react";
import { AppData } from "../../context/AppContext";
import {
  createSubzone,
  getAllSubzones,
  updateSubzone,
  deleteSubzone,
  getAllZones,
} from "../../api/admin.api";
import { toast } from "react-toastify";
import { Edit, Trash2 } from "lucide-react";

const AddSubZone = () => {
  const { user } = AppData();
  const [formData, setFormData] = useState({
    name: "",
    region: user?.region?._id || "",
    zone: "",
    zonalCoordinator: "",
    evngCoordinator: "",
    totalMembers: 1,
  });
  const [loading, setLoading] = useState(false);
  const [subzones, setSubzones] = useState([]);
  const [subzonesLoading, setSubzonesLoading] = useState(true);
  const [zones, setZones] = useState([]);
  const [editingSubzone, setEditingSubzone] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    region: user?.region?._id || "",
    zone: "",
    zonalCoordinator: "",
    evngCoordinator: "",
    totalMembers: 1,
  });
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subzonesData, zonesData] = await Promise.all([
          getAllSubzones(),
          getAllZones(),
        ]);
        // Filter subzones to only those in the user's region
        const filteredSubzones = (subzonesData.subZones || []).filter(
          (subzone) => subzone.region?._id === user?.region?._id
        );
        // Filter zones to only those in the user's region
        const filteredZones = (zonesData.zones || []).filter(
          (zone) => zone.region?._id === user?.region?._id
        );
        setSubzones(filteredSubzones);
        setZones(filteredZones);
      } catch (error) {
        console.error("Failed to fetch data", error);
        toast.error("Failed to load data");
      } finally {
        setSubzonesLoading(false);
      }
    };
    if (user?.region?._id) {
      fetchData();
    }
  }, [user]);

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
      const result = await createSubzone(formData);
      toast.success("Subzone added successfully!");
      setFormData({
        name: "",
        region: user?.region?._id || "",
        zone: "",
        zonalCoordinator: "",
        evngCoordinator: "",
        totalMembers: 1,
      });
      // Update cache with new subzone
      if (result.subZone) {
        setSubzones((prev) => [...prev, result.subZone]);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to add subzone");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (subzone) => {
    setEditingSubzone(subzone);
    setEditFormData({
      name: subzone.name,
      region: subzone.region?._id || "",
      zone: subzone.zone?._id || "",
      zonalCoordinator: subzone.zonalCoordinator?.zionId || "",
      evngCoordinator: subzone.evngCoordinator?.zionId || "",
      totalMembers: subzone.totalMembers,
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      const result = await updateSubzone(editingSubzone._id, editFormData);
      toast.success("Subzone updated successfully!");
      setEditingSubzone(null);
      // Update cache with updated subzone
      if (result.subZone) {
        setSubzones((prev) =>
          prev.map((subzone) =>
            subzone._id === editingSubzone._id ? result.subZone : subzone
          )
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update subzone");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subzone?"))
      return;
    try {
      await deleteSubzone(id);
      toast.success("Subzone deleted successfully!");
      // Update cache by removing deleted subzone
      setSubzones((prev) => prev.filter((subzone) => subzone._id !== id));
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete subzone");
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
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Add Subzone</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Subzone Name *
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
                <option value="">Select Zone</option>
                {zones.map((zone) => (
                  <option key={zone._id} value={zone._id}>
                    {zone.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Zonal Coordinator */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Zonal Coordinator Zion ID *
              </label>
              <input
                type="number"
                name="zonalCoordinator"
                value={formData.zonalCoordinator}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>

            {/* Evangelism Coordinator */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Evangelism Coordinator Zion ID *
              </label>
              <input
                type="number"
                name="evngCoordinator"
                value={formData.evngCoordinator}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
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
                min="1"
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
              {loading ? "Adding Subzone..." : "Add Subzone"}
            </button>
          </div>
        </form>
      </div>

      {/* Subzones List */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Existing Subzones
        </h2>
        {subzonesLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : subzones.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No subzones found.
          </div>
        ) : (
          <div className="flex flex-wrap gap-6 justify-center md:justify-start bg-white p-6 rounded-lg shadow-md">
            {subzones.map((subzone) => (
              <div
                key={subzone._id}
                className="bg-white rounded-lg shadow-md border border-gray-400 p-6 hover:shadow-lg transition-shadow duration-200 w-full md:max-w-70"
              >
                <div className="flex flex-col items-start justify-between mb-4">
                  <div className="flex flex-row items-center justify-between w-full mb-4">
                    <h3 className="text-lg font-bold text-gray-900">
                      {subzone.name}
                    </h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {subzone.zone?.name || "N/A"}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(subzone)}
                      className="p-1 text-gray-400 hover:text-blue-700 transition-colors"
                      title="Edit subzone"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(subzone._id)}
                      className="p-1 text-gray-400 hover:text-red-700 transition-colors"
                      title="Delete subzone"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium w-24">Zonal Coord:</span>
                    <span>{subzone.zonalCoordinator?.name || "N/A"}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium w-24">Evng Coord:</span>
                    <span>{subzone.evngCoordinator?.name || "N/A"}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium w-24">Members:</span>
                    <span>{subzone.totalMembers || 0}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="text-xs text-gray-500">
                    Created: {new Date(subzone.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingSubzone && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Edit Subzone
              </h3>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Subzone Name *
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
                    Zone *
                  </label>
                  <select
                    name="zone"
                    value={editFormData.zone}
                    onChange={handleEditChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  >
                    <option value="">Select Zone</option>
                    {zones.map((zone) => (
                      <option key={zone._id} value={zone._id}>
                        {zone.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Zonal Coordinator Zion ID *
                  </label>
                  <input
                    type="number"
                    name="zonalCoordinator"
                    value={editFormData.zonalCoordinator}
                    onChange={handleEditChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Evangelism Coordinator Zion ID *
                  </label>
                  <input
                    type="number"
                    name="evngCoordinator"
                    value={editFormData.evngCoordinator}
                    onChange={handleEditChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
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

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setEditingSubzone(null)}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={editLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {editLoading ? "Updating..." : "Update Subzone"}
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

export default AddSubZone;