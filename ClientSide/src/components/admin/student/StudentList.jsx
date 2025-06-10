import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

function StudentList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    year: '',
    branch: '',
    batch: '',
    status: '',
  });

  const students = [
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice@example.com",
      course: "CSE",
      gpa: 3.8,
      year: "1st",
      branch: "CSE",
      batch: "2025-2029",
      status: "Active"
    },
    {
      id: 2,
      name: "Bob Smith",
      email: "bob@example.com",
      course: "ECE",
      gpa: 3.6,
      year: "2nd",
      branch: "ECE",
      batch: "2024-2028",
      status: "Inactive"
    },
    {
      id: 3,
      name: "Carol White",
      email: "carol@example.com",
      course: "ME",
      gpa: 3.4,
      year: "3rd",
      branch: "ME",
      batch: "2023-2027",
      status: "Active"
    },
    {
      id: 4,
      name: "David Brown",
      email: "david@example.com",
      course: "CSE",
      gpa: 3.9,
      year: "4th",
      branch: "CSE",
      batch: "2022-2026",
      status: "Active"
    },
  ];

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filteredStudents = students.filter((student) => {
    return (
      (student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.course.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filters.year === '' || student.year === filters.year) &&
      (filters.branch === '' || student.branch === filters.branch) &&
      (filters.batch === '' || student.batch === filters.batch) &&
      (filters.status === '' || student.status === filters.status)
    );
  });

  const navigate = useNavigate();
  return (
    <div className="max-w-7xl mx-auto px-4 mt-10 space-y-6">
      <h1 className="text-3xl font-bold text-blue-800">🎓 Students</h1>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <input
          type="text"
          placeholder="Search by name, email, or course..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="col-span-2 px-4 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          name="year"
          value={filters.year}
          onChange={handleFilterChange}
          className="px-4 py-2 border border-gray-300 rounded shadow-sm"
        >
          <option value="">All Years</option>
          <option value="1st">1st Year</option>
          <option value="2nd">2nd Year</option>
          <option value="3rd">3rd Year</option>
          <option value="4th">4th Year</option>
        </select>

        <select
          name="branch"
          value={filters.branch}
          onChange={handleFilterChange}
          className="px-4 py-2 border border-gray-300 rounded shadow-sm"
        >
          <option value="">All Branches</option>
          <option value="CSE">CSE</option>
          <option value="ECE">ECE</option>
          <option value="ME">ME</option>
          <option value="CE">CE</option>
        </select>

        <select
          name="batch"
          value={filters.batch}
          onChange={handleFilterChange}
          className="px-4 py-2 border border-gray-300 rounded shadow-sm"
        >
          <option value="">All Batches</option>
          <option value="2025-2029">2025-2029</option>
          <option value="2024-2028">2024-2028</option>
          <option value="2023-2027">2023-2027</option>
          <option value="2022-2026">2022-2026</option>
        </select>

        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          className="px-4 py-2 border border-gray-300 rounded shadow-sm"
        >
          <option value="">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {/* Students Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
          <thead className="bg-gray-100 text-gray-700 text-sm">
            <tr>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Branch</th>
              <th className="px-6 py-3 text-left">Year</th>
              <th className="px-6 py-3 text-left">Batch</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">GPA</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <tr key={student.id} className="border-b text-sm">
                  <td className="px-6 py-3 font-medium text-gray-800">{student.name}</td>
                  <td className="px-6 py-3 text-gray-600">{student.email}</td>
                  <td className="px-6 py-3 text-gray-600">{student.branch}</td>
                  <td className="px-6 py-3 text-gray-600">{student.year}</td>
                  <td className="px-6 py-3 text-gray-600">{student.batch}</td>
                  <td className="px-6 py-3 text-gray-600">{student.status}</td>
                  <td className="px-6 py-3 text-gray-600">{student.gpa}</td>
                  <td className="px-6 py-3 space-x-2">
                    <button onClick={() => navigate(`/students/view/${student.id}`)} className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">View</button>
                    <button onClick={() => navigate(`/students/edit/${student.id}`)} className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600">Edit</button>
                    <button className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-6 text-gray-500">No students match the criteria.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StudentList;
