#!/bin/bash

# Integration test script for the EduCert Online Education Platform
# This script tests the complete flow from registration to course completion

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
print_header "EduCert Platform Integration Test"

# Step 1: Register a student
print_header "Step 1: Register a Student"
student_data='{"name":"Test Student","email":"student@example.com","password":"password123","userType":"Student"}'
if test_endpoint "/auth/register" "POST" "$student_data"; then
  print_success "Student registration successful"
  
  # Step 2: Login as student
  print_header "Step 2: Login as Student"
  login_data='{"email":"student@example.com","password":"password123"}'
  login_response=$(curl -s -X POST -H "Content-Type: application/json" -d "$login_data" http://localhost:3000/api/auth/login)
  student_token=$(echo $login_response | grep -o '"token":"[^"]*' | sed 's/"token":"//')
  
  if [ -n "$student_token" ]; then
    print_success "Student login successful, received token"
    student_auth_header="Bearer $student_token"
    
    # Step 3: Browse available courses
    print_header "Step 3: Browse Available Courses"
    test_endpoint "/courses" "GET" "" "$student_auth_header"
    
    # Step 4: Enroll in a course
    print_header "Step 4: Enroll in a Course"
    enroll_data='{"courseId":1}'
    if test_endpoint "/enrollments" "POST" "$enroll_data" "$student_auth_header"; then
      print_success "Course enrollment successful"
      
      # Step 5: View enrolled courses
      print_header "Step 5: View Enrolled Courses"
      test_endpoint "/enrollments/student" "GET" "" "$student_auth_header"
      
      # Step 6: Submit an assignment
      print_header "Step 6: Submit an Assignment"
      submission_data='{"assignmentId":1,"content":"This is my assignment submission."}'
      test_endpoint "/assignments/submit" "POST" "$submission_data" "$student_auth_header"
      
      # Step 7: Take an exam
      print_header "Step 7: Take an Exam"
      exam_data='{"examId":1,"answers":[{"questionId":1,"answer":"B"},{"questionId":2,"answer":"A"}]}'
      test_endpoint "/exams/submit" "POST" "$exam_data" "$student_auth_header"
      
      # Step 8: View certifications
      print_header "Step 8: View Certifications"
      test_endpoint "/certifications/student" "GET" "" "$student_auth_header"
    else
      print_error "Course enrollment failed"
    fi
  else
    print_error "Student login failed, no token received"
  fi
else
  print_error "Student registration failed"
fi

# Step 9: Register an instructor
print_header "Step 9: Register an Instructor"
instructor_data='{"name":"Test Instructor","email":"instructor@example.com","password":"password123","userType":"Instructor"}'
if test_endpoint "/auth/register" "POST" "$instructor_data"; then
  print_success "Instructor registration successful"
  
  # Step 10: Login as instructor
  print_header "Step 10: Login as Instructor"
  login_data='{"email":"instructor@example.com","password":"password123"}'
  login_response=$(curl -s -X POST -H "Content-Type: application/json" -d "$login_data" http://localhost:3000/api/auth/login)
  instructor_token=$(echo $login_response | grep -o '"token":"[^"]*' | sed 's/"token":"//')
  
  if [ -n "$instructor_token" ]; then
    print_success "Instructor login successful, received token"
    instructor_auth_header="Bearer $instructor_token"
    
    # Step 11: Create a new course
    print_header "Step 11: Create a New Course"
    course_data='{
      "title":"Test Course",
      "description":"This is a test course",
      "difficultyLevel":"Intermediate",
      "duration":120,
      "language":"English",
      "price":49.99,
      "certificationOption":true
    }'
    if test_endpoint "/courses" "POST" "$course_data" "$instructor_auth_header"; then
      print_success "Course creation successful"
      
      # Step 12: View instructor courses
      print_header "Step 12: View Instructor Courses"
      test_endpoint "/courses/instructor" "GET" "" "$instructor_auth_header"
      
      # Step 13: Create a new assignment
      print_header "Step 13: Create a New Assignment"
      assignment_data='{
        "courseId":1,
        "title":"Test Assignment",
        "description":"This is a test assignment",
        "dueDate":"2025-05-15"
      }'
      test_endpoint "/assignments" "POST" "$assignment_data" "$instructor_auth_header"
      
      # Step 14: View student submissions
      print_header "Step 14: View Student Submissions"
      test_endpoint "/assignments/1/submissions" "GET" "" "$instructor_auth_header"
    else
      print_error "Course creation failed"
    fi
  else
    print_error "Instructor login failed, no token received"
  fi
else
  print_error "Instructor registration failed"
fi

# Step 15: Register an administrator
print_header "Step 15: Register an Administrator"
admin_data='{"name":"Test Admin","email":"admin@example.com","password":"password123","userType":"Administrator"}'
if test_endpoint "/auth/register" "POST" "$admin_data"; then
  print_success "Administrator registration successful"
  
  # Step 16: Login as administrator
  print_header "Step 16: Login as Administrator"
  login_data='{"email":"admin@example.com","password":"password123"}'
  login_response=$(curl -s -X POST -H "Content-Type: application/json" -d "$login_data" http://localhost:3000/api/auth/login)
  admin_token=$(echo $login_response | grep -o '"token":"[^"]*' | sed 's/"token":"//')
  
  if [ -n "$admin_token" ]; then
    print_success "Administrator login successful, received token"
    admin_auth_header="Bearer $admin_token"
    
    # Step 17: Generate a report
    print_header "Step 17: Generate a Report"
    report_data='{
      "type":"popularity",
      "startDate":"2025-01-01",
      "endDate":"2025-04-30"
    }'
    test_endpoint "/reports/generate" "POST" "$report_data" "$admin_auth_header"
    
    # Step 18: View all users
    print_header "Step 18: View All Users"
    test_endpoint "/users" "GET" "" "$admin_auth_header"
    
    # Step 19: View all courses
    print_header "Step 19: View All Courses"
    test_endpoint "/courses" "GET" "" "$admin_auth_header"
  else
    print_error "Administrator login failed, no token received"
  fi
else
  print_error "Administrator registration failed"
fi

print_header "Integration Test Summary"
echo "The integration test has completed execution."
echo "Please review the output above for any errors."
echo "For comprehensive testing, manual verification of UI components is recommended."
