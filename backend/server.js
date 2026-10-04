// ============================================================
// ROTARY TUMKUR PRERANA - BACKEND SERVER
// Production-ready Express server for Render
// ============================================================

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

// IMPORTANT:
// dotenv must be loaded BEFORE importing database.js
const pool = require('./config/database');

const app = express();

// ============================================================
// CONFIGURATION
// ============================================================

const PORT = process.env.PORT || 5000;

const NODE_ENV = process.env.NODE_ENV || 'development';

const FRONTEND_URL =
    process.env.FRONTEND_URL ||
    process.env.VITE_FRONTEND_URL ||
    '*';

// ============================================================
// CORS CONFIGURATION
// ============================================================

// Allowed origins
const allowedOrigins = [
    FRONTEND_URL,

    // Add your frontend Render URL here if needed
    'https://rotary-tumkur-prerana-frontend.onrender.com',

    // Local development
    'http://localhost:5173',
    'http://127.0.0.1:5173'
].filter(Boolean);

// Remove duplicates
const uniqueOrigins = [...new Set(allowedOrigins)];

console.log('🌐 CORS configuration:');
console.log(uniqueOrigins);

// CORS middleware
app.use(
    cors({
        origin: function (origin, callback) {

            // Allow requests without Origin
            // Example: Postman, server-to-server requests
            if (!origin) {
                return callback(null, true);
            }

            // Allow all origins when FRONTEND_URL is *
            if (uniqueOrigins.includes('*')) {
                return callback(null, true);
            }

            if (uniqueOrigins.includes(origin)) {
                return callback(null, true);
            }

            console.warn(`⚠️ CORS blocked origin: ${origin}`);

            return callback(
                new Error(`CORS blocked for origin: ${origin}`)
            );
        },

        credentials: true,

        methods: [
            'GET',
            'POST',
            'PUT',
            'PATCH',
            'DELETE',
            'OPTIONS'
        ],

        allowedHeaders: [
            'Origin',
            'X-Requested-With',
            'Content-Type',
            'Accept',
            'Authorization'
        ]
    })
);

// Handle preflight requests
app.options('*', cors());

// ============================================================
// BODY PARSING
// ============================================================

app.use(
    express.json({
        limit: '50mb'
    })
);

app.use(
    express.urlencoded({
        limit: '50mb',
        extended: true
    })
);

// ============================================================
// REQUEST LOGGER
// ============================================================

app.use((req, res, next) => {

    console.log(
        `${new Date().toISOString()} | ${req.method} ${req.originalUrl}`
    );

    next();
});

// ============================================================
// UPLOAD DIRECTORIES
// ============================================================

const uploadDirs = [
    'uploads',
    'uploads/images',
    'uploads/pdfs',
    'uploads/others'
];

uploadDirs.forEach((dir) => {

    const fullPath = path.join(__dirname, dir);

    try {

        if (!fs.existsSync(fullPath)) {

            fs.mkdirSync(fullPath, {
                recursive: true
            });

            console.log(`📁 Created directory: ${dir}`);
        }

    } catch (error) {

        console.error(
            `❌ Failed to create directory ${dir}:`,
            error.message
        );
    }
});

// ============================================================
// SERVE UPLOADED FILES
// ============================================================

app.use(
    '/uploads',
    express.static(
        path.join(__dirname, 'uploads')
    )
);

// ============================================================
// MULTER CONFIGURATION
// ============================================================

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        let uploadPath;

        if (file.mimetype.startsWith('image/')) {

            uploadPath = path.join(
                __dirname,
                'uploads',
                'images'
            );

        } else if (file.mimetype === 'application/pdf') {

            uploadPath = path.join(
                __dirname,
                'uploads',
                'pdfs'
            );

        } else {

            uploadPath = path.join(
                __dirname,
                'uploads',
                'others'
            );
        }

        // Make sure directory exists
        fs.mkdirSync(uploadPath, {
            recursive: true
        });

        cb(null, uploadPath);
    },

    filename: (req, file, cb) => {

        const uniqueSuffix =
            Date.now() +
            '-' +
            Math.round(Math.random() * 1e9);

        const extension =
            path.extname(file.originalname);

        const filename =
            `file-${uniqueSuffix}${extension}`;

        cb(null, filename);
    }
});

