import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../../config/axios';

function EditStudent() {
  const navigate = useNavigate();
  const { id } = useParams(); // You can fetch real data using this
  const [branches, setBranches] = useState([]);
  const [batches, setBatches] = useState([]);

  // Initial mock student data (replace with real fetched data)
  const [student, setStudent] = useState({
    name: "Alice Johnson",
    email: "alice@example.com",
    branch: "CSE",
    year: "1st",
    batch: "2025-2029",
    status: "Active",
    gpa: 3.8,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      const updatedStudentRes = await Promise.all([
        axios.put(`/api/students/${id}`, student),
      ]);
      alert("Student updated successfully!");
      navigate("/students");
    } catch (error) {
      console.log(error)
    }
  };

    const fetchData = async () => {
    try {
      const response = await axios.get(`/api/students/${id}`);
      setStudent(response.data.data);
      setStudent((prev)=>({...prev, 'profilePic':`https://ui-avatars.com/api/?name=${response.data.data.name}&background=random&rounded=true`}))
      const [branchesRes, batchesRes] = await Promise.all([
        axios.get('/api/branches'),
        axios.get('/api/batches')
      ]);
      setBranches(branchesRes.data.data);
      setBatches(batchesRes.data.data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(()=>{
    fetchData()
  }, [])

  return (
    <div className="max-w-4xl mx-auto px-4 mt-10">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">✏️ Edit Student</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-6 space-y-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600">Full Name</label>
            <input
              type="text"
              name="name"
              value={student.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              value={student.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Branch</label>
            <select
              name="branch"
              value={student.branch?._id}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded"
            >
              <option value="">Select Branch</option>
              {
                branches.map((b)=>{
                  return(
                    <option key={b._id} value={b._id} > {b.name}</option>
                  )
                })
              }
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600">Batch</label>
            <select
              name="batch"
              value={student.batch}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded"
            >
              <option value="">Select Batch</option>
              {
                batches.map((b)=>{
                  return(
                    <option key={b._id} value={b.name}> {b.name}</option>
                  )
                })
              }
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate('/students')}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditStudent;
