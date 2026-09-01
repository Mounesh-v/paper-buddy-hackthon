const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const parentController = require('../controllers/parentController');
const attendanceController = require('../controllers/attendanceController');
const academicsController = require('../controllers/academicsController');
const assignmentController = require('../controllers/assignmentController');
const feeController = require('../controllers/feeController');
const eventController = require('../controllers/eventController');
const announcementController = require('../controllers/announcementController');
const notificationController = require('../controllers/notificationController');
const messageController = require('../controllers/messageController');

const router = express.Router();

// Apply auth middleware to all routes
router.use(authenticate);
router.use(authorize('PARENT'));

// Profile & Children
router.get('/me', parentController.getProfile);
router.get('/children', parentController.getChildren);
router.get('/children/:studentId', parentController.getChild);
router.get('/dashboard', parentController.getDashboard);

// Attendance
router.get('/children/:studentId/attendance', attendanceController.getAttendance);
router.get('/children/:studentId/attendance/summary', attendanceController.getAttendanceSummary);

// Academics
router.get('/children/:studentId/academics', academicsController.getAcademics);
router.get('/children/:studentId/academics/exams', academicsController.getExams);
router.get('/children/:studentId/academics/subjects', academicsController.getSubjects);

// Assignments
router.get('/children/:studentId/assignments', assignmentController.getAssignments);
router.get('/children/:studentId/assignments/:assignmentId', assignmentController.getAssignment);

// Fees
router.get('/children/:studentId/fees', feeController.getFees);
router.get('/children/:studentId/payments', feeController.getPayments);
router.get('/children/:studentId/receipts', feeController.getReceipts);

// Events
router.get('/events', eventController.getEvents);
router.get('/events/:eventId', eventController.getEvent);

// Announcements
router.get('/announcements', announcementController.getAnnouncements);
router.get('/announcements/:announcementId', announcementController.getAnnouncement);

// Notifications
router.get('/notifications', notificationController.getNotifications);
router.patch('/notifications/:notificationId/read', notificationController.markAsRead);
router.patch('/notifications/read-all', notificationController.markAllAsRead);

// Messages
router.get('/conversations', messageController.getConversations);
router.post('/conversations', messageController.createConversation);
router.get('/conversations/:conversationId/messages', messageController.getMessages);
router.post('/conversations/:conversationId/messages', messageController.sendMessage);

module.exports = router;
