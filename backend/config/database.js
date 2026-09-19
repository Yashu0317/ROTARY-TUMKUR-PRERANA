const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// ✅ Read CA certificate (optional, with fallback)
let sslConfig = {};
try {
  const caPath = path.join(__dirname, '../ca-certificate.pem');
  if (fs.existsSync(caPath)) {
    sslConfig = {
      ca: fs.readFileSync(caPath),
      rejectUnauthorized: false  // ✅ IMPORTANT: Set to false for Aiven
    };
    console.log('✅ CA certificate loaded successfully');
  } else {
    console.warn('⚠️ CA certificate file not found');
    console.warn('⚠️ Using standard SSL configuration...');
    sslConfig = {
      rejectUnauthorized: false
    };
  }
} catch (error) {
  console.warn('⚠️ Error reading CA certificate:', error.message);
  sslConfig = {
    rejectUnauthorized: false
  };
}

// ✅ Create connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'defaultdb',
  port: parseInt(process.env.DB_PORT || '3306'),
  
  // ✅ SSL Configuration for Aiven
  ssl: sslConfig,
  
  // ✅ Connection Pool Settings
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  
  // ✅ Timeout Settings
  connectionTimeout: 15000,    // 15 seconds
  enableKeepAlive: true,
  keepAliveInitialDelayMs: 30000,
  
  // ✅ Other Settings
  timezone: '+00:00',
  supportBigNumbers: true,
  bigNumberStrings: true,
  decimalNumbers: true,
  multipleStatements: false
});

// ✅ Error handling for pool
pool.on('error', (err) => {
  console.error('❌ Connection pool error:', err.code);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.error('Database connection was closed.');
  }
  if (err.code === 'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR') {
    console.error('Database had a fatal error.');
  }
  if (err.code === 'PROTOCOL_ENQUEUE_AFTER_CLOSE') {
    console.error('Database connection was closed.');
  }
});

// ✅ Log connection info (for debugging)
console.log(`📊 Database Configuration:`);
console.log(`  Host: ${process.env.DB_HOST}`);
console.log(`  Port: ${process.env.DB_PORT}`);
console.log(`  User: ${process.env.DB_USER}`);
console.log(`  Database: ${process.env.DB_NAME}`);
console.log(`  SSL: Enabled (rejectUnauthorized: false)`);
console.log(`✅ Database connection pool initialized`);

module.exports = pool;
