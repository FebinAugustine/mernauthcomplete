import React from "react";

const Dashboard = ({ user, reports }) => {
  const positiveCount = reports.filter((r) => r.status === "Positive").length;
  const negativeCount = reports.filter((r) => r.status === "Negative").length;
  const neutralCount = reports.filter((r) => r.status === "Neutral").length;

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
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Report Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 p-4 rounded-lg flex items-center">
            <span className="text-2xl mr-3">👍</span>
            <div>
              <h3 className="text-lg font-medium text-green-900">
                Total Positive
              </h3>
              <p className="text-green-600 text-xl font-bold">
                {positiveCount}
              </p>
            </div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg flex items-center">
            <span className="text-2xl mr-3">👎</span>
            <div>
              <h3 className="text-lg font-medium text-red-900">
                Total Negative
              </h3>
              <p className="text-red-600 text-xl font-bold">{negativeCount}</p>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg flex items-center">
            <span className="text-2xl mr-3">😐</span>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Total Neutral
              </h3>
              <p className="text-gray-600 text-xl font-bold">{neutralCount}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
