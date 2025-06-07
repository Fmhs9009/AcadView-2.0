import React from "react";
import "./App.css";

import MainLogin from "./components/login/MainLogin";
import Navbar from "./components/Navbar";
import Dashboard from "./components/student/Dashboard";
import { Outlet } from "react-router-dom";
const App = () => {
  return(

  <>
    <Navbar/>
    <Outlet/>
  </>
  )
};

export default App;