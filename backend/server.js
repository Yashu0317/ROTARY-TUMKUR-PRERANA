// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
require('dotenv').config();

const app = express();

// ✅ Load user routes safely (move this ABOVE app.use)
let userRoutes;
try {
  userRoutes = require('./routes/User'); // Ensure this file exists and exports router
  console.log('✅ User routes loaded');
} catch (e) {
  console.log('⚠️ User routes not found, creating basic route');
  const router = express.Router();
  router.get('/', (req, res) => res.json({ message: 'User route placeholder' }));
  userRoutes = router;
}

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Ensure uploads directories exist
const uploadDirs = ['uploads/images', 'uploads/pdfs', 'uploads/others'];
uploadDirs.forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`📁 Created directory: ${dir}`);
  }
});

// ✅ Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Use user routes (moved here, after defining userRoutes)
app.use('/api/users', userRoutes);

// ✅ Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = 'uploads/';
    if (file.mimetype.startsWith('image/')) {
      uploadPath += 'images/';
    } else if (file.mimetype === 'application/pdf') {
      uploadPath += 'pdfs/';
    } else {
      uploadPath += 'others/';
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, 'file-' + uniqueSuffix + extension);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only image and PDF files are allowed!'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10 MB
});

// ✅ File upload endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Normalize Windows paths
    const normalizedPath = req.file.path.replace(/\\/g, '/');

    // Extract the part AFTER "uploads/"
    const relativePath = normalizedPath.split('uploads/')[1];

    // Full correct URL
    const fileUrl = `/uploads/${relativePath}`;

    return res.json({
      success: true,
      message: 'File uploaded successfully',
      fileUrl: fileUrl,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      mimeType: req.file.mimetype
    });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});




// ✅ Safe route imports (with fallbacks)
function safeImport(routePath, name, placeholderHandler) {
  try {
    const route = require(routePath);
    console.log(`✅ ${name} routes loaded`);
    return route;
  } catch (e) {
    console.log(`⚠️ ${name} routes not found, creating placeholder`);
    const router = express.Router();
    router.get('/', placeholderHandler);
    return router;
  }
}

const authRoutes = safeImport('./routes/auth', 'Auth', (req, res) => res.json({ message: 'Auth placeholder' }));
const calendarRoutes = safeImport('./routes/calendar', 'Calendar', (req, res) => res.json({ message: 'Calendar placeholder' }));
const newsletterRoutes = safeImport('./routes/newsletters', 'Newsletter', (req, res) => res.json({ message: 'Newsletter placeholder' }));
const servicesRoutes = safeImport('./routes/services', 'Services', (req, res) => res.json({ message: 'Services placeholder' }));
const committeeRoutes = safeImport('./routes/committee', 'Committee', (req, res) => res.json({ message: 'Committee placeholder' }));
const joinRoutes = safeImport('./routes/join', 'Join', (req, res) => res.json({ message: 'Join placeholder' }));

// ✅ Use routes
app.use('/api/auth', authRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/newsletters', newsletterRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/committee', committeeRoutes);
app.use('/api/join', joinRoutes);

console.log('✅ All routes initialized successfully');

// ✅ Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    message: '✅ Rotary Club Backend is running successfully!',
    timestamp: new Date().toISOString(),
    status: 'OK',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// ✅ Database test endpoint
app.get('/api/test-db', async (req, res) => {
  try {
    if (fs.existsSync('./config/database.js')) {
      const pool = require('./config/database');
      const [rows] = await pool.execute('SELECT 1 + 1 AS result');
      res.json({
        message: '✅ Database connection successful!',
        testResult: rows[0].result,
        database: process.env.DB_NAME || 'Not configured'
      });
    } else {
      res.json({
        message: '⚠️ Database config file not found',
        tip: 'Create config/database.js file'
      });
    }
  } catch (error) {
    res.json({
      message: '❌ Database connection failed',
      error: error.message,
      tip: 'Check your .env file and MySQL connection'
    });
  }
});

// ✅ API info endpoint
app.get('/api', (req, res) => {
  res.json({
    message: '🎯 Rotary Club API - All Systems Ready!',
    status: 'Server is running successfully',
    endpoints: {
      auth: '/api/auth',
      calendar: '/api/calendar',
      club_newsletters: '/api/club-newsletters',
      governor_newsletters: '/api/governor-newsletters',
      services: '/api/services',
      committee: '/api/committee',
      join: '/api/join',
      upload: '/api/upload',
      health: '/api/health',
      test: '/api/test-db'
    },
    version: '1.0.0'
  });
});

// ✅ Global error handler
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
  }
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
  });
});

// ✅ 404 handler for unknown API endpoints
app.all(/^\/api(\/.*)?$/, (req, res) => {
  res.status(404).json({
    error: 'API endpoint not found',
    method: req.method,
    path: req.originalUrl
  });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📍 API Info: http://localhost:${PORT}/api`);
});
