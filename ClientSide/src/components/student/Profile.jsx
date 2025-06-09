import React from 'react';

function Profile() {
  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow-md">
      <h2 className="text-2xl font-semibold text-blue-700 mb-4">Your Profile</h2>
      <p><strong>Name:</strong> John Doe</p>
      <p><strong>Student ID:</strong> STU123456</p>
      <p><strong>Email:</strong> johndoe@example.com</p>
    </div>
  );
}

export default Profile;
