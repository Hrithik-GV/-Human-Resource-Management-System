/**
 * Async handler utility to wrap asynchronous express route handlers
 * eliminates repetitive try-catch blocks
 * 
 * @param {Function} fn - Async controller function
 * @returns {Function} Express middleware function
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
