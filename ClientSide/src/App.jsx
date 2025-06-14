import React from "react";
import "./App.css";
import { Routes, Route, Navigate, Outlet, useNavigate } from "react-router-dom";
import MainLogin from "./components/login/MainLogin";
import Navbar from "./components/Navbar";
import StudentNavbar from "./components/StudentNavbar";
import AdminNavBar from "./components/AdminNavBar";
import FacultyNavbar from "./components/faculty/FacultyNavbar";
import Dashboard from "./components/student/Dashboard";
import Courses from './components/student/Courses.jsx';
import Results from './components/student/Result.jsx';
import Profile from './components/student/Profile.jsx';
import CourseDetails from './components/student/CourseDetails.jsx';
import StudentList from './components/admin/student/StudentList.jsx';
import EditStudent from './components/admin/student/EditStudent.jsx';
import ViewStudent from './components/admin/student/ViewStudent.jsx';
import AdminDashboard from './components/admin/AdminDashboard.jsx';
import FacultyDashboard from './components/faculty/FacultyDashboard.jsx';
import UploadMarks from './components/faculty/UploadMarks.jsx';
import UploadAttendance from './components/faculty/UploadAttendance.jsx';
import UploadMaterial from './components/faculty/UploadMaterial.jsx';
import UploadAssignment from './components/faculty/UploadAssignment.jsx';
import Attendance from './components/faculty/Attendance.jsx';
import Timetable from './components/faculty/Timetable.jsx';

function RequireAuth({ allowedRoles, children }) {
  const role = localStorage.getItem('role');
  if (!role) return <Navigate to="/" replace />;
  if (!allowedRoles.includes(role)) return <Navigate to="/" replace />;
  return children;
}

function LayoutWithNavbar({ NavbarComponent, handleLogout }) {
  return (
    <>
      <NavbarComponent handleLogout={handleLogout} />
      <Outlet />
    </>
  );
}

function App() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('role');
    navigate('/');
  };

  return (
    <Routes>
      {/* Default route: Login */}
      <Route path="/" element={<MainLogin />} />

      {/* Student Routes */}
      <Route element={<RequireAuth allowedRoles={['Student']}><LayoutWithNavbar NavbarComponent={StudentNavbar} handleLogout={handleLogout} /></RequireAuth>}>
        <Route path="/student/dashboard" element={<Dashboard />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:subjectCode" element={<CourseDetails />} />
        <Route path="/results" element={<Results />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* Faculty Routes */}
      <Route element={<RequireAuth allowedRoles={['Faculty']}><LayoutWithNavbar NavbarComponent={FacultyNavbar} handleLogout={handleLogout} /></RequireAuth>}>
        <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
        <Route path="/faculty/upload-marks" element={<UploadMarks />} />
        <Route path="/faculty/upload-attendance" element={<UploadAttendance />} />
        <Route path="/faculty/upload-material" element={<UploadMaterial />} />
        <Route path="/faculty/upload-assignment" element={<UploadAssignment />} />
        <Route path="/faculty/attendance" element={<Attendance />} />
        <Route path="/faculty/timetable" element={<Timetable />} />
      </Route>

      {/* Admin Routes */}
      <Route element={<RequireAuth allowedRoles={['Admin']}><LayoutWithNavbar NavbarComponent={AdminNavBar} handleLogout={handleLogout} /></RequireAuth>}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/students" element={<StudentList />} />
        <Route path="/students/edit/:id" element={<EditStudent />} />
        <Route path="/students/view/:id" element={<ViewStudent />} />
        <Route path="/results" element={<Results />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* Catch-all: redirect to login */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;