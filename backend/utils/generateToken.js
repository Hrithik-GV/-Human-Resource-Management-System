import jwt from 'jsonwebtoken';

/**
 * Generate JWT token for authenticated user
 * 
 * @param {string} id - User ID
 * @param {string} role - User role (Employee / Admin)
 * @returns {string} JWT Token (expires in 7 days)
 */
const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

export default generateToken;
