// routes/calendar.js
const express = require('express');
const router = express.Router();
const calendarController = require('../controllers/calendarController');

// Get all events
router.get('/', calendarController.getEvents);

// Create new event
router.post('/', calendarController.createEvent);

// Update event
router.put('/:id', calendarController.updateEvent);

// Delete event
router.delete('/:id', calendarController.deleteEvent);

module.exports = router;