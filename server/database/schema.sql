-- Kh-doc PostgreSQL Database Schema
-- Run this script to create the database structure

-- Create database (run this separately as postgres superuser)
-- CREATE DATABASE kh_doc;

-- Connect to kh_doc database and run the following:

-- Create branches1 table
CREATE TABLE IF NOT EXISTS branches1 (
    id SERIAL PRIMARY KEY,
    branch_id INTEGER,
    title VARCHAR(255),
    content TEXT,
    isShow BOOLEAN DEFAULT false,
    isAdd BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create branches2 table
CREATE TABLE IF NOT EXISTS branches2 (
    id SERIAL PRIMARY KEY,
    branch_id INTEGER,
    title VARCHAR(255),
    content TEXT,
    isShow BOOLEAN DEFAULT false,
    isAdd BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create branches3 table
CREATE TABLE IF NOT EXISTS branches3 (
    id SERIAL PRIMARY KEY,
    branch_id INTEGER,
    title VARCHAR(255),
    content TEXT,
    isShow BOOLEAN DEFAULT false,
    isAdd BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create branches4 table
CREATE TABLE IF NOT EXISTS branches4 (
    id SERIAL PRIMARY KEY,
    branch_id INTEGER,
    title VARCHAR(255),
    content TEXT,
    isShow BOOLEAN DEFAULT false,
    isAdd BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create branches5 table
CREATE TABLE IF NOT EXISTS branches5 (
    id SERIAL PRIMARY KEY,
    branch_id INTEGER,
    title VARCHAR(255),
    content TEXT,
    isShow BOOLEAN DEFAULT false,
    isAdd BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_branches1_branch_id ON branches1(branch_id);
CREATE INDEX IF NOT EXISTS idx_branches1_isshow ON branches1(isShow);
CREATE INDEX IF NOT EXISTS idx_branches2_branch_id ON branches2(branch_id);
CREATE INDEX IF NOT EXISTS idx_branches2_isshow ON branches2(isShow);
CREATE INDEX IF NOT EXISTS idx_branches3_branch_id ON branches3(branch_id);
CREATE INDEX IF NOT EXISTS idx_branches3_isshow ON branches3(isShow);
CREATE INDEX IF NOT EXISTS idx_branches4_branch_id ON branches4(branch_id);
CREATE INDEX IF NOT EXISTS idx_branches4_isshow ON branches4(isShow);
CREATE INDEX IF NOT EXISTS idx_branches5_branch_id ON branches5(branch_id);
CREATE INDEX IF NOT EXISTS idx_branches5_isshow ON branches5(isShow);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_branches1_updated_at BEFORE UPDATE ON branches1 FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_branches2_updated_at BEFORE UPDATE ON branches2 FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_branches3_updated_at BEFORE UPDATE ON branches3 FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_branches4_updated_at BEFORE UPDATE ON branches4 FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_branches5_updated_at BEFORE UPDATE ON branches5 FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing
INSERT INTO branches1 (branch_id, title, content, isShow, isAdd) VALUES 
(1, 'Getting Started', '<h1>Welcome to Kh-doc</h1><p>This is your first branch.</p>', true, false),
(1, 'Installation', '<h1>Installation Guide</h1><p>Follow these steps to install...</p>', true, false);

INSERT INTO branches2 (branch_id, title, content, isShow, isAdd) VALUES 
(1, 'Configuration', '<h1>Configuration</h1><p>Configure your application...</p>', true, false);

-- Display table information
SELECT 'branches1' as table_name, COUNT(*) as row_count FROM branches1
UNION ALL
SELECT 'branches2' as table_name, COUNT(*) as row_count FROM branches2
UNION ALL
SELECT 'branches3' as table_name, COUNT(*) as row_count FROM branches3
UNION ALL
SELECT 'branches4' as table_name, COUNT(*) as row_count FROM branches4
UNION ALL
SELECT 'branches5' as table_name, COUNT(*) as row_count FROM branches5;