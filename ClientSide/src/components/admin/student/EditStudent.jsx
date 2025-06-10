import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function EditStudent() {
  const navigate = useNavigate();

  // Initial mock student data (replace with real fetched data)
  const [student, setStudent] = useState({
    name: "Alice Johnson",
    email: "alice@example.com",
    branch: "CSE",
    year: "1st",
    batch: "2025-2029",
    status: "Active",
    gpa: 3.8,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Send updated student to backend
    console.log("Updated Student:", student);
    alert("Student updated successfully!");
    navigate("/students");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 mt-10">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">✏️ Edit Student</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-6 space-y-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600">Full Name</label>
            <input
              type="text"
              name="name"
              value={student.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              value={student.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Branch</label>
            <select
              name="branch"
              value={student.branch}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded"
            >
              <option value="">Select Branch</option>
              <option value="CSE">CSE</option>
              <option value="ECE">ECE</option>
              <option value="ME">ME</option>
              <option value="CE">CE</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600">Year</label>
            <select
              name="year"
              value={student.year}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded"
            >
              <option value="">Select Year</option>
              <option value="1st">1st Year</option>
              <option value="2nd">2nd Year</option>
              <option value="3rd">3rd Year</option>
              <option value="4th">4th Year</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600">Batch</label>
            <select
              name="batch"
              value={student.batch}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded"
            >
              <option value="">Select Batch</option>
              <option value="2025-2029">2025–2029</option>
              <option value="2024-2028">2024–2028</option>
              <option value="2023-2027">2023–2027</option>
              <option value="2022-2026">2022–2026</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600">Status</label>
            <select
              name="status"
              value={student.status}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded"
            >
              <option value="">Select Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600">GPA</label>
            <input
              type="number"
              name="gpa"
              value={student.gpa}
              onChange={handleChange}
              min="0"
              max="4"
              step="0.1"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate('/students')}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditStudent;
