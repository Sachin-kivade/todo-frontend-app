import React from "react";
import Login from "../pages/Login";
const Navbar = ({ dark, setDark, handleLogout }) => {
  return (
    <nav className="w-full px-6 py-3 flex justify-between items-center 
    bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border-b border-white/30 shadow-md">

      {/* 🔥 LEFT: LOGO + APP NAME */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg items-center justify-center">
         <img src="/icon.png" alt="logo" className="w-full h-full object-cover" />
        </div>
        <h1 className="text-lg font-bold text-gray-200 dark:text-gray-200">
          Todo Pro
        </h1>
      </div>

      {/* 🔥 RIGHT: USER + ACTIONS */}
      <div className="flex items-center gap-4">

        {/* 👤 USER NAME */}
        <div className="flex items-center gap-3">
        <span>Hello,User 👋</span>

        {/* 🌙 DARK MODE */}
        <button
          onClick={() => setDark(!dark)}
          className="px-3 py-1 rounded-lg bg-gray-200 dark:bg-gray-700 hover:scale-105 transition"
        >
          {dark ? "☀️" : "🌙"}
        </button>

        {/* 🔴 LOGOUT */}
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg text-sm transition"
        >
          Logout
        </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;