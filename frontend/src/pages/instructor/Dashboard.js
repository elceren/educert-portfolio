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
  Tab
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import courseService from '../../services/courseService';
import enrollmentService from '../../services/enrollmentService';
import assignmentService from '../../services/assignmentService';
import examService from '../../services/examService';

// Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';
import QuizIcon from '@mui/icons-material/Quiz';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';

const InstructorDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [pendingAssignments, setPendingAssignments] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  
  useEffect(() => {
    fetchDashboardData();
  }, []);
  
  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Fetch instructor courses
      const filters = { instructorId: user?.id };
      const coursesResponse = await courseService.getAllCourses(filters);
      setCourses(coursesResponse.courses || []);
      
      // Fetch students enrolled in instructor's courses
      const enrolledStudents = [];
      for (const course of coursesResponse.courses || []) {
        try {
          const enrollmentsResponse = await enrollmentService.getCourseEnrollments(course.CourseID);
          if (enrollmentsResponse.enrollments) {
            enrolledStudents.push(...enrollmentsResponse.enrollments);
          }
        } catch (error) {
          console.error('Error fetching enrollments for course:', error);
        }
      }
      // Remove duplicates (students enrolled in multiple courses)
      const uniqueStudents = Array.from(new Set(enrolledStudents.map(e => e.StudentID)))
        .map(id => enrolledStudents.find(e => e.StudentID === id));
      setStudents(uniqueStudents);
      
      // Fetch pending assignments to grade
      const assignments = [];
      for (const course of coursesResponse.courses || []) {
        try {
          // This is a simplified approach - in a real app, you'd fetch assignments by course
          const assignmentsResponse = await assignmentService.getLectureAssignments(course.CourseID);
          if (assignmentsResponse.assignments) {
            assignments.push(...assignmentsResponse.assignments);
          }
        } catch (error) {
          console.error('Error fetching assignments for course:', error);
        }
      }
      setPendingAssignments(assignments);
      
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
          Instructor Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Welcome back, {user?.name || 'Instructor'}!
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
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SchoolIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  Your Courses
                </Typography>
              </Box>
              <Typography variant="h3" align="center">
                {courses.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PeopleIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  Enrolled Students
                </Typography>
              </Box>
              <Typography variant="h3" align="center">
                {students.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AssignmentIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  Pending Assignments
                </Typography>
              </Box>
              <Typography variant="h3" align="center">
                {pendingAssignments.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Tabs for different sections */}
      <Paper sx={{ mb: 4 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Your Courses" />
          <Tab label="Student Progress" />
          <Tab label="Assignments to Grade" />
        </Tabs>
        
        <Box sx={{ p: 3 }}>
          {/* Courses Tab */}
          {tabValue === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Courses You Teach
              </Typography>
              
              {courses.length > 0 ? (
                <List>
                  {courses.map((course) => (
                    <React.Fragment key={course.CourseID}>
                      <ListItem>
                        <ListItemIcon>
                          <SchoolIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={course.Title} 
                          secondary={`${course.enrollmentCount || 0} students enrolled`} 
                        />
                        <Button 
                          variant="contained" 
                          color="primary" 
                          size="small"
                          href={`/instructor/courses/${course.CourseID}/edit`}
                        >
                          Manage
                        </Button>
                      </ListItem>
                      <Divider component="li" />
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Typography variant="body1" color="text.secondary">
                  You are not teaching any courses yet.
                </Typography>
              )}
              
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                <Button 
                  variant="contained" 
                  color="primary"
                  href="/instructor/courses/new"
                >
                  Create New Course
                </Button>
              </Box>
            </Box>
          )}
          
          {/* Student Progress Tab */}
          {tabValue === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Student Progress
              </Typography>
              
              {students.length > 0 ? (
                <List>
                  {students.slice(0, 10).map((enrollment) => (
                    <ListItem key={enrollment.StudentID}>
                      <ListItemIcon>
                        <PeopleIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={enrollment.Student?.User?.Name || 'Unknown Student'} 
                        secondary={`Course: ${enrollment.Course?.Title || 'Unknown Course'} - Progress: ${enrollment.Progress || 0}%`} 
                      />
                      <Button 
                        variant="outlined" 
                        size="small"
                        href={`/instructor/students/${enrollment.StudentID}`}
                      >
                        View Details
                      </Button>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body1" color="text.secondary">
                  No students are enrolled in your courses yet.
                </Typography>
              )}
              
              {students.length > 10 && (
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                  <Button 
                    variant="text" 
                    color="primary"
                    href="/instructor/students"
                  >
                    View All Students
                  </Button>
                </Box>
              )}
            </Box>
          )}
          
          {/* Assignments to Grade Tab */}
          {tabValue === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Assignments to Grade
              </Typography>
              
              {pendingAssignments.length > 0 ? (
                <List>
                  {pendingAssignments.slice(0, 10).map((assignment) => (
                    <ListItem key={assignment.AssignmentID}>
                      <ListItemIcon>
                        <AssignmentIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={assignment.Title} 
                        secondary={`Course: ${assignment.Course?.Title || 'Unknown Course'}`} 
                      />
                      <Button 
                        variant="outlined" 
                        size="small"
                        href={`/instructor/assignments/${assignment.AssignmentID}/submissions`}
                      >
                        Grade
                      </Button>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body1" color="text.secondary">
                  No pending assignments to grade.
                </Typography>
              )}
              
              {pendingAssignments.length > 10 && (
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                  <Button 
                    variant="text" 
                    color="primary"
                    href="/instructor/assignments"
                  >
                    View All Assignments
                  </Button>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Paper>
      
      {/* Quick Actions */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Button 
              variant="outlined" 
              color="primary" 
              fullWidth
              href="/instructor/courses/new"
              startIcon={<SchoolIcon />}
            >
              Create Course
            </Button>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Button 
              variant="outlined" 
              color="primary" 
              fullWidth
              href="/instructor/assignments/new"
              startIcon={<AssignmentIcon />}
            >
              Create Assignment
            </Button>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Button 
              variant="outlined" 
              color="primary" 
              fullWidth
              href="/instructor/exams/new"
              startIcon={<QuizIcon />}
            >
              Create Exam
            </Button>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Button 
              variant="outlined" 
              color="primary" 
              fullWidth
              href="/instructor/reports"
              startIcon={<BarChartIcon />}
            >
              View Reports
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default InstructorDashboard;
