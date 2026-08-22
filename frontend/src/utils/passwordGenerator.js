/**
 * Utility to generate a secure random temporary password.
 * Example format: Dayflow#8492
 */
export const generateTempPassword = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomDigits = '';
  for (let i = 0; i < 4; i++) {
    randomDigits += Math.floor(Math.random() * 10);
  }
  return `Dayflow#${randomDigits}`;
};
