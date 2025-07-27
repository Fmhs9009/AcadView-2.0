import React, { useState, useEffect } from 'react';
import axios from '../../config/axios';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
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
  Visibility as ViewIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Notifications as NotificationsIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  CalendarToday as CalendarIcon,
  Priority as PriorityIcon,
  Close as CloseIcon,
  MarkEmailRead as MarkReadIcon,
  Announcement as AnnouncementIcon
} from '@mui/icons-material';

const StudentNotifications = () => {
  // State management
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0); // 0: All, 1: Unread, 2: Read
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({ total: 0, unread: 0, read: 0 });
  
  // Filter states
  const [filters, setFilters] = useState({
    priority: '',
    sender: '', // faculty or hod
    dateFrom: '',
    dateTo: ''
  });
  
  // Dialog states
  const [openDialog, setOpenDialog] = useState('');
  const [selectedNotice, setSelectedNotice] = useState(null);
  
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
      const status = activeTab === 1 ? 'unread' : activeTab === 2 ? 'read' : 'all';
      const params = {
        status,
        page: currentPage,
        limit: 10,
        ...filters
      };
      
      const response = await axios.get('/api/notices/student', { params });
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
      const response = await axios.get('/api/notices/student/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const markAsRead = async (noticeId) => {
    try {
      await axios.put(`/api/notices/${noticeId}/read`);
      fetchNotices();
      fetchStats();
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Error marking notice as read', 'error');
    }
  };

  // Dialog handlers
  const handleOpenViewDialog = async (notice) => {
    setSelectedNotice(notice);
    setOpenDialog('view');
    
    // Mark as read when viewing
    if (!notice.isRead) {
      await markAsRead(notice._id);
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

  const getSenderIcon = (senderRole) => {
    switch (senderRole) {
      case 'hod': return <PersonIcon />;
      case 'faculty': return <SchoolIcon />;
      default: return <AnnouncementIcon />;
    }
  };

  const getSenderColor = (senderRole) => {
    switch (senderRole) {
      case 'hod': return 'primary';
      case 'faculty': return 'secondary';
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
          My Notifications
        </Typography>
        
        {/* Stats Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" component="div">{stats.total}</Typography>
                    <Typography variant="body2">Total Notices</Typography>
                  </Box>
                  <NotificationsIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" component="div">{stats.unread}</Typography>
                    <Typography variant="body2">Unread Notices</Typography>
                  </Box>
                  <Badge badgeContent={stats.unread} color="error">
                    <AnnouncementIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                  </Badge>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" component="div">{stats.read}</Typography>
                    <Typography variant="body2">Read Notices</Typography>
                  </Box>
                  <MarkReadIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Tabs and Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
              <Tab 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    All Notices
                    {stats.total > 0 && <Badge badgeContent={stats.total} color="primary" />}
                  </Box>
                } 
              />
              <Tab 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    Unread
                    {stats.unread > 0 && <Badge badgeContent={stats.unread} color="error" />}
                  </Box>
                } 
              />
              <Tab label="Read" />
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
            <Grid item xs={12} sm={6} md={3}>
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
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Sender</InputLabel>
                <Select
                  value={filters.sender}
                  label="Sender"
                  onChange={(e) => setFilters({...filters, sender: e.target.value})}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="hod">HOD</MenuItem>
                  <MenuItem value="faculty">Faculty</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
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
            <Grid item xs={12} sm={6} md={3}>
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
              <NotificationsIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No notices found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                You'll see notices from your faculty and HOD here
              </Typography>
            </Box>
          ) : (
            <>
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell><strong>Title</strong></TableCell>
                      <TableCell><strong>From</strong></TableCell>
                      <TableCell><strong>Priority</strong></TableCell>
                      <TableCell><strong>Date</strong></TableCell>
                      <TableCell><strong>Status</strong></TableCell>
                      <TableCell align="center"><strong>Actions</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {notices.map((notice) => (
                      <TableRow 
                        key={notice._id} 
                        hover
                        sx={{ 
                          backgroundColor: !notice.isRead ? 'rgba(25, 118, 210, 0.04)' : 'inherit',
                          borderLeft: !notice.isRead ? '4px solid #1976d2' : 'none'
                        }}
                      >
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {!notice.isRead && (
                              <Box sx={{ 
                                width: 8, 
                                height: 8, 
                                borderRadius: '50%', 
                                backgroundColor: '#1976d2' 
                              }} />
                            )}
                            <Box>
                              <Typography variant="subtitle2" sx={{ fontWeight: 'medium' }}>
                                {notice.title}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" noWrap>
                                {notice.message.substring(0, 50)}...
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={getSenderIcon(notice.senderRole)}
                            label={notice.senderRole === 'hod' ? 'HOD' : 'Faculty'}
                            color={getSenderColor(notice.senderRole)}
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
                            label={notice.isExpired ? 'Expired' : notice.isRead ? 'Read' : 'Unread'}
                            color={notice.isExpired ? 'error' : notice.isRead ? 'success' : 'warning'}
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
                            {!notice.isRead && (
                              <Tooltip title="Mark as Read">
                                <IconButton
                                  size="small"
                                  onClick={() => markAsRead(notice._id)}
                                  sx={{ color: 'success.main' }}
                                >
                                  <MarkReadIcon />
                                </IconButton>
                              </Tooltip>
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
                  <Typography variant="body2" color="text.secondary">From:</Typography>
                  <Chip
                    icon={getSenderIcon(selectedNotice.senderRole)}
                    label={selectedNotice.senderRole === 'hod' ? 'HOD' : 'Faculty'}
                    color={getSenderColor(selectedNotice.senderRole)}
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
                    Sent: {formatDate(selectedNotice.createdAt)}
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

export default StudentNotifications;
