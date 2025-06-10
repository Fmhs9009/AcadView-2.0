import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Courses() {
  const navigate = useNavigate();

  const semesterData = {
    'Semester 1': [
      {
        code: 'CS101',
        name: 'Introduction to Computer Science',
        instructor: 'Dr. Ayesha Khan',
        status: 'Ongoing',
        progress: 80,
      },
      {
        code: 'MATH101',
        name: 'Calculus I',
        instructor: 'Prof. Ramesh Mehta',
        status: 'Completed',
        progress: 100,
      },
    ],
    'Semester 2': [
      {
        code: 'CS102',
        name: 'Data Structures',
        instructor: 'Dr. Sameer Ali',
        status: 'Ongoing',
        progress: 65,
      },
      {
        code: 'ENG102',
        name: 'Communication Skills',
        instructor: 'Ms. Priya Sharma',
        status: 'Completed',
        progress: 100,
      },
    ],
    'Semester 3': [
      {
        code: 'CS201',
        name: 'Algorithms',
        instructor: 'Dr. Farhan Qureshi',
        status: 'Ongoing',
        progress: 75,
      },
      {
        code: 'PHY201',
        name: 'Digital Electronics',
        instructor: 'Dr. Meenakshi Rao',
        status: 'Ongoing',
        progress: 60,
      },
    ],
  };

  const [selectedSemester, setSelectedSemester] = useState('Semester 1');

  const handleSemesterChange = (e) => {
    setSelectedSemester(e.target.value);
  };

  const handleViewDetails = (subjectCode) => {
    navigate(`/courses/${subjectCode}`);
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">📘 Your Courses</h1>

      {/* Semester Selector */}
      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-gray-700">Select Semester:</label>
        <select
          value={selectedSemester}
          onChange={handleSemesterChange}
          className="border border-gray-300 rounded px-4 py-2 w-full sm:w-1/2"
        >
          {Object.keys(semesterData).map((semester) => (
            <option key={semester} value={semester}>
              {semester}
            </option>
          ))}
        </select>
      </div>

      {/* Subject Cards */}
      <div className="grid gap-6">
        {semesterData[selectedSemester].map((course, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
            <div className="flex justify-between items-center mb-2">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">{course.name}</h2>
                <p className="text-sm text-gray-600">
                  Course Code: {course.code} • Instructor: {course.instructor}
                </p>
              </div>
              {/* <span
                className={`px-3 py-1 text-sm font-medium rounded-full ${
                  course.status === 'Ongoing'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {course.status}
              </span> */}
            </div>

            {/* Progress bar */}
            {/* <div className="mt-2 mb-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-500 h-2.5 rounded-full"
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Progress: {course.progress}%</p>
            </div> */}

            {/* View Details Button */}
            <button
              onClick={() => handleViewDetails(course.code)}
              className="inline-block text-sm text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Courses;
