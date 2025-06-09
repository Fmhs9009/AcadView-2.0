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

const router = createBrowserRouter(
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

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router = {router}/>
  </StrictMode>,
)
