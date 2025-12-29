import React from "react";

const Reports = ({ reports }) => {
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
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">No reports found.</div>
        )}
      </div>
    </div>
  );
};

export default Reports;
