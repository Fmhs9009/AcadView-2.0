import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import StudentNavbar from './StudentNavbar';
import AdminNavbar from './AdminNavBar';


function Navbar() {
    const navigate = useNavigate();

  const handleLogout = () => {
    // Example: Clear localStorage/sessionStorage if needed
    // localStorage.removeItem("userToken");
    
    // Redirect to login page
    navigate('/login');
  };
  const role = localStorage.getItem("role")
  return (
    <div>
      {
      role === "Student" ? <StudentNavbar handleLogout = {handleLogout}/>
      :
      role === "Admin" ? <AdminNavbar handleLogout = {handleLogout}/>
      :
      <></>
      }
    </div>
    
  );
}

export default Navbar;
