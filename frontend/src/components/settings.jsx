import React, { useState } from "react";
import { AppData } from "../context/AppContext";

const Settings = ({ setActiveTab }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user } = AppData();
  return (
    <div className="">
      {/* Classic Navbar */}
      <div className="bg-white shadow-md p-4 mb-6">
        <div className="flex justify-between items-center">
          <div className="flex flex-col md:flex-row md:items-center space-x-2">
            <h2 className="md:hidden text-xl font-bold text-blue-900">
              EVAPOD SETTINGS
            </h2>
            <h3 className="md:text-xl font-medium md:font-bold text-blue-900 overflow-hidden">
              Settings for {user?.name}
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
      {/* <h1 className="text-3xl font-bold text-gray-900 mb-6">Settings</h1> */}
      <div className="bg-white rounded-lg shadow p-6 ml-2 mr-2 md:ml-6 md:mr-6">
        <p className="text-gray-600">Settings functionality coming soon...</p>
      </div>
    </div>
  );
};

export default Settings;
