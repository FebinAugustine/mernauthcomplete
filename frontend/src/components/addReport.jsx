import React, { useState } from "react";
import { createReport } from "../api/report.api";
import { toast } from "react-toastify";

const AddReport = ({ user }) => {
  const [formData, setFormData] = useState({
    fellowship: "",
    typeOfReport: "",
    date: "",
    hearerName: "",
    noOfHearers: 1,
    location: "",
    mobileNumber: "",
    status: "Neutral",
    remarks: "",
    followUpStatus: "First Contact",
    nextFollowUpDate: "",
    followUpRemarks: "",
    appointmentDate: "",
    appointmentTime: "",
    appointmentLocation: "",
    appointmentStatus: "Not Scheduled",
    evangelistAssigned: "",
    appointmentRemarks: "",
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
      const reportData = {
        ...formData,
        user: user._id,
        date: new Date(formData.date),
        nextFollowUpDate: formData.nextFollowUpDate
          ? new Date(formData.nextFollowUpDate)
          : null,
        appointmentDate: formData.appointmentDate
          ? new Date(formData.appointmentDate)
          : null,
      };
      await createReport(reportData);
      toast.success("Report added successfully!");
      // Reset form
      setFormData({
        fellowship: "",
        typeOfReport: "",
        date: "",
        hearerName: "",
        noOfHearers: 1,
        location: "",
        mobileNumber: "",
        status: "Neutral",
        remarks: "",
        followUpStatus: "First Contact",
        nextFollowUpDate: "",
        followUpRemarks: "",
        appointmentDate: "",
        appointmentTime: "",
        appointmentLocation: "",
        appointmentStatus: "Not Scheduled",
        evangelistAssigned: "",
        appointmentRemarks: "",
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to add report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Add Report</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Fellowship */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Fellowship *
              </label>
              <select
                name="fellowship"
                value={formData.fellowship}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              >
                <option value="">Select Fellowship</option>
                <option value="Thevara">Thevara</option>
                <option value="FortKochi">FortKochi</option>
                <option value="Palarivattom">Palarivattom</option>
                <option value="Varappuzha">Varappuzha</option>
                <option value="Pala">Pala</option>
                <option value="Zion">Zion</option>
              </select>
            </div>

            {/* Type of Report */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Type of Report *
              </label>
              <select
                name="typeOfReport"
                value={formData.typeOfReport}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              >
                <option value="">Select Type</option>
                <option value="Calling">Calling</option>
                <option value="DTD">DTD</option>
                <option value="Card">Card</option>
                <option value="Survey">Survey</option>
                <option value="Personal">Personal</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>

            {/* Hearer Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Hearer Name *
              </label>
              <input
                type="text"
                name="hearerName"
                value={formData.hearerName}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>

            {/* Number of Hearers */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Number of Hearers *
              </label>
              <input
                type="number"
                name="noOfHearers"
                value={formData.noOfHearers}
                onChange={handleChange}
                min="1"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mobile Number *
              </label>
              <input
                type="tel"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Status *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              >
                <option value="Neutral">Neutral</option>
                <option value="Positive">Positive</option>
                <option value="Negative">Negative</option>
              </select>
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Remarks
            </label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              rows="3"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          {/* Follow Up Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Follow Up Status
            </label>
            <select
              name="followUpStatus"
              value={formData.followUpStatus}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            >
              <option value="First Contact">First Contact</option>
              <option value="Second Contact">Second Contact</option>
              <option value="Third Contact">Third Contact</option>
              <option value="Ready">Ready</option>
              <option value="Attended">Attended</option>
            </select>
          </div>

          {/* Next Follow Up Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Next Follow Up Date
            </label>
            <input
              type="date"
              name="nextFollowUpDate"
              value={formData.nextFollowUpDate}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          {/* Follow Up Remarks */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Follow Up Remarks
            </label>
            <textarea
              name="followUpRemarks"
              value={formData.followUpRemarks}
              onChange={handleChange}
              rows="2"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          {/* Appointment Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Appointment Date
            </label>
            <input
              type="date"
              name="appointmentDate"
              value={formData.appointmentDate}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          {/* Appointment Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Appointment Time
            </label>
            <input
              type="time"
              name="appointmentTime"
              value={formData.appointmentTime}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          {/* Appointment Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Appointment Location
            </label>
            <input
              type="text"
              name="appointmentLocation"
              value={formData.appointmentLocation}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          {/* Appointment Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Appointment Status
            </label>
            <select
              name="appointmentStatus"
              value={formData.appointmentStatus}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            >
              <option value="Not Scheduled">Not Scheduled</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Evangelist Assigned */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Evangelist Assigned
            </label>
            <input
              type="text"
              name="evangelistAssigned"
              value={formData.evangelistAssigned}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          {/* Appointment Remarks */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Appointment Remarks
            </label>
            <textarea
              name="appointmentRemarks"
              value={formData.appointmentRemarks}
              onChange={handleChange}
              rows="2"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? "Adding Report..." : "Add Report"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddReport;
