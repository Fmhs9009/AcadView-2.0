import React from "react";
import "./App.css";

import MainLogin from "./components/login/MainLogin";
import Navbar from "./components/Navbar";
import StudentNavbar from "./components/StudentNavbar";
import AdminNavBar from "./components/AdminNavBar";
import FacultyNavbar from "./components/faculty/FacultyNavbar";
import Dashboard from "./components/student/Dashboard";
import { Outlet } from "react-router-dom";

const App = () => {
  const role = localStorage.getItem('role');
  let NavComponent = Navbar;
  if (role === 'Student') NavComponent = StudentNavbar;
  else if (role === 'Admin') NavComponent = AdminNavBar;
  else if (role === 'Faculty') NavComponent = FacultyNavbar;

  return(
    <>
      <NavComponent/>
      <Outlet/>
    </>
  )
};

export default App;