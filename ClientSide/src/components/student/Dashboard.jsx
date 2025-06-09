import React from 'react';

function Dashboard() {
  const student = {
    name: "John Doe",
    courses: 5,
    gpa: 3.7,
    attendance: 92,
    recentGrades: [
      { subject: "Mathematics", grade: "A" },
      { subject: "Computer Science", grade: "A-" },
      { subject: "English", grade: "B+" },
    ],
    upcoming: [
      { event: "Data Structures Assignment", due: "June 10, 2025" },
      { event: "Midterm Exam - Physics", due: "June 15, 2025" },
    ],
    notifications: [
      "New grade posted in English Literature.",
      "Library book due tomorrow.",
      "Semester registration ends June 20.",
    ],
  };

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div className="max-w-7xl mx-auto mt-10 px-4 space-y-10">
      {/* Greeting */}
      <div>
        <h1 className="text-3xl font-bold text-blue-800">Welcome, {student.name} 👋</h1>
        <p className="text-gray-600 text-sm mt-1">{today}</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-blue-500">
          <h2 className="text-gray-600 text-sm">Total Courses</h2>
          <p className="text-2xl font-semibold text-blue-700">{student.courses}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-green-500">
          <h2 className="text-gray-600 text-sm">GPA</h2>
          <p className="text-2xl font-semibold text-green-700">{student.gpa}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-yellow-500">
          <h2 className="text-gray-600 text-sm">Attendance</h2>
          <div className="text-2xl font-semibold text-yellow-600">{student.attendance}%</div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: `${student.attendance}%` }}></div>
          </div>
        </div>
      </div>

      {/* Quick Access Shortcuts */}
      <div>
        <h2 className="text-xl font-bold text-blue-800 mb-3">🚀 Quick Access</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded shadow hover:shadow-md transition">
            <p className="font-semibold text-blue-700">Update Profile</p>
            <p className="text-sm text-gray-600">Keep your contact info up-to-date.</p>
          </div>
          <div className="bg-white p-4 rounded shadow hover:shadow-md transition">
            <p className="font-semibold text-green-700">Course Materials</p>
            <p className="text-sm text-gray-600">Download lectures and resources.</p>
          </div>
          <div className="bg-white p-4 rounded shadow hover:shadow-md transition">
            <p className="font-semibold text-purple-700">Student Support</p>
            <p className="text-sm text-gray-600">Need help? Reach out to support.</p>
          </div>
        </div>
      </div>

      {/* Notifications Panel */}
      <div>
        <h2 className="text-xl font-bold text-blue-800 mb-3">🔔 Notifications</h2>
        <ul className="space-y-2">
          {student.notifications.map((note, idx) => (
            <li key={idx} className="bg-white p-3 rounded-lg shadow-sm border-l-4 border-indigo-500 text-sm text-gray-700">
              {note}
            </li>
          ))}
        </ul>
      </div>

      {/* Recent Grades */}
      <div>
        <h2 className="text-xl font-bold text-blue-800 mb-3">📊 Recent Grades</h2>
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2">Subject</th>
                <th className="px-4 py-2">Grade</th>
              </tr>
            </thead>
            <tbody>
              {student.recentGrades.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-2">{item.subject}</td>
                  <td className="px-4 py-2 font-medium">{item.grade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upcoming Events */}
      <div>
        <h2 className="text-xl font-bold text-blue-800 mb-3">📅 Upcoming Deadlines</h2>
        <ul className="space-y-2">
          {student.upcoming.map((item, index) => (
            <li key={index} className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-red-400">
              <p className="font-semibold text-gray-800">{item.event}</p>
              <p className="text-sm text-gray-500">Due: {item.due}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;
