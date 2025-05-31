import React, { useState, useEffect } from 'react';
import './login.css';

// Icons for each role
const roleIcons = {
  Student: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
    </svg>
  ),
  Faculty: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  HOD: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  Admin: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
};

const MainLogin = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const roles = [
    { name: 'Student', description: 'Access your tasks and submissions.' },
    { name: 'Faculty', description: 'Assign tasks and evaluate students.' },
    { name: 'HOD', description: 'Manage faculty and courses.' },
    { name: 'Admin', description: 'Oversee the entire system.' },
  ];

  // Role-specific content for the left side
  const roleContent = {
    Student: {
      title: 'Student Portal',
      description: 'Access your courses, assignments, and grades. Stay updated with your academic progress.',
      image: 'https://img.icons8.com/color/96/000000/student-center.png',
      features: ['Course Materials', 'Assignment Submissions', 'Grade Tracking', 'Attendance Records']
    },
    Faculty: {
      title: 'Faculty Dashboard',
      description: 'Manage your courses, create assignments, and evaluate student performance.',
      image: 'https://img.icons8.com/color/96/000000/teacher.png',
      features: ['Course Management', 'Assignment Creation', 'Student Evaluation', 'Attendance Tracking']
    },
    HOD: {
      title: 'Department Head Portal',
      description: 'Oversee department activities, manage faculty, and monitor academic programs.',
      image: 'https://img.icons8.com/color/96/000000/manager.png',
      features: ['Faculty Management', 'Course Oversight', 'Department Analytics', 'Program Development']
    },
    Admin: {
      title: 'Admin Control Panel',
      description: 'Complete system administration with full access to all features and settings.',
      image: 'https://img.icons8.com/color/96/000000/admin-settings-male.png',
      features: ['User Management', 'System Configuration', 'Data Analytics', 'Security Controls']
    }
  };

  const handleRoleSelect = (role) => {
    if (selectedRole === role && showLoginForm) {
      // If clicking the same role when form is already shown, do nothing
      return;
    }
    
    // Reset form when changing roles
    setEmail('');
    setPassword('');
    setLoginError('');
    
    // If a different role is selected when form is showing, just change the role
    if (showLoginForm) {
      setSelectedRole(role);
      return;
    }
    
    // First time selecting a role - show animation
    setSelectedRole(role);
    setTimeout(() => {
      setShowLoginForm(true);
    }, 300);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError('');
    
    // Validate form
    if (!email || !password) {
      setLoginError('Please enter both email and password');
      setIsLoading(false);
      return;
    }
    
    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      alert(`Login attempt as ${selectedRole} with email: ${email}`);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center page-background">
      {/* Academic header bar */}
      <div className="header-bar"></div>
      <div className="side-accent"></div>
      <div className="university-banner"></div>
      <div className="academic-decoration academic-decoration-1"></div>
      <div className="academic-decoration academic-decoration-2"></div>
      
      {/* Professional background pattern */}
      <div className="bg-pattern"></div>
      
      {/* University-style banner */}
      <div className="university-banner"></div>
      
      <div className="main-card p-8 w-full max-w-5xl mx-4 z-10 relative">
        {!showLoginForm ? (
          // Initial view with role selection
          <div className="flex flex-col md:flex-row">
            {/* Left side - Logo and welcome text */}
            <div className="w-full md:w-2/5 text-center md:text-left mb-8 md:mb-0 md:pr-8 border-r border-gray-200">
              <div className="logo-container">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h1 className="title-text">AcadView</h1>
              <p className="subtitle-text">Academic Management System</p>
              
              {/* University/College Name */}
              <div className="mt-6 mb-4 py-2 px-4 bg-primary-light rounded-md inline-block">
                <p className="text-primary-dark font-semibold">University Portal</p>
              </div>
              
              <p className="text-secondary text-sm mt-4">Please select your role to continue.</p>
            </div>

            {/* Right side - Role selection */}
            <div className="w-full md:w-3/5 p-6 md:pl-8">
              <h2 className="section-title mb-4">Select Your Role</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {roles.map((role) => (
                  <div
                    key={role.name}
                    className={`relative p-6 rounded-xl cursor-pointer role-card text-center ${selectedRole === role.name ? 'selected' : ''}`}
                    onClick={() => handleRoleSelect(role.name)}
                  >
                    <div className={`text-center ${selectedRole === role.name ? 'text-primary' : 'text-text-primary'}`}>
                      {roleIcons[role.name]}
                      <h2 className="text-xl font-semibold mb-2">{role.name}</h2>
                      <p className="text-sm text-secondary">{role.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Login instructions */}
              <div className="mt-6 text-sm text-secondary">
                <p>After selecting your role, you will be directed to the login page.</p>
              </div>
            </div>
          </div>
        ) : (
          // Login form view after role selection
          <div className="login-form-container animate-fade-in">
            <div className="flex flex-col">
              {/* Role selection tabs at the top right */}
              <div className="self-end mb-8">
                <div className="role-tabs-container">
                  {roles.map((role) => (
                    <div 
                      key={role.name} 
                      className={`role-tab ${selectedRole === role.name ? 'active' : ''}`}
                      onClick={() => handleRoleSelect(role.name)}
                    >
                      <div className="role-tab-icon">
                        {roleIcons[role.name]}
                      </div>
                      <span>{role.name}</span>
                      {selectedRole === role.name && (
                        <span className="ml-1 bg-white bg-opacity-20 text-xs px-2 py-0.5 rounded-full">
                          Active
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row bg-white rounded-xl shadow-lg overflow-hidden border border-border-light">
                {/* Left side - Role specific content */}
                <div className="w-full md:w-2/5 bg-primary-bg animate-slide-in-left">
                  {selectedRole && (
                    <div className="role-specific-content p-8 h-full flex flex-col">
                      <div className="flex items-center mb-6">
                        <div className="p-4 rounded-xl bg-white mr-4 shadow-sm border border-primary-light">
                          <img 
                            src={roleContent[selectedRole].image} 
                            alt={`${selectedRole} icon`} 
                            className="w-14 h-14 object-contain animate-pulse"
                          />
                        </div>
                        <div>
                          <div className="text-xs text-primary-color font-medium mb-1 bg-primary-light inline-block px-2 py-0.5 rounded-full">Active Role</div>
                          <h2 className="text-xl font-bold text-primary-dark">{roleContent[selectedRole].title}</h2>
                        </div>
                      </div>
                      
                      <p className="text-text-primary mb-6 text-sm leading-relaxed">{roleContent[selectedRole].description}</p>
                      
                      <div className="bg-white p-5 rounded-lg shadow-sm mt-auto border border-border-light">
                        <h3 className="font-medium text-primary-color mb-3 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Key Features
                        </h3>
                        <ul className="space-y-2">
                          {roleContent[selectedRole].features.map((feature, index) => (
                            <li key={index} className="text-text-secondary text-sm flex items-start">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary-color mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="mt-8 text-center">
                        <div className="inline-flex items-center justify-center bg-white px-4 py-2 rounded-full text-xs text-primary-dark shadow-sm border border-primary-light">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-primary-color" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                          Secure Login
                        </div>
                        <div className="mt-2 text-xs text-text-secondary">End-to-end encrypted connection</div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Right side - Login form */}
                <div className="w-full md:w-3/5 p-8 animate-slide-in-right">
                  <div className="max-w-md mx-auto">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-bold text-primary-dark mb-2">{selectedRole} Login</h2>
                      <p className="text-text-secondary text-sm">Enter your credentials to access your account</p>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-1">Email Address</label>
                          <div className="relative">
                            <div className="input-icon">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-color opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                              </svg>
                            </div>
                            <input 
                              type="email" 
                              id="email" 
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="form-input"
                              placeholder="Enter your email"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-1">Password</label>
                          <div className="relative">
                            <div className="input-icon">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-color opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                              </svg>
                            </div>
                            <input 
                              type="password" 
                              id="password" 
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="form-input"
                              placeholder="Enter your password"
                            />
                          </div>
                        </div>
                      </div>
                      
                      {loginError && (
                        <div className="bg-red-50 text-red-500 text-sm p-3 rounded-md flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {loginError}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <input 
                            id="remember-me" 
                            name="remember-me" 
                            type="checkbox" 
                            className="h-4 w-4 text-primary-color focus:ring-primary-light border-gray-300 rounded"
                          />
                          <label htmlFor="remember-me" className="ml-2 block text-sm text-text-secondary">
                            Remember me
                          </label>
                        </div>
                        
                        <div className="text-sm">
                          <a href="#" className="text-primary-color hover:text-primary-dark font-medium">
                            Forgot password?
                          </a>
                        </div>
                      </div>
                      
                      <div>
                        <button 
                          type="submit" 
                          className="btn-primary w-full py-3 px-4 rounded-lg"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <span className="flex items-center">
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Signing in...
                            </span>
                          ) : (
                            'Sign in'
                          )}
                        </button>
                      </div>
                    </form>
                    
                    <div className="mt-8 text-center">
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-2 bg-white text-text-secondary">Or</span>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <span className="text-text-secondary text-sm">Don't have an account? </span>
                        <a href="#" className="text-primary-color hover:text-primary-dark font-medium text-sm">
                          Contact administrator
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-10 pt-4 border-t border-gray-200 text-center text-secondary text-sm flex justify-between items-center">
          <p>© {new Date().getFullYear()} AcadView</p>
          <p>Academic Management System</p>
          <p>Version 2.0</p>
        </div>
      </div>
    </div>
  )
}

export default MainLogin