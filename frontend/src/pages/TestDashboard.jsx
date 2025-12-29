import React from "react";
import {
  Home,
  Search,
  Bell,
  MessageSquare,
  Menu,
  Star,
  Settings,
  Box,
  Monitor,
  FileText,
  ShoppingBag,
  Layers,
  Maximize,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react";

/* --- Components --- */

// 1. Sidebar Component
const Sidebar = () => {
  const menuItems = [
    { icon: Home, label: "Dashboard", active: true, badge: "New" },
    { icon: Box, label: "Widgets", badge: "New" },
    { icon: Layers, label: "Ui Kits" },
    { icon: FileText, label: "Forms" },
    { icon: Monitor, label: "Tables" },
  ];

  return (
    <div className="w-72 bg-white h-screen fixed left-0 top-0 border-r border-gray-100 flex flex-col z-20 hidden lg:flex">
      {/* Logo */}
      <div className="h-20 flex items-center px-8 border-b border-gray-50">
        <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">
          POCO
        </h1>
      </div>

      {/* Navigation */}
      <div className="p-4 space-y-1 overflow-y-auto">
        <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 mt-4">
          General
        </p>

        {menuItems.map((item, index) => (
          <div
            key={index}
            className={`flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all ${
              item.active
                ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-200"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center space-x-3">
              <item.icon size={18} />
              <span className="font-medium text-sm">{item.label}</span>
            </div>
            {item.badge && (
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full ${
                  item.active
                    ? "bg-white/20 text-white"
                    : "bg-purple-100 text-purple-600"
                }`}
              >
                {item.badge}
              </span>
            )}
            {!item.badge && <ChevronRight size={14} className="opacity-50" />}
          </div>
        ))}

        <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 mt-8">
          Apps
        </p>
        <div className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl cursor-pointer">
          <ShoppingBag size={18} />
          <span className="font-medium text-sm">Ecommerce</span>
        </div>
      </div>
    </div>
  );
};

// 2. Top Navbar Component
const Navbar = () => {
  return (
    <div className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10 lg:ml-72">
      <div className="flex items-center space-x-4">
        <button className="lg:hidden p-2 text-gray-600">
          <Menu size={24} />
        </button>
        <div className="hidden md:flex items-center bg-gray-50 px-4 py-2 rounded-full w-96 border border-gray-100 focus-within:ring-2 ring-purple-100 transition-all">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search your Product..."
            className="bg-transparent border-none outline-none text-sm ml-2 w-full text-gray-600 placeholder-gray-400"
          />
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <Maximize
          size={20}
          className="text-gray-400 cursor-pointer hover:text-purple-500"
        />
        <Star size={20} className="text-amber-400 cursor-pointer" />
        <div className="relative">
          <Bell
            size={20}
            className="text-gray-400 cursor-pointer hover:text-purple-500"
          />
          <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
        </div>
        <MessageSquare
          size={20}
          className="text-gray-400 cursor-pointer hover:text-purple-500"
        />

        <div className="flex items-center space-x-3 pl-6 border-l border-gray-100">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-gray-700">Emay Walter</p>
            <p className="text-xs text-gray-400">Admin</p>
          </div>
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
            alt="User"
            className="h-10 w-10 rounded-full border-2 border-purple-100 p-0.5"
          />
        </div>
      </div>
    </div>
  );
};

// 3. Stat Card Component (From previous step, refined)
const StatCard = ({ title, gradient }) => (
  <div
    className={`relative overflow-hidden rounded-[30px] p-6 text-white shadow-xl ${gradient} transition-transform hover:-translate-y-1`}
  >
    <div className="relative z-10">
      <div className="h-16 mb-2">
        {/* Simple SVG Wave Line */}
        <svg
          viewBox="0 0 100 25"
          className="w-2/3 stroke-white fill-none stroke-3 opacity-90 drop-shadow-md"
        >
          <path d="M0,15 Q25,0 50,15 T100,10" strokeLinecap="round" />
        </svg>
      </div>
      <h3 className="text-lg font-medium">{title}</h3>
      <div className="flex items-baseline space-x-2 mt-1">
        <span className="text-sm opacity-80">70 / 100</span>
      </div>
    </div>
    {/* Background Decorations */}
    <div className="absolute -right-4 -bottom-4 h-24 w-24 bg-white opacity-10 rounded-full blur-xl"></div>
  </div>
);

