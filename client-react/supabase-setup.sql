-- ============================================
-- Supabase Setup Script for KH Documentation App
-- ============================================
-- Run this script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/YOUR_PROJECT/sql
-- ============================================

-- Create branches1 table
CREATE TABLE IF NOT EXISTS branches1 (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL DEFAULT auth.uid(),
  title VARCHAR(255),
  content TEXT,
  is_show BOOLEAN DEFAULT false,
  is_add BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create branches2 table
CREATE TABLE IF NOT EXISTS branches2 (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL DEFAULT auth.uid(),
  branch_id INTEGER,
  title VARCHAR(255),
  content TEXT,
  is_show BOOLEAN DEFAULT false,
  is_add BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create branches3 table
CREATE TABLE IF NOT EXISTS branches3 (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL DEFAULT auth.uid(),
  branch_id INTEGER,
  title VARCHAR(255),
  content TEXT,
  is_show BOOLEAN DEFAULT false,
  is_add BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create branches4 table
CREATE TABLE IF NOT EXISTS branches4 (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL DEFAULT auth.uid(),
  branch_id INTEGER,
  title VARCHAR(255),
  content TEXT,
  is_show BOOLEAN DEFAULT false,
  is_add BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create branches5 table
CREATE TABLE IF NOT EXISTS branches5 (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL DEFAULT auth.uid(),
  branch_id INTEGER,
  title VARCHAR(255),
  content TEXT,
  is_show BOOLEAN DEFAULT false,
  is_add BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Enable Row Level Security (RLS)
-- ============================================

ALTER TABLE branches1 ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches2 ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches3 ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches4 ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches5 ENABLE ROW LEVEL SECURITY;

-- ============================================
-- Create RLS Policies
-- Users can only access their own data
-- ============================================

-- branches1 policies
CREATE POLICY "Users can view own branches1" ON branches1
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own branches1" ON branches1
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own branches1" ON branches1
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own branches1" ON branches1
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- branches2 policies
CREATE POLICY "Users can view own branches2" ON branches2
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own branches2" ON branches2
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own branches2" ON branches2
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own branches2" ON branches2
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- branches3 policies
CREATE POLICY "Users can view own branches3" ON branches3
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own branches3" ON branches3
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own branches3" ON branches3
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own branches3" ON branches3
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- branches4 policies
CREATE POLICY "Users can view own branches4" ON branches4
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own branches4" ON branches4
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own branches4" ON branches4
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own branches4" ON branches4
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- branches5 policies
CREATE POLICY "Users can view own branches5" ON branches5
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own branches5" ON branches5
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own branches5" ON branches5
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own branches5" ON branches5
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- ============================================
-- Create indexes for better performance
-- ============================================

CREATE INDEX IF NOT EXISTS idx_branches1_user_id ON branches1(user_id);
CREATE INDEX IF NOT EXISTS idx_branches2_user_id ON branches2(user_id);
CREATE INDEX IF NOT EXISTS idx_branches2_branch_id ON branches2(branch_id);
CREATE INDEX IF NOT EXISTS idx_branches3_user_id ON branches3(user_id);
CREATE INDEX IF NOT EXISTS idx_branches3_branch_id ON branches3(branch_id);
CREATE INDEX IF NOT EXISTS idx_branches4_user_id ON branches4(user_id);
CREATE INDEX IF NOT EXISTS idx_branches4_branch_id ON branches4(branch_id);
CREATE INDEX IF NOT EXISTS idx_branches5_user_id ON branches5(user_id);
CREATE INDEX IF NOT EXISTS idx_branches5_branch_id ON branches5(branch_id);

-- ============================================
-- Done! Your database is ready.
-- ============================================
