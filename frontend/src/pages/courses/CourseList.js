import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  CardActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Rating,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import courseService from '../../services/courseService';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filter states
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [language, setLanguage] = useState('');
  
  // Pagination
  const [page, setPage] = useState(1);
  const coursesPerPage = 9;
  
  useEffect(() => {
    fetchCourses();
  }, []);
  
  const fetchCourses = async () => {
    setLoading(true);
    setError('');
    
    try {
      const filters = {
        title: title || undefined,
        difficulty: difficulty || undefined,
        language: language || undefined
      };
      
      const response = await courseService.getAllCourses(filters);
      setCourses(response.courses || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError('Failed to load courses. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    fetchCourses();
  };
  
  const handleReset = () => {
    setTitle('');
    setDifficulty('');
    setLanguage('');
    // Reset to first page
    setPage(1);
    // Fetch all courses without filters
    fetchCourses();
  };
  
  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo(0, 0);
  };
  
  // Calculate pagination
  const indexOfLastCourse = page * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(courses.length / coursesPerPage);
  
  // Render difficulty badge
  const getDifficultyColor = (level) => {
    switch (level) {
      case 'Beginner':
        return 'success';
      case 'Intermediate':
        return 'primary';
      case 'Advanced':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Explore Courses
      </Typography>
      
      {/* Search and Filter Section */}
      <Box 
        component="form" 
        onSubmit={handleSearch}
        sx={{ 
          mb: 4, 
          p: 3, 
          backgroundColor: 'background.paper', 
          borderRadius: 2,
          boxShadow: 1
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Search by title"
              variant="outlined"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Difficulty</InputLabel>
              <Select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                label="Difficulty"
              >
                <MenuItem value="">All Levels</MenuItem>
                <MenuItem value="Beginner">Beginner</MenuItem>
                <MenuItem value="Intermediate">Intermediate</MenuItem>
                <MenuItem value="Advanced">Advanced</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Language</InputLabel>
              <Select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                label="Language"
              >
                <MenuItem value="">All Languages</MenuItem>
                <MenuItem value="English">English</MenuItem>
                <MenuItem value="Spanish">Spanish</MenuItem>
                <MenuItem value="French">French</MenuItem>
                <MenuItem value="German">German</MenuItem>
                <MenuItem value="Chinese">Chinese</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={2}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                fullWidth
              >
                Search
              </Button>
              <Button 
                type="button" 
                variant="outlined" 
                color="secondary" 
                onClick={handleReset}
              >
                Reset
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
      
      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {/* Loading Indicator */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Courses Grid */}
          {currentCourses.length > 0 ? (
            <Grid container spacing={4}>
              {currentCourses.map((course) => (
                <Grid item key={course.CourseID} xs={12} sm={6} md={4}>
                  <Card 
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: 6
                      }
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="140"
                      image={`https://source.unsplash.com/random/800x600?${course.Title.split(' ')[0]}`}
                      alt={course.Title}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Chip 
                          label={course.DifficultyLevel || 'All Levels'} 
                          size="small" 
                          color={getDifficultyColor(course.DifficultyLevel)}
                        />
                        {course.CertificationOption && (
                          <Chip label="Certification" size="small" color="secondary" />
                        )}
                      </Box>
                      <Typography gutterBottom variant="h6" component="h2" sx={{ mt: 1 }}>
                        {course.Title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {course.Description?.substring(0, 100)}
                        {course.Description?.length > 100 ? '...' : ''}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Rating value={course.averageRating || 0} precision={0.5} readOnly size="small" />
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                          ({course.reviewCount || 0} reviews)
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {course.Instructor?.User?.Name || 'Unknown Instructor'}
                      </Typography>
                      {course.Language && (
                        <Typography variant="body2" color="text.secondary">
                          Language: {course.Language}
                        </Typography>
                      )}
                    </CardContent>
                    <CardActions>
                      <Button 
                        component={RouterLink} 
                        to={`/courses/${course.CourseID}`} 
                        size="small" 
                        color="primary"
                      >
                        View Details
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ textAlign: 'center', my: 4 }}>
              <Typography variant="h6">
                No courses found matching your criteria.
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleReset}
                sx={{ mt: 2 }}
              >
                Clear Filters
              </Button>
            </Box>
          )}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination 
                count={totalPages} 
                page={page} 
                onChange={handlePageChange} 
                color="primary" 
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default CourseList;
