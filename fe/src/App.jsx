import React from 'react'
import Login from './components/Login'
import {BrowserRouter as Router,Routes,Route} from "react-router-dom"
const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login/>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App