import React, { useState } from "react";
import { createFellowship } from "../api/admin.api";
import { toast } from "react-toastify";

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

      await createFellowship(dataToSend);
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
    } catch (error) {
      console.error(error);
      toast.error("Failed to add fellowship");
    } finally {
      setLoading(false);
    }
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
    </div>
  );
};

export default AddFellowship;
