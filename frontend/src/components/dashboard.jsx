import React from "react";
import { Share2 } from "lucide-react";

const Dashboard = ({ user, reports }) => {
  const positiveCount = reports.filter((r) => r.status === "Positive").length;
  const negativeCount = reports.filter((r) => r.status === "Negative").length;
  const neutralCount = reports.filter((r) => r.status === "Neutral").length;
  const firstContactCount = reports.filter(
    (r) => r.followUpStatus === "First Contact"
  ).length;
  const secondContactCount = reports.filter(
    (r) => r.followUpStatus === "Second Contact"
  ).length;
  const thirdContactCount = reports.filter(
    (r) => r.followUpStatus === "Third Contact"
  ).length;
  const readyCount = reports.filter((r) => r.followUpStatus === "Ready").length;
  const attendedCount = reports.filter(
    (r) => r.followUpStatus === "Attended"
  ).length;

  const currentDate = new Date().toLocaleDateString();

  const shareReportSummary = () => {
    const message = `Report Summary by ${user?.name} from ${user?.fellowship} on ${currentDate}:\n\nTotal Positive: ${positiveCount}\nTotal Negative: ${negativeCount}\nTotal Neutral: ${neutralCount}`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, "_blank");
  };

  const shareFollowUpSummary = () => {
    const message = `Follow-Up Status Summary by ${user?.name} from ${user?.fellowship} on ${currentDate}:\n\n1st Contact: ${firstContactCount}\n2nd Contact: ${secondContactCount}\n3rd Contact: ${thirdContactCount}\nReady: ${readyCount}\nAttended: ${attendedCount}`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, "_blank");
  };

  return (
    <div className="pt-0">
      {/* Classic Navbar */}
      <div className="bg-white shadow-md p-4 mb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-blue-900">EVAPOD HOME</h2>
          </div>
          <div>
            <span className="text-gray-600">ID: </span>
            <span className="font-semibold text-gray-800">{user?.zionId}</span>
          </div>
          {/* User Drop down */}
          <div className="relative">
            <button className="flex items-center space-x-2 focus:outline-none">
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
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg py-1 z-20 hidden">
              <a
                href="#profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Profile
              </a>
              <a
                href="#settings"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Settings
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* <h1 className="text-3xl font-bold text-blue-900 mb-6">Evapod Home</h1> */}
      <div className="bg-white rounded-lg shadow p-6 mb-6 ml-2 mr-2 md:ml-6 md:mr-6">
        <h2 className="text-xl font-semibold mb-4">
          Welcome back, {user?.name}!
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-blue-900">Role</h3>
            <p className="text-blue-600">{user?.role}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-green-900">Email</h3>
            <p className="text-green-600">{user?.email}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-purple-900">Reports</h3>
            <p className="text-purple-600">{reports.length}</p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-6 mb-6 ml-2 mr-2 md:ml-6 md:mr-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Report Summary</h2>
          <button
            onClick={shareReportSummary}
            className="text-green-600 hover:text-green-800 text-xl"
          >
            <Share2 size={22} color="#048b07" strokeWidth={3} />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 p-4 rounded-lg flex items-center">
            <span className="text-2xl mr-3">👍</span>
            <div>
              <h3 className="text-lg font-medium text-green-900">Positive</h3>
              <p className="text-green-600 text-xl font-bold">
                {positiveCount}
              </p>
            </div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg flex items-center">
            <span className="text-2xl mr-3">👎</span>
            <div>
              <h3 className="text-lg font-medium text-red-900">Negative</h3>
              <p className="text-red-600 text-xl font-bold">{negativeCount}</p>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg flex items-center">
            <span className="text-2xl mr-3">😐</span>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Neutral</h3>
              <p className="text-gray-600 text-xl font-bold">{neutralCount}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-6 ml-2 mr-2 md:ml-6 md:mr-6 ">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Follow-Up Status Summary</h2>
          <button
            onClick={shareFollowUpSummary}
            className="text-green-600 hover:text-green-800 text-xl"
          >
            <Share2 size={22} color="#048b07" strokeWidth={3} />
          </button>
        </div>
        <div className="flex flex-col md:flex-row flex-wrap gap-4 justify-between">
          <div className="bg-blue-50 p-4 rounded-lg flex items-center">
            <span className="text-2xl mr-3">1️⃣</span>
            <div>
              <h3 className="text-lg font-medium text-blue-900">1st</h3>
              <p className="text-blue-600 text-xl font-bold">
                {firstContactCount}
              </p>
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg flex items-center">
            <span className="text-2xl mr-3">2️⃣</span>
            <div>
              <h3 className="text-lg font-medium text-green-900">2nd</h3>
              <p className="text-green-600 text-xl font-bold">
                {secondContactCount}
              </p>
            </div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg flex items-center">
            <span className="text-2xl mr-3">3️⃣</span>
            <div>
              <h3 className="text-lg font-medium text-yellow-900">3rd</h3>
              <p className="text-yellow-600 text-xl font-bold">
                {thirdContactCount}
              </p>
            </div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg flex items-center">
            <span className="text-2xl mr-3">✅</span>
            <div>
              <h3 className="text-lg font-medium text-purple-900">Ready</h3>
              <p className="text-purple-600 text-xl font-bold">{readyCount}</p>
            </div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg flex items-center">
            <span className="text-2xl mr-3">🎉</span>
            <div>
              <h3 className="text-lg font-medium text-red-900">Attended</h3>
              <p className="text-red-600 text-xl font-bold">{attendedCount}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
