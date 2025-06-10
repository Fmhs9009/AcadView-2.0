import { NavLink } from 'react-router-dom';
import React from 'react'

function StudentNavbar({handleLogout}) {
  return (
    <nav className="bg-blue-800 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-bold">College Portal</h1>
      <ul className="flex space-x-6">
        <li>
          <NavLink to="/" className={({isActive})=>`${isActive ? "text-emerald-400" : "text-white"}`}>Dashboard</NavLink>
        </li>
        <li>
          <NavLink to="/courses" className={({isActive})=>`${isActive ? "text-emerald-400" : "text-white"}`}>Courses</NavLink>
        </li>
        <li>
          <NavLink to="/results" className={({isActive})=>`${isActive ? "text-emerald-400" : "text-white"}`}>Results</NavLink>
        </li>
        <li>
          <NavLink to="/profile" className={({isActive})=>`${isActive ? "text-emerald-400" : "text-white"}`}>Profile</NavLink>
        </li>
        {/* <li>
          <NavLink to="/logout" className={({isActive})=>`${isActive ? "text-emerald-400" : "text-white"}`}>Profile</NavLink>
        </li> */}
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
  )
}

export default StudentNavbar    