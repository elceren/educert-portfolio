import React from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        backgroundColor: (theme) => theme.palette.grey[100]
      }}
    >
      <Container component="main" maxWidth="lg" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
          {/* Left side - Platform info */}
          <Box 
            sx={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center',
              p: 4,
              display: { xs: 'none', md: 'flex' }
            }}
          >
            <Typography variant="h3" component="h1" gutterBottom color="primary">
              EduCert Learning Platform
            </Typography>
            <Typography variant="h5" gutterBottom>
              Expand your knowledge and earn certifications
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Join thousands of students and instructors on our comprehensive online education platform. 
              Access high-quality courses, earn recognized certifications, and advance your career.
            </Typography>
            <Box sx={{ mt: 4 }}>
              <Typography variant="body2" color="text.secondary">
                © {new Date().getFullYear()} EduCert Learning Platform
              </Typography>
            </Box>
          </Box>
          
          {/* Right side - Auth forms */}
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <Outlet />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default AuthLayout;
