import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import MainLogin from './components/login/MainLogin.jsx'
import Courses from './components/student/Courses.jsx'
import Results from './components/student/Result.jsx'
import Profile from './components/student/Profile.jsx'
import Dashboard from './components/student/Dashboard.jsx'
import CourseDetails from './components/student/CourseDetails.jsx'
import StudentList from './components/admin/student/StudentList.jsx'
import EditStudent from './components/admin/student/EditStudent.jsx'
import ViewStudent from './components/admin/student/ViewStudent.jsx'
import AdminDashboard from './components/admin/AdminDashboard.jsx'
import FacultyDashboard from './components/faculty/FacultyDashboard.jsx'
import UploadMarks from './components/faculty/UploadMarks.jsx'
import UploadAttendance from './components/faculty/UploadAttendance.jsx'
import UploadMaterial from './components/faculty/UploadMaterial.jsx'
import UploadAssignment from './components/faculty/UploadAssignment.jsx'
import Attendance from './components/faculty/Attendance.jsx'
import Timetable from './components/faculty/Timetable.jsx'

// Get the role from localStorage
const role = localStorage.getItem('role');

// Optionally restrict access based on role
const isStudent = role === 'Student';
const isFaculty = role === 'Faculty';
const isHod = role === 'HOD';
const isAdmin = role === 'Admin';

if (isStudent) {
  var router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path='/login' element={<MainLogin/>}/>
        <Route path='/' element={<App/>}>
          <Route path='/' element={<Dashboard/>}/>
          <Route path='/courses' element={<Courses/>}/>
          <Route path='courses/:subjectCode' element={<CourseDetails />} />
          <Route path='/results' element={<Results/>}/>
          <Route path='/profile' element={<Profile/>}/>
        </Route>
      </>
    )
  )
}
else if (isFaculty) {
  var router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path='/login' element={<MainLogin/>}/>
        <Route path='/' element={<App/>}>
          <Route path='/' element={<FacultyDashboard/>}/>
          <Route path='/faculty/upload-marks' element={<UploadMarks/>}/>
          <Route path='/faculty/upload-attendance' element={<UploadAttendance/>}/>
          <Route path='/faculty/upload-material' element={<UploadMaterial/>}/>
          <Route path='/faculty/upload-assignment' element={<UploadAssignment/>}/>
          <Route path='/faculty/attendance' element={<Attendance/>}/>
          <Route path='/faculty/timetable' element={<Timetable/>}/>
          <Route path='/courses' element={<Courses/>}/>
          <Route path='courses/:subjectCode' element={<CourseDetails />} />
          <Route path='/results' element={<Results/>}/>
          <Route path='/profile' element={<Profile/>}/>
        </Route>
      </>
    )
  )
}
else if (isHod) {
  var router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path='/login' element={<MainLogin/>}/>
        <Route path='/' element={<App/>}>
          <Route path='/' element={<Dashboard/>}/>
          <Route path='/courses' element={<Courses/>}/>
          <Route path='courses/:subjectCode' element={<CourseDetails />} />
          <Route path='/results' element={<Results/>}/>
          <Route path='/profile' element={<Profile/>}/>
        </Route>
      </>
    )
  )
}
  
else if (isAdmin) {
  var router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path='/login' element={<MainLogin/>}/>
        <Route path='/' element={<App/>}>
          <Route path='/' element={<AdminDashboard/>}/>
          <Route path='/students' element={<StudentList/>}/>
          <Route path='/students/edit/:id' element={<EditStudent />} />
          <Route path='/students/view/:id' element={<ViewStudent />} />
          <Route path='/results' element={<Results/>}/>
          <Route path='/profile' element={<Profile/>}/>
        </Route>
      </>
    )
  )
}
  


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router = {router}/>
  </StrictMode>,
)
