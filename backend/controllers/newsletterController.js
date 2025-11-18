// controllers/newsletterController.js
const Newsletter = require('../models/Newsletter');

// Utility function to deeply sanitize data
function deepSanitize(data) {
  if (data === null || data === undefined) {
    return null;
  }
  
  if (typeof data === 'object' && !Array.isArray(data)) {
    const sanitized = {};
    for (const [key, value] of Object.entries(data)) {
      sanitized[key] = deepSanitize(value);
    }
    return sanitized;
  }
  
  if (data === '') {
    return null;
  }
  
  return data;
}

exports.getNewsletters = async (req, res) => {
  try {
    const newsletters = await Newsletter.findAll();
    res.json(newsletters);
  } catch (error) {
    console.error('Get newsletters error:', error);
    res.status(500).json({ error: 'Failed to fetch newsletters' });
  }
};

exports.createNewsletter = async (req, res) => {
  try {
    console.log('Received newsletter data:', req.body);
    
    // Deep sanitize the entire request body
    const sanitizedBody = deepSanitize(req.body);
    
    const { 
      title, 
      file_url, 
      file_name, 
      file_size, 
      published_date, 
      location, 
      description 
    } = sanitizedBody;

    // Validate required fields
    if (!title) {
      return res.status(400).json({ 
        error: 'Title is required' 
      });
    }

    if (!file_url) {
      return res.status(400).json({ 
        error: 'File URL is required' 
      });
    }

    if (!file_name) {
      return res.status(400).json({ 
        error: 'File name is required' 
      });
    }

    const newsletterData = {
      title,
      file_url,
      file_name,
      file_size: file_size || 0,
      published_date: published_date || new Date().toISOString().split('T')[0],
      location: location || null,
      description: description || null,
      uploaded_by: req.user?.id || null
    };

    console.log('Processed newsletter data:', newsletterData);

    const result = await Newsletter.create(newsletterData);
    
    // Fetch the created newsletter
    const newNewsletter = await Newsletter.findById(result.insertId);
    
    res.status(201).json({
      message: 'Newsletter created successfully',
      item: newNewsletter
    });
  } catch (error) {
    console.error('Create newsletter error:', error);
    res.status(500).json({ 
      error: 'Failed to create newsletter',
      details: error.message 
    });
  }
};

exports.updateNewsletter = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Deep sanitize the entire request body
    const sanitizedBody = deepSanitize(req.body);
    
    const { 
      title, 
      file_url, 
      file_name, 
      file_size, 
      published_date, 
      location, 
      description,
      is_active 
    } = sanitizedBody;

    // Check if newsletter exists
    const existingNewsletter = await Newsletter.findById(id);
    if (!existingNewsletter) {
      return res.status(404).json({ error: 'Newsletter not found' });
    }

    const updateData = {
      title: title !== undefined ? title : existingNewsletter.title,
      file_url: file_url !== undefined ? file_url : existingNewsletter.file_url,
      file_name: file_name !== undefined ? file_name : existingNewsletter.file_name,
      file_size: file_size !== undefined ? file_size : existingNewsletter.file_size,
      published_date: published_date !== undefined ? published_date : existingNewsletter.published_date,
      location: location !== undefined ? location : existingNewsletter.location,
      description: description !== undefined ? description : existingNewsletter.description,
      is_active: is_active !== undefined ? is_active : existingNewsletter.is_active
    };

    const result = await Newsletter.update(id, updateData);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Newsletter not found' });
    }

    // Fetch the updated newsletter
    const updatedNewsletter = await Newsletter.findById(id);
    
    res.json({ 
      message: 'Newsletter updated successfully',
      item: updatedNewsletter 
    });
  } catch (error) {
    console.error('Update newsletter error:', error);
    res.status(500).json({ 
      error: 'Failed to update newsletter',
      details: error.message 
    });
  }
};

exports.deleteNewsletter = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if newsletter exists
    const existingNewsletter = await Newsletter.findById(id);
    if (!existingNewsletter) {
      return res.status(404).json({ error: 'Newsletter not found' });
    }

    const result = await Newsletter.delete(id);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Newsletter not found' });
    }
    
    res.json({ message: 'Newsletter deleted successfully' });
  } catch (error) {
    console.error('Delete newsletter error:', error);
    res.status(500).json({ 
      error: 'Failed to delete newsletter',
      details: error.message 
    });
  }
};