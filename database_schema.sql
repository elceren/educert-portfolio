-- Online Education Platform Database Schema

-- USER TABLE
CREATE TABLE User (
    UserID INT PRIMARY KEY,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Name VARCHAR(100) NOT NULL,
    Password VARCHAR(100) NOT NULL,
    Phone VARCHAR(20),
    LastLogin TIMESTAMP,
    UserType VARCHAR(20) CHECK (UserType IN ('Student', 'Instructor', 'Administrator'))
);

-- STUDENT TABLE
CREATE TABLE Student (
    UserID INT PRIMARY KEY,
    EducationLevel VARCHAR(50),
    Biography TEXT,
    FOREIGN KEY (UserID) REFERENCES User(UserID)
);

-- INSTRUCTOR TABLE
CREATE TABLE Instructor (
    UserID INT PRIMARY KEY,
    Description TEXT,
    WorkExperience INT,
    FOREIGN KEY (UserID) REFERENCES User(UserID)
);

-- ADMINISTRATOR TABLE
CREATE TABLE Administrator (
    UserID INT PRIMARY KEY,
    Department VARCHAR(100),
    AccessLevel VARCHAR(50),
    FOREIGN KEY (UserID) REFERENCES User(UserID)
);

-- COURSE TABLE
CREATE TABLE Course (
    CourseID INT PRIMARY KEY,
    Title VARCHAR(100),
    Description TEXT,
    DifficultyLevel VARCHAR(50),
    Language VARCHAR(50),
    Duration INT,
    InstructorID INT,
    CertificationOption BOOLEAN,
    FOREIGN KEY (InstructorID) REFERENCES Instructor(UserID)
);

-- ENROLLMENT TABLE
CREATE TABLE Enrolls (
    StudentID INT,
    CourseID INT,
    PRIMARY KEY (StudentID, CourseID),
    FOREIGN KEY (StudentID) REFERENCES Student(UserID),
    FOREIGN KEY (CourseID) REFERENCES Course(CourseID)
);

-- MODULE TABLE
CREATE TABLE Module (
    ModuleID INT PRIMARY KEY,
    Title VARCHAR(100),
    Description TEXT,
    OrderNumber INT,
    CourseID INT,
    FOREIGN KEY (CourseID) REFERENCES Course(CourseID)
);

-- LECTURE TABLE
CREATE TABLE Lecture (
    LectureID INT PRIMARY KEY,
    Title VARCHAR(100),
    Description TEXT,
    Duration INT,
    OrderNumber INT,
    ModuleID INT,
    FOREIGN KEY (ModuleID) REFERENCES Module(ModuleID)
);

-- CONTENT TABLE
CREATE TABLE Content (
    ContentID INT PRIMARY KEY,
    Title VARCHAR(100),
    Type VARCHAR(50),
    URL TEXT,
    UploadDate DATE
);

-- ASSIGNMENT TABLE
CREATE TABLE Assignment (
    AssignmentID INT PRIMARY KEY,
    Title VARCHAR(100),
    Description TEXT,
    DueDate DATE,
    MaxPoints INT,
    Weight DECIMAL(5,2),
    LectureID INT,
    FOREIGN KEY (LectureID) REFERENCES Lecture(LectureID)
);

-- SUBMISSION TABLE
CREATE TABLE Submission (
    SubmissionID INT PRIMARY KEY,
    SubmissionDate TIMESTAMP,
    Grade INT,
    FeedbackText TEXT,
    StudentID INT,
    AssignmentID INT,
    FOREIGN KEY (StudentID) REFERENCES Student(UserID),
    FOREIGN KEY (AssignmentID) REFERENCES Assignment(AssignmentID)
);

-- SKILL TABLE
CREATE TABLE Skill (
    SkillID INT PRIMARY KEY,
    Title VARCHAR(100),
    Description TEXT,
    Category VARCHAR(50)
);

