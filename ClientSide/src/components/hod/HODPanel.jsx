import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HODNavbar from './HODNavbar';
import HODDashboard from './HODDashboard';
import HODNotifications from './HODNotifications';
import HODApprovals from './HODApprovals';
import HODStudents from './HODStudents';
import HODFaculty from './HODFaculty';
import HODProfile from './HODProfile';
import DepartmentManagement from './DepartmentManagement';

const HODPanel = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<HODDashboard />} />
      <Route path="/notifications" element={<HODNotifications />} />
      <Route path="/approvals" element={<HODApprovals />} />
      <Route path="/students" element={<HODStudents />} />
      <Route path="/faculty" element={<HODFaculty />} />
      <Route path="/profile" element={<HODProfile />} />
      <Route path="/department-management" element={<DepartmentManagement />} />
      <Route path="*" element={<Navigate to="/hod/dashboard" replace />} />
    </Routes>
  );
};

export default HODPanel;
