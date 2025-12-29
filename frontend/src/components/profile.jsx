import React from "react";

const Profile = ({ profile }) => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Profile</h1>
      <div className="bg-white rounded-lg shadow p-6">
        {profile && profile.name && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <p className="mt-1 text-lg text-gray-900">{profile.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <p className="mt-1 text-lg text-gray-900">{profile.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <p className="mt-1 text-lg text-gray-900">{profile.role}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <p className="mt-1 text-lg text-gray-900">{profile.phone}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Fellowship
              </label>
              <p className="mt-1 text-lg text-gray-900">{profile.fellowship}</p>
            </div>
          </div>
        )}
        {!profile && (
          <div className="text-center text-gray-500">Loading profile...</div>
        )}
      </div>
    </div>
  );
};

export default Profile;
