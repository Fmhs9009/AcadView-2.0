import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UploadAssignment() {
  const [batches, setBatches] = useState([]);
  const [branches, setBranches] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
  
  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [maxMarks, setMaxMarks] = useState('');
  const [allowLateSubmission, setAllowLateSubmission] = useState(false);
  const [latePenalty, setLatePenalty] = useState('');
  const [submissionFormat, setSubmissionFormat] = useState('pdf,doc,docx');
  const [file, setFile] = useState(null);
  const [classString, setClassString] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

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
    
    if (!selectedBatch || !selectedBranch || !selectedSection || !selectedSubject || !title || !dueDate || !maxMarks) {
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
      formData.append('instructions', instructions);
      formData.append('dueDate', dueDate);
      formData.append('maxMarks', maxMarks);
      formData.append('subjectId', selectedSubject);
      formData.append('classId', classId);
      formData.append('facultyId', '507f1f77bcf86cd799439011'); // Replace with actual faculty ID from auth
      formData.append('allowLateSubmission', allowLateSubmission);
      formData.append('latePenalty', latePenalty || '0');
      formData.append('submissionFormat', submissionFormat);
      
      if (file) {
        formData.append('file', file);
      }

      const response = await axios.post('/api/assignments', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setMessage('Assignment uploaded successfully!');
      // Reset form
      setTitle('');
      setDescription('');
      setInstructions('');
      setDueDate('');
      setMaxMarks('');
      setSelectedSubject('');
      setAllowLateSubmission(false);
      setLatePenalty('');
      setSubmissionFormat('pdf,doc,docx');
      setFile(null);
      
    } catch (error) {
      console.error('Error uploading assignment:', error);
      setMessage(error.response?.data?.message || 'Failed to upload assignment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-purple-800 mb-6">Upload Assignment</h2>
      
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
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
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

        {/* Subject Selection */}
        <div className="mb-6">
          <label className="block text-gray-700 mb-2 font-medium">Subject *</label>
          <select 
            value={selectedSubject} 
            onChange={e => setSelectedSubject(e.target.value)} 
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          >
            <option value="">Select Subject</option>
            {subjects.map(subject => (
              <option key={subject._id} value={subject._id}>{subject.name} ({subject.code})</option>
            ))}
          </select>
        </div>

        {/* Assignment Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-700 mb-2 font-medium">Assignment Title *</label>
            <input 
              type="text" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" 
              placeholder="Enter assignment title"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2 font-medium">Max Marks *</label>
            <input 
              type="number" 
              value={maxMarks} 
              onChange={e => setMaxMarks(e.target.value)} 
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" 
              placeholder="Enter maximum marks"
              min="1"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-700 mb-2 font-medium">Due Date *</label>
            <input 
              type="datetime-local" 
              value={dueDate} 
              onChange={e => setDueDate(e.target.value)} 
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2 font-medium">Submission Format</label>
            <input 
              type="text" 
              value={submissionFormat} 
              onChange={e => setSubmissionFormat(e.target.value)} 
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" 
              placeholder="pdf,doc,docx"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2 font-medium">Description</label>
          <textarea 
            value={description} 
            onChange={e => setDescription(e.target.value)} 
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" 
            placeholder="Enter assignment description"
            rows="3"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2 font-medium">Instructions</label>
          <textarea 
            value={instructions} 
            onChange={e => setInstructions(e.target.value)} 
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" 
            placeholder="Enter detailed instructions for students"
            rows="4"
          />
        </div>

        {/* Late Submission Settings */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Late Submission Settings</h3>
          <div className="flex items-center mb-4">
            <input 
              type="checkbox" 
              id="allowLateSubmission"
              checked={allowLateSubmission} 
              onChange={e => setAllowLateSubmission(e.target.checked)} 
              className="mr-2"
            />
            <label htmlFor="allowLateSubmission" className="text-gray-700">Allow late submissions</label>
          </div>
          {allowLateSubmission && (
            <div>
              <label className="block text-gray-700 mb-2 font-medium">Late Penalty (%)</label>
              <input 
                type="number" 
                value={latePenalty} 
                onChange={e => setLatePenalty(e.target.value)} 
                className="w-full md:w-1/3 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" 
                placeholder="0-100"
                min="0"
                max="100"
              />
            </div>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2 font-medium">Attachment (Optional)</label>
          <input 
            type="file" 
            onChange={e => setFile(e.target.files[0])} 
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.zip,.rar"
          />
        </div>

        <div className="flex justify-end">
          <button 
            type="submit" 
            disabled={loading}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
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
              'Upload Assignment'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default UploadAssignment;