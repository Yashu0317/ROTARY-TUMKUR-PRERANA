const express = require('express');
const router = express.Router();
const Newsletter = require('../models/Newsletter');

// GET all newsletters
router.get('/club-newsletters', async (req, res) => {
  try {
    const newsletters = await Newsletter.findAll();
    res.json({
      success: true,
      data: newsletters,
      count: newsletters.length
    });
  } catch (error) {
    console.error('Error fetching newsletters:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch newsletters',
      message: error.message
    });
  }
});

// GET single newsletter by ID
router.get('/club-newsletters/:id', async (req, res) => {
  try {
    const newsletter = await Newsletter.findById(req.params.id);
    if (!newsletter) {
      return res.status(404).json({
        success: false,
        error: 'Newsletter not found'
      });
    }
    res.json({
      success: true,
      data: newsletter
    });
  } catch (error) {
    console.error('Error fetching newsletter:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch newsletter',
      message: error.message
    });
  }
});

// POST create new newsletter
router.post('/club-newsletters', async (req, res) => {
  try {
    console.log('Creating newsletter with data:', req.body);
    
    const result = await Newsletter.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Newsletter created successfully',
      data: {
        id: result.insertId,
        ...req.body
      }
    });
  } catch (error) {
    console.error('Error creating newsletter:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create newsletter',
      message: error.message
    });
  }
});

// PUT update newsletter
router.put('/club-newsletters/:id', async (req, res) => {
  try {
    const result = await Newsletter.update(req.params.id, req.body);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Newsletter not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Newsletter updated successfully',
      data: {
        id: req.params.id,
        ...req.body
      }
    });
  } catch (error) {
    console.error('Error updating newsletter:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update newsletter',
      message: error.message
    });
  }
});

// DELETE newsletter
router.delete('/club-newsletters/:id', async (req, res) => {
  try {
    const result = await Newsletter.delete(req.params.id);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Newsletter not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Newsletter deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting newsletter:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete newsletter',
      message: error.message
    });
  }
});

// GET governor newsletters (placeholder)
router.get('/governor-newsletters', async (req, res) => {
  try {
    // For now, return empty array or demo data
    res.json({
      success: true,
      data: [],
      message: 'Governor newsletters endpoint - implement logic as needed'
    });
  } catch ( error) {
    console.error('Error fetching governor newsletters:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch governor newsletters',
      message: error.message
    });
  }
});

// GET newsletter types
router.get('/newsletter-types', async (req, res) => {
  try {
    res.json({
      success: true,
      data: [
        { value: 'club', label: 'Club Newsletter' },
        { value: 'governor', label: 'Governor Newsletter' },
        { value: 'district', label: 'District Newsletter' },
        { value: 'international', label: 'International Newsletter' }
      ]
    });
  } catch (error) {
    console.error('Error fetching newsletter types:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch newsletter types',
      message: error.message
    });
  }
});

// GET newsletter statistics
router.get('/statistics', async (req, res) => {
  try {
    const newsletters = await Newsletter.findAll();
    
    const stats = {
      total: newsletters.length,
      active: newsletters.filter(n => n.is_active).length,
      byType: {
        club: newsletters.filter(n => n.newsletter_type === 'club').length,
        governor: newsletters.filter(n => n.newsletter_type === 'governor').length,
        district: newsletters.filter(n => n.newsletter_type === 'district').length,
        international: newsletters.filter(n => n.newsletter_type === 'international').length
      },
      recentUploads: newsletters
        .sort((a, b) => new Date(b.published_date) - new Date(a.published_date))
        .slice(0, 5)
    };
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics',
      message: error.message
    });
  }
});

// PATCH toggle newsletter status
router.patch('/club-newsletters/:id/toggle-status', async (req, res) => {
  try {
    const newsletter = await Newsletter.findById(req.params.id);
    if (!newsletter) {
      return res.status(404).json({
        success: false,
        error: 'Newsletter not found'
      });
    }
    
    const updatedStatus = !newsletter.is_active;
    const result = await Newsletter.update(req.params.id, { 
      is_active: updatedStatus 
    });
    
    res.json({
      success: true,
      message: `Newsletter ${updatedStatus ? 'activated' : 'deactivated'} successfully`,
      data: {
        id: req.params.id,
        is_active: updatedStatus
      }
    });
  } catch (error) {
    console.error('Error toggling newsletter status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to toggle newsletter status',
      message: error.message
    });
  }
});

// GET search newsletters
router.get('/search', async (req, res) => {
  try {
    const { query, type, year } = req.query;
    let newsletters = await Newsletter.findAll();
    
    // Apply filters
    if (query) {
      newsletters = newsletters.filter(newsletter => 
        newsletter.title.toLowerCase().includes(query.toLowerCase()) ||
        newsletter.description?.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    if (type) {
      newsletters = newsletters.filter(newsletter => 
        newsletter.newsletter_type === type
      );
    }
    
    if (year) {
      newsletters = newsletters.filter(newsletter => 
        new Date(newsletter.published_date).getFullYear().toString() === year
      );
    }
    
    res.json({
      success: true,
      data: newsletters,
      count: newsletters.length,
      filters: { query, type, year }
    });
  } catch (error) {
    console.error('Error searching newsletters:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search newsletters',
      message: error.message
    });
  }
});

module.exports = router;