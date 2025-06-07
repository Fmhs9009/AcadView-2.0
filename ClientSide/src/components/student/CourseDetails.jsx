import React from 'react';
import { useParams, Link } from 'react-router-dom';

// Mock data per subject
const subjectDetails = {
  CS101: {
    name: "Introduction to Computer Science",
    assignments: ["Assignment 1", "Assignment 2"],
    attendance: "95%",
    marks: "A",
  },
  MATH101: {
    name: "Calculus I",
    assignments: ["Limits Practice", "Differentiation HW"],
    attendance: "89%",
    marks: "B+",
  },
  CS102: {
    name: "Data Structures",
    assignments: ["Linked List Project", "Trees Quiz"],
    attendance: "92%",
    marks: "A-",
  },
  // Add more as needed...
};

function CourseDetails() {
  const { subjectCode } = useParams();
  const data = subjectDetails[subjectCode];

  if (!data) {
    return <p className="text-center text-red-500 mt-10">Subject not found.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold text-blue-800 mb-4">{data.name} ({subjectCode})</h1>

      <div className="bg-white shadow rounded p-6 space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-800">📝 Assignments</h2>
          <ul className="list-disc pl-5 text-gray-700">
            {data.assignments.map((a, index) => (
              <li key={index}>{a}</li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-800">📊 Attendance</h2>
          <p className="text-gray-700">{data.attendance}</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-800">📈 Final Grade</h2>
          <p className="text-gray-700 text-lg font-bold">{data.marks}</p>
        </div>

        <Link
          to="/courses"
          className="inline-block mt-4 text-sm text-blue-600 hover:underline"
        >
          ← Back to Courses
        </Link>
      </div>
    </div>
  );
}

export default CourseDetails;
