/**
 * Role-based authorization middleware
 * 
 * @param {...string} roles - Allowed user roles (e.g., 'Admin', 'Employee')
 * @returns {Function} Express middleware function
 */
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401);
      throw new Error('Not authenticated');
    }

    if (!roles.includes(req.user.role)) {
      res.status(403);
      throw new Error(`Role '${req.user.role}' is not authorized to access this resource`);
    }

    next();
  };
};
