import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UploadTimetable() {
  const [batches, setBatches] = useState([]);
  const [branches, setBranches] = useState([]);
  const [sections, setSections] = useState([]);
  
  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  const [semester, setSemester] = useState('');
  const [effectiveFrom, setEffectiveFrom] = useState('');
  const [effectiveTo, setEffectiveTo] = useState('');
  const [timetableType, setTimetableType] = useState('regular');
  const [file, setFile] = useState(null);
  const [classString, setClassString] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch initial data
  useEffect(() => {
    fetchBatches();
    fetchBranches();
    // Set current academic year
    const currentYear = new Date().getFullYear();
    setAcademicYear(`${currentYear}-${currentYear + 1}`);
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
    
    if (!selectedBatch || !selectedBranch || !selectedSection || !title || !academicYear || !semester || !effectiveFrom) {
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

      // Create form data for file upload
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('academicYear', academicYear);
      formData.append('semester', semester);
      formData.append('effectiveFrom', effectiveFrom);
      formData.append('effectiveTo', effectiveTo);
      formData.append('timetableType', timetableType);
      formData.append('classId', classId);
      formData.append('facultyId', '507f1f77bcf86cd799439011'); // Replace with actual faculty ID from auth
      
      if (file) {
        formData.append('file', file);
      }

      const response = await axios.post('/api/timetables', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setMessage('Timetable uploaded successfully!');
      // Reset form
      setTitle('');
      setDescription('');
      setSemester('');
      setEffectiveFrom('');
      setEffectiveTo('');
      setTimetableType('regular');
      setFile(null);
      
    } catch (error) {
      console.error('Error uploading timetable:', error);
      setMessage(error.response?.data?.message || 'Failed to upload timetable');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-blue-800 mb-6">Upload Timetable</h2>
      
      {message && (
        <div className={`mb-4 p-3 rounded ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Class Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-gray-700 mb-2 font-medium">Batch *</label>
            <select 
              value={selectedBatch} 
              onChange={e => setSelectedBatch(e.target.value)} 
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Batch</option>
              {batches.map(batch => (
                <option key={batch._id} value={batch._id}>{batch.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-2 font-medium">Branch *</label>
            <select 
              value={selectedBranch} 
              onChange={e => setSelectedBranch(e.target.value)} 
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Branch</option>
              {branches.map(branch => (
                <option key={branch._id} value={branch._id}>{branch.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-2 font-medium">Section *</label>
            <select 
              value={selectedSection} 
              onChange={e => setSelectedSection(e.target.value)} 
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={!selectedBatch || !selectedBranch}
            >
              <option value="">Select Section</option>
              {sections.map(section => (
                <option key={section._id} value={section._id}>{section.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Class String Display */}
        {classString && (
          <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 font-medium">Target Class: {classString}</p>
          </div>
        )}

        {/* Timetable Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-700 mb-2 font-medium">Timetable Title *</label>
            <input 
              type="text" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="Enter timetable title"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2 font-medium">Timetable Type</label>
            <select 
              value={timetableType} 
              onChange={e => setTimetableType(e.target.value)} 
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="regular">Regular</option>
              <option value="exam">Exam</option>
              <option value="special">Special</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-gray-700 mb-2 font-medium">Academic Year *</label>
            <input 
              type="text" 
              value={academicYear} 
              onChange={e => setAcademicYear(e.target.value)} 
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="2023-2024"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2 font-medium">Semester *</label>
            <select 
              value={semester} 
              onChange={e => setSemester(e.target.value)} 
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Semester</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                <option key={sem} value={sem}>{sem}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-2 font-medium">Effective From *</label>
            <input 
              type="date" 
              value={effectiveFrom} 
              onChange={e => setEffectiveFrom(e.target.value)} 
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-700 mb-2 font-medium">Effective To (Optional)</label>
            <input 
              type="date" 
              value={effectiveTo} 
              onChange={e => setEffectiveTo(e.target.value)} 
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2 font-medium">Timetable File *</label>
            <input 
              type="file" 
              onChange={e => setFile(e.target.files[0])} 
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
              required
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2 font-medium">Description</label>
          <textarea 
            value={description} 
            onChange={e => setDescription(e.target.value)} 
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
            placeholder="Enter timetable description (optional)"
            rows="4"
          />
        </div>

        <div className="flex justify-end">
          <button 
            type="submit" 
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </>
            ) : (
              'Upload Timetable'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default UploadTimetable;