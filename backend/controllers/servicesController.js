// controllers/servicesController.js
const db = require('../config/database');

// Get all services (across all categories)
exports.getServices = async (req, res) => {
  try {
    // Union query to get services from all tables
    const query = `
      SELECT * FROM (
        SELECT id, heading, description, image_url, location, service_date, 
               category, status, volunteers_count, impact_description, 
               created_by, is_active, created_at, updated_at, 'community_services' as source_table
        FROM community_services
        WHERE is_active = TRUE
        UNION ALL
        SELECT id, heading, description, image_url, location, service_date, 
               category, status, volunteers_count, impact_description, 
               created_by, is_active, created_at, updated_at, 'ClubService' as source_table
        FROM ClubService
        WHERE is_active = TRUE
        UNION ALL
        SELECT id, heading, description, image_url, location, service_date, 
               category, status, volunteers_count, impact_description, 
               created_by, is_active, created_at, updated_at, 'VocationalService' as source_table
        FROM VocationalService
        WHERE is_active = TRUE
        UNION ALL
        SELECT id, heading, description, image_url, location, service_date, 
               category, status, volunteers_count, impact_description, 
               created_by, is_active, created_at, updated_at, 'NewGenerationService' as source_table
        FROM NewGenerationService
        WHERE is_active = TRUE
        UNION ALL
        SELECT id, heading, description, image_url, location, service_date, 
               category, status, volunteers_count, impact_description, 
               created_by, is_active, created_at, updated_at, 'InternationalService' as source_table
        FROM InternationalService
        WHERE is_active = TRUE
        UNION ALL
        SELECT id, heading, description, image_url, location, service_date, 
               category, status, volunteers_count, impact_description, 
               created_by, is_active, created_at, updated_at, 'PublicImageInitiative' as source_table
        FROM PublicImageInitiative
        WHERE is_active = TRUE
      ) AS all_services
      ORDER BY created_at DESC
    `;

    const [results] = await db.execute(query);
    
    console.log(`✅ Fetched ${results.length} services`);
    res.json(results);
  } catch (error) {
    console.error('❌ Error fetching services:', error);
    res.status(500).json({ 
      error: 'Failed to fetch services',
      details: error.message 
    });
  }
};

// Create new service
exports.createService = async (req, res) => {
  try {
    const {
      heading,
      description,
      image_url,
      location,
      service_date,
      category,
      status,
      volunteers_count,
      impact_description,
      created_by,
      is_active,
      club_name
    } = req.body;

    console.log('📥 Received service data:', req.body);

    // Validate required fields
    if (!heading || !description) {
      return res.status(400).json({ 
        error: 'Heading and description are required fields' 
      });
    }

    if (!category) {
      return res.status(400).json({ 
        error: 'Category is required' 
      });
    }

    let tableName;

    // Determine which table to insert into based on category
    switch (category) {
      case 'community_service':
        tableName = 'community_services';
        break;
      case 'club_service':
        tableName = 'ClubService';
        break;
      case 'vocational_service':
        tableName = 'VocationalService';
        break;
      case 'new_generation_service':
        tableName = 'NewGenerationService';
        break;
      case 'international_service':
        tableName = 'InternationalService';
        break;
      case 'public_image_initiative':
        tableName = 'PublicImageInitiative';
        break;
      default:
        return res.status(400).json({ 
          error: 'Invalid category. Must be one of: community_service, club_service, vocational_service, new_generation_service, international_service, public_image_initiative' 
        });
    }

    // Insert into the appropriate table
    const query = `
      INSERT INTO ${tableName} 
      (heading, description, image_url, location, service_date, category, status, volunteers_count, impact_description, created_by, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const values = [
      heading,
      description,
      image_url || null,
      location || null,
      service_date || null,
      category,
      status || 'upcoming',
      parseInt(volunteers_count) || 0,
      impact_description || null,
      created_by || null,
      is_active !== undefined ? is_active : true
    ];

    console.log('🚀 Executing query:', query);
    console.log('📋 With values:', values);

    const [result] = await db.execute(query, values);
    
    console.log('✅ Service created successfully with ID:', result.insertId);
    
    // Get the newly created service
    const getQuery = `SELECT * FROM ${tableName} WHERE id = ?`;
    const [newService] = await db.execute(getQuery, [result.insertId]);
    
    res.status(201).json({
      id: result.insertId,
      message: 'Service created successfully',
      table: tableName,
      item: newService[0]
    });

  } catch (error) {
    console.error('❌ Error creating service:', error);
    res.status(500).json({ 
      error: 'Failed to create service',
      details: error.message,
      sqlMessage: error.sqlMessage 
    });
  }
};

// Update service
exports.updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      heading,
      description,
      image_url,
      location,
      service_date,
      category,
      status,
      volunteers_count,
      impact_description,
      is_active
    } = req.body;

    console.log('📥 Updating service ID:', id);
    console.log('📥 Update data:', req.body);

    // First, find which table contains this service
    const tables = [
      'community_services',
      'ClubService',
      'VocationalService',
      'NewGenerationService', 
      'InternationalService',
      'PublicImageInitiative'
    ];

    let sourceTable = '';
    for (const table of tables) {
      const checkQuery = `SELECT id FROM ${table} WHERE id = ?`;
      const [results] = await db.execute(checkQuery, [id]);
      if (results.length > 0) {
        sourceTable = table;
        break;
      }
    }

    if (!sourceTable) {
      return res.status(404).json({ error: 'Service not found' });
    }

    console.log('🔍 Found service in table:', sourceTable);

    // Update the service
    const query = `
      UPDATE ${sourceTable} 
      SET heading = ?, description = ?, image_url = ?, location = ?, 
          service_date = ?, category = ?, status = ?, volunteers_count = ?, 
          impact_description = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    const values = [
      heading,
      description,
      image_url || null,
      location || null,
      service_date || null,
      category,
      status || 'upcoming',
      parseInt(volunteers_count) || 0,
      impact_description || null,
      is_active !== undefined ? is_active : true,
      id
    ];

    const [result] = await db.execute(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }

    // Get the updated service
    const getQuery = `SELECT * FROM ${sourceTable} WHERE id = ?`;
    const [updatedService] = await db.execute(getQuery, [id]);

    console.log('✅ Service updated successfully');
    
    res.json({
      message: 'Service updated successfully',
      table: sourceTable,
      item: updatedService[0]
    });
  } catch (error) {
    console.error('❌ Error updating service:', error);
    res.status(500).json({ 
      error: 'Failed to update service',
      details: error.message,
      sqlMessage: error.sqlMessage 
    });
  }
};

