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
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
      <div className="bg-white rounded-lg shadow p-6 mb-6">
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
      <div className="bg-white rounded-lg shadow p-6 mb-6">
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
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Follow-Up Status Summary</h2>
          <button
            onClick={shareFollowUpSummary}
            className="text-green-600 hover:text-green-800 text-xl"
          >
            <Share2 size={22} color="#048b07" strokeWidth={3} />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
