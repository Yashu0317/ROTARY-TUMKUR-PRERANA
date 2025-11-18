// models/Event.js
const pool = require('../config/database');

class Event {
  static async findAll(filters = {}) {
    let query = `SELECT * FROM events WHERE is_active = TRUE`;
    const params = [];

    if (filters.event_type) {
      query += ' AND event_type = ?';
      params.push(filters.event_type);
    }

    if (filters.start_date) {
      query += ' AND event_date >= ?';
      params.push(filters.start_date);
    }

    if (filters.end_date) {
      query += ' AND event_date <= ?';
      params.push(filters.end_date);
    }

    query += ' ORDER BY event_date ASC, event_time ASC';

    const [events] = await pool.execute(query, params);
    return events;
  }

  static async findById(id) {
    const [events] = await pool.execute(
      'SELECT * FROM events WHERE id = ? AND is_active = TRUE', 
      [id]
    );
    return events[0] || null;
  }
}

module.exports = Event;