const jwt = require('jsonwebtoken');

// Secret key (should be moved to an environment variable for production)
const JWT_SECRET = 'your_jwt_secret';

// Function to generate a token
function generateToken(user) {
  return jwt.sign(
    { customer_id: user.customer_id, email: user.email }, // Payload
    JWT_SECRET,
    { expiresIn: '1h' } // Token expiration time, adjust as needed
  );
}

// Function to verify a token
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

module.exports = { generateToken, verifyToken };