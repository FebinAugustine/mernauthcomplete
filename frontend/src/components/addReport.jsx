import React, { useState } from "react";
import { createReport } from "../api/report.api";
import { toast } from "react-toastify";

const AddReport = ({ user, setActiveTab }) => {
  console.log("Current User in AddReport:", user);
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
    <div className="">
      {/* Classic Navbar */}
      <div className="bg-white shadow-md p-4 mb-4">
        <div className="flex justify-between items-center">
          <div className="flex flex-col md:flex-row md:items-center space-x-2">
            <h2 className="md:hidden text-xl font-bold text-blue-900">
              EVAPOD ADD REPORT
            </h2>
            <h3 className="md:text-xl font-medium md:font-bold text-blue-900 overflow-hidden">
              Add New Report
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
      {/* <h1 className="text-3xl font-bold text-gray-900 mb-6">Add Report</h1> */}
      <div className="bg-white rounded-lg shadow pt-6 pb-6 pl-2 pr-2 md:pl-6 md:pr-6 ml-2 mr-2 md:ml-6 md:mr-6">
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
                <option value="">select Your Fellowship</option>
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
