import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from '../../../config/axios';
import{
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

function StudentList() {
  const [branches, setBranches] = useState([]);
  const [batches, setBatches] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    year: '',
    branch: '',
    batch: '',
    status: '',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const [students, setStudents] = useState([]);
  const [openDialog, setOpenDialog] = useState('');
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
    });``

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelete = async (id) => {
    try {
      console.log(id)
      if (! window.confirm("Are you sure you want to delete this student?")) return;
      await axios.delete(`api/students/${id}`);
      setStudents((prev) => prev.filter((student) => student._id !== id));
      showSnackbar("Student deleted successfully")
    } catch (error) {
      console.error(error);
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
      // const semester = calculateSemester(newStudent.batch.from);
      await axios.post('/api/hod-management/student', {
        ...newStudent,
        batch: `${newStudent.batch.from}-${newStudent.batch.to}`
      });
      setOpenDialog('');
      fetchData();
      showSnackbar('Student added successfully');
    } catch (error) {
      console.log(error)
      showSnackbar(error.response?.data?.message || 'Error adding student', 'error');
    }
  };


  const fetchData = async () => {
    const [studentsRes, branchesRes, batchesRes] = await Promise.all([
      axios.get('api/students'),
      axios.get('/api/branches'),
      axios.get('/api/batches')
    ]);
    setBranches(branchesRes.data.data);
    setStudents(studentsRes.data.data);
    setBatches(batchesRes.data.data);
  }

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  useEffect(()=>{
    fetchData()
  }, [])

  const filteredStudents = students.filter((student) => {
    return (
      (student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.course?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filters.branch === '' || student.branch?._id === filters.branch) &&
      (filters.batch === '' || student.batch === filters.batch)
    );
  });  

  const navigate = useNavigate();
  return (
    <div className="max-w-7xl mx-auto px-4 mt-10 space-y-6">
      <h1 className="text-3xl font-bold text-blue-800">🎓 Students</h1>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <input
          type="text"
          placeholder="Search by name, email, or course..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="col-span-2 px-4 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          name="branch"
          value={filters.branch}
          onChange={handleFilterChange}
          className="px-4 py-2 border border-gray-300 rounded shadow-sm"
        >
          <option value="">All Branches</option>
          {
            branches.map((b)=>{
              return(
                <option key={b._id} value={b._id}> {b.name}</option>
              )
            })
          }
        </select>

        <select
          name="batch"
          value={filters.batch}
          onChange={handleFilterChange}
          className="px-4 py-2 border border-gray-300 rounded shadow-sm"
        >
          <option value="">All Batches</option>
          {
            batches.map((b)=>{
              return(
                <option key={b._id} value={b.name}> {b.name}</option>
              )
            })
          }
        </select>
      </div>

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => setOpenDialog('student')}
      >
        Add Student
      </Button>

      {/* Students Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
          <thead className="bg-gray-100 text-gray-700 text-sm">
            <tr>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Branch</th>
              <th className="px-6 py-3 text-left">Batch</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <tr key={student._id} className="border-b text-sm">
                  <td className="px-6 py-3 font-medium text-gray-800">{student.name}</td>
                  <td className="px-6 py-3 text-gray-600">{student.email}</td>
                  <td className="px-6 py-3 text-gray-600">{student.branch.name}</td>
                  <td className="px-6 py-3 text-gray-600">{student.batch}</td>
                  <td className="px-6 py-3 space-x-2">
                    <button onClick={() => navigate(`/students/view/${student.id}`)} className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">View</button>
                    <button onClick={() => navigate(`/students/edit/${student.id}`)} className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600">Edit</button>
                    <button onClick={()=> handleDelete(student._id)} className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-6 text-gray-500">No students match the criteria.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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
    </div>
  );
}

export default StudentList;
