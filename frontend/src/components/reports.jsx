import React, { useState } from "react";
import { Share2, Eye } from "lucide-react";

const Reports = ({ reports, user }) => {
  const [selectedReport, setSelectedReport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Reports</h1>
      <div className=" overflow-hidden">
        {reports.length > 0 ? (
          <div className="divide-y divide-gray-700">
            {reports.map((report) => (
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
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      report.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : report.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {report.status}
                  </span>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-800">
                    Submitted on:{" "}
                    {new Date(report.createdAt).toLocaleDateString()}
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
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
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
    </div>
  );
};

export default Reports;
