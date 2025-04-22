import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { useAuth } from './context/AuthContext';
import NotificationSystem from './components/common/NotificationSystem';

// Layout components
import MainLayout from './components/layouts/MainLayout';
import AuthLayout from './components/layouts/AuthLayout';

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Public pages
import Home from './pages/Home';
import CourseList from './pages/courses/CourseList';
import CourseDetails from './pages/courses/CourseDetails';

// Student pages
import StudentDashboard from './pages/student/Dashboard';
import EnrolledCourses from './pages/student/EnrolledCourses';
import CourseContent from './pages/student/CourseContent';
import Assignments from './pages/student/Assignments';
import Exams from './pages/student/Exams';
import Certifications from './pages/student/Certifications';

// Instructor pages
import InstructorDashboard from './pages/instructor/Dashboard';
import MyCourses from './pages/instructor/MyCourses';
import CourseEditor from './pages/instructor/CourseEditor';
import ManageAssignments from './pages/instructor/ManageAssignments';
import ManageExams from './pages/instructor/ManageExams';
import StudentProgress from './pages/instructor/StudentProgress';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import UserManagement from './pages/admin/UserManagement';
import CourseManagement from './pages/admin/CourseManagement';
import Reports from './pages/admin/Reports';
import CertificationManagement from './pages/admin/CertificationManagement';

// Import our enhanced ProtectedRoute component
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Global notification system */}
      <NotificationSystem />
      
      <Routes>
        {/* Auth routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        
        {/* Main layout routes */}
        <Route element={<MainLayout />}>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<CourseList />} />
          <Route path="/courses/:id" element={<CourseDetails />} />
          
          {/* Student routes */}
          <Route path="/student/dashboard" element={
            <ProtectedRoute allowedRoles={['Student']}>
              <StudentDashboard />
            </ProtectedRoute>
          } />
          <Route path="/student/courses" element={
            <ProtectedRoute allowedRoles={['Student']}>
              <EnrolledCourses />
            </ProtectedRoute>
          } />
          <Route path="/student/courses/:id" element={
            <ProtectedRoute allowedRoles={['Student']}>
              <CourseContent />
            </ProtectedRoute>
          } />
          <Route path="/student/assignments" element={
            <ProtectedRoute allowedRoles={['Student']}>
              <Assignments />
            </ProtectedRoute>
          } />
          <Route path="/student/exams" element={
            <ProtectedRoute allowedRoles={['Student']}>
              <Exams />
            </ProtectedRoute>
          } />
          <Route path="/student/certifications" element={
            <ProtectedRoute allowedRoles={['Student']}>
              <Certifications />
            </ProtectedRoute>
          } />
          
          {/* Instructor routes */}
          <Route path="/instructor/dashboard" element={
            <ProtectedRoute allowedRoles={['Instructor']}>
              <InstructorDashboard />
            </ProtectedRoute>
          } />
          <Route path="/instructor/courses" element={
            <ProtectedRoute allowedRoles={['Instructor']}>
              <MyCourses />
            </ProtectedRoute>
          } />
          <Route path="/instructor/courses/:id/edit" element={
            <ProtectedRoute allowedRoles={['Instructor']}>
              <CourseEditor />
            </ProtectedRoute>
          } />
          <Route path="/instructor/assignments" element={
            <ProtectedRoute allowedRoles={['Instructor']}>
              <ManageAssignments />
            </ProtectedRoute>
          } />
          <Route path="/instructor/exams" element={
            <ProtectedRoute allowedRoles={['Instructor']}>
              <ManageExams />
            </ProtectedRoute>
          } />
          <Route path="/instructor/students" element={
            <ProtectedRoute allowedRoles={['Instructor']}>
              <StudentProgress />
            </ProtectedRoute>
          } />
          
          {/* Admin routes */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRoles={['Administrator']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute allowedRoles={['Administrator']}>
              <UserManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/courses" element={
            <ProtectedRoute allowedRoles={['Administrator']}>
              <CourseManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/reports" element={
            <ProtectedRoute allowedRoles={['Administrator']}>
              <Reports />
            </ProtectedRoute>
          } />
          <Route path="/admin/certifications" element={
            <ProtectedRoute allowedRoles={['Administrator']}>
              <CertificationManagement />
            </ProtectedRoute>
          } />
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </Box>
  );
}

export default App;
