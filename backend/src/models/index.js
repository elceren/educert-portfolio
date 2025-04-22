// Index file to export all models
const User = require('./User');
const Student = require('./Student');
const Instructor = require('./Instructor');
const Administrator = require('./Administrator');
const Course = require('./Course');
const Enrolls = require('./Enrolls');
const Module = require('./Module');
const Lecture = require('./Lecture');
const Content = require('./Content');
const Assignment = require('./Assignment');
const Submission = require('./Submission');
const Skill = require('./Skill');
const StudentSkill = require('./StudentSkill');
const Attempt = require('./Attempt');
const Exam = require('./Exam');
const Question = require('./Question');
const ExamQuestion = require('./ExamQuestion');
const Review = require('./Review');
const Certification = require('./Certification');
const CourseCertification = require('./CourseCertification');
const StudentCertification = require('./StudentCertification');
const Notification = require('./Notification');
const UserNotification = require('./UserNotification');
const Report = require('./Report');
const Payment = require('./Payment');

module.exports = {
  User,
  Student,
  Instructor,
  Administrator,
  Course,
  Enrolls,
  Module,
  Lecture,
  Content,
  Assignment,
  Submission,
  Skill,
  StudentSkill,
  Attempt,
  Exam,
  Question,
  ExamQuestion,
  Review,
  Certification,
  CourseCertification,
  StudentCertification,
  Notification,
  UserNotification,
  Report,
  Payment
};
