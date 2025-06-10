import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon, AcademicCapIcon, EnvelopeIcon, UserIcon } from '@heroicons/react/24/outline';

function ViewStudent() {
  const navigate = useNavigate();
  const { id } = useParams(); // You can fetch real data using this

  // Mock student data
  const student = {
    id,
    name: "Alice Johnson",
    email: "alice@example.com",
    branch: "CSE",
    year: "1st",
    batch: "2025-2029",
    status: "Active",
    gpa: 3.8,
    profilePic: `https://ui-avatars.com/api/?name=Alice+Johnson&background=random&rounded=true`,
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-600 hover:underline"
      >
        <ArrowLeftIcon className="h-5 w-5 mr-1" />
        Back to Student List
      </button>

      {/* Profile Card */}
      <div className="bg-white shadow-xl rounded-lg p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <img
          src={student.profilePic}
          alt={student.name}
          className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
        />
        <div className="flex-1 space-y-2">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <UserIcon className="w-6 h-6 text-blue-500" />
            {student.name}
          </h1>
          <p className="text-gray-600 flex items-center gap-2">
            <EnvelopeIcon className="w-5 h-5 text-gray-400" />
            {student.email}
          </p>
          {/* <h1 className="text-3xl font-bold text-gray-800">👤 {student.name}</h1>
            <p className="text-gray-600">📧 {student.email}</p> */}

          <span className={`inline-block px-3 py-1 text-sm rounded-full font-medium ${student.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {student.status}
          </span>
        </div>
      </div>

      {/* Student Details */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold text-blue-800 mb-4">📋 Academic Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-sm text-gray-700">
          <div>
            <p className="font-semibold text-gray-500">Branch</p>
            <p>{student.branch}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-500">Year</p>
            <p>{student.year}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-500">Batch</p>
            <p>{student.batch}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-500">GPA</p>
            <p>{student.gpa}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-500">Student ID</p>
            <p>#{student.id}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewStudent;