// ============================================================
// FILE FILTER
// ============================================================

const fileFilter = (req, file, cb) => {

    const isImage =
        file.mimetype &&
        file.mimetype.startsWith('image/');

    const isPDF =
        file.mimetype === 'application/pdf';

    if (isImage || isPDF) {

        cb(null, true);

    } else {

        cb(
            new Error(
                'Only image and PDF files are allowed!'
            ),
            false
        );
    }
};

// ============================================================
// MULTER
// ============================================================

// 100 MB maximum file size
const upload = multer({

    storage,

    fileFilter,

    limits: {
        fileSize: 100 * 1024 * 1024
    }
});

// ============================================================
// SAFE ROUTE IMPORT
// ============================================================

function safeImport(
    routePath,
    name,
    placeholderHandler
) {

    try {

        const route = require(routePath);

        console.log(
            `✅ ${name} routes loaded`
        );

        return route;

    } catch (error) {

        console.error(
            `❌ Error loading ${name} routes:`,
            error.message
        );

        console.log(
            `⚠️ ${name} routes not found, creating fallback route`
        );

        const router = express.Router();

        router.get(
            '/',
            placeholderHandler
        );

        return router;
    }
}

// ============================================================
// LOAD ROUTES
// ============================================================

const userRoutes = safeImport(
    './routes/User',
    'User',
    (req, res) => {

        res.status(503).json({
            success: false,
            message: 'User routes are currently unavailable'
        });
    }
);

const authRoutes = safeImport(
    './routes/auth',
    'Auth',
    (req, res) => {

        res.status(503).json({
            success: false,
            message: 'Auth routes are currently unavailable'
        });
    }
);

const calendarRoutes = safeImport(
    './routes/calendar',
    'Calendar',
    (req, res) => {

        res.status(503).json({
            success: false,
            message: 'Calendar routes are currently unavailable'
        });
    }
);

const newsletterRoutes = safeImport(
    './routes/newsletters',
    'Newsletter',
    (req, res) => {

        res.status(503).json({
            success: false,
            message: 'Newsletter routes are currently unavailable'
        });
    }
);

const servicesRoutes = safeImport(
    './routes/services',
    'Services',
    (req, res) => {

        res.status(503).json({
            success: false,
            message: 'Services routes are currently unavailable'
        });
    }
);

const committeeRoutes = safeImport(
    './routes/committee',
    'Committee',
    (req, res) => {

        res.status(503).json({
            success: false,
            message: 'Committee routes are currently unavailable'
        });
    }
);

const joinRoutes = safeImport(
    './routes/join',
    'Join',
    (req, res) => {

        res.status(503).json({
            success: false,
            message: 'Join routes are currently unavailable'
        });
    }
);

// ============================================================
// REGISTER ROUTES
// ============================================================

app.use(
    '/api/users',
    userRoutes
);

app.use(
    '/api/auth',
    authRoutes
);

app.use(
    '/api/calendar',
    calendarRoutes
);

app.use(
    '/api/newsletters',
    newsletterRoutes
);

app.use(
    '/api/services',
    servicesRoutes
);

app.use(
    '/api/committee',
    committeeRoutes
);

app.use(
    '/api/join',
    joinRoutes
);

console.log(
    '✅ All routes initialized successfully'
);

// ============================================================
// FILE UPLOAD ENDPOINT
// ============================================================

