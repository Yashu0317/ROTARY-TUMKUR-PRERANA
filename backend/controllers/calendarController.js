// controllers/calendarController.js
const Event = require('../models/Event');

exports.getEvents = async (req, res) => {
  try {
    const { event_type, start_date, end_date } = req.query;
    const filters = {};

    if (event_type) filters.event_type = event_type;
    if (start_date) filters.start_date = start_date;
    if (end_date) filters.end_date = end_date;

    const events = await Event.findAll(filters);
    res.json(events);
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const eventData = req.body;
    
    // Validate required fields
    if (!eventData.event_type || !eventData.event_date) {
      return res.status(400).json({ error: 'Event type and date are required' });
    }

    // Validate event-specific required fields
    if (eventData.event_type === 'Birthday' && !eventData.person_name) {
      return res.status(400).json({ error: 'Person name is required for birthday events' });
    }
    if (eventData.event_type === 'Anniversary' && !eventData.couple_name) {
      return res.status(400).json({ error: 'Couple name is required for anniversary events' });
    }
    if (eventData.event_type === 'Event' && !eventData.event_name) {
      return res.status(400).json({ error: 'Event name is required for general events' });
    }

    const pool = require('../config/database');
    
    // Build query based on event type
    let query, params;
    
    if (eventData.event_type === 'Birthday') {
      query = `
        INSERT INTO events (event_type, event_date, event_time, location, description, image_url, person_name, date_of_birth, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, TRUE)
      `;
      params = [
        eventData.event_type,
        eventData.event_date,
        eventData.event_time || null,
        eventData.location || '',
        eventData.description || '',
        eventData.image_url || '',
        eventData.person_name,
        eventData.date_of_birth || null
      ];
    } else if (eventData.event_type === 'Anniversary') {
      query = `
        INSERT INTO events (event_type, event_date, event_time, location, description, image_url, couple_name, anniversary_date, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, TRUE)
      `;
      params = [
        eventData.event_type,
        eventData.event_date,
        eventData.event_time || null,
        eventData.location || '',
        eventData.description || '',
        eventData.image_url || '',
        eventData.couple_name,
        eventData.anniversary_date || null
      ];
    } else { // General Event
      query = `
        INSERT INTO events (event_type, event_date, event_time, location, description, image_url, event_name, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?, TRUE)
      `;
      params = [
        eventData.event_type,
        eventData.event_date,
        eventData.event_time || null,
        eventData.location || '',
        eventData.description || '',
        eventData.image_url || '',
        eventData.event_name
      ];
    }

    const [result] = await pool.execute(query, params);
    
    // Fetch the newly created event
    const [newEvent] = await pool.execute('SELECT * FROM events WHERE id = ?', [result.insertId]);
    
    res.status(201).json({ 
      message: 'Event created successfully', 
      item: newEvent[0] 
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Check if event exists
    const pool = require('../config/database');
    const [existingEvent] = await pool.execute('SELECT * FROM events WHERE id = ? AND is_active = TRUE', [id]);
    
    if (existingEvent.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const currentEvent = existingEvent[0];
    
    // Build update query dynamically based on provided fields and event type
    const allowedFields = ['event_type', 'event_date', 'event_time', 'location', 'description', 'image_url'];
    
    // Add event-type specific fields
    if (currentEvent.event_type === 'Birthday' || updates.event_type === 'Birthday') {
      allowedFields.push('person_name', 'date_of_birth');
    } else if (currentEvent.event_type === 'Anniversary' || updates.event_type === 'Anniversary') {
      allowedFields.push('couple_name', 'anniversary_date');
    } else if (currentEvent.event_type === 'Event' || updates.event_type === 'Event') {
      allowedFields.push('event_name');
    }

    const setClauses = [];
    const params = [];

    allowedFields.forEach(field => {
      if (updates[field] !== undefined) {
        setClauses.push(`${field} = ?`);
        params.push(updates[field]);
      }
    });

    if (setClauses.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    params.push(id); // Add id for WHERE clause

    const query = `UPDATE events SET ${setClauses.join(', ')} WHERE id = ? AND is_active = TRUE`;
    const [result] = await pool.execute(query, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Event not found or no changes made' });
    }

    // Fetch the updated event
    const [updatedEvent] = await pool.execute('SELECT * FROM events WHERE id = ?', [id]);
    
    res.json({ 
      message: 'Event updated successfully', 
      item: updatedEvent[0] 
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ error: 'Failed to update event' });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    
    const pool = require('../config/database');
    
    // Soft delete (set is_active to FALSE)
    const [result] = await pool.execute(
      'UPDATE events SET is_active = FALSE WHERE id = ? AND is_active = TRUE', 
      [id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
};