import pool, { query } from '../config/db.js';

/**
 * Initialize database with users table
 * User-specific branch tables are created during registration
 */
const initializeDatabase = async () => {
    console.log('🚀 Initializing PostgreSQL database...');

    try {
        // Test connection
        await query('SELECT NOW()');
        console.log('✅ Database connection successful');

        // Create users table if it doesn't exist
        await createUsersTable();

        // Verify users table
        const userCount = await query('SELECT COUNT(*) as count FROM users');
        console.log(`📊 Database status: ${userCount.rows[0].count} registered users`);

        // List existing user tables
        const userTables = await query(`
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public'
            AND table_name LIKE '%_branches%'
            ORDER BY table_name
        `);

        if (userTables.rows.length > 0) {
            console.log(`📋 Found ${userTables.rows.length} user branch tables`);
        }

    } catch (error) {
        console.error('❌ Database initialization failed:', error);
        throw error;
    }
};

/**
 * Create the users table for authentication
 */
const createUsersTable = async () => {
    const tableExists = await query(`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'users'
    `);

    if (tableExists.rows.length === 0) {
        console.log('📋 Creating users table...');

        await query(`
            CREATE TABLE users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create indexes for faster lookups
        await query('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
        await query('CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)');

        // Create trigger for updated_at
        await query(`
            CREATE OR REPLACE FUNCTION update_updated_at_column()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.updated_at = CURRENT_TIMESTAMP;
                RETURN NEW;
            END;
            $$ language 'plpgsql'
        `);

        await query(`
            DROP TRIGGER IF EXISTS update_users_updated_at ON users;
            CREATE TRIGGER update_users_updated_at
            BEFORE UPDATE ON users
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
        `);

        console.log('✅ Users table created successfully');
    } else {
        console.log('✅ Users table already exists');
    }
};

export default initializeDatabase;
