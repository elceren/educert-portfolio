import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Card, 
  CardContent,
  Button,
  Tabs,
  Tab,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Rating,
  Chip,
  Avatar,
  CircularProgress,
  Alert,
  Paper
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import courseService from '../../services/courseService';
import enrollmentService from '../../services/enrollmentService';
import { useAuth } from '../../context/AuthContext';

// Icons
import SchoolIcon from '@mui/icons-material/School';
import LanguageIcon from '@mui/icons-material/Language';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarIcon from '@mui/icons-material/Star';
import AssignmentIcon from '@mui/icons-material/Assignment';
import QuizIcon from '@mui/icons-material/Quiz';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  
  useEffect(() => {
    fetchCourseDetails();
    if (isAuthenticated) {
      checkEnrollmentStatus();
    }
  }, [id, isAuthenticated]);
  
  const fetchCourseDetails = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await courseService.getCourseById(id);
      setCourse(response.course);
    } catch (error) {
      console.error('Error fetching course details:', error);
      setError('Failed to load course details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const checkEnrollmentStatus = async () => {
    try {
      const enrollments = await enrollmentService.getStudentEnrollments();
      const isEnrolled = enrollments.enrollments.some(
        enrollment => enrollment.CourseID === parseInt(id)
      );
      setEnrolled(isEnrolled);
    } catch (error) {
      console.error('Error checking enrollment status:', error);
    }
  };
  
  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (user.userType !== 'Student') {
      setError('Only students can enroll in courses.');
      return;
    }
    
    setEnrolling(true);
    setError('');
    
    try {
      await enrollmentService.enrollInCourse(id);
      setEnrolled(true);
    } catch (error) {
      console.error('Error enrolling in course:', error);
      setError('Failed to enroll in course. Please try again later.');
    } finally {
      setEnrolling(false);
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
  
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }
  
  if (!course) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info">Course not found.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Course Header */}
      <Box 
        sx={{ 
          p: 4, 
          mb: 4, 
          borderRadius: 2,
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(https://source.unsplash.com/random/1200x400?${course.Title.split(' ')[0]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white'
        }}
      >
        <Typography variant="h3" component="h1" gutterBottom>
          {course.Title}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Rating value={course.averageRating || 0} precision={0.5} readOnly />
          <Typography variant="body1" sx={{ ml: 1 }}>
            ({course.reviewCount || 0} reviews)
          </Typography>
        </Box>
        
        <Typography variant="body1" paragraph>
          {course.Description}
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
          <Chip 
            icon={<SchoolIcon />} 
            label={`Difficulty: ${course.DifficultyLevel || 'All Levels'}`} 
            color="primary" 
            sx={{ color: 'white', backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
          />
          <Chip 
            icon={<LanguageIcon />} 
            label={`Language: ${course.Language || 'English'}`} 
            sx={{ color: 'white', backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
          />
          <Chip 
            icon={<AccessTimeIcon />} 
            label={`Duration: ${course.Duration || 0} minutes`} 
            sx={{ color: 'white', backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
          />
          {course.CertificationOption && (
            <Chip 
              icon={<CheckCircleIcon />} 
              label="Certification Available" 
              color="secondary"
            />
          )}
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar 
            alt={course.Instructor?.User?.Name || 'Instructor'} 
            src={`https://i.pravatar.cc/150?u=${course.InstructorID}`}
            sx={{ width: 56, height: 56, mr: 2 }}
          />
          <Box>
            <Typography variant="subtitle1">
              Instructor: {course.Instructor?.User?.Name || 'Unknown Instructor'}
            </Typography>
            <Typography variant="body2">
              {course.Instructor?.Description?.substring(0, 100) || 'Experienced instructor'}
              {course.Instructor?.Description?.length > 100 ? '...' : ''}
            </Typography>
          </Box>
        </Box>
      </Box>
      
      {/* Enrollment Button */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
        {enrolled ? (
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            onClick={() => navigate(`/student/courses/${id}`)}
            startIcon={<PlayCircleOutlineIcon />}
          >
            Continue Learning
          </Button>
        ) : (
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            onClick={handleEnroll}
            disabled={enrolling || (isAuthenticated && user.userType !== 'Student')}
          >
            {enrolling ? <CircularProgress size={24} /> : 'Enroll Now'}
          </Button>
        )}
      </Box>
      
      {/* Course Content Tabs */}
      <Paper sx={{ mb: 4 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Course Content" />
          <Tab label="Reviews" />
          <Tab label="Requirements" />
        </Tabs>
        
        <Box sx={{ p: 3 }}>
          {/* Course Content Tab */}
          {tabValue === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Course Modules
              </Typography>
              
              {course.Modules && course.Modules.length > 0 ? (
                course.Modules.map((module, index) => (
                  <Box key={module.ModuleID} sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Module {index + 1}: {module.Title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {module.Description}
                    </Typography>
                    
                    <List dense>
                      {module.Lectures && module.Lectures.map((lecture) => (
                        <ListItem key={lecture.LectureID}>
                          <ListItemIcon>
                            <PlayCircleOutlineIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText 
                            primary={lecture.Title} 
                            secondary={`${lecture.Duration || 0} minutes`} 
                          />
                        </ListItem>
                      ))}
                    </List>
                    
                    <Divider sx={{ my: 2 }} />
                  </Box>
                ))
              ) : (
                <Typography variant="body1" color="text.secondary">
                  No modules available for this course yet.
                </Typography>
              )}
              
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Assessments
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <AssignmentIcon color="primary" sx={{ mr: 1 }} />
                          <Typography variant="h6">
                            Assignments
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          Complete practical assignments to apply what you've learned.
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <QuizIcon color="primary" sx={{ mr: 1 }} />
                          <Typography variant="h6">
                            Exams
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          Test your knowledge with quizzes and final exam.
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          )}
          
          {/* Reviews Tab */}
          {tabValue === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Student Reviews
              </Typography>
              
              {course.Reviews && course.Reviews.length > 0 ? (
                course.Reviews.map((review) => (
                  <Box key={review.ReviewID} sx={{ mb: 3, pb: 3, borderBottom: 1, borderColor: 'divider' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Avatar 
                        alt={review.Student?.User?.Name || 'Student'} 
                        src={`https://i.pravatar.cc/150?u=${review.StudentID}`}
                        sx={{ width: 40, height: 40, mr: 2 }}
                      />
                      <Box>
                        <Typography variant="subtitle2">
                          {review.Student?.User?.Name || 'Anonymous Student'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(review.Date).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Rating value={review.Rating} readOnly size="small" />
                    
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {review.Comment}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography variant="body1" color="text.secondary">
                  No reviews available for this course yet.
                </Typography>
              )}
            </Box>
          )}
          
          {/* Requirements Tab */}
          {tabValue === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Course Requirements
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Basic computer skills" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Internet connection" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Dedication to learn" />
                </ListItem>
              </List>
              
              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                What You'll Learn
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <StarIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Comprehensive understanding of the subject" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <StarIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Practical skills applicable to real-world scenarios" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <StarIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Industry-recognized certification (if applicable)" />
                </ListItem>
              </List>
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default CourseDetails;