app.post(
    '/api/upload',
    upload.single('file'),
    (req, res) => {

        try {

            if (!req.file) {

                return res.status(400).json({
                    success: false,
                    error: 'No file uploaded'
                });
            }

            // Convert Windows paths to URL-safe paths
            const normalizedPath =
                req.file.path.replace(/\\/g, '/');

            const uploadsIndex =
                normalizedPath.indexOf('uploads/');

            if (uploadsIndex === -1) {

                return res.status(500).json({
                    success: false,
                    error: 'Invalid upload path'
                });
            }

            const relativePath =
                normalizedPath.substring(
                    uploadsIndex + 'uploads/'.length
                );

            const fileUrl =
                `/uploads/${relativePath}`;

            console.log(
                `📤 File uploaded: ${fileUrl}`
            );

            return res.json({

                success: true,

                message:
                    'File uploaded successfully',

                fileUrl,

                fileName:
                    req.file.originalname,

                fileSize:
                    req.file.size,

                mimeType:
                    req.file.mimetype
            });

        } catch (error) {

            console.error(
                '❌ File upload error:',
                error
            );

            return res.status(500).json({

                success: false,

                error:
                    'Failed to upload file'
            });
        }
    }
);

// ============================================================
// ROOT ENDPOINT
// ============================================================

app.get('/', (req, res) => {

    res.json({

        success: true,

        message:
            '🎯 Welcome to Rotary Tumkur Prerana API',

        status:
            'Server is running successfully',

        version:
            '1.0.0',

        environment:
            NODE_ENV,

        timestamp:
            new Date().toISOString(),

        documentation: {

            health_check:
                '/api/health',

            api_info:
                '/api',

            database_test:
                '/api/test-db'
        },

        main_endpoints: {

            auth:
                '/api/auth',

            users:
                '/api/users',

            calendar:
                '/api/calendar',

            newsletters:
                '/api/newsletters',

            services:
                '/api/services',

            committee:
                '/api/committee',

            join:
                '/api/join',

            upload:
                '/api/upload'
        }
    });
});

// ============================================================
// HEALTH CHECK
// ============================================================

app.get(
    '/api/health',
    (req, res) => {

        res.status(200).json({

            success: true,

            message:
                '✅ Rotary Club Backend is running successfully!',

            status:
                'OK',

            version:
                '1.0.0',

            environment:
                NODE_ENV,

            timestamp:
                new Date().toISOString()
        });
    }
);

// ============================================================
// DATABASE TEST
// ============================================================

app.get(
    '/api/test-db',
    async (req, res) => {

        try {

            const [rows] =
                await pool.execute(
                    'SELECT 1 + 1 AS result'
                );

            return res.status(200).json({

                success: true,

                message:
                    '✅ Database connection successful!',

                testResult:
                    rows[0].result,

                database:
                    process.env.DB_NAME ||
                    'Not configured'
            });

        } catch (error) {

            console.error(
                '❌ Database test failed:',
                error.message
            );

            return res.status(500).json({

                success: false,

                message:
                    '❌ Database connection failed',

                error:
                    error.message,

                database:
                    process.env.DB_NAME ||
                    'Not configured'
            });
        }
    }
);

// ============================================================
// DATABASE CONNECTION TEST
// ============================================================

app.get(
    '/api/test-connection',
    async (req, res) => {

        let connection;

        try {

            connection =
                await pool.getConnection();

            const [rows] =
                await connection.query(
                    'SELECT 1 AS test'
                );

            return res.status(200).json({

                success: true,

                message:
                    'Database connected successfully!',

                result:
                    rows
            });

        } catch (error) {

            console.error(
                '❌ Database connection test:',
                error.message
            );

            return res.status(500).json({

                success: false,

                error:
                    'Database connection failed',

                details:
                    error.message
            });

        } finally {

            if (connection) {
                connection.release();
            }
        }
    }
);

// ============================================================
// API INFORMATION
// ============================================================

