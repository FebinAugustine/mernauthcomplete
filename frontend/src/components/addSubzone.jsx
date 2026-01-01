import React, { useState } from "react";
import { createSubzone } from "../api/admin.api";
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
    </div>
  );
};

export default AddSubzone;
