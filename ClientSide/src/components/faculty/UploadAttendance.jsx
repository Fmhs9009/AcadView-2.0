import React, { useState } from 'react';

function UploadAttendance() {
  // Static data for demo
  const courses = [
    { code: 'CSE101', name: 'Data Structures' },
    { code: 'MAT201', name: 'Discrete Mathematics' },
    { code: 'CSE202', name: 'Algorithms' },
  ];
  const branches = ['CSE', 'ECE', 'ME', 'CE'];
  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];
  const students = [
    { roll: 'CSE001', name: 'Aman Kumar' },
    { roll: 'CSE002', name: 'Priya Singh' },
    { roll: 'CSE003', name: 'Rahul Verma' },
  ];
  const [selectedCourse, setSelectedCourse] = useState('CSE101');
  const [selectedBranch, setSelectedBranch] = useState('CSE');
  const [selectedSemester, setSelectedSemester] = useState(1);
  const [attendance, setAttendance] = useState({});

  const handleAttendanceChange = (roll, value) => {
    setAttendance({ ...attendance, [roll]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Attendance submitted! (Demo)');
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-green-800 mb-4">Upload Attendance</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-gray-700 mb-1">Course</label>
            <select value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)} className="w-full border rounded px-2 py-1">
              {courses.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Branch</label>
            <select value={selectedBranch} onChange={e => setSelectedBranch(e.target.value)} className="w-full border rounded px-2 py-1">
              {branches.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Semester</label>
            <select value={selectedSemester} onChange={e => setSelectedSemester(Number(e.target.value))} className="w-full border rounded px-2 py-1">
              {semesters.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div className="mb-6">
          <table className="w-full text-left">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2">Roll No</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Attendance</th>
              </tr>
            </thead>
            <tbody>
              {students.map(stu => (
                <tr key={stu.roll} className="border-b">
                  <td className="px-4 py-2">{stu.roll}</td>
                  <td className="px-4 py-2">{stu.name}</td>
                  <td className="px-4 py-2">
                    <select
                      value={attendance[stu.roll] || ''}
                      onChange={e => handleAttendanceChange(stu.roll, e.target.value)}
                      className="border rounded px-2 py-1"
                    >
                      <option value="">Select</option>
                      <option value="Present">Present</option>
                      <option value="Absent">Absent</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Submit Attendance</button>
      </form>
    </div>
  );
}

export default UploadAttendance; 