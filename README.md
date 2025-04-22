# EduCert Platform - Online Education Platform

## Overview
EduCert is a comprehensive online education platform that offers courses, certifications, and skill assessments. The platform serves three types of users: students, instructors, and administrators. Students can browse, filter, and enroll in courses, complete assignments, take exams, and receive certifications. Instructors can create course content and define schedules. Administrators can generate reports on course demand and enrollment trends.

## Features

### For Students
- Browse and filter courses by various criteria
- Enroll in courses and track progress
- Complete assignments and submit work
- Take exams and assessments
- Receive certifications upon course completion
- View and manage personal skills profile

### For Instructors
- Create and manage courses
- Develop course content and modules
- Create assignments and exams
- Monitor student progress
- Review and grade submissions
- Manage course schedules

### For Administrators
- Generate reports on course popularity
- Track enrollment trends
- Manage users and permissions
- Monitor platform performance
- Oversee certification issuance

## Technology Stack

### Backend
- Node.js with Express
- MySQL database
- Sequelize ORM
- JWT for authentication
- RESTful API architecture

### Frontend
- React.js
- Material UI component library
- Context API for state management
- Responsive design for all devices

### Deployment
- Docker containerization
- Nginx for serving frontend and proxying API requests
- PM2 for process management (non-Docker deployment)

## Project Structure

```
educert-platform/
├── backend/                # Backend API server
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Sequelize models
│   │   ├── routes/         # API routes
│   │   └── utils/          # Utility functions
│   ├── .env                # Environment variables
│   ├── Dockerfile          # Docker configuration
│   └── package.json        # Dependencies
│
├── frontend/               # React frontend
│   ├── public/             # Static files
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── context/        # React context providers
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service functions
│   │   └── utils/          # Utility functions
│   ├── .env                # Environment variables
│   ├── Dockerfile          # Docker configuration
│   └── package.json        # Dependencies
│
├── database_schema.sql     # Database schema
├── docker-compose.yml      # Docker Compose configuration
├── deployment.md           # Deployment documentation
└── user_guide.md           # User guide
```

## Installation and Deployment

### Development Setup
1. Clone the repository
2. Set up the database using the provided schema
3. Configure environment variables
4. Install dependencies for both backend and frontend
5. Start the development servers

Detailed instructions are available in the [Deployment Guide](deployment.md).

### Production Deployment
The platform can be deployed using Docker or traditional server setup:

#### Docker Deployment
```bash
# Configure environment variables
cp .env.example .env
# Edit .env with your configuration

# Start the containers
docker-compose up -d
```

#### Traditional Deployment
Follow the step-by-step instructions in the [Deployment Guide](deployment.md).

## Documentation

- [User Guide](user_guide.md): Comprehensive guide for students, instructors, and administrators
- [Deployment Guide](deployment.md): Instructions for setting up development and production environments
- API Documentation: Available at `/api/docs` when the server is running

## Testing

The platform includes comprehensive test suites:

- Backend API tests
- Frontend component tests
- Integration tests

Run tests using the provided scripts:
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# Integration tests
./integration_test.sh
```

## License
This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.
