import React, { useState, useEffect } from "react";
import { createSubzone, getAllSubzones } from "../api/admin.api";
import { toast } from "react-toastify";

const AddSubzone = () => {
  const [formData, setFormData] = useState({
    name: "",
    zone: "Kochi",
    zonalCoordinator: "",
    evngCoordinator: "",
    totalMembers: 1,
  });
  const [loading, setLoading] = useState(false);
  const [subzones, setSubzones] = useState([]);
  const [subzonesLoading, setSubzonesLoading] = useState(true);

  useEffect(() => {
    const fetchSubzones = async () => {
      try {
        const data = await getAllSubzones();
        setSubzones(data.subZones || []);
      } catch (error) {
        console.error("Failed to fetch subzones", error);
        toast.error("Failed to load subzones");
      } finally {
        setSubzonesLoading(false);
      }
    };
    fetchSubzones();
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
      await createSubzone(formData);
      toast.success("Subzone added successfully!");
      setFormData({
        name: "",
        zone: "Kochi",
        zonalCoordinator: "",
        evngCoordinator: "",
        totalMembers: 1,
      });
      // Refresh subzones list
      const data = await getAllSubzones();
      setSubzones(data.subZones || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to add subzone");
    } finally {
      setLoading(false);
    }
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subzones.map((subzone) => (
              <div
                key={subzone._id}
                className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {subzone.name}
                  </h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {subzone.zone}
                  </span>
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
    </div>
  );
};

export default AddSubzone;
