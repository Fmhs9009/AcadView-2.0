import React from 'react';
import { useNavigate } from 'react-router-dom';

function HODDashboard() {
  const navigate = useNavigate();
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  // Static data (replace with dynamic data later)
  const hod = {
    name: 'Dr. Rajesh Kumar',
    department: 'Computer Science',
    pendingApprovals: 5,
    notifications: [
      'Faculty meeting scheduled for June 15 at 2:00 PM.',
      'New curriculum proposal needs review by June 20.',
      'Budget allocation for next semester due by end of month.'
    ],
    facultyMembers: [
      { id: 1, name: 'Dr. Priya Sharma', subject: 'Data Structures', students: 60 },
      { id: 2, name: 'Prof. Amit Verma', subject: 'Algorithms', students: 55 },
      { id: 3, name: 'Dr. Neha Gupta', subject: 'Database Systems', students: 50 },
    ],
    departmentStats: {
      students: 120,
      faculty: 15,
      subjects: 25,
      events: ['Guest Lecture', 'Workshop', 'Hackathon']
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-10 px-4 space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-blue-800">Welcome, {hod.name} 👨‍🏫</h1>
        <p className="text-gray-600 text-sm mt-1">{today}</p>
        <p className="text-gray-700">Department of {hod.department}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-blue-500">
          <h2 className="text-gray-600 text-sm">Total Students</h2>
          <p className="text-2xl font-semibold text-blue-700">{hod.departmentStats.students}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-green-500">
          <h2 className="text-gray-600 text-sm">Faculty Members</h2>
          <p className="text-2xl font-semibold text-green-700">{hod.departmentStats.faculty}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-yellow-500">
          <h2 className="text-gray-600 text-sm">Pending Approvals</h2>
          <p className="text-2xl font-semibold text-yellow-600">{hod.pendingApprovals}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-purple-500">
          <h2 className="text-gray-600 text-sm">Subjects Offered</h2>
          <p className="text-2xl font-semibold text-purple-700">{hod.departmentStats.subjects}</p>
        </div>
      </div>

      {/* Quick Access */}
      <div>
        <h2 className="text-xl font-bold text-blue-800 mb-3">🚀 Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <button onClick={() => navigate('/hod/approvals')} className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500 shadow hover:shadow-md transition cursor-pointer w-full">
            <p className="font-semibold text-blue-700">Approvals</p>
            <p className="text-sm text-gray-600">Review and manage pending approvals.</p>
          </button>
          <button onClick={() => navigate('/hod/students')} className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500 shadow hover:shadow-md transition cursor-pointer w-full">
            <p className="font-semibold text-green-700">Students</p>
            <p className="text-sm text-gray-600">Manage student records and performance.</p>
          </button>
          <button onClick={() => navigate('/hod/faculty')} className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500 shadow hover:shadow-md transition cursor-pointer w-full">
            <p className="font-semibold text-yellow-700">Faculty</p>
            <p className="text-sm text-gray-600">Manage faculty assignments and records.</p>
          </button>
          <button onClick={() => navigate('/hod/notifications')} className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500 shadow hover:shadow-md transition cursor-pointer w-full">
            <p className="font-semibold text-purple-700">Notifications</p>
            <p className="text-sm text-gray-600">Send announcements and notifications.</p>
          </button>
        </div>
      </div>

      {/* Faculty Table */}
      <div>
        <h2 className="text-xl font-bold text-blue-800 mb-3">👩‍🏫 Faculty Members</h2>
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Subject</th>
                <th className="px-4 py-2">Students</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {hod.facultyMembers.map((faculty) => (
                <tr key={faculty.id} className="border-b">
                  <td className="px-4 py-2">{faculty.name}</td>
                  <td className="px-4 py-2">{faculty.subject}</td>
                  <td className="px-4 py-2">{faculty.students}</td>
                  <td className="px-4 py-2 space-x-2">
                    <button className="bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 text-xs">View</button>
                    <button className="bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200 text-xs">Edit</button>
                    <button className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded hover:bg-yellow-200 text-xs">Schedule</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Department Summary & Notifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Department Summary */}
        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-blue-500">
          <h2 className="text-lg font-bold text-blue-700 mb-2">Department Summary</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• {hod.departmentStats.students} students enrolled</li>
            <li>• {hod.departmentStats.faculty} faculty members</li>
            <li>• {hod.departmentStats.subjects} subjects offered</li>
            <li>• Recent events: {hod.departmentStats.events.join(', ')}</li>
          </ul>
        </div>
        
        {/* Notifications */}
        <div>
          <h2 className="text-lg font-bold text-blue-700 mb-2">🔔 Notifications</h2>
          <ul className="space-y-2">
            {hod.notifications.map((note, idx) => (
              <li key={idx} className="bg-white p-3 rounded-lg shadow-sm border-l-4 border-indigo-500 text-sm text-gray-700">
                {note}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default HODDashboard;