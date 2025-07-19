import { NavLink } from 'react-router-dom';
import React from 'react'

function HODNavbar({ handleLogout }) {
  return (
    <nav className="bg-blue-800 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-bold">College Portal</h1>
      <ul className="flex space-x-6">
        <li>
          <NavLink to="/hod/dashboard" className={({isActive})=>`${isActive ? "text-emerald-400" : "text-white"}`}>Dashboard</NavLink>
        </li>
        <li>
          <NavLink to="/hod/approvals" className={({isActive})=>`${isActive ? "text-emerald-400" : "text-white"}`}>Approvals</NavLink>
        </li>
        <li>
          <NavLink to="/hod/students" className={({isActive})=>`${isActive ? "text-emerald-400" : "text-white"}`}>Students</NavLink>
        </li>
        <li>
          <NavLink to="/hod/faculty" className={({isActive})=>`${isActive ? "text-emerald-400" : "text-white"}`}>Faculty</NavLink>
        </li>
        <li>
          <NavLink to="/hod/notifications" className={({isActive})=>`${isActive ? "text-emerald-400" : "text-white"}`}>Notifications</NavLink>
        </li>
        <li>
          <NavLink to="/hod/profile" className={({isActive})=>`${isActive ? "text-emerald-400" : "text-white"}`}>Profile</NavLink>
        </li>
        <li>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded text-sm"
          >
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default HODNavbar;