import React from "react";
import { AppData } from "../context/AppContext";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const { logoutUser, user } = AppData();
  const navigate = useNavigate();

  return (
    <div className="flex w-25 m-auto mt-40">
      <button
        className="bg-red-500 text-white p-2 rounded-md"
        onClick={() => logoutUser(navigate)}
      >
        Logout
      </button>

      {user && user.role === "admin" && (
        <Link
          to="/dashboard"
          className="bg-purple-500 text-white p-2 rounded-md"
        >
          Dashboard
        </Link>
      )}
      <h3>{user && user.name}</h3>
      <h3>{user && user.email}</h3>
      <h3>{user && user.role}</h3>
    </div>
  );
};

export default Home;
