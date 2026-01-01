import React, { useState } from "react";
import { Link } from "react-router-dom";

import { toast } from "react-toastify";

import TestDashboard from "./TestDashboard";
import { registerUser } from "../api/user.api";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [fellowship, setFellowship] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);

  const userData = {
    name,
    email,
    password,
    phone,
    fellowship,
  };

  const submitHandler = async (e) => {
    setBtnLoading(true);
    e.preventDefault();
    try {
      const { data } = await registerUser(userData);
      setName("");
      setEmail("");
      setPassword("");
      setPhone("");
      setFellowship("");
      toast.success(data?.message || "Registration successful");
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.data?.message ||
        error?.message ||
        "An error occurred";
      toast.error(message);
    } finally {
      setBtnLoading(false);
    }
  };
  return (
    <section className="text-gray-600 body-font ">
      <div className="container pb-4 pt-8 md:px-4 lg:px-6  mx-auto flex flex-wrap items-center">
        <div className="lg:w-3/5 md:w-1/2 md:pr-16 lg:pr-0 pr-0">
          <h1 className="title-font font-medium text-3xl text-gray-600 px-4 text-center">
            Whoever has ears, let them hear.
          </h1>
          <p className="leading-relaxed mt-4 px-4 text-center text-gray-400">
            “A farmer went out to sow his seed. ..... Still other seed fell on
            good soil, where it produced a crop—some yielding a hundred times,
            some sixty, some thirty
          </p>
        </div>
        <form
          onSubmit={submitHandler}
          className="lg:w-2/6 md:w-1/2 bg-gray-100 rounded-lg p-6 flex flex-col md:ml-auto w-full mt-10 md:mt-0 "
        >
          {/* logo */}
          <img
            src="./src/assets/evapod_logo.png"
            alt="EVAPOD LOGO"
            className="mx-auto h-12 w-auto mb-4"
          />
          <h1 className="text-blue-700 text-lg font-bold title-font mb-2 text-center">
            THE EVAPOD APP
          </h1>
          <p className="text-center text-xs mb-4">
            Setup you Account to Get Started.
          </p>
          <h2 className="text-gray-600 text-lg font-bold title-font mb-5 text-center">
            Sign Up
          </h2>
          <div className="relative mb-4">
            <label htmlFor="name" className="leading-7 text-sm text-gray-600">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="relative mb-4">
            <label htmlFor="email" className="leading-7 text-sm text-gray-600">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="relative mb-4">
            <label
              htmlFor="password"
              className="leading-7 text-sm text-gray-600"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {/* Phone Number Feild */}
          <div className="relative mb-4">
            <label htmlFor="phone" className="leading-7 text-sm text-gray-600">
              Phone Number
            </label>
            <input
              type="number"
              id="phone"
              name="phone"
              className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          {/* select fellowship from drop down  */}
          <div className="relative mb-4">
            <label
              htmlFor="fellowship"
              className="leading-7 text-sm text-gray-600"
            >
              Fellowship
            </label>
            <select
              id="fellowship"
              name="fellowship"
              className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              value={fellowship}
              onChange={(e) => setFellowship(e.target.value)}
              required
            >
              <option value="">Select Fellowship</option>
              <option value="Thevara">Thevara</option>
              <option value="Palarivattom">Palarivattom</option>
              <option value="FortKochi">FortKochi</option>
              <option value="Thoppumpady">Thoppumpady</option>
            </select>
          </div>

          <button
            className="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
            disabled={btnLoading}
          >
            {btnLoading ? "Submitting..." : "Button"}
          </button>
          <Link to={"/login"} className="text-sm text-gray-500 mt-3">
            Have an account?
          </Link>
        </form>
      </div>
      {/* footer with copyright */}
      <div className="w-full text-center mt-4">
        <p className="text-gray-200 text-xs bg-blue-900 py-2 rounded w-full">
          &copy; 2026 EVAPOD App | CLEEZ. All rights reserved.
        </p>
      </div>
    </section>
  );
};

export default Register;
