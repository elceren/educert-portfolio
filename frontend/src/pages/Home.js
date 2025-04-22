import React from 'react';
import { Box, Typography, Container, Grid, Paper, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';

// Styled components
const HeroSection = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(8, 0, 6),
  marginBottom: theme.spacing(4),
}));

const FeatureCard = styled(Paper)(({ theme }) => ({
  height: '100%',
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
}));

const Home = () => {
  return (
    <Box>
      {/* Hero Section */}
      <HeroSection>
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom>
            EduCert Learning Platform
          </Typography>
          <Typography variant="h5" paragraph>
            Expand your knowledge, enhance your skills, and earn certifications with our comprehensive online courses.
          </Typography>
          <Box mt={4}>
            <Button 
              component={RouterLink} 
              to="/courses" 
              variant="contained" 
              color="secondary" 
              size="large"
              sx={{ mr: 2 }}
            >
              Browse Courses
            </Button>
            <Button 
              component={RouterLink} 
              to="/register" 
              variant="outlined" 
              color="inherit" 
              size="large"
            >
              Sign Up
            </Button>
          </Box>
        </Container>
      </HeroSection>

      {/* Features Section */}
      <Container maxWidth="lg">
        <Typography variant="h3" component="h2" align="center" gutterBottom>
          Why Choose EduCert?
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6} md={4}>
            <FeatureCard elevation={2}>
              <Typography variant="h5" component="h3" gutterBottom>
                Quality Courses
              </Typography>
              <Typography>
                Access high-quality courses designed by industry experts and experienced instructors.
              </Typography>
            </FeatureCard>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FeatureCard elevation={2}>
              <Typography variant="h5" component="h3" gutterBottom>
                Recognized Certifications
              </Typography>
              <Typography>
                Earn verifiable certifications that showcase your skills and knowledge to employers.
              </Typography>
            </FeatureCard>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FeatureCard elevation={2}>
              <Typography variant="h5" component="h3" gutterBottom>
                Flexible Learning
              </Typography>
              <Typography>
                Learn at your own pace with 24/7 access to course materials from any device.
              </Typography>
            </FeatureCard>
          </Grid>
        </Grid>
      </Container>

      {/* Popular Categories Section */}
      <Container maxWidth="lg" sx={{ mt: 8, mb: 8 }}>
        <Typography variant="h3" component="h2" align="center" gutterBottom>
          Popular Categories
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Button 
              component={RouterLink}
              to="/courses?category=programming"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ py: 3 }}
            >
              Programming
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button 
              component={RouterLink}
              to="/courses?category=business"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ py: 3 }}
            >
              Business
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button 
              component={RouterLink}
              to="/courses?category=design"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ py: 3 }}
            >
              Design
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button 
              component={RouterLink}
              to="/courses?category=science"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ py: 3 }}
            >
              Science
            </Button>
          </Grid>
        </Grid>
      </Container>

      {/* Call to Action */}
      <Box bgcolor="secondary.main" color="secondary.contrastText" py={6}>
        <Container maxWidth="md">
          <Typography variant="h4" align="center" gutterBottom>
            Ready to start learning?
          </Typography>
          <Typography variant="h6" align="center" paragraph>
            Join thousands of students already learning on EduCert
          </Typography>
          <Box display="flex" justifyContent="center" mt={3}>
            <Button 
              component={RouterLink} 
              to="/register" 
              variant="contained" 
              color="primary" 
              size="large"
            >
              Get Started Now
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
