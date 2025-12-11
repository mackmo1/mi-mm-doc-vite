import pool, { query } from '../config/db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const initializeDatabase = async () => {
    console.log('🚀 Initializing PostgreSQL database...');
    
    try {
        // Test connection
        await query('SELECT NOW()');
        console.log('✅ Database connection successful');
        
        // Check if tables exist
        const tablesExist = await query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name LIKE 'branches%'
        `);
        
        if (tablesExist.rows.length === 0) {
            console.log('📋 Creating database tables...');
            
            // Read and execute schema file
            const schemaPath = path.join(__dirname, 'schema.sql');
            if (fs.existsSync(schemaPath)) {
                const schema = fs.readFileSync(schemaPath, 'utf8');
                await query(schema);
                console.log('✅ Database schema created successfully');
            } else {
                console.log('⚠️  Schema file not found, creating basic tables...');
                await createBasicTables();
            }
        } else {
            console.log('✅ Database tables already exist');
        }
        
        // Verify tables
        const verification = await query(`
            SELECT 'branches1' as table_name, COUNT(*) as row_count FROM branches1
            UNION ALL
            SELECT 'branches2' as table_name, COUNT(*) as row_count FROM branches2
            UNION ALL
            SELECT 'branches3' as table_name, COUNT(*) as row_count FROM branches3
            UNION ALL
            SELECT 'branches4' as table_name, COUNT(*) as row_count FROM branches4
            UNION ALL
            SELECT 'branches5' as table_name, COUNT(*) as row_count FROM branches5
        `);
        
        console.log('📊 Database status:');
        verification.rows.forEach(row => {
            console.log(`   ${row.table_name}: ${row.row_count} records`);
        });
        
    } catch (error) {
        console.error('❌ Database initialization failed:', error);
        throw error;
    }
};

const createBasicTables = async () => {
    const tables = ['branches1', 'branches2', 'branches3', 'branches4', 'branches5'];
    
    for (const tableName of tables) {
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
        
        await query(`
            CREATE INDEX IF NOT EXISTS idx_${tableName}_branch_id ON ${tableName}(branch_id)
        `);
    }
};

export default initializeDatabase;