app.get(
    '/api',
    (req, res) => {

        res.json({

            success: true,

            message:
                '🎯 Rotary Club API',

            status:
                'Server is running successfully',

            version:
                '1.0.0',

            endpoints: {

                root:
                    '/',

                auth:
                    '/api/auth',

                users:
                    '/api/users',

                calendar:
                    '/api/calendar',

                newsletters:
                    '/api/newsletters',

                services:
                    '/api/services',

                committee:
                    '/api/committee',

                join:
                    '/api/join',

                upload:
                    '/api/upload',

                health:
                    '/api/health',

                database:
                    '/api/test-db'
            }
        });
    }
);

// ============================================================
// API 404 HANDLER
// ============================================================

app.use(
    '/api',
    (req, res) => {

        res.status(404).json({

            success: false,

            error:
                'API endpoint not found',

            method:
                req.method,

            path:
                req.originalUrl
        });
    }
);

// ============================================================
// GENERAL 404 HANDLER
// ============================================================

app.use(
    (req, res) => {

        res.status(404).json({

            success: false,

            error:
                'Route not found',

            method:
                req.method,

            path:
                req.originalUrl
        });
    }
);

// ============================================================
// MULTER / GLOBAL ERROR HANDLER
// ============================================================

app.use(
    (error, req, res, next) => {

        console.error(
            '❌ Server error:',
            error
        );

        // Multer file size error
        if (
            error instanceof multer.MulterError &&
            error.code === 'LIMIT_FILE_SIZE'
        ) {

            return res.status(400).json({

                success: false,

                error:
                    'File too large. Maximum size is 100MB.'
            });
        }

        // File type error
        if (
            error.message ===
            'Only image and PDF files are allowed!'
        ) {

            return res.status(400).json({

                success: false,

                error:
                    error.message
            });
        }

        // CORS error
        if (
            error.message &&
            error.message.startsWith('CORS blocked')
        ) {

            return res.status(403).json({

                success: false,

                error:
                    'CORS policy blocked this request'
            });
        }

        return res.status(500).json({

            success: false,

            error:
                'Something went wrong!',

            message:
                NODE_ENV === 'development'
                    ? error.message
                    : 'Internal server error'
        });
    }
);

// ============================================================
// START SERVER
// ============================================================

const server =
    app.listen(
        PORT,
        '0.0.0.0',
        () => {

            console.log('');
            console.log(
                '=========================================='
            );

            console.log(
                '🚀 ROTARY TUMKUR PRERANA BACKEND'
            );

            console.log(
                '=========================================='
            );

            console.log(
                `🚀 Server running on port ${PORT}`
            );

            console.log(
                `🌍 Environment: ${NODE_ENV}`
            );

            console.log(
                `📍 Health: /api/health`
            );

            console.log(
                `📍 API: /api`
            );

            console.log(
                `📍 Database Test: /api/test-db`
            );

            console.log(
                `📍 Committee: /api/committee`
            );

            console.log(
                '=========================================='
            );

            console.log('');
        }
    );

// ============================================================
// SERVER TIMEOUTS
// ============================================================

server.keepAliveTimeout = 120000;
server.headersTimeout = 125000;

// ============================================================
// UNHANDLED ERRORS
// ============================================================

process.on(
    'unhandledRejection',
    (reason) => {

        console.error(
            '❌ Unhandled Promise Rejection:',
            reason
        );
    }
);

process.on(
    'uncaughtException',
    (error) => {

        console.error(
            '❌ Uncaught Exception:',
            error
        );
    }
);

// ============================================================
// GRACEFUL SHUTDOWN
// ============================================================

process.on(
    'SIGTERM',
    () => {

        console.log(
            '🛑 SIGTERM received. Shutting down...'
        );

        server.close(
            () => {

                console.log(
                    '✅ Server closed'
                );

                process.exit(0);
            }
        );
    }
);

process.on(
    'SIGINT',
    () => {

        console.log(
            '🛑 SIGINT received. Shutting down...'
        );

        server.close(
            () => {

                console.log(
                    '✅ Server closed'
                );

                process.exit(0);
            }
        );
    }
);
