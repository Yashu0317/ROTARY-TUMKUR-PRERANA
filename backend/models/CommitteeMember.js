// models/CommitteeMember.js
const pool = require('../config/database');

class CommitteeMember {

  // Fetch all active members
  static async findAll() {
    const [members] = await pool.execute(
      `SELECT * FROM committee_members
       WHERE is_active = TRUE
       ORDER BY category, position_order ASC`
    );
    return members;
  }

  // Fetch members by category
  static async findByCategory(category) {
    const [members] = await pool.execute(
      `SELECT * FROM committee_members
       WHERE category = ? AND is_active = TRUE
       ORDER BY position_order ASC`,
      [category]
    );
    return members;
  }

  // Fetch single member by ID
  static async findById(id) {
    const [members] = await pool.execute(
      'SELECT * FROM committee_members WHERE id = ? AND is_active = TRUE',
      [id]
    );
    return members[0];
  }

  // Create a new committee member
  static async create(data) {
    const position = data.position || data.title || 'Member';
    const image_url = data.image_url || null;
    const category = data.category || 'board_of_directors';
    const email = data.email || null;
    const phone = data.phone || null;
    const bio = data.bio || null;
    const position_order = data.position_order ?? 0;
    const is_active = data.is_active ?? true;

    const [result] = await pool.execute(
      `INSERT INTO committee_members 
        (name, position, image_url, category, email, phone, bio, position_order, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.name,
        position,
        image_url,
        category,
        email,
        phone,
        bio,
        position_order,
        is_active
      ]
    );

    return await this.findById(result.insertId);
  }

  // Update a committee member
  static async update(id, memberData) {
    const fields = [];
    const values = [];

    Object.keys(memberData).forEach(key => {
      // ❌ Do NOT update these fields
      if (key === "id" || key === "created_at" || key === "updated_at") return;

      if (memberData[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(memberData[key]);
      }
    });

    // If nothing to update
    if (fields.length === 0) return false;

    values.push(id);

    const [result] = await pool.execute(
      `UPDATE committee_members
       SET ${fields.join(', ')},
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      values
    );

    return result.affectedRows > 0;
  }

  // Soft delete — mark member inactive
  static async delete(id) {
    const [result] = await pool.execute(
      `UPDATE committee_members 
       SET is_active = FALSE 
       WHERE id = ?`,
      [id]
    );

    return result.affectedRows > 0;
  }
}

module.exports = CommitteeMember;
