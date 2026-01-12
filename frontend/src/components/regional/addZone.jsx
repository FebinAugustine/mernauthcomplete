import React, { useState, useEffect } from "react";
import { AppData } from "../../context/AppContext";
import {
  createZone,
  getAllZones,
  updateZone,
  deleteZone,
} from "../../api/admin.api";
import { toast } from "react-toastify";
import { Edit, Trash2 } from "lucide-react";

const AddZone = () => {
  const { user } = AppData();
  const [formData, setFormData] = useState({
    name: "",
    region: user?.region?._id || "",
    regionalCoordinator: "",
    zonalCoordinator: "",
    evngCoordinators: [],
  });
  const [loading, setLoading] = useState(false);
  const [zones, setZones] = useState([]);
  const [zonesLoading, setZonesLoading] = useState(true);
  const [editingZone, setEditingZone] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    region: user?.region?._id || "",
    regionalCoordinator: "",
    zonalCoordinator: "",
    evngCoordinators: [],
  });
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const zonesData = await getAllZones();
        // Filter zones to only those in the user's region
        const filteredZones = (zonesData.zones || []).filter(
          (zone) => zone.region?._id === user?.region?._id
        );
        setZones(filteredZones);
      } catch (error) {
        console.error("Failed to fetch data", error);
        toast.error("Failed to load data");
      } finally {
        setZonesLoading(false);
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

  const handleArrayChange = (name, value) => {
    const ids = value
      .split(",")
      .map((id) => id.trim())
      .filter((id) => id);
    setFormData((prev) => ({
      ...prev,
      [name]: ids,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await createZone(formData);
      toast.success("Zone added successfully!");
      setFormData({
        name: "",
        region: user?.region?._id || "",
        regionalCoordinator: "",
        zonalCoordinator: "",
        evngCoordinators: [],
      });
      // Update cache with new zone
      if (result.zone) {
        setZones((prev) => [...prev, result.zone]);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to add zone");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (zone) => {
    setEditingZone(zone);
    setEditFormData({
      name: zone.name,
      region: zone.region?._id || "",
      regionalCoordinator: zone.regionalCoordinator?.zionId || "",
      zonalCoordinator: zone.zonalCoordinator?.zionId || "",
      evngCoordinators:
        zone.evngCoordinators?.map((coord) => coord.zionId) || [],
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      const result = await updateZone(editingZone._id, editFormData);
      toast.success("Zone updated successfully!");
      setEditingZone(null);
      // Update cache with updated zone
      if (result.zone) {
        setZones((prev) =>
          prev.map((zone) =>
            zone._id === editingZone._id ? result.zone : zone
          )
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update zone");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this zone?")) return;
    try {
      await deleteZone(id);
      toast.success("Zone deleted successfully!");
      // Update cache by removing deleted zone
      setZones((prev) => prev.filter((zone) => zone._id !== id));
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete zone");
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditArrayChange = (name, value) => {
    const ids = value
      .split(",")
      .map((id) => id.trim())
      .filter((id) => id);
    setEditFormData((prev) => ({
      ...prev,
      [name]: ids,
    }));
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Add Zone</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Zone Name *
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

            {/* Regional Coordinator */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Regional Coordinator Zion ID
              </label>
              <input
                type="number"
                name="regionalCoordinator"
                value={formData.regionalCoordinator}
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

            {/* Evangelism Coordinators */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Evangelism Coordinators Zion IDs (comma separated)
              </label>
              <input
                type="text"
                name="evngCoordinators"
                value={formData.evngCoordinators.join(", ")}
                onChange={(e) =>
                  handleArrayChange("evngCoordinators", e.target.value)
                }
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                placeholder="e.g. 123, 456, 789"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? "Adding Zone..." : "Add Zone"}
            </button>
          </div>
        </form>
      </div>

      {/* Zones List */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Existing Zones
        </h2>
        {zonesLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : zones.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No zones found.</div>
        ) : (
          <div className="flex flex-wrap gap-6 justify-center md:justify-start bg-white p-6 rounded-lg shadow-md">
            {zones.map((zone) => (
              <div
                key={zone._id}
                className="bg-white rounded-lg shadow-md border border-gray-400 p-6 hover:shadow-lg transition-shadow duration-200 w-full md:max-w-70"
              >
                <div className="flex flex-col items-start justify-between mb-4">
                  <div className="flex flex-row items-center justify-between w-full mb-4">
                    <h3 className="text-lg font-bold text-gray-900">
                      {zone.name}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(zone)}
                        className="p-1 text-gray-400 hover:text-blue-700 transition-colors"
                        title="Edit zone"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(zone._id)}
                        className="p-1 text-gray-400 hover:text-red-700 transition-colors"
                        title="Delete zone"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium w-24">Region:</span>
                    <span>{zone.region?.name || "N/A"}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium w-24">Regional Coord:</span>
                    <span>{zone.regionalCoordinator?.name || "N/A"}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium w-24">Zonal Coord:</span>
                    <span>{zone.zonalCoordinator?.name || "N/A"}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium w-24">Evng Coords:</span>
                    <span>{zone.evngCoordinators?.length || 0}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium w-24">Members:</span>
                    <span>{zone.totalMembers || 0}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="text-xs text-gray-500">
                    Created: {new Date(zone.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingZone && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Edit Zone
              </h3>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Zone Name *
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
                    Regional Coordinator Zion ID
                  </label>
                  <input
                    type="number"
                    name="regionalCoordinator"
                    value={editFormData.regionalCoordinator}
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
                    Evangelism Coordinators Zion IDs (comma separated)
                  </label>
                  <input
                    type="text"
                    name="evngCoordinators"
                    value={editFormData.evngCoordinators.join(", ")}
                    onChange={(e) =>
                      handleEditArrayChange("evngCoordinators", e.target.value)
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    placeholder="e.g. 123, 456, 789"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setEditingZone(null)}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={editLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {editLoading ? "Updating..." : "Update Zone"}
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

export default AddZone;