// 4. Bar Chart Component (Custom CSS/Flex implementation)
const YearOverviewChart = () => {
  const bars = [30, 45, 20, 50, 70, 40, 60, 80, 25, 55, 35, 90];

  return (
    <div className="bg-white p-8 rounded-[30px] shadow-sm border border-gray-100 col-span-1 lg:col-span-2">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h3 className="font-bold text-lg text-gray-800">Year Overview</h3>
        </div>
        <div className="text-right">
          <h4 className="font-bold text-lg text-gray-800">70 / 100</h4>
          <p className="text-xs text-cyan-500 font-medium">Total 71,52,225 $</p>
        </div>
      </div>

      <div className="h-64 flex items-end justify-between space-x-2 sm:space-x-4 relative">
        {/* Background Grid Lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="border-t border-gray-50 w-full h-full"
            ></div>
          ))}
        </div>

        {/* Bars */}
        {bars.map((height, i) => (
          <div
            key={i}
            className="relative w-full h-full flex items-end justify-center group z-10"
          >
            <div
              className={`w-3 sm:w-4 rounded-full transition-all duration-500 hover:opacity-80 ${
                i % 2 === 0 ? "bg-indigo-500" : "bg-pink-400"
              }`}
              style={{ height: `${height}%` }}
            ></div>
            {/* Tooltip on hover */}
            <div className="absolute -top-10 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              {height}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 5. Radial Chart Component
const SalesByCountries = () => {
  return (
    <div className="bg-white p-8 rounded-[30px] shadow-sm border border-gray-100 flex flex-col items-center justify-between">
      <div className="w-full flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg text-gray-800">Sales By Countries</h3>
        <Settings size={16} className="text-gray-400" />
      </div>

      <div className="relative h-48 w-48 flex items-center justify-center">
        {/* SVG Donut Chart */}
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="#f3f4f6"
            strokeWidth="6"
            fill="none"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="#3b82f6"
            strokeWidth="6"
            fill="none"
            strokeDasharray="251.2"
            strokeDashoffset="62.8" // 75% filled (251.2 * 0.25)
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute text-center">
          <h2 className="text-3xl font-bold text-gray-800">75</h2>
          <p className="text-gray-400 text-sm">Total</p>
        </div>
      </div>

      {/* Legend decoration */}
      <div className="flex space-x-2 mt-4">
        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
        <div className="w-2 h-2 rounded-full bg-gray-200"></div>
      </div>
    </div>
  );
};

/* --- Main Layout --- */

const TestDashboard = () => {
  const stats = [
    {
      title: "Total Sale",
      gradient: "bg-gradient-to-br from-purple-600 to-indigo-600",
    },
    {
      title: "Total Visits",
      gradient: "bg-gradient-to-br from-pink-400 to-rose-500",
    },
    {
      title: "Total Stock",
      gradient: "bg-gradient-to-br from-amber-300 to-orange-400",
    },
    {
      title: "Total Value",
      gradient: "bg-gradient-to-br from-cyan-400 to-teal-500",
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <Sidebar />
      <Navbar />

      <main className="lg:ml-72 p-8 pt-6">
        {/* Breadcrumb Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-indigo-900">Default</h2>
            <p className="text-xs font-bold text-indigo-400 tracking-[0.2em] uppercase mt-1">
              Admin Panel
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center bg-white px-4 py-2 rounded-full shadow-sm text-sm">
            <Home size={14} className="text-indigo-500 mr-2" />
            <span className="text-gray-300 mx-2">/</span>
            <span className="text-indigo-500">Dashboard</span>
            <span className="text-gray-300 mx-2">/</span>
            <span className="text-gray-400">Default</span>
          </div>
        </div>

        {/* Top Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, i) => (
            <StatCard key={i} {...stat} />
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <YearOverviewChart />
          <SalesByCountries />
        </div>
      </main>
    </div>
  );
};

export default TestDashboard;

// import React from "react";
// import { Home, ChevronRight, TrendingUp } from "lucide-react";

// const StatCard = ({ title, ratio, gradient }) => (
//   <div
//     className={`flex flex-col items-center justify-between p-8 rounded-[40px] text-white w-full aspect-square shadow-lg ${gradient}`}
//   >
//     {/* Sparkline Illustration */}
//     <div className="w-full h-24 flex items-center justify-center">
//       <svg
//         viewBox="0 0 100 40"
//         className="w-3/4 stroke-white/80 fill-none stroke-4 drop-shadow-md"
//       >
//         <path
//           d="M10,25 Q25,5 40,25 T70,25 T90,10"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//         />
//       </svg>
//     </div>

//     <div className="text-center">
//       <h3 className="text-xl font-semibold mb-1">{title}</h3>
//       <p className="text-sm opacity-90">{ratio}</p>
//     </div>
//   </div>
// );

// const TestDashboard = () => {
//   const stats = [
//     {
//       title: "Total Sale",
//       ratio: "70 / 100",
//       gradient: "bg-gradient-to-br from-purple-500 to-indigo-600",
//     },
//     {
//       title: "Total Visits",
//       ratio: "70 / 100",
//       gradient: "bg-gradient-to-br from-pink-400 to-rose-500",
//     },
//     {
//       title: "Total Stock",
//       ratio: "70 / 100",
//       gradient: "bg-gradient-to-br from-yellow-300 to-orange-400",
//     },
//     {
//       title: "Total Value",
//       ratio: "70 / 100",
//       gradient: "bg-gradient-to-br from-cyan-400 to-teal-500",
//     },
//   ];

//   return (
//     <div className="p-8 bg-gray-50 min-h-screen font-sans">
//       {/* Header Section */}
//       <div className="flex justify-between items-start mb-12">
//         <div>
//           <h1 className="text-4xl font-bold text-indigo-900">Default</h1>
//           <p className="text-indigo-800 tracking-[0.2em] text-xs font-bold mt-1 uppercase">
//             Admin Panel
//           </p>
//         </div>

//         {/* Breadcrumbs */}
//         <nav className="flex items-center space-x-2 text-sm text-gray-500 bg-white px-4 py-2 rounded-full shadow-sm">
//           <Home size={16} className="text-purple-500" />
//           <span className="text-gray-300">/</span>
//           <span className="text-purple-600 font-medium">Dashboard</span>
//           <span className="text-gray-300">/</span>
//           <span className="text-gray-400">Default</span>
//         </nav>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
//         {stats.map((stat, index) => (
//           <StatCard key={index} {...stat} />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default TestDashboard;