-- STUDENT_SKILL TABLE
CREATE TABLE StudentSkill (
    StudentID INT,
    SkillID INT,
    PRIMARY KEY (StudentID, SkillID),
    FOREIGN KEY (StudentID) REFERENCES Student(UserID),
    FOREIGN KEY (SkillID) REFERENCES Skill(SkillID)
);

-- ATTEMPT TABLE
CREATE TABLE Attempt (
    AttemptID INT PRIMARY KEY,
    AttemptDate TIMESTAMP,
    Score INT,
    TimeSpent INT,
    Status VARCHAR(50)
);

-- EXAM TABLE
CREATE TABLE Exam (
    ExamID INT PRIMARY KEY,
    Title VARCHAR(100),
    Duration INT,
    TotalPoints INT,
    PassingScore INT,
    NumQuestions INT,
    CourseID INT,
    FOREIGN KEY (CourseID) REFERENCES Course(CourseID)
);

-- QUESTION TABLE
CREATE TABLE Question (
    QuestionID INT PRIMARY KEY,
    Text TEXT,
    Type VARCHAR(50),
    DifficultyLevel VARCHAR(50),
    Points INT
);

-- EXAM_QUESTION TABLE
CREATE TABLE ExamQuestion (
    ExamID INT,
    QuestionID INT,
    PRIMARY KEY (ExamID, QuestionID),
    FOREIGN KEY (ExamID) REFERENCES Exam(ExamID),
    FOREIGN KEY (QuestionID) REFERENCES Question(QuestionID)
);

-- REVIEW TABLE
CREATE TABLE Review (
    ReviewID INT PRIMARY KEY,
    Rating INT CHECK (Rating BETWEEN 1 AND 5),
    Comment TEXT,
    Date TIMESTAMP,
    StudentID INT,
    CourseID INT,
    FOREIGN KEY (StudentID) REFERENCES Student(UserID),
    FOREIGN KEY (CourseID) REFERENCES Course(CourseID)
);

-- CERTIFICATION TABLE
CREATE TABLE Certification (
    CertificationID INT PRIMARY KEY,
    Title VARCHAR(100),
    IssueDate DATE,
    ExpiryDate DATE,
    IssuingBody VARCHAR(100)
);

-- COURSE_CERTIFICATION TABLE
CREATE TABLE CourseCertification (
    CourseID INT,
    CertificationID INT,
    PRIMARY KEY (CourseID, CertificationID),
    FOREIGN KEY (CourseID) REFERENCES Course(CourseID),
    FOREIGN KEY (CertificationID) REFERENCES Certification(CertificationID)
);

-- STUDENT_CERTIFICATION TABLE
CREATE TABLE StudentCertification (
    StudentID INT,
    CertificationID INT,
    PRIMARY KEY (StudentID, CertificationID),
    FOREIGN KEY (StudentID) REFERENCES Student(UserID),
    FOREIGN KEY (CertificationID) REFERENCES Certification(CertificationID)
);

-- NOTIFICATION TABLE
CREATE TABLE Notification (
    NotificationID INT PRIMARY KEY,
    Title VARCHAR(100),
    Message TEXT,
    CreationDate TIMESTAMP
);

-- USER_NOTIFICATION TABLE
CREATE TABLE UserNotification (
    NotificationID INT,
    UserID INT,
    PRIMARY KEY (NotificationID, UserID),
    FOREIGN KEY (NotificationID) REFERENCES Notification(NotificationID),
    FOREIGN KEY (UserID) REFERENCES User(UserID)
);

-- REPORT TABLE
CREATE TABLE Report (
    ReportID INT PRIMARY KEY,
    Title VARCHAR(100),
    GeneratedDate DATE,
    ReportType VARCHAR(50),
    Format VARCHAR(20),
    Parameters TEXT,
    AdministratorID INT,
    FOREIGN KEY (AdministratorID) REFERENCES Administrator(UserID)
);

