/**
 * User Model
 * Handles user operations and dynamic table creation for multi-user support
 */

import { query } from '../config/db.js';
import { getUserTableName, getAllUserTableNames } from '../utils/tableHelper.js';

/**
 * Create the 5 branch tables for a new user
 * Tables are named: {username}_branches1, {username}_branches2, etc.
 * @param {string} username - The sanitized username
 * @returns {Promise<void>}
 */
export async function createUserTables(username) {
    console.log(`📋 Creating branch tables for user: ${username}`);
    
    try {
        for (let level = 1; level <= 5; level++) {
            const tableName = getUserTableName(username, level);
            
            // Create the branch table
            await query(`
                CREATE TABLE IF NOT EXISTS ${tableName} (
                    id SERIAL PRIMARY KEY,
                    branch_id INTEGER,
                    title VARCHAR(255),
                    content TEXT,
                    isShow BOOLEAN DEFAULT false,
                    isAdd BOOLEAN DEFAULT false,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `);
            
            // Create index for branch_id lookups
            await query(`
                CREATE INDEX IF NOT EXISTS idx_${tableName}_branch_id 
                ON ${tableName}(branch_id)
            `);
            
            console.log(`   ✅ Created table: ${tableName}`);
        }
        
        console.log(`✅ All tables created for user: ${username}`);
    } catch (error) {
        console.error(`❌ Failed to create tables for user ${username}:`, error);
        throw error;
    }
}

/**
 * Check if user tables exist
 * @param {string} username 
 * @returns {Promise<boolean>}
 */
export async function userTablesExist(username) {
    try {
        const tableName = getUserTableName(username, 1);
        const result = await query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = $1
        `, [tableName]);
        
        return result.rows.length > 0;
    } catch (error) {
        console.error('Error checking user tables:', error);
        return false;
    }
}

/**
 * Delete all tables for a user (use with caution!)
 * @param {string} username 
 * @returns {Promise<void>}
 */
export async function deleteUserTables(username) {
    console.log(`🗑️ Deleting all tables for user: ${username}`);
    
    try {
        const tableNames = getAllUserTableNames(username);
        
        for (const tableName of tableNames) {
            await query(`DROP TABLE IF EXISTS ${tableName} CASCADE`);
            console.log(`   🗑️ Dropped table: ${tableName}`);
        }
        
        console.log(`✅ All tables deleted for user: ${username}`);
    } catch (error) {
        console.error(`❌ Failed to delete tables for user ${username}:`, error);
        throw error;
    }
}

/**
 * Find user by email
 * @param {string} email 
 * @returns {Promise<object|null>}
 */
export async function findUserByEmail(email) {
    const result = await query(
        'SELECT id, username, email, password_hash, created_at FROM users WHERE email = $1',
        [email]
    );
    return result.rows.length > 0 ? result.rows[0] : null;
}

/**
 * Find user by username
 * @param {string} username 
 * @returns {Promise<object|null>}
 */
export async function findUserByUsername(username) {
    const result = await query(
        'SELECT id, username, email, password_hash, created_at FROM users WHERE username = $1',
        [username]
    );
    return result.rows.length > 0 ? result.rows[0] : null;
}

/**
 * Find user by ID
 * @param {number} id 
 * @returns {Promise<object|null>}
 */
export async function findUserById(id) {
    const result = await query(
        'SELECT id, username, email, created_at FROM users WHERE id = $1',
        [id]
    );
    return result.rows.length > 0 ? result.rows[0] : null;
}

/**
 * Create a new user
 * @param {string} username 
 * @param {string} email 
 * @param {string} passwordHash - Already hashed password
 * @returns {Promise<object>} The created user
 */
export async function createUser(username, email, passwordHash) {
    const result = await query(
        'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email, created_at',
        [username, email, passwordHash]
    );
    return result.rows[0];
}

