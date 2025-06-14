import React from 'react';

function AdminDashboard() {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const stats = [
    { label: 'Total Students', value: 512, color: 'blue' },
    { label: 'Faculties', value: 42, color: 'green' },
    { label: 'Courses', value: 28, color: 'yellow' },
    { label: 'Active Notices', value: 6, color: 'red' },
  ];

  const quickAccess = [
    { label: 'Manage Students', description: 'Add, edit or remove students', color: 'blue', path: '/students' },
    { label: 'Manage Faculties', description: 'Faculty directory and profiles', color: 'green', path: '/faculties' },
    { label: 'Post Notice', description: 'Create a new campus-wide announcement', color: 'purple', path: '/notices' },
  ];

  const notifications = [
    "System maintenance scheduled for June 15.",
    "New faculty added: Dr. Sneha Sharma (Math Dept).",
    "10 new students registered for CSE.",
  ];

  return (
    <div className="max-w-7xl mx-auto mt-10 px-4 space-y-10">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-blue-800">Welcome, Admin 👨‍💼</h1>
        <p className="text-gray-600 text-sm mt-1">{today}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className={`bg-white p-6 rounded-lg shadow-md border-t-4 border-${stat.color}-500`}
          >
            <h2 className="text-gray-600 text-sm">{stat.label}</h2>
            <p className={`text-2xl font-semibold text-${stat.color}-700`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Access */}
      <div>
        <h2 className="text-xl font-bold text-blue-800 mb-3">🚀 Quick Access</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {quickAccess.map((item, idx) => (
            <a
              href={item.path}
              key={idx}
              className={`bg-${item.color}-50 p-4 rounded-lg border-l-4 border-${item.color}-500 shadow hover:shadow-md transition cursor-pointer`}
            >
              <p className={`font-semibold text-${item.color}-700`}>{item.label}</p>
              <p className="text-sm text-gray-600">{item.description}</p>
            </a>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div>
        <h2 className="text-xl font-bold text-blue-800 mb-3">🔔 Recent Activity</h2>
        <ul className="space-y-2">
          {notifications.map((note, idx) => (
            <li
              key={idx}
              className="bg-white p-3 rounded-lg shadow-sm border-l-4 border-indigo-500 text-sm text-gray-700"
            >
              {note}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AdminDashboard;
