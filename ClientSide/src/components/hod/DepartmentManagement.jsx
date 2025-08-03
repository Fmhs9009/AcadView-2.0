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
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Refresh as RefreshIcon, Visibility as ViewIcon, Person as PersonIcon, School as SchoolIcon } from '@mui/icons-material';

const DepartmentManagement = () => {
  const [faculty, setFaculty] = useState([]);
  const [students, setStudents] = useState([]);
  const [filters, setFilters] = useState({
    batch: '',
    section: '',
    semester: ''
  });
  const [openDialog, setOpenDialog] = useState('');
  const [viewFacultyDialog, setViewFacultyDialog] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  
  const [newFaculty, setNewFaculty] = useState({
    name: '',
    email: '',
    phoneNo: '',
    gender: '',
    empId: '',
    designation: '',
    department: '',
    qualification: '',
    experience: '',
    address: ''
  });
  
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    phoneNo: '',
    gender: '',
    enrollmentNo: '',
    batch: '',
    section: '',
    department: '',
    branch: '',
    fatherName: '',
    motherName: '',
    address: '',
    dob: ''
  });
  
  const [batches, setBatches] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const fetchData = async () => {
    try {
      const [facultyRes, studentsRes, batchesRes] = await Promise.all([
        axios.get('/api/faculty'),
        axios.get('/api/students', { params: filters }),
        axios.get('/api/batches')
      ]);

      setFaculty(Array.isArray(facultyRes.data.data) ? facultyRes.data.data : []);
      setStudents(Array.isArray(studentsRes.data.data) ? studentsRes.data.data : []);
      setBatches(Array.isArray(batchesRes.data.data) ? batchesRes.data.data : []);
    } catch (error) {
      console.error('Error fetching data:', error);
      showSnackbar(error.response?.data?.message || 'Error fetching data', 'error');
      setFaculty([]);
      setStudents([]);
      setBatches([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const calculateSemester = (batchYear) => {
    if (!batchYear) return 1;
    const currentYear = new Date().getFullYear();
    const yearDiff = currentYear - parseInt(batchYear);
    const currentMonth = new Date().getMonth() + 1;
    let semester = yearDiff * 2;
    if (currentMonth >= 7) {
      semester += 1;
    }
    return Math.min(Math.max(semester, 1), 8);
  };

  const handleAddFaculty = async () => {
    const requiredFields = ['name', 'email', 'phoneNo', 'gender', 'empId', 'designation', 'department', 'qualification', 'experience'];
    const missingFields = requiredFields.filter(field => !newFaculty[field]);

    if (missingFields.length > 0) {
      showSnackbar(`Please fill all required fields: ${missingFields.join(', ')}`, 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newFaculty.email)) {
      showSnackbar('Please enter a valid email address', 'error');
      return;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(newFaculty.phoneNo)) {
      showSnackbar('Please enter a valid 10-digit phone number', 'error');
      return;
    }

    try {
      await axios.post('/api/faculty', newFaculty);
      setOpenDialog('');
      setNewFaculty({
        name: '',
        email: '',
        phoneNo: '',
        gender: '',
        empId: '',
        designation: '',
        department: '',
        qualification: '',
        experience: '',
        address: ''
      });
      fetchData();
      showSnackbar('Faculty added successfully');
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Error adding faculty', 'error');
    }
  };

  const handleAddStudent = async () => {
    const requiredFields = ['name', 'email', 'phoneNo', 'gender', 'enrollmentNo', 'section', 'department', 'batch', 'fatherName', 'motherName', 'dob'];
    const missingFields = requiredFields.filter(field => !newStudent[field]);

    if (!newStudent.batch) {
      showSnackbar('Please select a batch', 'error');
      return;
    }

    if (missingFields.length > 0) {
      showSnackbar(`Please fill all required fields: ${missingFields.join(', ')}`, 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newStudent.email)) {
      showSnackbar('Please enter a valid email address', 'error');
      return;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(newStudent.phoneNo)) {
      showSnackbar('Please enter a valid 10-digit phone number', 'error');
      return;
    }

    try {
      const batchYearMatch = newStudent.batch.match(/^(\d{4})/);
      const batchYear = batchYearMatch ? batchYearMatch[1] : null;
      const semester = batchYear ? calculateSemester(batchYear) : 1;
      
      await axios.post('/api/students', {
        ...newStudent,
        semester
      });
      setOpenDialog('');
      setNewStudent({
        name: '',
        email: '',
        phoneNo: '',
        gender: '',
        enrollmentNo: '',
        batch: '',
        section: '',
        department: '',
        branch: '',
        fatherName: '',
        motherName: '',
        address: '',
        dob: ''
      });
      fetchData();
      showSnackbar('Student added successfully');
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Error adding student', 'error');
    }
  };

  const handleRemoveFaculty = async (id) => {
    if (window.confirm('Are you sure you want to remove this faculty member?')) {
      try {
        await axios.delete(`/api/faculty/${id}`);
        fetchData();
        showSnackbar('Faculty removed successfully');
      } catch (error) {
        showSnackbar('Error removing faculty', 'error');
      }
    }
  };

  const handleRemoveStudent = async (id) => {
    if (window.confirm('Are you sure you want to remove this student?')) {
      try {
        await axios.delete(`/api/students/${id}`);
        fetchData();
        showSnackbar('Student removed successfully');
      } catch (error) {
        showSnackbar('Error removing student', 'error');
      }
    }
  };

  const handleViewFaculty = (facultyMember) => {
    setSelectedFaculty(facultyMember);
    setViewFacultyDialog(true);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ 
        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontWeight: 'bold',
        mb: 4
      }}>
        Department Management
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(45deg, #FF6B6B 30%, #FF8E8E 90%)' }}>
            <CardContent>
              <Typography color="white" gutterBottom>
                Total Faculty
              </Typography>
              <Typography variant="h4" color="white">
                {faculty.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(45deg, #4ECDC4 30%, #44A08D 90%)' }}>
            <CardContent>
              <Typography color="white" gutterBottom>
                Total Students
              </Typography>
              <Typography variant="h4" color="white">
                {students.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Faculty Management */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Faculty Management
            </Typography>
            <Box>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenDialog('faculty')}
                sx={{ mr: 1 }}
              >
                Add Faculty
              </Button>
              <IconButton onClick={fetchData}>
                <RefreshIcon />
              </IconButton>
            </Box>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Employee ID</TableCell>
                  <TableCell>Designation</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {faculty.map((member) => (
                  <TableRow key={member._id}>
                    <TableCell>{member.name}</TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>{member.empId}</TableCell>
                    <TableCell>{member.designation}</TableCell>
                    <TableCell>{member.department}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleViewFaculty(member)} color="primary">
                        <ViewIcon />
                      </IconButton>
                      <IconButton onClick={() => handleRemoveFaculty(member._id)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Student Management */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Student Management
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenDialog('student')}
            >
              Add Student
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Enrollment No</TableCell>
                  <TableCell>Batch</TableCell>
                  <TableCell>Section</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student._id}>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.enrollmentNo}</TableCell>
                    <TableCell>{student.batch}</TableCell>
                    <TableCell>{student.section}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleRemoveStudent(student._id)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Add Faculty Dialog */}
      <Dialog open={openDialog === 'faculty'} onClose={() => setOpenDialog('')} maxWidth="lg" fullWidth>
        <DialogTitle sx={{ 
          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <PersonIcon />
          Add New Faculty
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, color: '#2196F3' }}>Personal Information</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Name"
                value={newFaculty.name}
                onChange={(e) => setNewFaculty({ ...newFaculty, name: e.target.value })}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Email"
                type="email"
                value={newFaculty.email}
                onChange={(e) => setNewFaculty({ ...newFaculty, email: e.target.value })}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Phone Number"
                value={newFaculty.phoneNo}
                onChange={(e) => setNewFaculty({ ...newFaculty, phoneNo: e.target.value })}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Gender</InputLabel>
                <Select
                  value={newFaculty.gender}
                  label="Gender"
                  onChange={(e) => setNewFaculty({ ...newFaculty, gender: e.target.value })}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="Male">👨 Male</MenuItem>
                  <MenuItem value="Female">👩 Female</MenuItem>
                  <MenuItem value="Other">⚧ Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, mt: 2, color: '#2196F3' }}>Professional Information</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Employee ID"
                value={newFaculty.empId}
                onChange={(e) => setNewFaculty({ ...newFaculty, empId: e.target.value })}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Designation"
                value={newFaculty.designation}
                onChange={(e) => setNewFaculty({ ...newFaculty, designation: e.target.value })}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Department"
                value={newFaculty.department}
                onChange={(e) => setNewFaculty({ ...newFaculty, department: e.target.value })}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Qualification"
                value={newFaculty.qualification}
                onChange={(e) => setNewFaculty({ ...newFaculty, qualification: e.target.value })}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Experience (years)"
                value={newFaculty.experience}
                onChange={(e) => setNewFaculty({ ...newFaculty, experience: e.target.value })}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Address"
                multiline
                rows={2}
                value={newFaculty.address}
                onChange={(e) => setNewFaculty({ ...newFaculty, address: e.target.value })}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenDialog('')} sx={{ borderRadius: 2 }}>
            Cancel
          </Button>
          <Button 
            onClick={handleAddFaculty} 
            variant="contained"
            sx={{ 
              borderRadius: 2,
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)'
            }}
          >
            Add Faculty
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Student Dialog */}
      <Dialog open={openDialog === 'student'} onClose={() => setOpenDialog('')} maxWidth="lg" fullWidth>
        <DialogTitle sx={{ 
          background: 'linear-gradient(45deg, #4ECDC4 30%, #44A08D 90%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <SchoolIcon />
          Add New Student
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, color: '#4ECDC4' }}>Personal Information</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Name"
                placeholder="Enter student's full name"
                value={newStudent.name}
                onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Email"
                type="email"
                placeholder="student@example.com"
                value={newStudent.email}
                onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Phone Number"
                placeholder="10-digit phone number"
                value={newStudent.phoneNo}
                onChange={(e) => setNewStudent({ ...newStudent, phoneNo: e.target.value })}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Gender</InputLabel>
                <Select
                  value={newStudent.gender}
                  label="Gender"
                  onChange={(e) => setNewStudent({ ...newStudent, gender: e.target.value })}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="Male">👨 Male</MenuItem>
                  <MenuItem value="Female">👩 Female</MenuItem>
                  <MenuItem value="Other">⚧ Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Date of Birth"
                type="date"
                value={newStudent.dob}
                onChange={(e) => setNewStudent({ ...newStudent, dob: e.target.value })}
                InputLabelProps={{ shrink: true }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, mt: 2, color: '#4ECDC4' }}>Academic Information</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Enrollment Number"
                placeholder="Enter enrollment number"
                value={newStudent.enrollmentNo}
                onChange={(e) => setNewStudent({ ...newStudent, enrollmentNo: e.target.value })}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Batch</InputLabel>
                <Select
                  value={newStudent.batch}
                  label="Batch"
                  onChange={(e) => setNewStudent({ ...newStudent, batch: e.target.value })}
                  sx={{ borderRadius: 2 }}
                >
                  {batches.map((batch) => (
                    <MenuItem key={batch._id} value={batch.name}>
                      {batch.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Section</InputLabel>
                <Select
                  value={newStudent.section}
                  label="Section"
                  onChange={(e) => setNewStudent({ ...newStudent, section: e.target.value })}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="A">📚 Section A</MenuItem>
                  <MenuItem value="B">📚 Section B</MenuItem>
                  <MenuItem value="C">📚 Section C</MenuItem>
                  <MenuItem value="D">📚 Section D</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Department"
                value={newStudent.department}
                onChange={(e) => setNewStudent({ ...newStudent, department: e.target.value })}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Branch"
                value={newStudent.branch}
                onChange={(e) => setNewStudent({ ...newStudent, branch: e.target.value })}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, mt: 2, color: '#4ECDC4' }}>Family Information</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Father's Name"
                placeholder="Enter father's full name"
                value={newStudent.fatherName}
                onChange={(e) => setNewStudent({ ...newStudent, fatherName: e.target.value })}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Mother's Name"
                placeholder="Enter mother's full name"
                value={newStudent.motherName}
                onChange={(e) => setNewStudent({ ...newStudent, motherName: e.target.value })}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                multiline
                rows={3}
                placeholder="Enter complete address"
                value={newStudent.address}
                onChange={(e) => setNewStudent({ ...newStudent, address: e.target.value })}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenDialog('')} sx={{ borderRadius: 2 }}>
            Cancel
          </Button>
          <Button 
            onClick={handleAddStudent} 
            variant="contained"
            sx={{ 
              borderRadius: 2,
              background: 'linear-gradient(45deg, #4ECDC4 30%, #44A08D 90%)'
            }}
          >
            Add Student
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Faculty Dialog */}
      <Dialog open={viewFacultyDialog} onClose={() => setViewFacultyDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ 
          background: 'linear-gradient(45deg, #FF6B6B 30%, #FF8E8E 90%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <ViewIcon />
          Faculty Details
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {selectedFaculty && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Name</Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>{selectedFaculty.name}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Email</Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>{selectedFaculty.email}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Phone</Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>{selectedFaculty.phoneNo}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Gender</Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>{selectedFaculty.gender}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Employee ID</Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>{selectedFaculty.empId}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Designation</Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>{selectedFaculty.designation}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Department</Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>{selectedFaculty.department}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Qualification</Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>{selectedFaculty.qualification}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Experience</Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>{selectedFaculty.experience} years</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="textSecondary">Address</Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>{selectedFaculty.address || 'Not provided'}</Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewFacultyDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default DepartmentManagement;
