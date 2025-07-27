import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UploadTimetable() {
  const [batches, setBatches] = useState([]);
  const [branches, setBranches] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
  
  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [day, setDay] = useState('Monday');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [room, setRoom] = useState('');
  const [classString, setClassString] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Fetch initial data
  useEffect(() => {
    fetchBatches();
    fetchBranches();
    fetchSubjects();
  }, []);

  const fetchBatches = async () => {
    try {
      const response = await axios.get('/api/batches');
      setBatches(response.data.data || []);
    } catch (error) {
      console.error('Error fetching batches:', error);
      setBatches([
        { _id: '1', name: '2021-2025', startYear: 2021, endYear: 2025 },
        { _id: '2', name: '2022-2026', startYear: 2022, endYear: 2026 },
        { _id: '3', name: '2023-2027', startYear: 2023, endYear: 2027 }
      ]);
    }
  };

  const fetchBranches = async () => {
    try {
      const response = await axios.get('/api/branches');
      setBranches(response.data.data || []);
    } catch (error) {
      console.error('Error fetching branches:', error);
      setBranches([
        { _id: '1', name: 'CSE' },
        { _id: '2', name: 'ECE' },
        { _id: '3', name: 'ME' },
        { _id: '4', name: 'CE' }
      ]);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await axios.get('/api/subjects');
      setSubjects(response.data.data || []);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      setSubjects([
        { _id: '1', name: 'Data Structures', code: 'CSE101' },
        { _id: '2', name: 'Discrete Mathematics', code: 'MAT201' },
        { _id: '3', name: 'Algorithms', code: 'CSE202' }
      ]);
    }
  };

  const fetchSections = async (batchId, branchId) => {
    try {
      const response = await axios.get(`/api/sections?batch=${batchId}&branch=${branchId}`);
      setSections(response.data.data || []);
    } catch (error) {
      console.error('Error fetching sections:', error);
      setSections([
        { _id: '1', name: 'A' },
        { _id: '2', name: 'B' },
        { _id: '3', name: 'C' }
      ]);
    }
  };

  const generateClassString = async (batchId, branchId, sectionId) => {
    try {
      const response = await axios.get('/api/classes/class-string', {
        params: { batchId, branchId, sectionId }
      });
      setClassString(response.data.classString);
    } catch (error) {
      console.error('Error generating class string:', error);
      setClassString('Class String Generation Failed');
    }
  };

  // Handle selection changes
  useEffect(() => {
    if (selectedBatch && selectedBranch) {
      fetchSections(selectedBatch, selectedBranch);
      setSelectedSection('');
      setClassString('');
    }
  }, [selectedBatch, selectedBranch]);

  useEffect(() => {
    if (selectedBatch && selectedBranch && selectedSection) {
      generateClassString(selectedBatch, selectedBranch, selectedSection);
    }
  }, [selectedBatch, selectedBranch, selectedSection]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedBatch || !selectedBranch || !selectedSection || !selectedSubject || !day || !startTime || !endTime || !room) {
      setMessage('Please fill all required fields');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // First get or create the class
      const classResponse = await axios.post('/api/classes/get-or-create', {
        batchId: selectedBatch,
        branchId: selectedBranch,
        sectionId: selectedSection
      });

      const classId = classResponse.data.data._id;

      // Create timetable entry
      const timetableData = {
        day,
        startTime,
        endTime,
        room,
        subjectId: selectedSubject,
        classId,
        facultyId: '507f1f77bcf86cd799439011' // Replace with actual faculty ID from auth
      };

      const response = await axios.post('/api/timetables', timetableData);

      setMessage('Timetable entry added successfully!');
      // Reset form
      setDay('Monday');
      setStartTime('');
      setEndTime('');
      setRoom('');
      setSelectedSubject('');
      
    } catch (error) {
      console.error('Error adding timetable entry:', error);
      setMessage(error.response?.data?.message || 'Failed to add timetable entry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-blue-800 mb-4">Upload Timetable</h2>
      {message && (
        <div className={`p-3 mb-4 rounded ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 mb-1">Batch</label>
            <select 
              value={selectedBatch} 
              onChange={e => setSelectedBatch(e.target.value)} 
              className="w-full border rounded px-2 py-1"
              required
            >
              <option value="">Select Batch</option>
              {batches.map(batch => (
                <option key={batch._id} value={batch._id}>{batch.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Branch</label>
            <select 
              value={selectedBranch} 
              onChange={e => setSelectedBranch(e.target.value)} 
              className="w-full border rounded px-2 py-1"
              required
            >
              <option value="">Select Branch</option>
              {branches.map(branch => (
                <option key={branch._id} value={branch._id}>{branch.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 mb-1">Section</label>
            <select 
              value={selectedSection} 
              onChange={e => setSelectedSection(e.target.value)} 
              className="w-full border rounded px-2 py-1"
              required
              disabled={!selectedBatch || !selectedBranch}
            >
              <option value="">Select Section</option>
              {sections.map(section => (
                <option key={section._id} value={section._id}>{section.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Subject</label>
            <select 
              value={selectedSubject} 
              onChange={e => setSelectedSubject(e.target.value)} 
              className="w-full border rounded px-2 py-1"
              required
            >
              <option value="">Select Subject</option>
              {subjects.map(subject => (
                <option key={subject._id} value={subject._id}>{subject.name} ({subject.code})</option>
              ))}
            </select>
          </div>
        </div>
        {classString && (
          <div className="mb-4 p-2 bg-gray-100 rounded">
            <p className="text-gray-700">Class: <span className="font-semibold">{classString}</span></p>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 mb-1">Day</label>
            <select 
              value={day} 
              onChange={e => setDay(e.target.value)} 
              className="w-full border rounded px-2 py-1"
              required
            >
              {days.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Room</label>
            <input 
              type="text" 
              value={room} 
              onChange={e => setRoom(e.target.value)} 
              className="w-full border rounded px-2 py-1" 
              placeholder="Room Number/Name"
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-gray-700 mb-1">Start Time</label>
            <input 
              type="time" 
              value={startTime} 
              onChange={e => setStartTime(e.target.value)} 
              className="w-full border rounded px-2 py-1"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">End Time</label>
            <input 
              type="time" 
              value={endTime} 
              onChange={e => setEndTime(e.target.value)} 
              className="w-full border rounded px-2 py-1"
              required
            />
          </div>
        </div>
        <button 
          type="submit" 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Timetable Entry'}
        </button>
      </form>
    </div>
  );
}

export default UploadTimetable;