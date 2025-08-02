import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeftIcon,
  EnvelopeIcon,
  UserIcon,
  PhoneIcon,
  BriefcaseIcon,
} from '@heroicons/react/24/outline';
import axios from '../../../config/axios';

function ViewFaculty() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [faculty, setFaculty] = useState({});

  const fetchFaculty = async () => {
    try {
      const response = await axios.get(`/api/faculty/${id}`);
      const data = response.data.data;
      setFaculty({
        ...data,
        profilePic: `https://ui-avatars.com/api/?name=${data.name}&background=random&rounded=true`,
        dob: data.dob ? new Date(data.dob).toLocaleDateString() : 'N/A',
      });
    } catch (error) {
      console.error('Error fetching faculty:', error);
    }
  };

  useEffect(() => {
    fetchFaculty();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-600 hover:underline"
      >
        <ArrowLeftIcon className="h-5 w-5 mr-1" />
        Back to Faculty List
      </button>

      {/* Profile Card */}
      <div className="bg-white shadow-xl rounded-lg p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <img
          src={faculty.profilePic}
          alt={faculty.name}
          className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
        />
        <div className="flex-1 space-y-2">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <UserIcon className="w-6 h-6 text-blue-500" />
            {faculty.name}
          </h1>
          <p className="text-gray-600 flex items-center gap-2">
            <EnvelopeIcon className="w-5 h-5 text-gray-400" />
            {faculty.email}
          </p>
          <p className="text-gray-600 flex items-center gap-2">
            <PhoneIcon className="w-5 h-5 text-gray-400" />
            {faculty.phoneNo}
          </p>
        </div>
      </div>

      {/* Faculty Details */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold text-blue-800 mb-4">📋 Faculty Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-sm text-gray-700">
          <div>
            <p className="font-semibold text-gray-500">Employee ID</p>
            <p>{faculty.empId}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-500">Department</p>
            <p>{faculty.department}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-500">Designation</p>
            <p>{faculty.designation}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-500">Gender</p>
            <p>{faculty.gender}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-500">Date of Birth</p>
            <p>{faculty.dob}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewFaculty;
