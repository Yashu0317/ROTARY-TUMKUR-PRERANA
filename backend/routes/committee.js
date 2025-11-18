// routes/committee.js

console.log("COMMITTEE ROUTE HIT FOR UPLOAD");


const express = require('express');
const router = express.Router();
const committeeController = require('../controllers/committeeController');

// Get all committee members
router.get('/', committeeController.getCommitteeMembers);

// Create new committee member
router.post('/', committeeController.createCommitteeMember);

// Update committee member (by ID)
router.put('/:id', committeeController.updateCommitteeMember);

// Delete committee member (by ID)
router.delete('/:id', committeeController.deleteCommitteeMember);

module.exports = router;
