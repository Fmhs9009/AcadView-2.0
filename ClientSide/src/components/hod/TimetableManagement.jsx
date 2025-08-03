import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
  Divider,
  Badge,
  Avatar,
  CardMedia
} from '@mui/material';
import {
  Add as AddIcon,
  Schedule as ScheduleIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Upload as UploadIcon,
  CalendarToday as CalendarIcon,
  CloudUpload as CloudUploadIcon,
  PictureAsPdf as PdfIcon,
  Image as ImageIcon,
  GetApp as DownloadIcon,
  Star as StarIcon,
  AccessTime as TimeIcon
} from '@mui/icons-material';
import axios from '../../config/axios';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`timetable-tabpanel-${index}`}
      aria-labelledby={`timetable-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

// Helper function to get file icon based on file type
function getFileIcon(fileName) {
  if (!fileName) return <ScheduleIcon color="primary" />;
  
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'pdf':
      return <PdfIcon sx={{ color: '#d32f2f' }} />;
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return <ImageIcon sx={{ color: '#1976d2' }} />;
    default:
      return <ScheduleIcon color="primary" />;
  }
}

function TimetableManagement() {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Data states
  const [batches, setBatches] = useState([]);
  const [branches, setBranches] = useState([]);
  const [sections, setSections] = useState([]);
  const [timetables, setTimetables] = useState([]);

  // Form states for uploading timetable
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    batch: '',
    branch: '',
    section: '',
    type: 'student', // 'student' or 'faculty'
    status: 'current', // 'current' or 'future'
    effectiveDate: '',
    file: null
  });

  // Dialog states
  const [uploadDialog, setUploadDialog] = useState(false);
  const [viewDialog, setViewDialog] = useState(false);
  const [selectedTimetable, setSelectedTimetable] = useState(null);

  useEffect(() => {
    fetchInitialData();
    fetchTimetables();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [batchRes, branchRes] = await Promise.all([
        axios.get('/api/batches'),
        axios.get('/api/branches')
      ]);

      setBatches(batchRes.data.data || []);
      setBranches(branchRes.data.data || []);
      setSections(['A', 'B', 'C', 'D']); // Default sections
    } catch (error) {
      console.error('Error fetching initial data:', error);
      showSnackbar('Error loading data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchTimetables = async () => {
    try {
      const response = await axios.get('/api/timetables/files');
      setTimetables(response.data.data || []);
    } catch (error) {
      console.error('Error fetching timetables:', error);
      showSnackbar('Error loading timetables', 'error');
    }
  };

  const handleUploadFormChange = (field, value) => {
    setUploadForm(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        showSnackbar('Please upload only PDF or image files (JPG, PNG)', 'error');
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        showSnackbar('File size should be less than 10MB', 'error');
        return;
      }
      
      setUploadForm(prev => ({ ...prev, file }));
    }
  };

  const handleUploadSubmit = async () => {
    if (!uploadForm.title || !uploadForm.type || !uploadForm.file) {
      showSnackbar('Please fill all required fields and select a file', 'error');
      return;
    }

    if (uploadForm.status === 'future' && !uploadForm.effectiveDate) {
      showSnackbar('Please select effective date for future timetable', 'error');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', uploadForm.title);
      formData.append('description', uploadForm.description);
      formData.append('batch', uploadForm.batch);
      formData.append('branch', uploadForm.branch);
      formData.append('section', uploadForm.section);
      formData.append('type', uploadForm.type);
      formData.append('status', uploadForm.status);
      formData.append('effectiveDate', uploadForm.effectiveDate);
      formData.append('file', uploadForm.file);

      await axios.post('/api/timetables/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      showSnackbar('Timetable uploaded successfully', 'success');
      setUploadDialog(false);
      resetUploadForm();
      fetchTimetables();
    } catch (error) {
      console.error('Error uploading timetable:', error);
      showSnackbar('Error uploading timetable', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTimetable = async (id) => {
    if (!window.confirm('Are you sure you want to delete this timetable?')) return;

    setLoading(true);
    try {
      await axios.delete(`/api/timetables/files/${id}`);
      showSnackbar('Timetable deleted successfully', 'success');
      fetchTimetables();
    } catch (error) {
      console.error('Error deleting timetable:', error);
      showSnackbar('Error deleting timetable', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSetCurrent = async (id) => {
    if (!window.confirm('Set this timetable as current? This will replace the existing current timetable.')) return;

    setLoading(true);
    try {
      await axios.patch(`/api/timetables/${id}/set-current`);
      showSnackbar('Timetable set as current successfully', 'success');
      fetchTimetables();
    } catch (error) {
      console.error('Error setting timetable as current:', error);
      showSnackbar('Error setting timetable as current', 'error');
    } finally {
      setLoading(false);
    }
  };

  const resetUploadForm = () => {
    setUploadForm({
      title: '',
      description: '',
      batch: '',
      branch: '',
      section: '',
      type: 'student',
      status: 'current',
      effectiveDate: '',
      file: null
    });
    // Reset file input
    const fileInput = document.getElementById('timetable-file-input');
    if (fileInput) fileInput.value = '';
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleViewTimetable = (timetable) => {
    setSelectedTimetable(timetable);
    setViewDialog(true);
  };

  // Computed values for filtered timetables
  const studentTimetables = timetables.filter(t => t.type === 'student');
  const facultyTimetables = timetables.filter(t => t.type === 'faculty');

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ borderRadius: 2 }}>
        <Box sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          p: 3,
          borderRadius: '8px 8px 0 0'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <ScheduleIcon sx={{ fontSize: 40 }} />
            <Box>
              <Typography variant="h4" component="h1" fontWeight="bold">
                Timetable Management
              </Typography>
              <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                Upload and manage PDF/Image timetables for students and faculty
              </Typography>
            </Box>
          </Box>
        </Box>

        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}
        >
          <Tab 
            label="Upload Timetable" 
            icon={<CloudUploadIcon />} 
            iconPosition="start"
          />
          <Tab 
            label="Student Timetables" 
            icon={<SchoolIcon />} 
            iconPosition="start"
          />
          <Tab 
            label="Faculty Timetables" 
            icon={<PersonIcon />} 
            iconPosition="start"
          />
        </Tabs>

        {/* Upload Timetable Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CloudUploadIcon color="primary" />
                    Upload New Timetable
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  
                  <Grid container spacing={3}>
                    {/* Title */}
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Timetable Title"
                        value={uploadForm.title}
                        onChange={(e) => handleUploadFormChange('title', e.target.value)}
                        placeholder="e.g., CSE 3rd Semester - Winter 2024"
                        required
                      />
                    </Grid>

                    {/* Description */}
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Description"
                        value={uploadForm.description}
                        onChange={(e) => handleUploadFormChange('description', e.target.value)}
                        placeholder="Brief description of the timetable"
                      />
                    </Grid>

                    {/* Timetable Type */}
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth required>
                        <InputLabel>Timetable Type</InputLabel>
                        <Select
                          value={uploadForm.type}
                          onChange={(e) => handleUploadFormChange('type', e.target.value)}
                          label="Timetable Type"
                        >
                          <MenuItem value="student">👨‍🎓 Student Timetable</MenuItem>
                          <MenuItem value="faculty">👨‍🏫 Faculty Timetable</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    {/* Status */}
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth required>
                        <InputLabel>Status</InputLabel>
                        <Select
                          value={uploadForm.status}
                          onChange={(e) => handleUploadFormChange('status', e.target.value)}
                          label="Status"
                        >
                          <MenuItem value="current">⭐ Current Timetable</MenuItem>
                          <MenuItem value="future">🔮 Future Timetable</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    {/* Effective Date - Only for future timetables */}
                    {uploadForm.status === 'future' && (
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          type="date"
                          label="Effective Date"
                          value={uploadForm.effectiveDate}
                          onChange={(e) => handleUploadFormChange('effectiveDate', e.target.value)}
                          InputLabelProps={{ shrink: true }}
                          required
                          helperText="When should this timetable become active?"
                        />
                      </Grid>
                    )}

                    {/* Optional Metadata Fields */}
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Batch (Optional)</InputLabel>
                        <Select
                          value={uploadForm.batch}
                          onChange={(e) => handleUploadFormChange('batch', e.target.value)}
                          label="Batch (Optional)"
                        >
                          <MenuItem value="">All Batches</MenuItem>
                          {batches.map(batch => (
                            <MenuItem key={batch._id} value={batch._id}>
                              {batch.name || `${batch.startYear}-${batch.endYear}`}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Branch (Optional)</InputLabel>
                        <Select
                          value={uploadForm.branch}
                          onChange={(e) => handleUploadFormChange('branch', e.target.value)}
                          label="Branch (Optional)"
                        >
                          <MenuItem value="">All Branches</MenuItem>
                          {branches.map(branch => (
                            <MenuItem key={branch._id} value={branch._id}>
                              {branch.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Section (Optional)</InputLabel>
                        <Select
                          value={uploadForm.section}
                          onChange={(e) => handleUploadFormChange('section', e.target.value)}
                          label="Section (Optional)"
                        >
                          <MenuItem value="">All Sections</MenuItem>
                          {sections.map(section => (
                            <MenuItem key={section} value={section}>
                              Section {section}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    {/* File Upload Section */}
                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }}>
                        <Chip label="📎 Upload Timetable File" color="primary" variant="outlined" />
                      </Divider>
                    </Grid>

                    <Grid item xs={12}>
                      <Box
                        sx={{
                          border: '2px dashed #ccc',
                          borderRadius: 2,
                          p: 3,
                          textAlign: 'center',
                          bgcolor: uploadForm.file ? '#f0f8ff' : '#fafafa',
                          borderColor: uploadForm.file ? '#1976d2' : '#ccc',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <input
                          id="timetable-file-input"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={handleFileChange}
                          style={{ display: 'none' }}
                        />
                        
                        {uploadForm.file ? (
                          <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
                              {getFileIcon(uploadForm.file.name)}
                              <Typography variant="h6" color="primary">
                                {uploadForm.file.name}
                              </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Size: {(uploadForm.file.size / (1024 * 1024)).toFixed(2)} MB
                            </Typography>
                            <Button
                              variant="outlined"
                              onClick={() => document.getElementById('timetable-file-input').click()}
                              startIcon={<CloudUploadIcon />}
                            >
                              Change File
                            </Button>
                          </Box>
                        ) : (
                          <Box>
                            <CloudUploadIcon sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
                            <Typography variant="h6" gutterBottom>
                              Upload Timetable File
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Drag and drop or click to select PDF or Image files
                            </Typography>
                            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                              Supported formats: PDF, JPG, PNG (Max size: 10MB)
                            </Typography>
                            <Button
                              variant="contained"
                              onClick={() => document.getElementById('timetable-file-input').click()}
                              startIcon={<CloudUploadIcon />}
                              sx={{ mt: 2 }}
                            >
                              Select File
                            </Button>
                          </Box>
                        )}
                      </Box>
                    </Grid>

                  </Grid>
                </CardContent>
                <CardActions sx={{ p: 3, pt: 0 }}>
                  <Button
                    variant="contained"
                    onClick={handleUploadSubmit}
                    disabled={loading || !uploadForm.file}
                    startIcon={loading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
                    sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                      }
                    }}
                  >
                    {loading ? 'Uploading...' : 'Upload Timetable'}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={resetUploadForm}
                    disabled={loading}
                  >
                    Reset Form
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Student Timetables Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SchoolIcon color="primary" />
              Student Timetables ({studentTimetables.length})
            </Typography>
          </Box>

          {studentTimetables.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <ScheduleIcon sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
              <Typography variant="h6" color="textSecondary" gutterBottom>
                No Student Timetables Found
              </Typography>
              <Typography color="textSecondary">
                Upload student timetables using the Upload tab to get started.
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {studentTimetables.map((timetable) => (
                <Grid item xs={12} md={6} lg={4} key={timetable._id}>
                  <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        {getFileIcon(timetable.fileName)}
                        <Typography variant="h6" component="h3" noWrap>
                          {timetable.title}
                        </Typography>
                        {timetable.status === 'current' && (
                          <Badge badgeContent={<StarIcon sx={{ fontSize: 12 }} />} color="warning" />
                        )}
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {timetable.description || 'No description provided'}
                      </Typography>
                      
                      <Box sx={{ mt: 2 }}>
                        <Chip 
                          label={timetable.type === 'student' ? '👨‍🎓 Student' : '👨‍🏫 Faculty'}
                          color="primary"
                          size="small"
                          sx={{ mr: 1, mb: 1 }}
                        />
                        <Chip 
                          label={timetable.status === 'current' ? '⭐ Current' : '🔮 Future'}
                          color={timetable.status === 'current' ? 'success' : 'info'}
                          size="small"
                          sx={{ mr: 1, mb: 1 }}
                        />
                      </Box>
                      
                      {(timetable.batch || timetable.branch || timetable.section) && (
                        <Box sx={{ mt: 1 }}>
                          {timetable.batch && (
                            <Typography variant="caption" display="block">
                              📚 Batch: {timetable.batch?.name || timetable.batch}
                            </Typography>
                          )}
                          {timetable.branch && (
                            <Typography variant="caption" display="block">
                              🏢 Branch: {timetable.branch?.name || timetable.branch}
                            </Typography>
                          )}
                          {timetable.section && (
                            <Typography variant="caption" display="block">
                              📋 Section: {timetable.section}
                            </Typography>
                          )}
                        </Box>
                      )}
                      
                      {timetable.effectiveDate && (
                        <Typography variant="caption" color="info.main" display="block" sx={{ mt: 1 }}>
                          🗓️ Effective: {new Date(timetable.effectiveDate).toLocaleDateString()}
                        </Typography>
                      )}
                    </CardContent>
                    
                    <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                      <Box>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleViewTimetable(timetable)}
                          title="View Timetable"
                        >
                          <ViewIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() => window.open(timetable.fileUrl, '_blank')}
                          title="Download"
                        >
                          <DownloadIcon />
                        </IconButton>
                        {timetable.status === 'future' && (
                          <IconButton
                            size="small"
                            color="warning"
                            onClick={() => handleSetCurrent(timetable._id)}
                            title="Set as Current"
                          >
                            <StarIcon />
                          </IconButton>
                        )}
                      </Box>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteTimetable(timetable._id)}
                        title="Delete"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </TabPanel>

        {/* Faculty Timetables Tab */}
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PersonIcon color="primary" />
              Faculty Timetables ({facultyTimetables.length})
            </Typography>
          </Box>

          {facultyTimetables.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <ScheduleIcon sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
              <Typography variant="h6" color="textSecondary" gutterBottom>
                No Faculty Timetables Found
              </Typography>
              <Typography color="textSecondary">
                Upload faculty timetables using the Upload tab to get started.
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {facultyTimetables.map((timetable) => (
                <Grid item xs={12} md={6} lg={4} key={timetable._id}>
                  <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        {getFileIcon(timetable.fileName)}
                        <Typography variant="h6" component="h3" noWrap>
                          {timetable.title}
                        </Typography>
                        {timetable.status === 'current' && (
                          <Badge badgeContent={<StarIcon sx={{ fontSize: 12 }} />} color="warning" />
                        )}
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {timetable.description || 'No description provided'}
                      </Typography>
                      
                      <Box sx={{ mt: 2 }}>
                        <Chip 
                          label={timetable.type === 'student' ? '👨‍🎓 Student' : '👨‍🏫 Faculty'}
                          color="secondary"
                          size="small"
                          sx={{ mr: 1, mb: 1 }}
                        />
                        <Chip 
                          label={timetable.status === 'current' ? '⭐ Current' : '🔮 Future'}
                          color={timetable.status === 'current' ? 'success' : 'info'}
                          size="small"
                          sx={{ mr: 1, mb: 1 }}
                        />
                      </Box>
                      
                      {(timetable.batch || timetable.branch || timetable.section) && (
                        <Box sx={{ mt: 1 }}>
                          {timetable.batch && (
                            <Typography variant="caption" display="block">
                              📚 Batch: {timetable.batch?.name || timetable.batch}
                            </Typography>
                          )}
                          {timetable.branch && (
                            <Typography variant="caption" display="block">
                              🏢 Branch: {timetable.branch?.name || timetable.branch}
                            </Typography>
                          )}
                          {timetable.section && (
                            <Typography variant="caption" display="block">
                              📋 Section: {timetable.section}
                            </Typography>
                          )}
                        </Box>
                      )}
                      
                      {timetable.effectiveDate && (
                        <Typography variant="caption" color="info.main" display="block" sx={{ mt: 1 }}>
                          🗓️ Effective: {new Date(timetable.effectiveDate).toLocaleDateString()}
                        </Typography>
                      )}
                    </CardContent>
                    
                    <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                      <Box>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleViewTimetable(timetable)}
                          title="View Timetable"
                        >
                          <ViewIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() => window.open(timetable.fileUrl, '_blank')}
                          title="Download"
                        >
                          <DownloadIcon />
                        </IconButton>
                        {timetable.status === 'future' && (
                          <IconButton
                            size="small"
                            color="warning"
                            onClick={() => handleSetCurrent(timetable._id)}
                            title="Set as Current"
                          >
                            <StarIcon />
                          </IconButton>
                        )}
                      </Box>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteTimetable(timetable._id)}
                        title="Delete"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </TabPanel>
      </Paper>

      {/* View Timetable Dialog */}
      <Dialog
        open={viewDialog}
        onClose={() => setViewDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <ViewIcon />
          View Timetable
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {selectedTimetable && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedTimetable.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {selectedTimetable.description || 'No description provided'}
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Chip 
                  label={selectedTimetable.type === 'student' ? '👨‍🎓 Student' : '👨‍🏫 Faculty'}
                  color="primary"
                  size="small"
                  sx={{ mr: 1 }}
                />
                <Chip 
                  label={selectedTimetable.status === 'current' ? '⭐ Current' : '🔮 Future'}
                  color={selectedTimetable.status === 'current' ? 'success' : 'info'}
                  size="small"
                />
              </Box>
              
              {selectedTimetable.fileUrl && (
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  {selectedTimetable.fileName?.toLowerCase().includes('.pdf') ? (
                    <iframe
                      src={selectedTimetable.fileUrl}
                      width="100%"
                      height="500px"
                      style={{ border: '1px solid #ddd', borderRadius: '4px' }}
                      title="Timetable PDF"
                    />
                  ) : (
                    <img
                      src={selectedTimetable.fileUrl}
                      alt="Timetable"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '500px',
                        border: '1px solid #ddd',
                        borderRadius: '4px'
                      }}
                    />
                  )}
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialog(false)}>Close</Button>
          {selectedTimetable?.fileUrl && (
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={() => window.open(selectedTimetable.fileUrl, '_blank')}
            >
              Download
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default TimetableManagement;
