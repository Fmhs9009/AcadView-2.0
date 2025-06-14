import React, { useState } from 'react';

function UploadMaterial() {
  // Static data for demo
  const courses = [
    { code: 'CSE101', name: 'Data Structures' },
    { code: 'MAT201', name: 'Discrete Mathematics' },
    { code: 'CSE202', name: 'Algorithms' },
  ];
  const branches = ['CSE', 'ECE', 'ME', 'CE'];
  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];
  const [selectedCourse, setSelectedCourse] = useState('CSE101');
  const [selectedBranch, setSelectedBranch] = useState('CSE');
  const [selectedSemester, setSelectedSemester] = useState(1);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Study material uploaded! (Demo)');
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-yellow-800 mb-4">Upload Study Material</h2>
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
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Title</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full border rounded px-2 py-1" placeholder="Material Title" />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 mb-1">File</label>
          <input type="file" onChange={e => setFile(e.target.files[0])} className="w-full" />
        </div>
        <button type="submit" className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700">Upload Material</button>
      </form>
    </div>
  );
}

export default UploadMaterial; 