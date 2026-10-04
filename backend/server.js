require('dotenv').config(); // load .env first, before anything else needs it

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const pool = require('./config/database');

const app = express();

// ✅ Middleware
app.use(cors({
  origin: [
    'https://rotary-tumkur-prerana-frontend.onrender.com',
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  credentials: true
}));
app.use(express.json({ limit: '900mb' }));
app.use(express.urlencoded({ limit: '900mb', extended: true }));

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

// ✅ Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = path.join(__dirname, 'uploads');
    if (file.mimetype.startsWith('image/')) {
      uploadPath = path.join(uploadPath, 'images');
    } else if (file.mimetype === 'application/pdf') {
      uploadPath = path.join(uploadPath, 'pdfs');
    } else {
      uploadPath = path.join(uploadPath, 'others');
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
  limits: { fileSize: 1000 * 1024 * 1024 } // 1000 MB
});

// ✅ Safe route imports with fallbacks
function safeImport(routePath, name, placeholderHandler) {
  try {
    const route = require(routePath);
    console.log(`✅ ${name} routes loaded`);
    return route;
  } catch (e) {
    console.log(`⚠️ ${name} routes not loaded, creating placeholder. Reason: ${e.message}`);
    const router = express.Router();
    router.get('/', placeholderHandler);
    return router;
  }
}

// ✅ Load all routes
const userRoutes = safeImport('./routes/User', 'User', (req, res) => res.json({ message: 'User route placeholder' }));
const authRoutes = safeImport('./routes/auth', 'Auth', (req, res) => res.json({ message: 'Auth placeholder' }));
const calendarRoutes = safeImport('./routes/calendar', 'Calendar', (req, res) => res.json({ message: 'Calendar placeholder' }));
const newsletterRoutes = safeImport('./routes/newsletters', 'Newsletter', (req, res) => res.json({ message: 'Newsletter placeholder' }));
const servicesRoutes = safeImport('./routes/services', 'Services', (req, res) => res.json({ message: 'Services placeholder' }));
const committeeRoutes = safeImport('./routes/committee', 'Committee', (req, res) => res.json({ message: 'Committee placeholder' }));
const joinRoutes = safeImport('./routes/join', 'Join', (req, res) => res.json({ message: 'Join placeholder' }));

// ✅ Register all routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/newsletters', newsletterRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/committee', committeeRoutes);
app.use('/api/join', joinRoutes);

console.log('✅ All routes initialized successfully');

// ✅ File upload endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const normalizedPath = req.file.path.replace(/\\/g, '/');
    const relativePath = normalizedPath.split('uploads/')[1];
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

// ✅ ROOT ENDPOINT
app.get('/', (req, res) => {
  res.json({
    message: '🎯 Welcome to Rotary Club API',
    status: 'Server is running successfully',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    documentation: {
      health_check: '/api/health',
      api_info: '/api',
      database_test: '/api/test-db'
    },
    main_endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      calendar: '/api/calendar',
      newsletters: '/api/newsletters',
      services: '/api/services',
      committee: '/api/committee',
      join: '/api/join',
      upload: '/api/upload'
    }
  });
});

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
    const [rows] = await pool.execute('SELECT 1 + 1 AS result');
    res.json({
      message: '✅ Database connection successful!',
      testResult: rows[0].result,
      database: process.env.DB_NAME || 'Not configured'
    });
  } catch (error) {
    res.json({
      message: '❌ Database connection failed',
      error: error.message,
      tip: 'Check your environment variables and MySQL connection'
    });
  }
});

// ✅ API info endpoint
app.get('/api', (req, res) => {
  res.json({
    message: '🎯 Rotary Club API - All Systems Ready!',
    status: 'Server is running successfully',
    endpoints: {
      root: '/',
      auth: '/api/auth',
      users: '/api/users',
      calendar: '/api/calendar',
      newsletters: '/api/newsletters',
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

// ✅ Connection test endpoint
app.get('/api/test-connection', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT 1 as test');
    connection.release();
    res.json({ message: 'Database connected successfully!', result: rows });
  } catch (error) {
    res.status(500).json({ error: 'Database connection failed', details: error.message });
  }
});

// ✅ 404 handler for unknown API endpoints
app.use('/api', (req, res) => {
  res.status(404).json({
    error: 'API endpoint not found',
    method: req.method,
    path: req.originalUrl
  });
});

// ✅ Global error handler (must come last)
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'File too large. Maximum size is 1000MB.' });
  }
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
  });
});

// ✅ Create tables if they don't exist
async function initDatabase() {
  try {
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS committee_members (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        position VARCHAR(255) NOT NULL DEFAULT 'Member',
        image_url VARCHAR(500) NULL,
        category VARCHAR(100) NOT NULL DEFAULT 'board_of_directors',
        email VARCHAR(255) NULL,
        phone VARCHAR(50) NULL,
        bio TEXT NULL,
        position_order INT NOT NULL DEFAULT 0,
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ committee_members table ready');
  } catch (error) {
    console.error('❌ Database init failed:', error.message);
  }
}
initDatabase();

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📍 API Info: http://localhost:${PORT}/api`);
  console.log(`📍 Root: http://localhost:${PORT}/`);
});
