// routes/services.js
const express = require('express');
const router = express.Router();
const servicesController = require('../controllers/servicesController');

// Get all services
router.get('/', servicesController.getServices);

// Get service by ID
router.get('/:id', servicesController.getServiceById);

// Get services by category
router.get('/category/:category', servicesController.getServicesByCategory);

// Create new service
router.post('/', servicesController.createService);

// Update service
router.put('/:id', servicesController.updateService);

// Delete service
router.delete('/:id', servicesController.deleteService);

module.exports = router;