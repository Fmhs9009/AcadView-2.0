import React from 'react';
import { useNavigate } from 'react-router-dom';

function FacultyDashboard() {
  const navigate = useNavigate();
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  // Static data (replace with dynamic data later)
  const faculty = {
    name: 'Dr. Priya Sharma',
    attendance: 96,
    timetable: [
      { day: 'Monday', slots: ['9:00-10:00 CSE101', '11:00-12:00 MAT201'] },
      { day: 'Tuesday', slots: ['10:00-11:00 CSE101', '2:00-3:00 CSE202'] },
      { day: 'Wednesday', slots: ['9:00-10:00 CSE101', '1:00-2:00 CSE202'] },
      { day: 'Thursday', slots: ['11:00-12:00 MAT201', '3:00-4:00 CSE202'] },
      { day: 'Friday', slots: ['10:00-11:00 CSE101', '2:00-3:00 CSE202'] },
    ],
    notifications: [
      'Assignment 2 deadline extended for CSE101.',
      'Faculty meeting on June 12 at 3:00 PM.',
      'New study material uploaded for MAT201.'
    ],
    courses: [
      { code: 'CSE101', name: 'Data Structures', students: 60 },
      { code: 'MAT201', name: 'Discrete Mathematics', students: 45 },
      { code: 'CSE202', name: 'Algorithms', students: 50 },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto mt-10 px-4 space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-blue-800">Welcome, {faculty.name} 👩‍🏫</h1>
        <p className="text-gray-600 text-sm mt-1">{today}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-blue-500">
          <h2 className="text-gray-600 text-sm">Courses Taught</h2>
          <p className="text-2xl font-semibold text-blue-700">{faculty.courses.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-green-500">
          <h2 className="text-gray-600 text-sm">Total Students</h2>
          <p className="text-2xl font-semibold text-green-700">{faculty.courses.reduce((acc, c) => acc + c.students, 0)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-yellow-500">
          <h2 className="text-gray-600 text-sm">Attendance</h2>
          <div className="text-2xl font-semibold text-yellow-600">{faculty.attendance}%</div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: `${faculty.attendance}%` }}></div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-purple-500">
          <h2 className="text-gray-600 text-sm">Upcoming Events</h2>
          <p className="text-2xl font-semibold text-purple-700">2</p>
        </div>
      </div>

      {/* Quick Access */}
      <div>
        <h2 className="text-xl font-bold text-blue-800 mb-3">🚀 Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <button onClick={() => navigate('/faculty/upload-marks')} className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500 shadow hover:shadow-md transition cursor-pointer w-full">
            <p className="font-semibold text-blue-700">Upload Marks</p>
            <p className="text-sm text-gray-600">Enter or upload student marks for your courses.</p>
          </button>
          <button onClick={() => navigate('/faculty/upload-attendance')} className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500 shadow hover:shadow-md transition cursor-pointer w-full">
            <p className="font-semibold text-green-700">Upload Attendance</p>
            <p className="text-sm text-gray-600">Mark or upload attendance records.</p>
          </button>
          <button onClick={() => navigate('/faculty/upload-material')} className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500 shadow hover:shadow-md transition cursor-pointer w-full">
            <p className="font-semibold text-yellow-700">Upload Study Material</p>
            <p className="text-sm text-gray-600">Share notes, slides, and resources.</p>
          </button>
          <button onClick={() => navigate('/faculty/upload-assignment')} className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500 shadow hover:shadow-md transition cursor-pointer w-full">
            <p className="font-semibold text-purple-700">Upload Assignment</p>
            <p className="text-sm text-gray-600">Create and upload new assignments.</p>
          </button>
        </div>
      </div>

      {/* Courses Table */}
      <div>
        <h2 className="text-xl font-bold text-blue-800 mb-3">📚 Courses Taught</h2>
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2">Course Code</th>
                <th className="px-4 py-2">Course Name</th>
                <th className="px-4 py-2">Students</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {faculty.courses.map((course, idx) => (
                <tr key={idx} className="border-b">
                  <td className="px-4 py-2">{course.code}</td>
                  <td className="px-4 py-2">{course.name}</td>
                  <td className="px-4 py-2">{course.students}</td>
                  <td className="px-4 py-2 space-x-2">
                    <button onClick={() => navigate('/faculty/upload-marks')} className="bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 text-xs">Marks</button>
                    <button onClick={() => navigate('/faculty/upload-attendance')} className="bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200 text-xs">Attendance</button>
                    <button onClick={() => navigate('/faculty/upload-material')} className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded hover:bg-yellow-200 text-xs">Material</button>
                    <button onClick={() => navigate('/faculty/upload-assignment')} className="bg-purple-100 text-purple-700 px-3 py-1 rounded hover:bg-purple-200 text-xs">Assignment</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Notifications */}
      <div>
        <h2 className="text-xl font-bold text-blue-800 mb-3">🔔 Notifications</h2>
        <ul className="space-y-2">
          {faculty.notifications.map((note, idx) => (
            <li key={idx} className="bg-white p-3 rounded-lg shadow-sm border-l-4 border-indigo-500 text-sm text-gray-700">
              {note}
            </li>
          ))}
        </ul>
      </div>

      {/* Faculty Attendance & Timetable */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Attendance */}
        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-green-500">
          <h2 className="text-lg font-bold text-green-700 mb-2">Your Attendance</h2>
          <div className="text-3xl font-semibold text-green-700">{faculty.attendance}%</div>
          <div className="w-full bg-gray-200 rounded-full h-3 mt-2 mb-4">
            <div className="bg-green-500 h-3 rounded-full" style={{ width: `${faculty.attendance}%` }}></div>
          </div>
          <p className="text-gray-600 text-sm">Keep your attendance above 90% for eligibility.</p>
        </div>
        {/* Timetable */}
        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-blue-500">
          <h2 className="text-lg font-bold text-blue-700 mb-2">Your Timetable</h2>
          <table className="w-full text-left">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2">Day</th>
                <th className="px-4 py-2">Slots</th>
              </tr>
            </thead>
            <tbody>
              {faculty.timetable.map((row, idx) => (
                <tr key={idx} className="border-b">
                  <td className="px-4 py-2 font-semibold">{row.day}</td>
                  <td className="px-4 py-2">
                    <ul className="list-disc ml-4">
                      {row.slots.map((slot, i) => (
                        <li key={i}>{slot}</li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default FacultyDashboard; 