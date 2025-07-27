import React, { useState, useEffect } from 'react';
import axios from '../../config/axios';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
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
  Chip,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  Alert,
  Snackbar,
  CircularProgress,
  Tooltip,
  Badge,
  Avatar,
  Stack,
  Pagination
} from '@mui/material';
import {
  Add as AddIcon,
  Send as SendIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Notifications as NotificationsIcon,
  School as SchoolIcon,
  CalendarToday as CalendarIcon,
  PriorityHigh as PriorityIcon,
  Close as CloseIcon
} from '@mui/icons-material';

const FacultyNotifications = () => {
  // State management
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0); // 0: All, 1: Sent, 2: Received
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({ sent: 0, received: 0 });
  
  // Filter states
  const [filters, setFilters] = useState({
    priority: '',
    dateFrom: '',
    dateTo: ''
  });
  
  // Dialog states
  const [openDialog, setOpenDialog] = useState('');
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [editMode, setEditMode] = useState(false);
  
  // Form state for creating/editing notices (Faculty can only send to students)
  const [noticeForm, setNoticeForm] = useState({
    title: '',
    message: '',
    audience: 'students', // Fixed for faculty
    priority: 'medium',
    expirationDate: ''
  });
  
  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Utility functions
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // API functions
  const fetchNotices = async () => {
    setLoading(true);
    try {
      const type = activeTab === 1 ? 'sent' : activeTab === 2 ? 'received' : 'all';
      const params = {
        type,
        page: currentPage,
        limit: 10,
        ...filters
      };
      
      const response = await axios.get('/api/notices/faculty', { params });
      setNotices(response.data.notices || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Error fetching notices', 'error');
      setNotices([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/notices/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const createNotice = async () => {
    try {
      await axios.post('/api/notices', noticeForm);
      showSnackbar('Notice sent to students successfully!');
      setOpenDialog('');
      resetForm();
      fetchNotices();
      fetchStats();
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Error creating notice', 'error');
    }
  };

  const updateNotice = async () => {
    try {
      await axios.put(`/api/notices/${selectedNotice._id}`, noticeForm);
      showSnackbar('Notice updated successfully!');
      setOpenDialog('');
      resetForm();
      fetchNotices();
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Error updating notice', 'error');
    }
  };

  const deleteNotice = async (noticeId) => {
    if (window.confirm('Are you sure you want to delete this notice?')) {
      try {
        await axios.delete(`/api/notices/${noticeId}`);
        showSnackbar('Notice deleted successfully!');
        fetchNotices();
        fetchStats();
      } catch (error) {
        showSnackbar(error.response?.data?.message || 'Error deleting notice', 'error');
      }
    }
  };

  // Form handlers
  const resetForm = () => {
    setNoticeForm({
      title: '',
      message: '',
      audience: 'students', // Always students for faculty
      priority: 'medium',
      expirationDate: ''
    });
    setEditMode(false);
    setSelectedNotice(null);
  };

  const handleOpenCreateDialog = () => {
    resetForm();
    setOpenDialog('create');
  };

  const handleOpenEditDialog = (notice) => {
    setSelectedNotice(notice);
    setNoticeForm({
      title: notice.title,
      message: notice.message,
      audience: 'students', // Always students for faculty
      priority: notice.priority,
      expirationDate: notice.expirationDate ? new Date(notice.expirationDate).toISOString().split('T')[0] : ''
    });
    setEditMode(true);
    setOpenDialog('create');
  };

  const handleOpenViewDialog = (notice) => {
    setSelectedNotice(notice);
    setOpenDialog('view');
  };

  const handleFormSubmit = () => {
    if (editMode) {
      updateNotice();
    } else {
      createNotice();
    }
  };

  // Effects
  useEffect(() => {
    fetchNotices();
    fetchStats();
  }, [activeTab, currentPage, filters]);

  // Helper functions
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ 
          background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <NotificationsIcon sx={{ fontSize: 40, color: '#1976d2' }} />
          Faculty Notifications
        </Typography>
        
        {/* Stats Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" component="div">{stats.sent}</Typography>
                    <Typography variant="body2">Sent to Students</Typography>
                  </Box>
                  <SendIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" component="div">{stats.received}</Typography>
                    <Typography variant="body2">Received Notices</Typography>
                  </Box>
                  <NotificationsIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" component="div">{notices.length}</Typography>
                    <Typography variant="body2">Current Page</Typography>
                  </Box>
                  <ViewIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenCreateDialog}
              sx={{ 
                height: '100%',
                minHeight: 100,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
                }
              }}
              fullWidth
            >
              Send Notice to Students
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Tabs and Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
              <Tab label="All Notices" />
              <Tab label="Sent" />
              <Tab label="Received" />
            </Tabs>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Refresh">
                <IconButton onClick={fetchNotices} disabled={loading}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Filter">
                <IconButton>
                  <FilterIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          
          {/* Filters */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Priority</InputLabel>
                <Select
                  value={filters.priority}
                  label="Priority"
                  onChange={(e) => setFilters({...filters, priority: e.target.value})}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                size="small"
                type="date"
                label="From Date"
                InputLabelProps={{ shrink: true }}
                value={filters.dateFrom}
                onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                size="small"
                type="date"
                label="To Date"
                InputLabelProps={{ shrink: true }}
                value={filters.dateTo}
                onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Notices Table */}
      <Card>
        <CardContent>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : notices.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <SchoolIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No notices found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Send your first notice to students to get started
              </Typography>
            </Box>
          ) : (
            <>
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell><strong>Title</strong></TableCell>
                      <TableCell><strong>Audience</strong></TableCell>
                      <TableCell><strong>Priority</strong></TableCell>
                      <TableCell><strong>Date</strong></TableCell>
                      <TableCell><strong>Status</strong></TableCell>
                      <TableCell align="center"><strong>Actions</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {notices.map((notice) => (
                      <TableRow key={notice._id} hover>
                        <TableCell>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'medium' }}>
                            {notice.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {notice.message.substring(0, 50)}...
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={<SchoolIcon />}
                            label="Students"
                            color="primary"
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={<PriorityIcon />}
                            label={notice.priority.charAt(0).toUpperCase() + notice.priority.slice(1)}
                            color={getPriorityColor(notice.priority)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {formatDate(notice.createdAt)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={notice.isExpired ? 'Expired' : 'Active'}
                            color={notice.isExpired ? 'error' : 'success'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Stack direction="row" spacing={1} justifyContent="center">
                            <Tooltip title="View">
                              <IconButton
                                size="small"
                                onClick={() => handleOpenViewDialog(notice)}
                                sx={{ color: 'primary.main' }}
                              >
                                <ViewIcon />
                              </IconButton>
                            </Tooltip>
                            {/* Only show edit/delete for sent notices */}
                            {notice.sender && (
                              <>
                                <Tooltip title="Edit">
                                  <IconButton
                                    size="small"
                                    onClick={() => handleOpenEditDialog(notice)}
                                    sx={{ color: 'warning.main' }}
                                  >
                                    <EditIcon />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete">
                                  <IconButton
                                    size="small"
                                    onClick={() => deleteNotice(notice._id)}
                                    sx={{ color: 'error.main' }}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </Tooltip>
                              </>
                            )}
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              {/* Pagination */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(e, page) => setCurrentPage(page)}
                  color="primary"
                />
              </Box>
            </>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Notice Dialog */}
      <Dialog 
        open={openDialog === 'create'} 
        onClose={() => setOpenDialog('')}
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
          <SchoolIcon />
          {editMode ? 'Edit Notice to Students' : 'Send Notice to Students'}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                value={noticeForm.title}
                onChange={(e) => setNoticeForm({...noticeForm, title: e.target.value})}
                required
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Message"
                multiline
                rows={4}
                value={noticeForm.message}
                onChange={(e) => setNoticeForm({...noticeForm, message: e.target.value})}
                required
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth disabled>
                <InputLabel>Audience</InputLabel>
                <Select
                  value="students"
                  label="Audience"
                >
                  <MenuItem value="students">👨‍🎓 Students Only</MenuItem>
                </Select>
              </FormControl>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Faculty can only send notices to students
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={noticeForm.priority}
                  label="Priority"
                  onChange={(e) => setNoticeForm({...noticeForm, priority: e.target.value})}
                >
                  <MenuItem value="low">🟢 Low</MenuItem>
                  <MenuItem value="medium">🟡 Medium</MenuItem>
                  <MenuItem value="high">🔴 High</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="date"
                label="Expiration Date (Optional)"
                InputLabelProps={{ shrink: true }}
                value={noticeForm.expirationDate}
                onChange={(e) => setNoticeForm({...noticeForm, expirationDate: e.target.value})}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenDialog('')} color="inherit">
            Cancel
          </Button>
          <Button 
            onClick={handleFormSubmit}
            variant="contained"
            startIcon={editMode ? <EditIcon /> : <SendIcon />}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
              }
            }}
          >
            {editMode ? 'Update Notice' : 'Send to Students'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Notice Dialog */}
      <Dialog 
        open={openDialog === 'view'} 
        onClose={() => setOpenDialog('')}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <ViewIcon />
          Notice Details
          <IconButton
            onClick={() => setOpenDialog('')}
            sx={{ ml: 'auto', color: 'white' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {selectedNotice && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedNotice.title}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Audience:</Typography>
                  <Chip
                    icon={<SchoolIcon />}
                    label="Students"
                    color="primary"
                    sx={{ mt: 0.5 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Priority:</Typography>
                  <Chip
                    icon={<PriorityIcon />}
                    label={selectedNotice.priority.charAt(0).toUpperCase() + selectedNotice.priority.slice(1)}
                    color={getPriorityColor(selectedNotice.priority)}
                    sx={{ mt: 0.5 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Created: {formatDate(selectedNotice.createdAt)}
                  </Typography>
                  {selectedNotice.expirationDate && (
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Expires: {formatDate(selectedNotice.expirationDate)}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Message:
                  </Typography>
                  <Paper sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
                    <Typography variant="body1">
                      {selectedNotice.message}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
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
    </Container>
  );
};

export default FacultyNotifications;
