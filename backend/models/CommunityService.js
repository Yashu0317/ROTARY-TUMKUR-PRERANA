// models/CommunityService.js
const pool = require('../config/database');

class CommunityService {
  static async findAll() {
    const [services] = await pool.execute(
      `SELECT * FROM community_services 
       WHERE is_active = TRUE 
       ORDER BY service_date DESC, created_at DESC`
    );
    return services;
  }

  static async findById(id) {
    const [services] = await pool.execute(
      'SELECT * FROM community_services WHERE id = ? AND is_active = TRUE',
      [id]
    );
    return services[0];
  }

  static async create(serviceData) {
    const [result] = await pool.execute(
      `INSERT INTO community_services 
       (heading, description, image_url, location, service_date, club_name, 
        category, status, volunteers_count, impact_description, created_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        serviceData.heading,
        serviceData.description,
        serviceData.image_url,
        serviceData.location,
        serviceData.service_date,
        serviceData.club_name,
        serviceData.category,
        serviceData.status,
        serviceData.volunteers_count,
        serviceData.impact_description,
        serviceData.created_by
      ]
    );
    return result.insertId;
  }

  static async update(id, serviceData) {
    const fields = [];
    const values = [];

    Object.keys(serviceData).forEach(key => {
      if (serviceData[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(serviceData[key]);
      }
    });

    values.push(id);

    const [result] = await pool.execute(
      `UPDATE community_services SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      values
    );

    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await pool.execute(
      'UPDATE community_services SET is_active = FALSE WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
}

module.exports = CommunityService;