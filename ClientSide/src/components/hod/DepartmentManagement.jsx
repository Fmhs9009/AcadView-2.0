import React, { useState, useEffect } from 'react';
import axios from '../../config/axios';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  Tabs,
  Tab,
  Divider,
  CircularProgress,
  Tooltip,
  Chip,
} from '@mui/material';
import { 
  Add as AddIcon, 
  Delete as DeleteIcon, 
  Edit as EditIcon, 
  Refresh as RefreshIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  Dashboard as DashboardIcon,
} from '@mui/icons-material';

const DepartmentManagement = () => {
  // Tab state
  const [activeTab, setActiveTab] = useState(0);
  
  // Data states
  const [faculty, setFaculty] = useState([]);
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    batch: '',
    section: ''
  });
  
  // Available batches and sections for filters
  const [availableBatches, setAvailableBatches] = useState([]);
  const [availableSections, setAvailableSections] = useState(['A', 'B', 'C']);
  
  // Dialog states
  const [openDialog, setOpenDialog] = useState('');
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: '',
    message: '',
    confirmAction: null
  });
  
  // Edit states
  const [editMode, setEditMode] = useState(false);
  const [selectedFacultyId, setSelectedFacultyId] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  
  // Form states
  const [newFaculty, setNewFaculty] = useState({
    name: '',
    email: '',
    phoneNo: '',
    gender: '',
    empId: '',
    designation: '',
    department: ''
  });
  
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    phoneNo: '',
    gender: '',
    enrollmentNo: '',
    batch: {
      from: '',
      to: ''
    },
    section: '',
    department: '',
    branch: '',
    fatherName: '',
    motherName: '',
    address: '',
    dob: ''
  });
  
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Add function to calculate semester from batch
  const calculateSemester = (batchFrom) => {
    if (!batchFrom) return '';
    const currentYear = new Date().getFullYear();
    const batchYear = parseInt(batchFrom);
    const yearDiff = currentYear - batchYear;
    const currentMonth = new Date().getMonth() + 1; // 0-based month
    let semester = yearDiff * 2;
    if (currentMonth >= 7) { // After June
      semester += 1;
    }
    return Math.min(Math.max(semester, 1), 8); // Keep between 1-8
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [facultyRes, studentsRes, statsRes] = await Promise.all([
        axios.get('/api/hod-management/faculty'),
        axios.get('/api/hod-management/students', { params: filters }),
        axios.get('/api/hod-management/statistics')
      ]);

      const facultyData = Array.isArray(facultyRes.data) ? facultyRes.data : [];
      const studentsData = Array.isArray(studentsRes.data) ? studentsRes.data : [];
      
      setFaculty(facultyData);
      setStudents(studentsData);
      setStats(statsRes.data || null);
      
      // Extract unique batches from students data for filter options
      if (studentsData.length > 0) {
        const batches = [...new Set(studentsData.map(student => student.batch))];
        setAvailableBatches(batches.sort().reverse()); // Sort in descending order (newest first)
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      showSnackbar(error.response?.data?.message || 'Error fetching data', 'error');
      setFaculty([]);
      setStudents([]);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  // Function to handle opening the faculty form dialog
  const handleOpenFacultyDialog = (faculty = null) => {
    if (faculty) {
      // Edit mode - populate form with faculty data
      setNewFaculty({
        name: faculty.name,
        email: faculty.email,
        phoneNo: faculty.phoneNo,
        gender: faculty.gender,
        empId: faculty.empId,
        designation: faculty.designation,
        department: faculty.department || ''
      });
      setEditMode(true);
      setSelectedFacultyId(faculty._id);
    } else {
      // Add mode - reset form
      setNewFaculty({
        name: '',
        email: '',
        phoneNo: '',
        gender: '',
        empId: '',
        designation: '',
        department: ''
      });
      setEditMode(false);
      setSelectedFacultyId(null);
    }
    setOpenDialog('faculty');
  };

  // Function to validate faculty form
  const validateFacultyForm = () => {
    // Check required fields
    const requiredFields = ['name', 'email', 'phoneNo', 'gender', 'empId', 'designation', 'department'];
    const missingFields = requiredFields.filter(field => !newFaculty[field]);

    if (missingFields.length > 0) {
      showSnackbar(`Please fill all required fields: ${missingFields.join(', ')}`, 'error');
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newFaculty.email)) {
      showSnackbar('Please enter a valid email address', 'error');
      return false;
    }

    // Validate phone number (10 digits)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(newFaculty.phoneNo)) {
      showSnackbar('Please enter a valid 10-digit phone number', 'error');
      return false;
    }

    return true;
  };

  // Function to handle adding or updating faculty
  const handleAddFaculty = async () => {
    if (!validateFacultyForm()) return;

    try {
      if (editMode && selectedFacultyId) {
        // Update existing faculty
        await axios.put(`/api/hod-management/faculty/${selectedFacultyId}`, newFaculty);
        showSnackbar('Faculty updated successfully');
      } else {
        // Add new faculty
        await axios.post('/api/hod-management/faculty', newFaculty);
        showSnackbar('Faculty added successfully');
      }
      setOpenDialog('');
      fetchData();
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Error processing faculty data', 'error');
    }
  };

  // Function to handle opening the student form dialog
  const handleOpenStudentDialog = (student = null) => {
    if (student) {
      // Edit mode - populate form with student data
      // Parse batch from format "YYYY-YYYY" to { from: "YYYY", to: "YYYY" }
      const batchParts = student.batch ? student.batch.split('-') : ['', ''];
      
      setNewStudent({
        name: student.name,
        email: student.email,
        phoneNo: student.phoneNo,
        gender: student.gender,
        enrollmentNo: student.enrollmentNo,
        batch: {
          from: batchParts[0] || '',
          to: batchParts[1] || ''
        },
        section: student.section,
        department: student.department || '',
        branch: student.branch?.name || student.branch || '',
        fatherName: student.fatherName || '',
        motherName: student.motherName || '',
        address: student.address || '',
        dob: student.dob ? new Date(student.dob).toISOString().split('T')[0] : ''
      });
      setEditMode(true);
      setSelectedStudentId(student._id);
    } else {
      // Add mode - reset form
      setNewStudent({
        name: '',
        email: '',
        phoneNo: '',
        gender: '',
        enrollmentNo: '',
        batch: {
          from: '',
          to: ''
        },
        section: '',
        department: '',
        branch: '',
        fatherName: '',
        motherName: '',
        address: '',
        dob: ''
      });
      setEditMode(false);
      setSelectedStudentId(null);
    }
    setOpenDialog('student');
  };

  // Function to validate student form
  const validateStudentForm = () => {
    // Check required fields
    const requiredFields = ['name', 'email', 'phoneNo', 'gender', 'enrollmentNo', 'section', 'department', 'branch', 'fatherName', 'motherName', 'dob'];
    const missingFields = requiredFields.filter(field => !newStudent[field]);

    if (!newStudent.batch.from || !newStudent.batch.to) {
      showSnackbar('Please enter complete batch details', 'error');
      return false;
    }

    if (missingFields.length > 0) {
      showSnackbar(`Please fill all required fields: ${missingFields.join(', ')}`, 'error');
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newStudent.email)) {
      showSnackbar('Please enter a valid email address', 'error');
      return false;
    }

    // Validate phone number (10 digits)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(newStudent.phoneNo)) {
      showSnackbar('Please enter a valid 10-digit phone number', 'error');
      return false;
    }

    // Validate batch years
    const batchFrom = parseInt(newStudent.batch.from);
    const batchTo = parseInt(newStudent.batch.to);
    if (isNaN(batchFrom) || isNaN(batchTo) || batchFrom >= batchTo) {
      showSnackbar('Please enter valid batch years', 'error');
      return false;
    }

    return true;
  };

  // Function to handle adding or updating student
  const handleAddStudent = async () => {
    if (!validateStudentForm()) return;

    try {
      const semester = calculateSemester(newStudent.batch.from);
      const studentData = {
        ...newStudent,
        batch: `${newStudent.batch.from}-${newStudent.batch.to}`,
        semester
      };

      if (editMode && selectedStudentId) {
        // Update existing student
        await axios.put(`/api/hod-management/student/${selectedStudentId}`, studentData);
        showSnackbar('Student updated successfully');
      } else {
        // Add new student
        await axios.post('/api/hod-management/student', studentData);
        showSnackbar('Student added successfully');
      }
      setOpenDialog('');
      fetchData();
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Error processing student data', 'error');
    }
  };

  const handleRemoveFaculty = async (id) => {
    // Open confirmation dialog
    setConfirmDialog({
      open: true,
      title: 'Remove Faculty',
      message: 'Are you sure you want to remove this faculty member? This action cannot be undone.',
      confirmAction: async () => {
        try {
          await axios.delete(`/api/hod-management/faculty/${id}`);
          fetchData();
          showSnackbar('Faculty removed successfully');
        } catch (error) {
          showSnackbar(error.response?.data?.message || 'Error removing faculty', 'error');
        } finally {
          // Close confirmation dialog
          setConfirmDialog({ ...confirmDialog, open: false });
        }
      },
      cancelAction: () => {
        // Close confirmation dialog
        setConfirmDialog({ ...confirmDialog, open: false });
      }
    });
  };

  const handleRemoveStudent = async (id) => {
    // Open confirmation dialog
    setConfirmDialog({
      open: true,
      title: 'Remove Student',
      message: 'Are you sure you want to remove this student? This action cannot be undone.',
      confirmAction: async () => {
        try {
          await axios.delete(`/api/hod-management/student/${id}`);
          fetchData();
          showSnackbar('Student removed successfully');
        } catch (error) {
          showSnackbar(error.response?.data?.message || 'Error removing student', 'error');
        } finally {
          // Close confirmation dialog
          setConfirmDialog({ ...confirmDialog, open: false });
        }
      },
      cancelAction: () => {
        // Close confirmation dialog
        setConfirmDialog({ ...confirmDialog, open: false });
      }
    });
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Statistics Cards */}
        <Grid item xs={12}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <DashboardIcon sx={{ mr: 1 }} color="primary" />
                <Typography variant="h6">Department Dashboard</Typography>
              </Box>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>Total Faculty</Typography>
                      <Typography variant="h5">{stats?.facultyCount || 0}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>Total Students</Typography>
                      <Typography variant="h5">{stats?.studentCount || 0}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Management Tabs */}
        <Grid item xs={12}>
          <Card>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={activeTab} 
                onChange={(e, newValue) => setActiveTab(newValue)}
                aria-label="department management tabs"
              >
                <Tab 
                  icon={<PersonIcon />} 
                  label="Faculty Management" 
                  id="tab-0" 
                  aria-controls="tabpanel-0" 
                />
                <Tab 
                  icon={<SchoolIcon />} 
                  label="Student Management" 
                  id="tab-1" 
                  aria-controls="tabpanel-1" 
                />
              </Tabs>
            </Box>
            
            {/* Faculty Management Tab */}
            <Box
              role="tabpanel"
              hidden={activeTab !== 0}
              id="tabpanel-0"
              aria-labelledby="tab-0"
              sx={{ p: 3 }}
            >
              {activeTab === 0 && (
                <>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6">Faculty Members</Typography>
                    <Box display="flex" gap={1}>
                      <Button
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                        onClick={fetchData}
                        disabled={loading}
                      >
                        Refresh
                      </Button>
                      <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenFacultyDialog()}
                      >
                        Add Faculty
                      </Button>
                    </Box>
                  </Box>
                  
                  {loading ? (
                    <Box display="flex" justifyContent="center" my={4}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Employee ID</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Department</TableCell>
                            <TableCell>Designation</TableCell>
                            <TableCell align="center">Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {faculty.length > 0 ? (
                            faculty.map((f) => (
                              <TableRow key={f._id}>
                                <TableCell>{f.name}</TableCell>
                                <TableCell>{f.empId}</TableCell>
                                <TableCell>{f.email}</TableCell>
                                <TableCell>{f.phoneNo}</TableCell>
                                <TableCell>{f.department}</TableCell>
                                <TableCell>{f.designation}</TableCell>
                                <TableCell align="center">
                                  <Tooltip title="Edit Faculty">
                                    <IconButton 
                                      onClick={() => handleOpenFacultyDialog(f)} 
                                      color="primary"
                                      size="small"
                                      sx={{ mr: 1 }}
                                    >
                                      <EditIcon />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Remove Faculty">
                                    <IconButton 
                                      onClick={() => handleRemoveFaculty(f._id)} 
                                      color="error"
                                      size="small"
                                    >
                                      <DeleteIcon />
                                    </IconButton>
                                  </Tooltip>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={7} align="center">
                                No faculty members found
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </>
              )}
            </Box>
            
            {/* Student Management Tab */}
            <Box
              role="tabpanel"
              hidden={activeTab !== 1}
              id="tabpanel-1"
              aria-labelledby="tab-1"
              sx={{ p: 3 }}
            >
              {activeTab === 1 && (
                <>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6">Students</Typography>
                    <Box display="flex" gap={1}>
                      <FormControl size="small">
                        <InputLabel>Batch</InputLabel>
                        <Select
                          value={filters.batch}
                          label="Batch"
                          onChange={(e) => setFilters({ ...filters, batch: e.target.value })}
                          style={{ minWidth: 120 }}
                        >
                          <MenuItem value="">All</MenuItem>
                          {availableBatches.map((batch) => (
                            <MenuItem key={batch} value={batch}>{batch}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControl size="small">
                        <InputLabel>Section</InputLabel>
                        <Select
                          value={filters.section}
                          label="Section"
                          onChange={(e) => setFilters({ ...filters, section: e.target.value })}
                          style={{ minWidth: 120 }}
                        >
                          <MenuItem value="">All</MenuItem>
                          {availableSections.map((section) => (
                            <MenuItem key={section} value={section}>{section}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <Button
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                        onClick={fetchData}
                        disabled={loading}
                      >
                        Refresh
                      </Button>
                      <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenStudentDialog()}
                      >
                        Add Student
                      </Button>
                    </Box>
                  </Box>
                  
                  {loading ? (
                    <Box display="flex" justifyContent="center" my={4}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Enrollment No</TableCell>
                            <TableCell>Batch</TableCell>
                            <TableCell>Section</TableCell>
                            <TableCell>Branch</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell align="center">Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {students.length > 0 ? (
                            students.map((s) => (
                              <TableRow key={s._id}>
                                <TableCell>{s.name}</TableCell>
                                <TableCell>{s.enrollmentNo}</TableCell>
                                <TableCell>{s.batch}</TableCell>
                                <TableCell>
                                  <Chip 
                                    label={s.section} 
                                    size="small" 
                                    color="primary" 
                                    variant="outlined"
                                  />
                                </TableCell>
                                <TableCell>{s.branch?.name || s.branch || '-'}</TableCell>
                                <TableCell>{s.email}</TableCell>
                                <TableCell align="center">
                                  <Tooltip title="Edit Student">
                                    <IconButton 
                                      onClick={() => handleOpenStudentDialog(s)} 
                                      color="primary"
                                      size="small"
                                      sx={{ mr: 1 }}
                                    >
                                      <EditIcon />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Remove Student">
                                    <IconButton 
                                      onClick={() => handleRemoveStudent(s._id)} 
                                      color="error"
                                      size="small"
                                    >
                                      <DeleteIcon />
                                    </IconButton>
                                  </Tooltip>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={7} align="center">
                                No students found
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </>
              )}
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Add/Edit Faculty Dialog */}
      <Dialog 
        open={openDialog === 'faculty'} 
        onClose={() => setOpenDialog('')} 
        maxWidth="lg" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            textAlign: 'center',
            fontSize: '1.5rem',
            fontWeight: 600,
            py: 3
          }}
        >
          <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          {editMode ? 'Edit Faculty Member' : 'Add New Faculty Member'}
        </DialogTitle>
        <DialogContent sx={{ p: 4, backgroundColor: '#fafafa' }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" color="primary" gutterBottom>
              Personal Information
            </Typography>
            <Divider sx={{ mb: 3 }} />
          </Box>
          
          <Grid container spacing={3}>
            {/* Row 1: Name and Email */}
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Full Name"
                placeholder="Enter full name"
                value={newFaculty.name}
                onChange={(e) => setNewFaculty({ ...newFaculty, name: e.target.value })}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: 'white',
                    '&:hover fieldset': {
                      borderColor: '#667eea',
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Email Address"
                type="email"
                placeholder="Enter email address"
                value={newFaculty.email}
                onChange={(e) => setNewFaculty({ ...newFaculty, email: e.target.value })}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: 'white',
                    '&:hover fieldset': {
                      borderColor: '#667eea',
                    },
                  },
                }}
              />
            </Grid>
            
            {/* Row 2: Phone and Gender */}
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Phone Number"
                placeholder="Enter phone number"
                value={newFaculty.phoneNo}
                onChange={(e) => setNewFaculty({ ...newFaculty, phoneNo: e.target.value })}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: 'white',
                    '&:hover fieldset': {
                      borderColor: '#667eea',
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl 
                fullWidth 
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: 'white',
                    '&:hover fieldset': {
                      borderColor: '#667eea',
                    },
                  },
                }}
              >
                <InputLabel>Gender</InputLabel>
                <Select
                  value={newFaculty.gender}
                  label="Gender"
                  onChange={(e) => setNewFaculty({ ...newFaculty, gender: e.target.value })}
                >
                  <MenuItem value="Male">👨 Male</MenuItem>
                  <MenuItem value="Female">👩 Female</MenuItem>
                  <MenuItem value="Other">⚧ Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 4, mb: 3 }}>
            <Typography variant="h6" color="primary" gutterBottom>
              Professional Information
            </Typography>
            <Divider sx={{ mb: 3 }} />
          </Box>
          
          <Grid container spacing={3}>
            {/* Row 3: Employee ID and Department */}
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Employee ID"
                placeholder="Enter employee ID"
                value={newFaculty.empId}
                onChange={(e) => setNewFaculty({ ...newFaculty, empId: e.target.value })}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: 'white',
                    '&:hover fieldset': {
                      borderColor: '#667eea',
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Department"
                placeholder="Enter department"
                value={newFaculty.department}
                onChange={(e) => setNewFaculty({ ...newFaculty, department: e.target.value })}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: 'white',
                    '&:hover fieldset': {
                      borderColor: '#667eea',
                    },
                  },
                }}
              />
            </Grid>
            
            {/* Row 4: Designation and Qualification */}
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Designation"
                placeholder="e.g., Assistant Professor"
                value={newFaculty.designation}
                onChange={(e) => setNewFaculty({ ...newFaculty, designation: e.target.value })}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: 'white',
                    '&:hover fieldset': {
                      borderColor: '#667eea',
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Qualification"
                placeholder="e.g., M.Tech, Ph.D"
                value={newFaculty.qualification}
                onChange={(e) => setNewFaculty({ ...newFaculty, qualification: e.target.value })}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: 'white',
                    '&:hover fieldset': {
                      borderColor: '#667eea',
                    },
                  },
                }}
              />
            </Grid>
            
            {/* Row 5: Experience */}
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Experience (Years)"
                type="number"
                placeholder="Enter years of experience"
                value={newFaculty.experience}
                onChange={(e) => setNewFaculty({ ...newFaculty, experience: e.target.value })}
                variant="outlined"
                inputProps={{ min: 0, max: 50 }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: 'white',
                    '&:hover fieldset': {
                      borderColor: '#667eea',
                    },
                  },
                }}
              />
            </Grid>
            
            {/* Row 6: Address */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                placeholder="Enter complete address"
                multiline
                rows={3}
                value={newFaculty.address}
                onChange={(e) => setNewFaculty({ ...newFaculty, address: e.target.value })}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: 'white',
                    '&:hover fieldset': {
                      borderColor: '#667eea',
                    },
                  },
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, backgroundColor: '#f5f5f5', justifyContent: 'space-between' }}>
          <Button 
            onClick={() => setOpenDialog('')}
            variant="outlined"
            size="large"
            sx={{ 
              borderRadius: 2,
              px: 4,
              borderColor: '#ccc',
              color: '#666',
              '&:hover': {
                borderColor: '#999',
                backgroundColor: '#f9f9f9'
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleAddFaculty} 
            variant="contained" 
            size="large"
            sx={{
              borderRadius: 2,
              px: 4,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
              }
            }}
          >
            {editMode ? '✏️ Update Faculty' : '➕ Add Faculty'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add/Edit Student Dialog */}
      <Dialog 
        open={openDialog === 'student'} 
        onClose={() => setOpenDialog('')} 
        maxWidth="lg" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white',
            textAlign: 'center',
            fontSize: '1.5rem',
            fontWeight: 600,
            py: 3
          }}
        >
          <SchoolIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          {editMode ? 'Edit Student Information' : 'Add New Student'}
        </DialogTitle>
        <DialogContent sx={{ p: 4, backgroundColor: '#fafafa' }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" color="primary" gutterBottom>
              Personal Information
            </Typography>
            <Divider sx={{ mb: 3 }} />
          </Box>
          
          <Grid container spacing={3}>
            {/* Row 1: Name and Email */}
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Full Name"
                placeholder="Enter student's full name"
                value={newStudent.name}
                onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: 'white',
                    '&:hover fieldset': {
                      borderColor: '#4facfe',
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Email Address"
                type="email"
                placeholder="Enter email address"
                value={newStudent.email}
                onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: 'white',
                    '&:hover fieldset': {
                      borderColor: '#4facfe',
                    },
                  },
                }}
              />
            </Grid>
            
            {/* Row 2: Phone and Gender */}
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Phone Number"
                placeholder="Enter phone number"
                value={newStudent.phoneNo}
                onChange={(e) => setNewStudent({ ...newStudent, phoneNo: e.target.value })}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: 'white',
                    '&:hover fieldset': {
                      borderColor: '#4facfe',
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl 
                fullWidth 
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: 'white',
                    '&:hover fieldset': {
                      borderColor: '#4facfe',
                    },
                  },
                }}
              >
                <InputLabel>Gender</InputLabel>
                <Select
                  value={newStudent.gender}
                  label="Gender"
                  onChange={(e) => setNewStudent({ ...newStudent, gender: e.target.value })}
                >
                  <MenuItem value="Male">👨 Male</MenuItem>
                  <MenuItem value="Female">👩 Female</MenuItem>
                  <MenuItem value="Other">⚧ Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            {/* Row 3: Date of Birth and Enrollment Number */}
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Date of Birth"
                type="date"
                value={newStudent.dob}
                onChange={(e) => setNewStudent({ ...newStudent, dob: e.target.value })}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: 'white',
                    '&:hover fieldset': {
                      borderColor: '#4facfe',
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Enrollment Number"
                placeholder="Enter enrollment number"
                value={newStudent.enrollmentNo}
                onChange={(e) => setNewStudent({ ...newStudent, enrollmentNo: e.target.value })}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: 'white',
                    '&:hover fieldset': {
                      borderColor: '#4facfe',
                    },
                  },
                }}
              />
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 4, mb: 3 }}>
            <Typography variant="h6" color="primary" gutterBottom>
              Academic Information
            </Typography>
            <Divider sx={{ mb: 3 }} />
          </Box>
          
          <Grid container spacing={3}>
            {/* Row 4: Department and Branch */}
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Department"
                placeholder="Enter department"
                value={newStudent.department}
                onChange={(e) => setNewStudent({ ...newStudent, department: e.target.value })}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: 'white',
                    '&:hover fieldset': {
                      borderColor: '#4facfe',
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Branch"
                placeholder="Enter branch"
                value={newStudent.branch}
                onChange={(e) => setNewStudent({ ...newStudent, branch: e.target.value })}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: 'white',
                    '&:hover fieldset': {
                      borderColor: '#4facfe',
                    },
                  },
                }}
              />
            </Grid>
            
            {/* Row 5: Section and Batch */}
            <Grid item xs={12} md={6}>
              <FormControl 
                fullWidth 
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: 'white',
                    '&:hover fieldset': {
                      borderColor: '#4facfe',
                    },
                  },
                }}
              >
                <InputLabel>Section</InputLabel>
                <Select
                  value={newStudent.section}
                  label="Section"
                  onChange={(e) => setNewStudent({ ...newStudent, section: e.target.value })}
                >
                  <MenuItem value="A">📚 Section A</MenuItem>
                  <MenuItem value="B">📚 Section B</MenuItem>
                  <MenuItem value="C">📚 Section C</MenuItem>
                  <MenuItem value="D">📚 Section D</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  required
                  fullWidth
                  label="Batch From"
                  type="number"
                  placeholder="2020"
                  value={newStudent.batch.from}
                  onChange={(e) => setNewStudent({
                    ...newStudent,
                    batch: { ...newStudent.batch, from: e.target.value }
                  })}
                  variant="outlined"
                  inputProps={{ min: 2000, max: 2030 }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: 'white',
                      '&:hover fieldset': {
                        borderColor: '#4facfe',
                      },
                    },
                  }}
                />
                <TextField
                  required
                  fullWidth
                  label="Batch To"
                  type="number"
                  placeholder="2024"
                  value={newStudent.batch.to}
                  onChange={(e) => setNewStudent({
                    ...newStudent,
                    batch: { ...newStudent.batch, to: e.target.value }
                  })}
                  variant="outlined"
                  inputProps={{ min: 2000, max: 2030 }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: 'white',
                      '&:hover fieldset': {
                        borderColor: '#4facfe',
                      },
                    },
                  }}
                />
              </Box>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 4, mb: 3 }}>
            <Typography variant="h6" color="primary" gutterBottom>
              Family Information
            </Typography>
            <Divider sx={{ mb: 3 }} />
          </Box>
          
          <Grid container spacing={3}>
            {/* Row 6: Father's and Mother's Name */}
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Father's Name"
                placeholder="Enter father's name"
                value={newStudent.fatherName}
                onChange={(e) => setNewStudent({ ...newStudent, fatherName: e.target.value })}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: 'white',
                    '&:hover fieldset': {
                      borderColor: '#4facfe',
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Mother's Name"
                placeholder="Enter mother's name"
                value={newStudent.motherName}
                onChange={(e) => setNewStudent({ ...newStudent, motherName: e.target.value })}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: 'white',
                    '&:hover fieldset': {
                      borderColor: '#4facfe',
                    },
                  },
                }}
              />
            </Grid>
            
            {/* Row 7: Address */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                placeholder="Enter complete address"
                multiline
                rows={3}
                value={newStudent.address}
                onChange={(e) => setNewStudent({ ...newStudent, address: e.target.value })}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: 'white',
                    '&:hover fieldset': {
                      borderColor: '#4facfe',
                    },
                  },
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, backgroundColor: '#f5f5f5', justifyContent: 'space-between' }}>
          <Button 
            onClick={() => setOpenDialog('')}
            variant="outlined"
            size="large"
            sx={{ 
              borderRadius: 2,
              px: 4,
              borderColor: '#ccc',
              color: '#666',
              '&:hover': {
                borderColor: '#999',
                backgroundColor: '#f9f9f9'
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleAddStudent} 
            variant="contained" 
            size="large"
            sx={{
              borderRadius: 2,
              px: 4,
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #3d8bfe 0%, #00d4fe 100%)',
              }
            }}
          >
            {editMode ? '✏️ Update Student' : '➕ Add Student'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open || false}
        onClose={() => confirmDialog.cancelAction && confirmDialog.cancelAction()}
      >
        <DialogTitle>{confirmDialog.title}</DialogTitle>
        <DialogContent>
          <Typography>{confirmDialog.message}</Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => confirmDialog.cancelAction && confirmDialog.cancelAction()}
            color="primary"
          >
            Cancel
          </Button>
          <Button 
            onClick={() => confirmDialog.confirmAction && confirmDialog.confirmAction()}
            color="error"
            variant="contained"
            autoFocus
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default DepartmentManagement;