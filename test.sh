#!/bin/bash

# Test script for the EduCert Online Education Platform
# This script performs automated tests on various components of the system

# Set up colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print section headers
print_header() {
  echo -e "\n${YELLOW}========================================"
  echo -e "  $1"
  echo -e "========================================${NC}\n"
}

# Function to print success messages
print_success() {
  echo -e "${GREEN}✓ $1${NC}"
}

# Function to print error messages
print_error() {
  echo -e "${RED}✗ $1${NC}"
}

# Function to test API endpoints
test_endpoint() {
  local endpoint=$1
  local method=${2:-GET}
  local data=$3
  local auth_header=$4
  
  echo -e "Testing $method $endpoint..."
  
  if [ "$method" = "GET" ]; then
    if [ -z "$auth_header" ]; then
      response=$(curl -s -w "%{http_code}" -X $method http://localhost:3000/api$endpoint)
    else
      response=$(curl -s -w "%{http_code}" -X $method -H "Authorization: $auth_header" http://localhost:3000/api$endpoint)
    fi
  else
    if [ -z "$auth_header" ]; then
      response=$(curl -s -w "%{http_code}" -X $method -H "Content-Type: application/json" -d "$data" http://localhost:3000/api$endpoint)
    else
      response=$(curl -s -w "%{http_code}" -X $method -H "Content-Type: application/json" -H "Authorization: $auth_header" -d "$data" http://localhost:3000/api$endpoint)
    fi
  fi
  
  http_code=${response: -3}
  response_body=${response:0:${#response}-3}
  
  if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
    print_success "Endpoint $endpoint returned status $http_code"
    echo "$response_body" | json_pp
    return 0
  else
    print_error "Endpoint $endpoint returned status $http_code"
    echo "$response_body" | json_pp
    return 1
  fi
}

# Main test execution
print_header "EduCert Platform Test Suite"

# Test database connection
print_header "Testing Database Connection"
if node -e "
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('educert', 'root', 'password', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false
});

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
}

testConnection();
"; then
  print_success "Database connection successful"
else
  print_error "Database connection failed"
fi

# Test API endpoints
print_header "Testing Public API Endpoints"

# Test courses endpoint
test_endpoint "/courses"

# Test authentication
print_header "Testing Authentication"

# Test registration
register_data='{"name":"Test User","email":"testuser@example.com","password":"password123","userType":"Student"}'
if test_endpoint "/auth/register" "POST" "$register_data"; then
  print_success "Registration successful"
  
  # Test login
  login_data='{"email":"testuser@example.com","password":"password123"}'
  login_response=$(curl -s -X POST -H "Content-Type: application/json" -d "$login_data" http://localhost:3000/api/auth/login)
  token=$(echo $login_response | grep -o '"token":"[^"]*' | sed 's/"token":"//')
  
  if [ -n "$token" ]; then
    print_success "Login successful, received token"
    auth_header="Bearer $token"
    
    # Test protected endpoints
    print_header "Testing Protected API Endpoints"
    
    # Test user profile endpoint
    test_endpoint "/users/profile" "GET" "" "$auth_header"
    
    # Test enrollment
    enroll_data='{"courseId":1}'
    test_endpoint "/enrollments" "POST" "$enroll_data" "$auth_header"
    
    # Test student enrollments
    test_endpoint "/enrollments/student" "GET" "" "$auth_header"
  else
    print_error "Login failed, no token received"
  fi
else
  print_error "Registration failed"
fi

print_header "Test Summary"
echo "The test script has completed execution."
echo "Please review the output above for any errors."
echo "For comprehensive testing, manual verification of UI components is recommended."
