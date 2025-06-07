import React, { useState } from 'react';

const resultData = [
  {
    semester: 'Semester 1',
    gpa: 8.2,
    subjects: [
      { code: 'CS101', name: 'Intro to CS', credits: 4, marks: 85, grade: 'A' },
      { code: 'MATH101', name: 'Calculus I', credits: 3, marks: 78, grade: 'B+' },
      { code: 'ENG101', name: 'English', credits: 2, marks: 91, grade: 'A+' },
    ],
  },
  {
    semester: 'Semester 2',
    gpa: 8.7,
    subjects: [
      { code: 'CS102', name: 'Data Structures', credits: 4, marks: 88, grade: 'A' },
      { code: 'PHY101', name: 'Physics', credits: 3, marks: 74, grade: 'B' },
      { code: 'ENG102', name: 'Communication', credits: 2, marks: 90, grade: 'A+' },
    ],
  },
];

function Result() {
  const [expanded, setExpanded] = useState(null);

  const toggleSemester = (index) => {
    setExpanded(expanded === index ? null : index);
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">📄 Academic Results</h1>

      {resultData.map((sem, index) => (
        <div key={index} className="mb-6 bg-white rounded shadow border-l-4 border-blue-500">
          <div
            className="cursor-pointer px-6 py-4 flex justify-between items-center bg-blue-50 hover:bg-blue-100 transition"
            onClick={() => toggleSemester(index)}
          >
            <div>
              <h2 className="text-lg font-semibold text-blue-800">{sem.semester}</h2>
              <p className="text-sm text-gray-600">GPA: {sem.gpa}</p>
            </div>
            <span className="text-gray-500 text-xl">{expanded === index ? '−' : '+'}</span>
          </div>

          {expanded === index && (
            <div className="p-6">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-100 text-sm text-gray-700">
                  <tr>
                    <th className="py-2 px-3 border-b">Code</th>
                    <th className="py-2 px-3 border-b">Subject</th>
                    <th className="py-2 px-3 border-b">Credits</th>
                    <th className="py-2 px-3 border-b">Marks</th>
                    <th className="py-2 px-3 border-b">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {sem.subjects.map((subj, subIndex) => (
                    <tr key={subIndex} className="text-sm text-gray-800 border-b hover:bg-gray-50">
                      <td className="py-2 px-3">{subj.code}</td>
                      <td className="py-2 px-3">{subj.name}</td>
                      <td className="py-2 px-3">{subj.credits}</td>
                      <td className="py-2 px-3">{subj.marks}</td>
                      <td className="py-2 px-3 font-medium">{subj.grade}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-4 text-right text-sm text-gray-600 font-medium">
                Semester GPA: <span className="text-blue-800 font-bold">{sem.gpa}</span>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default Result;
