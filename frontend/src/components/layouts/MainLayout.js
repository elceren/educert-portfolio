import React from 'react';
import { Box, Container, Typography, AppBar, Toolbar, Button, IconButton, Menu, MenuItem } from '@mui/material';
import { Outlet, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useState } from 'react';

const MainLayout = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
  };

  // Determine dashboard link based on user type
  const getDashboardLink = () => {
    if (!user) return '/';
    
    switch (user.userType) {
      case 'Student':
        return '/student/dashboard';
      case 'Instructor':
        return '/instructor/dashboard';
      case 'Administrator':
        return '/admin/dashboard';
      default:
        return '/';
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header/Navigation */}
      <AppBar position="static">
        <Toolbar>
          <Typography 
            variant="h6" 
            component={RouterLink} 
            to="/" 
            sx={{ 
              flexGrow: 1, 
              textDecoration: 'none', 
              color: 'inherit' 
            }}
          >
            EduCert
          </Typography>
          
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/courses"
            sx={{ mx: 1 }}
          >
            Courses
          </Button>
          
          {isAuthenticated ? (
            <>
              <Button 
                color="inherit" 
                component={RouterLink} 
                to={getDashboardLink()}
                sx={{ mx: 1 }}
              >
                Dashboard
              </Button>
              
              <IconButton
                color="inherit"
                onClick={handleMenu}
                edge="end"
              >
                <AccountCircleIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem 
                  component={RouterLink} 
                  to={`/profile/${user?.id}`}
                  onClick={handleClose}
                >
                  My Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button 
                color="inherit" 
                component={RouterLink} 
                to="/login"
                sx={{ mx: 1 }}
              >
                Login
              </Button>
              <Button 
                variant="outlined" 
                color="inherit" 
                component={RouterLink} 
                to="/register"
              >
                Register
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>

      {/* Footer */}
      <Box 
        component="footer" 
        sx={{ 
          py: 3, 
          px: 2, 
          mt: 'auto', 
          backgroundColor: (theme) => theme.palette.grey[900],
          color: 'white'
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body1" align="center">
            © {new Date().getFullYear()} EduCert Learning Platform. All rights reserved.
          </Typography>
          <Typography variant="body2" align="center" color="text.secondary" sx={{ mt: 1 }}>
            <RouterLink to="/terms" style={{ color: 'inherit', marginRight: 16 }}>
              Terms of Service
            </RouterLink>
            <RouterLink to="/privacy" style={{ color: 'inherit', marginRight: 16 }}>
              Privacy Policy
            </RouterLink>
            <RouterLink to="/contact" style={{ color: 'inherit' }}>
              Contact Us
            </RouterLink>
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default MainLayout;
