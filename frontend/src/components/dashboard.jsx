import React from "react";

const Dashboard = ({ user, reports }) => {
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
    </div>
  );
};

export default Dashboard;
