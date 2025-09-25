const crypto = require('crypto');

// Generate a secure random token
const generateToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

// Generate a secure random string for verification
const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Generate a secure random string for password reset
const generateResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Generate a secure random string for API keys
const generateApiKey = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Hash a token for secure storage
const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

// Verify a token against its hash
const verifyToken = (token, hash) => {
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  return tokenHash === hash;
};

module.exports = {
  generateToken,
  generateVerificationToken,
  generateResetToken,
  generateApiKey,
  hashToken,
  verifyToken
};
