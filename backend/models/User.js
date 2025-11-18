// Import Express
const express = require('express');
const router = express.Router();

// Example: Import your user controller (optional)
// const { registerUser, loginUser, getAllUsers } = require('../controllers/userController');

// ✅ 1. Basic route to check if it's working
router.get('/', (req, res) => {
  res.send('User route working!');
});

// ✅ 2. Example routes (optional)
// Register new user
router.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  // You can add database logic here later
  res.json({
    message: 'User registered successfully',
    user: { name, email }
  });
});

// ✅ 3. Example login route
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  // Example login logic
  if (email === 'admin@example.com' && password === '12345') {
    res.json({ message: 'Login successful', token: 'sample_jwt_token' });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// ✅ 4. Example route to get all users
router.get('/all', (req, res) => {
  // Replace with real DB fetch later
  const sampleUsers = [
    { id: 1, name: 'John', email: 'john@example.com' },
    { id: 2, name: 'Jane', email: 'jane@example.com' }
  ];
  res.json(sampleUsers);
});

// ✅ Export router so it can be used in server.js
module.exports = router;
