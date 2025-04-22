import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Card, 
  CardContent,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Button,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import courseService from '../../services/courseService';
import reportService from '../../services/reportService';

// Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import SchoolIcon from '@mui/icons-material/School';
import PeopleIcon from '@mui/icons-material/People';
import AssessmentIcon from '@mui/icons-material/Assessment';
import BarChartIcon from '@mui/icons-material/BarChart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import StarIcon from '@mui/icons-material/Star';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [courses, setCourses] = useState([]);
  const [reports, setReports] = useState([]);
  const [popularityReport, setPopularityReport] = useState(null);
  const [ratingReport, setRatingReport] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  
  useEffect(() => {
    fetchDashboardData();
  }, []);
  
  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Fetch all courses
      const coursesResponse = await courseService.getAllCourses();
      setCourses(coursesResponse.courses || []);
      
      // Fetch reports
      const reportsResponse = await reportService.getAllReports();
      setReports(reportsResponse.reports || []);
      
      // Generate course popularity report
      try {
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 1);
        const popularityResponse = await reportService.generateCoursePopularityReport(
          startDate.toISOString(),
          new Date().toISOString()
        );
        setPopularityReport(popularityResponse);
      } catch (error) {
        console.error('Error generating popularity report:', error);
      }
      
      // Generate course rating report
      try {
        const ratingResponse = await reportService.generateCourseRatingReport();
        setRatingReport(ratingResponse);
      } catch (error) {
        console.error('Error generating rating report:', error);
      }
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Dashboard Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Administrator Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Welcome back, {user?.name || 'Administrator'}!
        </Typography>
      </Box>
      
      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {/* Dashboard Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SchoolIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  Total Courses
                </Typography>
              </Box>
              <Typography variant="h3" align="center">
                {courses.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PeopleIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  Active Users
                </Typography>
              </Box>
              <Typography variant="h3" align="center">
                {/* This would be fetched from a real API */}
                {Math.floor(Math.random() * 1000) + 500}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AssessmentIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  Reports
                </Typography>
              </Box>
              <Typography variant="h3" align="center">
                {reports.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUpIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  Enrollments
                </Typography>
              </Box>
              <Typography variant="h3" align="center">
                {/* This would be fetched from a real API */}
                {Math.floor(Math.random() * 5000) + 1000}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Tabs for different reports */}
      <Paper sx={{ mb: 4 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Course Popularity" />
          <Tab label="Course Ratings" />
          <Tab label="Generated Reports" />
        </Tabs>
        
        <Box sx={{ p: 3 }}>
          {/* Course Popularity Tab */}
          {tabValue === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Most Popular Courses (Last 30 Days)
              </Typography>
              
              {popularityReport && popularityReport.data && popularityReport.data.length > 0 ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Course</TableCell>
                        <TableCell>Difficulty</TableCell>
                        <TableCell>Language</TableCell>
                        <TableCell align="right">Enrollments</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {popularityReport.data.slice(0, 10).map((item) => (
                        <TableRow key={item.CourseID}>
                          <TableCell>{item.Course?.Title || 'Unknown Course'}</TableCell>
                          <TableCell>{item.Course?.DifficultyLevel || 'N/A'}</TableCell>
                          <TableCell>{item.Course?.Language || 'N/A'}</TableCell>
                          <TableCell align="right">{item.enrollmentCount}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography variant="body1" color="text.secondary">
                  No enrollment data available for the last 30 days.
                </Typography>
              )}
              
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                <Button 
                  variant="contained" 
                  color="primary"
                  href="/admin/reports/generate/popularity"
                >
                  Generate Full Report
                </Button>
              </Box>
            </Box>
          )}
          
          {/* Course Ratings Tab */}
          {tabValue === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Highest Rated Courses
              </Typography>
              
              {ratingReport && ratingReport.data && ratingReport.data.length > 0 ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Course</TableCell>
                        <TableCell>Difficulty</TableCell>
                        <TableCell>Language</TableCell>
                        <TableCell>Reviews</TableCell>
                        <TableCell align="right">Average Rating</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {ratingReport.data.slice(0, 10).map((item) => (
                        <TableRow key={item.CourseID}>
                          <TableCell>{item.Course?.Title || 'Unknown Course'}</TableCell>
                          <TableCell>{item.Course?.DifficultyLevel || 'N/A'}</TableCell>
                          <TableCell>{item.Course?.Language || 'N/A'}</TableCell>
                          <TableCell>{item.reviewCount}</TableCell>
                          <TableCell align="right">
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                              <Typography variant="body2" sx={{ mr: 1 }}>
                                {parseFloat(item.averageRating).toFixed(1)}
                              </Typography>
                              <StarIcon color="primary" fontSize="small" />
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography variant="body1" color="text.secondary">
                  No rating data available.
                </Typography>
              )}
              
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                <Button 
                  variant="contained" 
                  color="primary"
                  href="/admin/reports/generate/rating"
                >
                  Generate Full Report
                </Button>
              </Box>
            </Box>
          )}
          
          {/* Generated Reports Tab */}
          {tabValue === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Recently Generated Reports
              </Typography>
              
              {reports.length > 0 ? (
                <List>
                  {reports.slice(0, 10).map((report) => (
                    <React.Fragment key={report.ReportID}>
                      <ListItem>
                        <ListItemIcon>
                          <BarChartIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={report.Title} 
                          secondary={`Generated: ${new Date(report.GeneratedDate).toLocaleString()}`} 
                        />
                        <Button 
                          variant="outlined" 
                          size="small"
                          href={`/admin/reports/${report.ReportID}`}
                        >
                          View
                        </Button>
                      </ListItem>
                      <Divider component="li" />
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Typography variant="body1" color="text.secondary">
                  No reports have been generated yet.
                </Typography>
              )}
              
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                <Button 
                  variant="contained" 
                  color="primary"
                  href="/admin/reports"
                >
                  View All Reports
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Paper>
      
      {/* Quick Actions */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Administrative Actions
        </Typography>
        
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Button 
              variant="outlined" 
              color="primary" 
              fullWidth
              href="/admin/users"
              startIcon={<PeopleIcon />}
            >
              Manage Users
            </Button>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Button 
              variant="outlined" 
              color="primary" 
              fullWidth
              href="/admin/courses"
              startIcon={<SchoolIcon />}
            >
              Manage Courses
            </Button>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Button 
              variant="outlined" 
              color="primary" 
              fullWidth
              href="/admin/reports/generate"
              startIcon={<AssessmentIcon />}
            >
              Generate Reports
            </Button>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Button 
              variant="outlined" 
              color="primary" 
              fullWidth
              href="/admin/certifications"
              startIcon={<BarChartIcon />}
            >
              Manage Certifications
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default AdminDashboard;
