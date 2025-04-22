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
  Alert
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import courseService from '../../services/courseService';
import enrollmentService from '../../services/enrollmentService';
import assignmentService from '../../services/assignmentService';
import examService from '../../services/examService';
import certificationService from '../../services/certificationService';

// Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';
import QuizIcon from '@mui/icons-material/Quiz';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [enrollments, setEnrollments] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [upcomingExams, setUpcomingExams] = useState([]);
  const [certifications, setCertifications] = useState([]);
  
  useEffect(() => {
    fetchDashboardData();
  }, []);
  
  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Fetch enrollments
      const enrollmentsResponse = await enrollmentService.getStudentEnrollments();
      setEnrollments(enrollmentsResponse.enrollments || []);
      
      // Fetch pending assignments
      const pendingAssignments = [];
      for (const enrollment of enrollmentsResponse.enrollments || []) {
        try {
          const courseId = enrollment.CourseID;
          // This is a simplified approach - in a real app, you'd fetch assignments by course
          const assignmentsResponse = await assignmentService.getLectureAssignments(courseId);
          if (assignmentsResponse.assignments) {
            pendingAssignments.push(...assignmentsResponse.assignments);
          }
        } catch (error) {
          console.error('Error fetching assignments for course:', error);
        }
      }
      setAssignments(pendingAssignments);
      
      // Fetch upcoming exams
      const exams = [];
      for (const enrollment of enrollmentsResponse.enrollments || []) {
        try {
          const courseId = enrollment.CourseID;
          const examsResponse = await examService.getCourseExams(courseId);
          if (examsResponse.exams) {
            exams.push(...examsResponse.exams);
          }
        } catch (error) {
          console.error('Error fetching exams for course:', error);
        }
      }
      setUpcomingExams(exams);
      
      // Fetch certifications
      const certificationsResponse = await certificationService.getStudentCertifications();
      setCertifications(certificationsResponse.certifications || []);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
      setLoading(false);
    }
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
          Student Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Welcome back, {user?.name || 'Student'}!
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
                  Enrolled Courses
                </Typography>
              </Box>
              <Typography variant="h3" align="center">
                {enrollments.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AssignmentIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  Pending Assignments
                </Typography>
              </Box>
              <Typography variant="h3" align="center">
                {assignments.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <QuizIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  Upcoming Exams
                </Typography>
              </Box>
              <Typography variant="h3" align="center">
                {upcomingExams.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <EmojiEventsIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  Certifications
                </Typography>
              </Box>
              <Typography variant="h3" align="center">
                {certifications.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Course Progress */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Your Course Progress
        </Typography>
        
        {enrollments.length > 0 ? (
          <List>
            {enrollments.map((enrollment) => (
              <React.Fragment key={enrollment.CourseID}>
                <ListItem>
                  <ListItemIcon>
                    <TrendingUpIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={enrollment.Course?.Title || 'Unknown Course'} 
                    secondary={`Progress: ${enrollment.Progress || 0}%`} 
                  />
                  <Button 
                    variant="contained" 
                    color="primary" 
                    size="small"
                    href={`/student/courses/${enrollment.CourseID}`}
                  >
                    Continue
                  </Button>
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Typography variant="body1" color="text.secondary">
            You are not enrolled in any courses yet.
          </Typography>
        )}
        
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
          <Button 
            variant="outlined" 
            color="primary"
            href="/courses"
          >
            Browse Courses
          </Button>
        </Box>
      </Paper>
      
      {/* Upcoming Assignments */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom>
              Pending Assignments
            </Typography>
            
            {assignments.length > 0 ? (
              <List>
                {assignments.slice(0, 5).map((assignment) => (
                  <ListItem key={assignment.AssignmentID}>
                    <ListItemIcon>
                      <AssignmentIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={assignment.Title} 
                      secondary={`Due: ${new Date(assignment.DueDate).toLocaleDateString()}`} 
                    />
                    <Button 
                      variant="outlined" 
                      size="small"
                      href={`/student/assignments/${assignment.AssignmentID}`}
                    >
                      View
                    </Button>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body1" color="text.secondary">
                No pending assignments.
              </Typography>
            )}
            
            {assignments.length > 5 && (
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                <Button 
                  variant="text" 
                  color="primary"
                  href="/student/assignments"
                >
                  View All Assignments
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
        
        {/* Upcoming Exams */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom>
              Upcoming Exams
            </Typography>
            
            {upcomingExams.length > 0 ? (
              <List>
                {upcomingExams.slice(0, 5).map((exam) => (
                  <ListItem key={exam.ExamID}>
                    <ListItemIcon>
                      <QuizIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={exam.Title} 
                      secondary={`Course: ${exam.Course?.Title || 'Unknown Course'}`} 
                    />
                    <Button 
                      variant="outlined" 
                      size="small"
                      href={`/student/exams/${exam.ExamID}`}
                    >
                      View
                    </Button>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body1" color="text.secondary">
                No upcoming exams.
              </Typography>
            )}
            
            {upcomingExams.length > 5 && (
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                <Button 
                  variant="text" 
                  color="primary"
                  href="/student/exams"
                >
                  View All Exams
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default StudentDashboard;
