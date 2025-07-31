import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../../config/axios';
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
  Snackbar,
  Alert,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, RemoveRedEyeOutlined as ViewIcon, Edit as EditIcon, Password } from '@mui/icons-material';

function FacultyList() {
  const [faculties, setFaculties] = useState([]);
  const [branches, setBranches] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    department: '',
    branch: '',
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const [openDialog, setOpenDialog] = useState(false);
  const [newFaculty, setNewFaculty] = useState({
    name: '',
    email: '',
    phoneNo: '',
    gender: '',
    empId: '',
    department: '',
    designation: '',
    qualification: '',
    experience: '',
    address: '',
    dob: '',
  });

  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const [facultyRes, branchRes] = await Promise.all([
        axios.get('/api/faculty'),
        axios.get('/api/branches'),
      ]);
      setFaculties(facultyRes.data.data);
      setBranches(branchRes.data.data);
    } catch (error) {
      showSnackbar('Failed to fetch data', 'error');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this faculty?')) return;
    try {
      await axios.delete(`/api/faculty/${id}`);
      setFaculties((prev) => prev.filter((f) => f._id !== id));
      showSnackbar('Faculty deleted successfully');
    } catch (error) {
      showSnackbar('Error deleting faculty', 'error');
    }
  };

  const handleAddFaculty = async () => {
    const requiredFields = ['name', 'email', 'phoneNo', 'gender', 'empId', 'department', 'designation', 'qualification', 'experience', 'dob'];
    const missing = requiredFields.filter((field) => !newFaculty[field]);

    if (missing.length > 0) {
      showSnackbar(`Please fill all required fields: ${missing.join(', ')}`, 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    if (!emailRegex.test(newFaculty.email)) {
      showSnackbar('Invalid email format', 'error');
      return;
    }

    if (!phoneRegex.test(newFaculty.phoneNo)) {
      showSnackbar('Invalid 10-digit phone number', 'error');
      return;
    }

    try {
      await axios.post('/api/faculty', newFaculty);
      setOpenDialog(false);
      fetchData();
      showSnackbar('Faculty added successfully');
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Error adding faculty', 'error');
    }
  };

  const filteredFaculties = faculties.filter((faculty) =>
    (faculty.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faculty.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faculty.designation?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filters.department === '' || faculty.department === filters.department) &&
    (filters.branch === '' || faculty.branch?._id === filters.branch)&&
    (filters.department === '' || faculty.department === filters.department)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 mt-10 space-y-6">
      <h1 className="text-3xl font-bold text-blue-800">👩‍🏫 Faculty Members</h1>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <input
          type="text"
          placeholder="Search by name, email, or designation..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="col-span-2 px-4 py-2 border border-gray-300 rounded shadow-sm"
        />

        {/* <input
          type="text"
          name="department"
          value={filters.department}
          onChange={handleFilterChange}
          placeholder="Filter by Department"
          className="px-4 py-2 border border-gray-300 rounded shadow-sm"
        /> */}

        <select
          name="department"
          value={filters.department}
          onChange={handleFilterChange}
          className="px-4 py-2 border border-gray-300 rounded shadow-sm"
        >
          <option value="">All Department</option>
          {branches.map((b) => (
            <option key={b._id} value={b.name}>{b.name}</option>
          ))}
        </select>
      </div>

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => setOpenDialog(true)}
      >
        Add Faculty
      </Button>

      {/* Faculty Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-lg">
          <thead className="bg-gray-100 text-gray-700 text-sm">
            <tr>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Department</th>
              {/* <th className="px-6 py-3 text-left">Branch</th> */}
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFaculties.length > 0 ? (
              filteredFaculties.map((faculty) => (
                <tr key={faculty._id} className="border-b text-sm">
                  <td className="px-6 py-3">{faculty.name}</td>
                  <td className="px-6 py-3">{faculty.email}</td>
                  <td className="px-6 py-3">{faculty.department}</td>
                  {/* <td className="px-6 py-3">{faculty.branch?.name || '—'}</td> */}
                  <td className="px-6 py-3 space-x-2">
                    <button onClick={() => navigate(`/faculty/view/${faculty._id}`)} className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"><ViewIcon /></button>
                    <button onClick={() => navigate(`/faculty/edit/${faculty._id}`)} className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"><EditIcon /></button>
                    <button onClick={() => handleDelete(faculty._id)} className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"><DeleteIcon /></button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">No faculty matches the criteria.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Faculty Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
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
                <TextField
                    required
                    fullWidth
                    label="Gender"
                    value={newFaculty.gender}
                    onChange={(e) => setNewFaculty({ ...newFaculty, gender: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    required
                    fullWidth
                    label="Employe Id"
                    value={newFaculty.empId}
                    onChange={(e) => setNewFaculty({ ...newFaculty, empId: e.target.value })}
                    />
            </Grid>
            {/* <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Department"
                value={newFaculty.department}
                onChange={(e) => setNewFaculty({ ...newFaculty, department: e.target.value })}
              />
            </Grid> */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Department</InputLabel>
                <Select
                  value={newFaculty.department}
                  label="Department"
                  onChange={(e) => setNewFaculty({ ...newFaculty, department: e.target.value })}
                >
                  {branches.map((branch) => (
                    <MenuItem key={branch._id} value={branch.name}>{branch.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
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
                    label="Qualification"
                    value={newFaculty.qualification}
                    onChange={(e) => setNewFaculty({ ...newFaculty, qualification: e.target.value })}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    required
                    fullWidth
                    label="Experience"
                    value={newFaculty.experience}
                    onChange={(e) => setNewFaculty({ ...newFaculty, experience: e.target.value })}
                    />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    required
                    fullWidth
                    label="Date Of Birth"
                    value={newFaculty.dob}
                    type='date'
                    onChange={(e) => setNewFaculty({ ...newFaculty, dob: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                    />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="Address"
                    value={newFaculty.address}
                    onChange={(e) => setNewFaculty({ ...newFaculty, address: e.target.value })}
                    />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddFaculty} variant="contained" color="primary">
            Add Faculty
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for feedback */}
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

export default FacultyList;
