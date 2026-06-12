const express = require('express');
const router = express.Router();
const Newsletter = require('../models/Newsletter');

// GET all newsletters
router.get('/', async (req, res) => {
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
router.get('/:id', async (req, res) => {
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

// CREATE newsletter
router.post('/', async (req, res) => {
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

// UPDATE newsletter
router.put('/:id', async (req, res) => {
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
router.delete('/:id', async (req, res) => {
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

// GET governor newsletters
router.get('/governor-newsletters/list', async (req, res) => {
  try {
    res.json({
      success: true,
      data: [],
      message: 'Governor newsletters endpoint'
    });
  } catch (error) {
    console.error('Error fetching governor newsletters:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch governor newsletters',
      message: error.message
    });
  }
});

// GET newsletter types
router.get('/newsletter-types/list', async (req, res) => {
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

// GET statistics
router.get('/statistics/list', async (req, res) => {
  try {
    const newsletters = await Newsletter.findAll();

    const stats = {
      total: newsletters.length,
      active: newsletters.filter(n => n.is_active).length
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

// TOGGLE status
router.patch('/:id/toggle-status', async (req, res) => {
  try {
    const newsletter = await Newsletter.findById(req.params.id);

    if (!newsletter) {
      return res.status(404).json({
        success: false,
        error: 'Newsletter not found'
      });
    }

    const updatedStatus = !newsletter.is_active;

    await Newsletter.update(req.params.id, {
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

// SEARCH newsletters
router.get('/search/list', async (req, res) => {
  try {
    const { query, type, year } = req.query;

    let newsletters = await Newsletter.findAll();

    if (query) {
      newsletters = newsletters.filter(newsletter =>
        newsletter.title?.toLowerCase().includes(query.toLowerCase()) ||
        newsletter.description?.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (type) {
      newsletters = newsletters.filter(
        newsletter => newsletter.newsletter_type === type
      );
    }

    if (year) {
      newsletters = newsletters.filter(
        newsletter =>
          new Date(newsletter.published_date).getFullYear().toString() === year
      );
    }

    res.json({
      success: true,
      data: newsletters,
      count: newsletters.length
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