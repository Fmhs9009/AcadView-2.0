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
import { Add as AddIcon, Delete as DeleteIcon, Refresh as RefreshIcon } from '@mui/icons-material';

const DepartmentManagement = () => {
  const [faculty, setFaculty] = useState([]);
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({
    batch: '',
    section: '',
    semester: ''
  });
  const [openDialog, setOpenDialog] = useState('');
  // Update newFaculty state
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
  
  // Update newStudent state
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    phoneNo: '',
    gender: '',
    enrollmentNo: '',
    batch: '',
    section: '',
    department: '',
    fatherName: '',
    motherName: '',
    address: '',
    dob: ''
  });
  
  // State for batches
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

      setFaculty(Array.isArray(facultyRes.data) ? facultyRes.data : []);
      setStudents(Array.isArray(studentsRes.data) ? studentsRes.data : []);
      setStats(null); // Remove stats for now
      setBatches(Array.isArray(batchesRes.data.data) ? batchesRes.data.data : []);
    } catch (error) {
      console.error('Error fetching data:', error);
      showSnackbar(error.response?.data?.message || 'Error fetching data', 'error');
      setFaculty([]);
      setStudents([]);
      setStats(null);
      setBatches([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  const handleAddFaculty = async () => {
    // Check required fields
    const requiredFields = ['name', 'email', 'phoneNo', 'gender', 'empId', 'designation', 'department', 'qualification', 'experience'];
    const missingFields = requiredFields.filter(field => !newFaculty[field]);

    if (missingFields.length > 0) {
      showSnackbar(`Please fill all required fields: ${missingFields.join(', ')}`, 'error');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newFaculty.email)) {
      showSnackbar('Please enter a valid email address', 'error');
      return;
    }

    // Validate phone number (10 digits)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(newFaculty.phoneNo)) {
      showSnackbar('Please enter a valid 10-digit phone number', 'error');
      return;
    }

    try {
      await axios.post('/api/faculty', newFaculty);
      setOpenDialog('');
      fetchData();
      showSnackbar('Faculty added successfully');
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Error adding faculty', 'error');
    }
  };

  const handleAddStudent = async () => {
    // Check required fields
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

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newStudent.email)) {
      showSnackbar('Please enter a valid email address', 'error');
      return;
    }

    // Validate phone number (10 digits)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(newStudent.phoneNo)) {
      showSnackbar('Please enter a valid 10-digit phone number', 'error');
      return;
    }

    try {
      // Extract batch year from selected batch for semester calculation
      const batchYearMatch = newStudent.batch.match(/^(\d{4})/);
      const batchYear = batchYearMatch ? batchYearMatch[1] : null;
      const semester = batchYear ? calculateSemester(batchYear) : 1;
      
      await axios.post('/api/students', {
        ...newStudent,
        semester
      });
      setOpenDialog('');
      fetchData();
      showSnackbar('Student added successfully');
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Error adding student', 'error');
    }
  };

  const handleRemoveFaculty = async (id) => {
    // Show confirmation dialog before removing faculty
    if (window.confirm('Are you sure you want to remove this faculty member?')) {
      try {
        await axios.delete(`/api/hod-management/faculty/${id}`);
        fetchData();
        showSnackbar('Faculty removed successfully');
      } catch (error) {
        showSnackbar('Error removing faculty', 'error');
      }
    }
  };

  const handleRemoveStudent = async (id) => {
    try {
      await axios.delete(`/api/students/${id}`);
      fetchData();
      showSnackbar('Student removed successfully');
    } catch (error) {
      showSnackbar('Error removing student', 'error');
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // State for faculty details dialog
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [viewFacultyDialog, setViewFacultyDialog] = useState(false);

  const handleViewFaculty = (faculty) => {
    setSelectedFaculty(faculty);
    setViewFacultyDialog(true);
  };

  const handleCloseViewFaculty = () => {
    setViewFacultyDialog(false);
    setSelectedFaculty(null);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
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
      <Grid container spacing={3}>
        {/* Statistics Cards */}
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>Total Faculty</Typography>
                  <Typography variant="h5">{stats?.facultyCount || 0}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>Total Students</Typography>
                  <Typography variant="h5">{stats?.studentCount || 0}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Faculty Section */}
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Faculty Members</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenDialog('faculty')}
            >
              Add Faculty
            </Button>
          </Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Employee ID</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Designation</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {faculty.map((f) => (
                  <TableRow key={f._id}>
                    <TableCell>{f.name}</TableCell>
                    <TableCell>{f.empId}</TableCell>
                    <TableCell>{f.email}</TableCell>
                    <TableCell>{f.phoneNo}</TableCell>
                    <TableCell>{f.designation}</TableCell>
                    <TableCell>
                      <Button 
                        variant="outlined" 
                        size="small" 
                        onClick={() => handleViewFaculty(f)}
                        sx={{ mr: 1 }}
                      >
                        View
                      </Button>
                      <IconButton onClick={() => handleRemoveFaculty(f._id)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        {/* Students Section */}
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Students</Typography>
            <Box display="flex" gap={2}>
              <FormControl size="small">
                <InputLabel>Batch</InputLabel>
                <Select
                  value={filters.batch}
                  label="Batch"
                  onChange={(e) => setFilters({ ...filters, batch: e.target.value })}
                  style={{ minWidth: 120 }}
                >
                  <MenuItem value="">All</MenuItem>
                  {/* Add batch options dynamically */}
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
                  <MenuItem value="A">A</MenuItem>
                  <MenuItem value="B">B</MenuItem>
                  <MenuItem value="C">C</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenDialog('student')}
              >
                Add Student
              </Button>
            </Box>
          </Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Enrollment No</TableCell>
                  <TableCell>Batch</TableCell>
                  <TableCell>Section</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((s) => (
                  <TableRow key={s._id}>
                    <TableCell>{s.name}</TableCell>
                    <TableCell>{s.enrollmentNo}</TableCell>
                    <TableCell>{s.batch}</TableCell>
                    <TableCell>{s.section}</TableCell>
                    <TableCell>{s.email}</TableCell>
                    <TableCell>{s.phoneNo}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleRemoveStudent(s._id)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      {/* Add Faculty Dialog */}
      <Dialog open={openDialog === 'faculty'} onClose={() => setOpenDialog('')}>
        <DialogTitle>Add New Faculty</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Name"
                value={newFaculty.name}
                onChange={(e) => setNewFaculty({ ...newFaculty, name: e.target.value })}
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
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Phone Number"
                value={newFaculty.phoneNo}
                onChange={(e) => setNewFaculty({ ...newFaculty, phoneNo: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Gender</InputLabel>
                <Select
                  value={newFaculty.gender}
                  label="Gender"
                  onChange={(e) => setNewFaculty({ ...newFaculty, gender: e.target.value })}
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Employee ID"
                value={newFaculty.empId}
                onChange={(e) => setNewFaculty({ ...newFaculty, empId: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Designation"
                value={newFaculty.designation}
                onChange={(e) => setNewFaculty({ ...newFaculty, designation: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Department"
                value={newFaculty.department}
                disabled
                onChange={(e) => setNewFaculty({ ...newFaculty, department: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Qualification"
                value={newFaculty.qualification}
                onChange={(e) => setNewFaculty({ ...newFaculty, qualification: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Experience (Years)"
                type="number"
                value={newFaculty.experience}
                onChange={(e) => setNewFaculty({ ...newFaculty, experience: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                multiline
                rows={2}
                value={newFaculty.address}
                onChange={(e) => setNewFaculty({ ...newFaculty, address: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog('')}>Cancel</Button>
          <Button onClick={handleAddFaculty} variant="contained" color="primary">
            Add Faculty
          </Button>
        </DialogActions>
      </Dialog>

      {/* Faculty Details Dialog */}
      <Dialog open={viewFacultyDialog} onClose={handleCloseViewFaculty} maxWidth="md">
        <DialogTitle>Faculty Details</DialogTitle>
        <DialogContent>
          {selectedFaculty && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Name</Typography>
                <Typography variant="body1">{selectedFaculty.name}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                <Typography variant="body1">{selectedFaculty.email}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Phone Number</Typography>
                <Typography variant="body1">{selectedFaculty.phoneNo}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Gender</Typography>
                <Typography variant="body1">{selectedFaculty.gender}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Employee ID</Typography>
                <Typography variant="body1">{selectedFaculty.empId}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Designation</Typography>
                <Typography variant="body1">{selectedFaculty.designation}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Department</Typography>
                <Typography variant="body1">{selectedFaculty.department}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Qualification</Typography>
                <Typography variant="body1">{selectedFaculty.qualification}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Experience</Typography>
                <Typography variant="body1">{selectedFaculty.experience} years</Typography>
              </Grid>
              {selectedFaculty.address && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Address</Typography>
                  <Typography variant="body1">{selectedFaculty.address}</Typography>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseViewFaculty}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Add Student Dialog */}
      <Dialog open={openDialog === 'student'} onClose={() => setOpenDialog('')}>
        <DialogTitle>Add New Student</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Name"
                value={newStudent.name}
                onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Email"
                type="email"
                value={newStudent.email}
                onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Phone Number"
                value={newStudent.phoneNo}
                onChange={(e) => setNewStudent({ ...newStudent, phoneNo: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Gender</InputLabel>
                <Select
                  value={newStudent.gender}
                  label="Gender"
                  onChange={(e) => setNewStudent({ ...newStudent, gender: e.target.value })}
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Enrollment Number"
                value={newStudent.enrollmentNo}
                onChange={(e) => setNewStudent({ ...newStudent, enrollmentNo: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Section"
                value={newStudent.section}
                onChange={(e) => setNewStudent({ ...newStudent, section: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Batch</InputLabel>
                <Select
                  value={newStudent.batch}
                  label="Batch"
                  onChange={(e) => setNewStudent({ ...newStudent, batch: e.target.value })}
                >
                  {batches.map((batch) => (
                    <MenuItem key={batch._id} value={batch.name}>{batch.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Department"
                value={newStudent.department}
                disabled
                onChange={(e) => setNewStudent({ ...newStudent, department: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Father's Name"
                value={newStudent.fatherName}
                onChange={(e) => setNewStudent({ ...newStudent, fatherName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Mother's Name"
                value={newStudent.motherName}
                onChange={(e) => setNewStudent({ ...newStudent, motherName: e.target.value })}
              />
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
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                multiline
                rows={2}
                value={newStudent.address}
                onChange={(e) => setNewStudent({ ...newStudent, address: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog('')}>Cancel</Button>
          <Button onClick={handleAddStudent} variant="contained" color="primary">
            Add Student
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
