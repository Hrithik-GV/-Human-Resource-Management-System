/**
 * Middleware to restrict route access to Admin role only
 */
export const isAdmin = (req, res, next) => {
  if (!req.user) {
    res.status(401);
    throw new Error('Not authorized, user not authenticated');
  }

  if (req.user.role !== 'Admin') {
    res.status(403);
    throw new Error('Forbidden: Access is restricted to Admins only');
  }

  next();
};

/**
 * Middleware to allow route access to Employee and Admin roles
 */
export const isEmployee = (req, res, next) => {
  if (!req.user) {
    res.status(401);
    throw new Error('Not authorized, user not authenticated');
  }

  if (req.user.role !== 'Employee' && req.user.role !== 'Admin') {
    res.status(403);
    throw new Error('Forbidden: Access is restricted to Employees and Admins');
  }

  next();
};

/**
 * Reusable generic role-based authorization middleware
 * 
 * @param {...string} roles - List of allowed roles
 * @returns {Function} Express middleware
 */
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized, user not authenticated');
    }

    if (!roles.includes(req.user.role)) {
      res.status(403);
      throw new Error(`Forbidden: Role '${req.user.role}' is not authorized to access this resource`);
    }

    next();
  };
};