-- PAYMENT TABLE
CREATE TABLE Payment (
    PaymentID INT PRIMARY KEY,
    StudentID INT,
    CourseID INT,
    Amount DECIMAL(10,2),
    PaymentMethod VARCHAR(50),
    PaymentDate TIMESTAMP,
    FOREIGN KEY (StudentID) REFERENCES Student(UserID),
    FOREIGN KEY (CourseID) REFERENCES Course(CourseID)
);

-- Add indexes for performance optimization
CREATE INDEX idx_course_title ON Course(Title);
CREATE INDEX idx_course_difficulty ON Course(DifficultyLevel);
CREATE INDEX idx_course_language ON Course(Language);
CREATE INDEX idx_user_email ON User(Email);
CREATE INDEX idx_module_course ON Module(CourseID);
CREATE INDEX idx_lecture_module ON Lecture(ModuleID);
CREATE INDEX idx_assignment_lecture ON Assignment(LectureID);
CREATE INDEX idx_submission_student ON Submission(StudentID);
CREATE INDEX idx_submission_assignment ON Submission(AssignmentID);
CREATE INDEX idx_exam_course ON Exam(CourseID);
CREATE INDEX idx_review_course ON Review(CourseID);
CREATE INDEX idx_review_student ON Review(StudentID);
CREATE INDEX idx_payment_student ON Payment(StudentID);
CREATE INDEX idx_payment_course ON Payment(CourseID);

-- Add auto-increment for primary keys (assuming MySQL/MariaDB syntax)
ALTER TABLE User MODIFY UserID INT AUTO_INCREMENT;
ALTER TABLE Course MODIFY CourseID INT AUTO_INCREMENT;
ALTER TABLE Module MODIFY ModuleID INT AUTO_INCREMENT;
ALTER TABLE Lecture MODIFY LectureID INT AUTO_INCREMENT;
ALTER TABLE Content MODIFY ContentID INT AUTO_INCREMENT;
ALTER TABLE Assignment MODIFY AssignmentID INT AUTO_INCREMENT;
ALTER TABLE Submission MODIFY SubmissionID INT AUTO_INCREMENT;
ALTER TABLE Skill MODIFY SkillID INT AUTO_INCREMENT;
ALTER TABLE Attempt MODIFY AttemptID INT AUTO_INCREMENT;
ALTER TABLE Exam MODIFY ExamID INT AUTO_INCREMENT;
ALTER TABLE Question MODIFY QuestionID INT AUTO_INCREMENT;
ALTER TABLE Review MODIFY ReviewID INT AUTO_INCREMENT;
ALTER TABLE Certification MODIFY CertificationID INT AUTO_INCREMENT;
ALTER TABLE Notification MODIFY NotificationID INT AUTO_INCREMENT;
ALTER TABLE Report MODIFY ReportID INT AUTO_INCREMENT;
ALTER TABLE Payment MODIFY PaymentID INT AUTO_INCREMENT;

-- Add timestamps for tracking creation and updates
ALTER TABLE User ADD COLUMN CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE User ADD COLUMN UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

ALTER TABLE Course ADD COLUMN CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE Course ADD COLUMN UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

ALTER TABLE Module ADD COLUMN CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE Module ADD COLUMN UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

ALTER TABLE Lecture ADD COLUMN CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE Lecture ADD COLUMN UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

ALTER TABLE Assignment ADD COLUMN CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE Assignment ADD COLUMN UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

ALTER TABLE Exam ADD COLUMN CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE Exam ADD COLUMN UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Add enrollment date to Enrolls table
ALTER TABLE Enrolls ADD COLUMN EnrollmentDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE Enrolls ADD COLUMN CompletionDate TIMESTAMP NULL;
ALTER TABLE Enrolls ADD COLUMN Progress INT DEFAULT 0;

-- Add status field to track active/inactive courses
ALTER TABLE Course ADD COLUMN Status VARCHAR(20) DEFAULT 'Active';
