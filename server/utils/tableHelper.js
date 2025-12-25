/**
 * Table Name Helper Utility
 * Provides safe table name generation for multi-user table-per-user architecture
 */

/**
 * Generate a safe table name for a user's branch table
 * @param {string} username - User's username (will be sanitized)
 * @param {number} level - Branch level (1-5)
 * @returns {string} Safe table name like "john_branches1"
 * @throws {Error} If username or level is invalid
 */
export function getUserTableName(username, level) {
    // Validate level
    const lvl = parseInt(level, 10);
    if (isNaN(lvl) || lvl < 1 || lvl > 5) {
        throw new Error('Invalid branch level. Must be 1-5.');
    }
    
    // Validate username exists
    if (!username || typeof username !== 'string') {
        throw new Error('Username is required.');
    }
    
    // Sanitize username: only allow alphanumeric and underscores, lowercase
    const sanitized = username.toLowerCase().replace(/[^a-z0-9_]/g, '');
    
    if (!sanitized || sanitized.length < 1) {
        throw new Error('Invalid username for table name.');
    }
    
    // Ensure it doesn't start with a number (PostgreSQL requirement)
    const safeName = /^[0-9]/.test(sanitized) ? `u_${sanitized}` : sanitized;
    
    return `${safeName}_branches${lvl}`;
}

/**
 * Validate that a username is safe for table creation
 * Username must:
 * - Start with a letter
 * - Be 3-30 characters long
 * - Contain only letters, numbers, and underscores
 * @param {string} username 
 * @returns {boolean}
 */
export function isValidUsername(username) {
    if (!username || typeof username !== 'string') {
        return false;
    }
    // Only alphanumeric and underscores, 3-30 characters, must start with letter
    const regex = /^[a-zA-Z][a-zA-Z0-9_]{2,29}$/;
    return regex.test(username);
}

/**
 * Validate email format
 * @param {string} email 
 * @returns {boolean}
 */
export function isValidEmail(email) {
    if (!email || typeof email !== 'string') {
        return false;
    }
    // Basic email validation regex
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/**
 * Get all table names for a user
 * @param {string} username 
 * @returns {string[]} Array of 5 table names
 */
export function getAllUserTableNames(username) {
    const tables = [];
    for (let level = 1; level <= 5; level++) {
        tables.push(getUserTableName(username, level));
    }
    return tables;
}

