// models/Newsletter.js
const db = require('../config/database');

class Newsletter {
  static async findAll() {
    try {
      const [rows] = await db.execute(`
        SELECT * FROM club_newsletters 
        WHERE is_active = TRUE 
        ORDER BY published_date DESC
      `);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async create(newsletterData) {
    try {
      // Comprehensive data sanitization
      const sanitizedData = {
        title: newsletterData.title || null,
        file_url: newsletterData.file_url || null,
        file_name: newsletterData.file_name || null,
        file_size: newsletterData.file_size ? parseInt(newsletterData.file_size) : 0,
        published_date: newsletterData.published_date || new Date().toISOString().split('T')[0],
        location: newsletterData.location || null,
        description: newsletterData.description || null,
        uploaded_by: newsletterData.uploaded_by || null,
        is_active: newsletterData.is_active !== undefined ? (newsletterData.is_active ? 1 : 0) : 1
      };

      // Double-check: remove any remaining undefined values
      Object.keys(sanitizedData).forEach(key => {
        if (sanitizedData[key] === undefined) {
          sanitizedData[key] = null;
        }
      });

      console.log('Sanitized newsletter data for DB:', sanitizedData);

      const query = `
        INSERT INTO club_newsletters 
        (title, file_url, file_name, file_size, published_date, location, description, uploaded_by, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const params = [
        sanitizedData.title,
        sanitizedData.file_url,
        sanitizedData.file_name,
        sanitizedData.file_size,
        sanitizedData.published_date,
        sanitizedData.location,
        sanitizedData.description,
        sanitizedData.uploaded_by,
        sanitizedData.is_active
      ];

      console.log('Final DB parameters:', params);

      const [result] = await db.execute(query, params);
      return result;
    } catch (error) {
      console.error('Database error in Newsletter.create:', error);
      throw error;
    }
  }

  static async update(id, newsletterData) {
    try {
      // Comprehensive data sanitization
      const sanitizedData = {
        title: newsletterData.title || null,
        file_url: newsletterData.file_url || null,
        file_name: newsletterData.file_name || null,
        file_size: newsletterData.file_size ? parseInt(newsletterData.file_size) : 0,
        published_date: newsletterData.published_date || null,
        location: newsletterData.location || null,
        description: newsletterData.description || null,
        is_active: newsletterData.is_active !== undefined ? (newsletterData.is_active ? 1 : 0) : 1
      };

      // Double-check: remove any remaining undefined values
      Object.keys(sanitizedData).forEach(key => {
        if (sanitizedData[key] === undefined) {
          sanitizedData[key] = null;
        }
      });

      const query = `
        UPDATE club_newsletters 
        SET title = ?, file_url = ?, file_name = ?, file_size = ?, 
            published_date = ?, location = ?, description = ?, is_active = ?
        WHERE id = ?
      `;
      
      const params = [
        sanitizedData.title,
        sanitizedData.file_url,
        sanitizedData.file_name,
        sanitizedData.file_size,
        sanitizedData.published_date,
        sanitizedData.location,
        sanitizedData.description,
        sanitizedData.is_active,
        id
      ];

      const [result] = await db.execute(query, params);
      return result;
    } catch (error) {
      console.error('Database error in Newsletter.update:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const query = 'DELETE FROM club_newsletters WHERE id = ?';
      const [result] = await db.execute(query, [id]);
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      const query = 'SELECT * FROM club_newsletters WHERE id = ?';
      const [rows] = await db.execute(query, [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Newsletter;