// controllers/committeeController.js
const CommitteeMember = require('../models/CommitteeMember');

exports.getCommitteeMembers = async (req, res) => {
  try {
    const members = await CommitteeMember.findAll();
    res.json(members);
  } catch (error) {
    console.error('Get committee members error:', error);
    res.status(500).json({ error: 'Failed to fetch committee members' });
  }
};

exports.createCommitteeMember = async (req, res) => {
  try {
    const memberData = req.body;
    
    // Validate required fields
    if (!memberData.name || !memberData.position) {
      return res.status(400).json({ error: 'Name and position are required' });
    }

    const newMember = await CommitteeMember.create(memberData);
    res.status(201).json({ 
      message: 'Committee member created successfully', 
      item: newMember 
    });
  } catch (error) {
    console.error('Create committee member error:', error);
    res.status(500).json({ error: 'Failed to create committee member' });
  }
};

exports.updateCommitteeMember = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedMember = await CommitteeMember.update(id, updates);
    
    if (!updatedMember) {
      return res.status(404).json({ error: 'Committee member not found' });
    }

    res.json({ 
      message: 'Committee member updated successfully', 
      item: updatedMember 
    });
  } catch (error) {
    console.error('Update committee member error:', error);
    res.status(500).json({ error: 'Failed to update committee member' });
  }
};

exports.deleteCommitteeMember = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deleted = await CommitteeMember.delete(id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Committee member not found' });
    }

    res.json({ message: 'Committee member deleted successfully' });
  } catch (error) {
    console.error('Delete committee member error:', error);
    res.status(500).json({ error: 'Failed to delete committee member' });
  }
};