/**
 * Utility to generate a structured Login ID.
 * Format:
 * First 2 letters of first name +
 * First 2 letters of last name +
 * Joining Year +
 * Four-digit running employee number.
 *
 * Example: Oliver Todd, Year 2023, Seq 1 => OITODO20230001
 */
export const generateLoginId = (name = '', year = new Date().getFullYear(), sequence = 1) => {
  const cleanName = name.trim();
  if (!cleanName) return '';

  const nameParts = cleanName.split(/\s+/);
  const firstName = nameParts[0] || 'EM';
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : firstName;

  const firstTwoFirst = firstName.substring(0, 2).padEnd(2, 'X').toUpperCase();
  const firstTwoLast = lastName.substring(0, 2).padEnd(2, 'X').toUpperCase();

  const seqPadded = String(sequence).padStart(4, '0');

  return `${firstTwoFirst}${firstTwoLast}${year}${seqPadded}`;
};
