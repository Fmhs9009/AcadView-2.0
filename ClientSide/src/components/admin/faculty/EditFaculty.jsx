import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../../config/axios';

function EditFaculty() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [faculty, setFaculty] = useState({
    name: '',
    email: '',
    phoneNo: '',
    gender: '',
    empId: '',
    department: '',
    designation: '',
    dob: '',
  });

  const [departments, setDepartments] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFaculty((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/faculty/${id}`, faculty);
      alert('Faculty updated successfully!');
      navigate('/faculties');
    } catch (error) {
      console.error(error);
      alert('Error updating faculty');
    }
  };

  const fetchFaculty = async () => {
    try {
      const res = await axios.get(`/api/faculty/${id}`);
      const data = res.data.data;
      setFaculty({
        ...data,
        dob: data.dob ? data.dob.slice(0, 10) : '', // format for input type="date"
      });
    } catch (error) {
      console.error('Error fetching faculty:', error);
    }
  };

  const fetchDepartments = async () => {
    try {
        const res = await axios.get('/api/branches');
        setDepartments(res.data.data);
        console.log(res.data.data);
    } catch (error) {
        console.error('Error fetching departments:', error);
    }
  };

  useEffect(() => {
    fetchFaculty();
    fetchDepartments();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 mt-10">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">✏️ Edit Faculty</h1>
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
              value={faculty.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              value={faculty.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600">Phone Number</label>
            <input
              type="text"
              name="phoneNo"
              value={faculty.phoneNo}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600">Gender</label>
            <select
              name="gender"
              value={faculty.gender}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-600">Employee ID</label>
            <input
              type="text"
              name="empId"
              value={faculty.empId}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600">Department</label>
            <select
              type="text"
              name="department"
              value={faculty.department}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded"
            >
            {
                departments.map((d)=>{
                    return <option key={d.id} value={d.name}>{d.name}</option>
                })
            }
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-600">Designation</label>
            <input
              type="text"
              name="designation"
              value={faculty.designation}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={faculty.dob}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate('/faculties')}
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

export default EditFaculty;
