import React, { useState, useEffect } from "react";
import {
  createRegion,
  getAllRegions,
  updateRegion,
  deleteRegion,
} from "../api/admin.api";
import { toast } from "react-toastify";
import { Edit, Trash2 } from "lucide-react";

const AddRegion = () => {
  const [formData, setFormData] = useState({
    name: "",
    regionalCoordinator: "",
    zonalCoordinators: [],
    evngCoordinators: [],
  });
  const [loading, setLoading] = useState(false);
  const [regions, setRegions] = useState([]);
  const [regionsLoading, setRegionsLoading] = useState(true);
  const [editingRegion, setEditingRegion] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    regionalCoordinator: "",
    zonalCoordinators: [],
    evngCoordinators: [],
  });
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const data = await getAllRegions();
        setRegions(data.regions || []);
      } catch (error) {
        console.error("Failed to fetch regions", error);
        toast.error("Failed to load regions");
      } finally {
        setRegionsLoading(false);
      }
    };
    fetchRegions();
  }, []);

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
      const result = await createRegion(formData);
      toast.success("Region added successfully!");
      setFormData({
        name: "",
        regionalCoordinator: "",
        zonalCoordinators: [],
        evngCoordinators: [],
      });
      // Update cache with new region
      if (result.region) {
        setRegions((prev) => [...prev, result.region]);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to add region");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (region) => {
    setEditingRegion(region);
    setEditFormData({
      name: region.name,
      regionalCoordinator: region.regionalCoordinator?.zionId || "",
      zonalCoordinators:
        region.zonalCoordinators?.map((coord) => coord.zionId) || [],
      evngCoordinators:
        region.evngCoordinators?.map((coord) => coord.zionId) || [],
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      const result = await updateRegion(editingRegion._id, editFormData);
      toast.success("Region updated successfully!");
      setEditingRegion(null);
      // Update cache with updated region
      if (result.region) {
        setRegions((prev) =>
          prev.map((region) =>
            region._id === editingRegion._id ? result.region : region
          )
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update region");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this region?")) return;
    try {
      await deleteRegion(id);
      toast.success("Region deleted successfully!");
      // Update cache by removing deleted region
      setRegions((prev) => prev.filter((region) => region._id !== id));
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete region");
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
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Add Region</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Region Name *
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

            {/* Regional Coordinator */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Regional Coordinator Zion ID *
              </label>
              <input
                type="number"
                name="regionalCoordinator"
                value={formData.regionalCoordinator}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>

            {/* Zonal Coordinators */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Zonal Coordinators Zion IDs (comma separated)
              </label>
              <input
                type="text"
                name="zonalCoordinators"
                value={formData.zonalCoordinators.join(", ")}
                onChange={(e) =>
                  handleArrayChange("zonalCoordinators", e.target.value)
                }
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                placeholder="e.g. 123, 456, 789"
              />
            </div>

            {/* Evangelism Coordinators */}
            <div>
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
              {loading ? "Adding Region..." : "Add Region"}
            </button>
          </div>
        </form>
      </div>

      {/* Regions List */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Existing Regions
        </h2>
        {regionsLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : regions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No regions found.
          </div>
        ) : (
          <div className="flex flex-wrap gap-6 justify-center md:justify-start bg-white p-6 rounded-lg shadow-md">
            {regions.map((region) => (
              <div
                key={region._id}
                className="bg-white rounded-lg shadow-md border border-gray-400 p-6 hover:shadow-lg transition-shadow duration-200 w-full md:max-w-70"
              >
                <div className="flex flex-col items-start justify-between mb-4">
                  <div className="flex flex-row items-center justify-between w-full mb-4">
                    <h3 className="text-lg font-bold text-gray-900">
                      {region.name}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(region)}
                        className="p-1 text-gray-400 hover:text-blue-700 transition-colors"
                        title="Edit region"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(region._id)}
                        className="p-1 text-gray-400 hover:text-red-700 transition-colors"
                        title="Delete region"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium w-24">Regional Coord:</span>
                    <span>{region.regionalCoordinator?.name || "N/A"}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium w-24">Zonal Coords:</span>
                    <span>{region.zonalCoordinators?.length || 0}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium w-24">Evng Coords:</span>
                    <span>{region.evngCoordinators?.length || 0}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium w-24">Members:</span>
                    <span>{region.totalMembers || 0}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="text-xs text-gray-500">
                    Created: {new Date(region.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingRegion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Edit Region
              </h3>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Region Name *
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
                    Regional Coordinator Zion ID *
                  </label>
                  <input
                    type="number"
                    name="regionalCoordinator"
                    value={editFormData.regionalCoordinator}
                    onChange={handleEditChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Zonal Coordinators Zion IDs (comma separated)
                  </label>
                  <input
                    type="text"
                    name="zonalCoordinators"
                    value={editFormData.zonalCoordinators.join(", ")}
                    onChange={(e) =>
                      handleEditArrayChange("zonalCoordinators", e.target.value)
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    placeholder="e.g. 123, 456, 789"
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
                    onClick={() => setEditingRegion(null)}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={editLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {editLoading ? "Updating..." : "Update Region"}
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

export default AddRegion;
