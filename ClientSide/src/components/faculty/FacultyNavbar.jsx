import { NavLink } from 'react-router-dom';
import React from 'react'

function FacultyNavbar({handleLogout}) {
  return (
    <nav className="bg-blue-800 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-bold">College Portal</h1>
      <ul className="flex space-x-6">
        <li>
          <NavLink to="/" className={({isActive})=>`${isActive ? "text-emerald-400" : "text-white"}`}>Dashboard</NavLink>
        </li>
        <li>
          <NavLink to="/faculty/upload-marks" className={({isActive})=>`${isActive ? "text-emerald-400" : "text-white"}`}>Upload Marks</NavLink>
        </li>
        <li>
          <NavLink to="/faculty/upload-attendance" className={({isActive})=>`${isActive ? "text-emerald-400" : "text-white"}`}>Upload Attendance</NavLink>
        </li>
        <li>
          <NavLink to="/faculty/upload-material" className={({isActive})=>`${isActive ? "text-emerald-400" : "text-white"}`}>Upload Study Material</NavLink>
        </li>
        <li>
          <NavLink to="/faculty/upload-assignment" className={({isActive})=>`${isActive ? "text-emerald-400" : "text-white"}`}>Upload Assignment</NavLink>
        </li>
        <li>
          <NavLink to="/faculty/upload-timetable" className={({isActive})=>`${isActive ? "text-emerald-400" : "text-white"}`}>Upload Timetable</NavLink>
        </li>
        <li>
          <NavLink to="/faculty/attendance" className={({isActive})=>`${isActive ? "text-emerald-400" : "text-white"}`}>Attendance</NavLink>
        </li>
        <li>
          <NavLink to="/faculty/timetable" className={({isActive})=>`${isActive ? "text-emerald-400" : "text-white"}`}>Timetable</NavLink>
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
  )
}

export default FacultyNavbar