// Delete service (soft delete)
exports.deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('🗑️ Deleting service ID:', id);

    // Find which table contains this service
    const tables = [
      'community_services',
      'ClubService',
      'VocationalService',
      'NewGenerationService',
      'InternationalService',
      'PublicImageInitiative'
    ];

    let sourceTable = '';
    for (const table of tables) {
      const checkQuery = `SELECT id FROM ${table} WHERE id = ?`;
      const [results] = await db.execute(checkQuery, [id]);
      if (results.length > 0) {
        sourceTable = table;
        break;
      }
    }

    if (!sourceTable) {
      return res.status(404).json({ error: 'Service not found' });
    }

    console.log('🔍 Found service in table:', sourceTable);

    // Soft delete by setting is_active to false
    const query = `UPDATE ${sourceTable} SET is_active = FALSE WHERE id = ?`;
    const [result] = await db.execute(query, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }

    console.log('✅ Service deleted successfully');
    
    res.json({ 
      message: 'Service deleted successfully',
      table: sourceTable 
    });
  } catch (error) {
    console.error('❌ Error deleting service:', error);
    res.status(500).json({ 
      error: 'Failed to delete service',
      details: error.message,
      sqlMessage: error.sqlMessage 
    });
  }
};

// Get service by ID
exports.getServiceById = async (req, res) => {
  try {
    const { id } = req.params;

    // Try each table until we find the service
    const tables = [
      'community_services',
      'ClubService', 
      'VocationalService',
      'NewGenerationService',
      'InternationalService',
      'PublicImageInitiative'
    ];

    let service = null;
    let sourceTable = '';

    for (const table of tables) {
      const query = `SELECT * FROM ${table} WHERE id = ? AND is_active = TRUE`;
      const [results] = await db.execute(query, [id]);
      
      if (results.length > 0) {
        service = results[0];
        sourceTable = table;
        break;
      }
    }

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    // Add source table to response
    service.source_table = sourceTable;
    res.json(service);
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({ 
      error: 'Failed to fetch service',
      details: error.message 
    });
  }
};

// Get services by category
exports.getServicesByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    let tableName;
    switch (category) {
      case 'community_service':
        tableName = 'community_services';
        break;
      case 'club_service':
        tableName = 'ClubService';
        break;
      case 'vocational_service':
        tableName = 'VocationalService';
        break;
      case 'new_generation_service':
        tableName = 'NewGenerationService';
        break;
      case 'international_service':
        tableName = 'InternationalService';
        break;
      case 'public_image_initiative':
        tableName = 'PublicImageInitiative';
        break;
      default:
        return res.status(400).json({ 
          error: 'Invalid category' 
        });
    }

    const query = `SELECT * FROM ${tableName} WHERE is_active = TRUE ORDER BY created_at DESC`;
    const [results] = await db.execute(query);

    res.json(results);
  } catch (error) {
    console.error('Error fetching services by category:', error);
    res.status(500).json({ 
      error: 'Failed to fetch services',
      details: error.message 
    });
  }
};