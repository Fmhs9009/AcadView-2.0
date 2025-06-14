import React from 'react';

function Attendance() {
  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-green-800 mb-4">Your Attendance</h2>
      <div className="text-5xl font-bold text-green-700 mb-4">96%</div>
      <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
        <div className="bg-green-500 h-3 rounded-full" style={{ width: '96%' }}></div>
      </div>
      <p className="text-gray-600">This is a placeholder. Connect to backend for real attendance data.</p>
    </div>
  );
}

export default Attendance; 