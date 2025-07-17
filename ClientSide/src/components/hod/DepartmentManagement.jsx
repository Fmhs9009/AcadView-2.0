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
  const [newFaculty, setNewFaculty] = useState({
    name: '',
    email: '',
    phoneNo: '',
    gender: '',
    empId: '',
    designation: '',
    department: '',
    branch: '',
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
    try {
      const [facultyRes, studentsRes, statsRes] = await Promise.all([
        axios.get('/api/hod-management/faculty'),
        axios.get('/api/hod-management/students', { params: filters }),
        axios.get('/api/hod-management/statistics')
      ]);

      setFaculty(Array.isArray(facultyRes.data) ? facultyRes.data : []);
      setStudents(Array.isArray(studentsRes.data) ? studentsRes.data : []);
      setStats(statsRes.data || null);
    } catch (error) {
      console.error('Error fetching data:', error);
      showSnackbar(error.response?.data?.message || 'Error fetching data', 'error');
      setFaculty([]);
      setStudents([]);
      setStats(null);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  const handleAddFaculty = async () => {
    // Check required fields
    const requiredFields = ['name', 'email', 'phoneNo', 'gender', 'empId', 'designation', 'department', 'branch', 'qualification', 'experience'];
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
      await axios.post('/api/hod-management/faculty', newFaculty);
      setOpenDialog('');
      fetchData();
      showSnackbar('Faculty added successfully');
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Error adding faculty', 'error');
    }
  };

  const handleAddStudent = async () => {
    // Check required fields
    const requiredFields = ['name', 'email', 'phoneNo', 'gender', 'enrollmentNo', 'section', 'department', 'branch', 'fatherName', 'motherName', 'dob'];
    const missingFields = requiredFields.filter(field => !newStudent[field]);

    if (!newStudent.batch.from || !newStudent.batch.to) {
      showSnackbar('Please enter complete batch details', 'error');
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

    // Validate batch years
    const batchFrom = parseInt(newStudent.batch.from);
    const batchTo = parseInt(newStudent.batch.to);
    if (isNaN(batchFrom) || isNaN(batchTo) || batchFrom >= batchTo) {
      showSnackbar('Please enter valid batch years', 'error');
      return;
    }

    try {
      const semester = calculateSemester(newStudent.batch.from);
      await axios.post('/api/hod-management/student', {
        ...newStudent,
        batch: `${newStudent.batch.from}-${newStudent.batch.to}`,
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
    try {
      await axios.delete(`/api/hod-management/faculty/${id}`);
      fetchData();
      showSnackbar('Faculty removed successfully');
    } catch (error) {
      showSnackbar('Error removing faculty', 'error');
    }
  };

  const handleRemoveStudent = async (id) => {
    try {
      await axios.delete(`/api/hod-management/student/${id}`);
      fetchData();
      showSnackbar('Student removed successfully');
    } catch (error) {
      showSnackbar('Error removing student', 'error');
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
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
                onChange={(e) => setNewFaculty({ ...newFaculty, department: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Branch"
                value={newFaculty.branch}
                onChange={(e) => setNewFaculty({ ...newFaculty, branch: e.target.value })}
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
              <FormControl fullWidth required>
                <InputLabel>Section</InputLabel>
                <Select
                  value={newStudent.section}
                  label="Section"
                  onChange={(e) => setNewStudent({ ...newStudent, section: e.target.value })}
                >
                  <MenuItem value="A">A</MenuItem>
                  <MenuItem value="B">B</MenuItem>
                  <MenuItem value="C">C</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    required
                    fullWidth
                    label="Batch From"
                    type="number"
                    value={newStudent.batch.from}
                    onChange={(e) => setNewStudent({
                      ...newStudent,
                      batch: { ...newStudent.batch, from: e.target.value }
                    })}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    required
                    fullWidth
                    label="Batch To"
                    type="number"
                    value={newStudent.batch.to}
                    onChange={(e) => setNewStudent({
                      ...newStudent,
                      batch: { ...newStudent.batch, to: e.target.value }
                    })}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Department"
                value={newStudent.department}
                onChange={(e) => setNewStudent({ ...newStudent, department: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Branch"
                value={newStudent.branch}
                onChange={(e) => setNewStudent({ ...newStudent, branch: e.target.value })}
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