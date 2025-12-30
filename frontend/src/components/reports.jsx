import React, { useState } from "react";
import { Share2, Eye, Edit, Search } from "lucide-react";
import { updateReportById } from "../api/report.api";
import { toast } from "react-toastify";

const Reports = ({ reports, user, refreshReports }) => {
  const [selectedReport, setSelectedReport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingReport, setEditingReport] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [sortOrder, setSortOrder] = useState("desc"); // 'asc' or 'desc'
  const [searchTerm, setSearchTerm] = useState("");
  const currentDate = new Date().toLocaleDateString();

  const shareReport = (report) => {
    const message = `Report Details shared by ${user?.name} from ${
      user?.fellowship
    } on ${currentDate}:\n\nFellowship: ${report.fellowship}\nType of Report: ${
      report.typeOfReport
    }\nDate: ${new Date(report.date).toLocaleDateString()}\nHearer Name: ${
      report.hearerName
    }\nNumber of Hearers: ${report.noOfHearers}\nLocation: ${
      report.location
    }\nMobile Number: ${report.mobileNumber}\nStatus: ${
      report.status
    }\nRemarks: ${report.remarks || "N/A"}\nFollow Up Status: ${
      report.followUpStatus
    }\nNext Follow Up Date: ${
      report.nextFollowUpDate
        ? new Date(report.nextFollowUpDate).toLocaleDateString()
        : "N/A"
    }\nFollow Up Remarks: ${report.followUpRemarks || "N/A"}`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, "_blank");
  };

  const openModal = (report) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedReport(null);
    setIsModalOpen(false);
  };

  const openEditModal = (report) => {
    setEditingReport(report);
    setEditFormData({
      fellowship: report.fellowship,
      typeOfReport: report.typeOfReport,
      date: report.date
        ? new Date(report.date).toISOString().split("T")[0]
        : "",
      hearerName: report.hearerName,
      noOfHearers: report.noOfHearers,
      location: report.location,
      mobileNumber: report.mobileNumber,
      status: report.status,
      remarks: report.remarks,
      followUpStatus: report.followUpStatus,
      nextFollowUpDate: report.nextFollowUpDate
        ? new Date(report.nextFollowUpDate).toISOString().split("T")[0]
        : "",
      followUpRemarks: report.followUpRemarks,
      appointmentDate: report.appointmentDate
        ? new Date(report.appointmentDate).toISOString().split("T")[0]
        : "",
      appointmentTime: report.appointmentTime,
      appointmentLocation: report.appointmentLocation,
      appointmentStatus: report.appointmentStatus,
      evangelistAssigned: report.evangelistAssigned,
      appointmentRemarks: report.appointmentRemarks,
    });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditingReport(null);
    setEditFormData({});
    setIsEditModalOpen(false);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateReportById(editingReport._id, editFormData);
      toast.success("Report updated successfully");
      closeEditModal();
      // Refresh reports
      refreshReports();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update report");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const filteredReports = reports.filter((report) => {
    const term = searchTerm.toLowerCase();
    return (
      report.typeOfReport?.toLowerCase().includes(term) ||
      report.hearerName?.toLowerCase().includes(term) ||
      report.mobileNumber?.toString().includes(term)
    );
  });

  const sortedReports = [...filteredReports].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    if (sortOrder === "asc") {
      return dateA - dateB;
    } else {
      return dateB - dateA;
    }
  });

  const shareFullReport = (report) => {
    const message = `Full Report Details shared by ${user?.name} from ${
      user?.fellowship
    } on ${currentDate}:\n\nFellowship: ${report.fellowship}\nType of Report: ${
      report.typeOfReport
    }\nDate: ${new Date(report.date).toLocaleDateString()}\nHearer Name: ${
      report.hearerName
    }\nNumber of Hearers: ${report.noOfHearers}\nLocation: ${
      report.location
    }\nMobile Number: ${report.mobileNumber}\nStatus: ${
      report.status
    }\nRemarks: ${report.remarks || "N/A"}\nFollow Up Status: ${
      report.followUpStatus
    }\nNext Follow Up Date: ${
      report.nextFollowUpDate
        ? new Date(report.nextFollowUpDate).toLocaleDateString()
        : "N/A"
    }\nFollow Up Remarks: ${
      report.followUpRemarks || "N/A"
    }\nAppointment Date: ${
      report.appointmentDate
        ? new Date(report.appointmentDate).toLocaleDateString()
        : "N/A"
    }\nAppointment Time: ${
      report.appointmentTime || "N/A"
    }\nAppointment Location: ${
      report.appointmentLocation || "N/A"
    }\nAppointment Status: ${report.appointmentStatus}\nEvangelist Assigned: ${
      report.evangelistAssigned || "N/A"
    }\nAppointment Remarks: ${
      report.appointmentRemarks || "N/A"
    }\nCreated At: ${new Date(
      report.createdAt
    ).toLocaleString()}\nUpdated At: ${new Date(
      report.updatedAt
    ).toLocaleString()}`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, "_blank");
  };
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Reports</h1>
      <div className="mb-4 flex items-center space-x-4">
        <div className="flex items-center space-x-2 w-full">
          <label className="text-sm font-medium text-gray-700">Search:</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by type, name, or mobile"
            className="border border-gray-300 rounded-md px-3 py-1 text-sm w-full lg:w-full h-10"
          />
          <span className="text-gray-500">
            <Search size={22} />
          </span>
        </div>
      </div>
      <div className="mb-4 flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">
            Sort by Date:
          </label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm"
          >
            <option value="asc">Newest First</option>
            <option value="desc">Oldest First</option>
          </select>
        </div>
      </div>
      <div className=" overflow-hidden">
        {reports.length > 0 ? (
          <div className="divide-y divide-gray-700">
            {sortedReports.map((report) => (
              <div
                key={report._id}
                className="bg-white rounded-lg p-4 hover:bg-gray-50 mb-2"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {report?.typeOfReport
                        ? `${report.typeOfReport} Report`
                        : "Report"}
                    </h3>
                    <p className="text-gray-800">{report.description}</p>
                    <p className="text-sm text-gray-800">
                      Status: {report.status}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        report.status === "Neutral"
                          ? "bg-yellow-100 text-yellow-800"
                          : report.status === "Positive"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {report.status}
                    </span>
                    <button
                      onClick={() => openEditModal(report)}
                      className="text-blue-500 hover:text-blue-700"
                      title="Edit Report"
                    >
                      <Edit size={16} />
                    </button>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-800">
                    Submitted on:{" "}
                    {new Date(report.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-800">
                    Report Date: {new Date(report.date).toLocaleDateString()}
                  </p>
                  {/* Hearer name */}
                  <p className="text-sm text-gray-800">
                    Hearer Name: {report.hearerName}
                  </p>
                  {/* Number of Hearers */}
                  <p className="text-sm text-gray-800">
                    Number of Hearers: {report.noOfHearers}
                  </p>
                  {/* Location */}
                  <p className="text-sm text-gray-800">
                    Location: {report.location}
                  </p>
                  {/* Mobile Number */}
                  <p className="text-sm text-gray-800">
                    Mobile Number: {report.mobileNumber}
                  </p>

                  {/* Follow Up Status */}
                  <p className="text-sm text-gray-800">
                    Follow Up Status: {report.followUpStatus}
                  </p>
                  {/* Next Follow Up Date */}
                  <p className="text-sm text-gray-800">
                    Next Follow Up Date:{" "}
                    {report.nextFollowUpDate
                      ? new Date(report.nextFollowUpDate).toLocaleDateString()
                      : "N/A"}
                  </p>
                  {/* Buttons */}
                  <div className="mt-4 flex justify-end space-x-2">
                    <button
                      onClick={() => openModal(report)}
                      className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition duration-200 text-sm flex items-center"
                    >
                      <Eye size={16} className="mr-1" />
                      View Full Report
                    </button>
                    <button
                      onClick={() => shareReport(report)}
                      className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition duration-200 text-sm flex items-center"
                    >
                      <Share2 size={16} className="mr-1" />
                      Share
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">No reports found.</div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                Full Report Details
              </h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => shareFullReport(selectedReport)}
                  className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition duration-200 text-sm flex items-center"
                >
                  <Share2 size={16} className="mr-1" />
                  Share
                </button>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <strong>Fellowship:</strong> {selectedReport.fellowship}
                </div>
                <div>
                  <strong>Type of Report:</strong> {selectedReport.typeOfReport}
                </div>
                <div>
                  <strong>Date:</strong>{" "}
                  {new Date(selectedReport.date).toLocaleDateString()}
                </div>
                <div>
                  <strong>Hearer Name:</strong> {selectedReport.hearerName}
                </div>
                <div>
                  <strong>Number of Hearers:</strong>{" "}
                  {selectedReport.noOfHearers}
                </div>
                <div>
                  <strong>Location:</strong> {selectedReport.location}
                </div>
                <div>
                  <strong>Mobile Number:</strong> {selectedReport.mobileNumber}
                </div>
                <div>
                  <strong>Status:</strong> {selectedReport.status}
                </div>
                <div>
                  <strong>Remarks:</strong> {selectedReport.remarks || "N/A"}
                </div>
                <div>
                  <strong>Follow Up Status:</strong>{" "}
                  {selectedReport.followUpStatus}
                </div>
                <div>
                  <strong>Next Follow Up Date:</strong>{" "}
                  {selectedReport.nextFollowUpDate
                    ? new Date(
                        selectedReport.nextFollowUpDate
                      ).toLocaleDateString()
                    : "N/A"}
                </div>
                <div>
                  <strong>Follow Up Remarks:</strong>{" "}
                  {selectedReport.followUpRemarks || "N/A"}
                </div>
                <div>
                  <strong>Appointment Date:</strong>{" "}
                  {selectedReport.appointmentDate
                    ? new Date(
                        selectedReport.appointmentDate
                      ).toLocaleDateString()
                    : "N/A"}
                </div>
                <div>
                  <strong>Appointment Time:</strong>{" "}
                  {selectedReport.appointmentTime || "N/A"}
                </div>
                <div>
                  <strong>Appointment Location:</strong>{" "}
                  {selectedReport.appointmentLocation || "N/A"}
                </div>
                <div>
                  <strong>Appointment Status:</strong>{" "}
                  {selectedReport.appointmentStatus}
                </div>
                <div>
                  <strong>Evangelist Assigned:</strong>{" "}
                  {selectedReport.evangelistAssigned || "N/A"}
                </div>
                <div>
                  <strong>Appointment Remarks:</strong>{" "}
                  {selectedReport.appointmentRemarks || "N/A"}
                </div>
                <div>
                  <strong>Created At:</strong>{" "}
                  {new Date(selectedReport.createdAt).toLocaleString()}
                </div>
                <div>
                  <strong>Updated At:</strong>{" "}
                  {new Date(selectedReport.updatedAt).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && editingReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Edit Report</h2>
              <button
                onClick={closeEditModal}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Fellowship
                  </label>
                  <select
                    name="fellowship"
                    value={editFormData.fellowship}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  >
                    <option value="Thevara">Thevara</option>
                    <option value="FortKochi">FortKochi</option>
                    <option value="Palarivattom">Palarivattom</option>
                    <option value="Varappuzha">Varappuzha</option>
                    <option value="Pala">Pala</option>
                    <option value="Zion">Zion</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Type of Report
                  </label>
                  <select
                    name="typeOfReport"
                    value={editFormData.typeOfReport}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  >
                    <option value="Calling">Calling</option>
                    <option value="DTD">DTD</option>
                    <option value="Card">Card</option>
                    <option value="Survey">Survey</option>
                    <option value="Personal">Personal</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={editFormData.date}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Hearer Name
                  </label>
                  <input
                    type="text"
                    name="hearerName"
                    value={editFormData.hearerName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Number of Hearers
                  </label>
                  <input
                    type="number"
                    name="noOfHearers"
                    value={editFormData.noOfHearers}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    min="1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={editFormData.location}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Mobile Number
                  </label>
                  <input
                    type="number"
                    name="mobileNumber"
                    value={editFormData.mobileNumber}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    name="status"
                    value={editFormData.status}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  >
                    <option value="Neutral">Neutral</option>
                    <option value="Positive">Positive</option>
                    <option value="Negative">Negative</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Remarks
                  </label>
                  <textarea
                    name="remarks"
                    value={editFormData.remarks}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    rows="2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Follow Up Status
                  </label>
                  <select
                    name="followUpStatus"
                    value={editFormData.followUpStatus}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  >
                    <option value="First Contact">First Contact</option>
                    <option value="Second Contact">Second Contact</option>
                    <option value="Third Contact">Third Contact</option>
                    <option value="Ready">Ready</option>
                    <option value="Attended">Attended</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Next Follow Up Date
                  </label>
                  <input
                    type="date"
                    name="nextFollowUpDate"
                    value={editFormData.nextFollowUpDate}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Follow Up Remarks
                  </label>
                  <textarea
                    name="followUpRemarks"
                    value={editFormData.followUpRemarks}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    rows="2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Appointment Date
                  </label>
                  <input
                    type="date"
                    name="appointmentDate"
                    value={editFormData.appointmentDate}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Appointment Time
                  </label>
                  <input
                    type="text"
                    name="appointmentTime"
                    value={editFormData.appointmentTime}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Appointment Location
                  </label>
                  <input
                    type="text"
                    name="appointmentLocation"
                    value={editFormData.appointmentLocation}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Appointment Status
                  </label>
                  <select
                    name="appointmentStatus"
                    value={editFormData.appointmentStatus}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  >
                    <option value="Not Scheduled">Not Scheduled</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Evangelist Assigned
                  </label>
                  <input
                    type="text"
                    name="evangelistAssigned"
                    value={editFormData.evangelistAssigned}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Appointment Remarks
                  </label>
                  <textarea
                    name="appointmentRemarks"
                    value={editFormData.appointmentRemarks}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    rows="2"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Update Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
