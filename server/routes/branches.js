/**
 * Unified Branch Routes
 * Handles all 5 branch levels with dynamic table names based on authenticated user
 * Route: /api/branches/:level
 */

import express from 'express';
import { query } from '../config/db.js';
import { authMiddleware } from '../middleware/auth.js';
import { getUserTableName } from '../utils/tableHelper.js';

const router = express.Router();

/**
 * Get the table name for the current user and level
 * @param {object} req - Express request with user attached
 * @param {string|number} level - Branch level (1-5)
 * @returns {string} Table name
 */
const getTableName = (req, level) => {
    return getUserTableName(req.user.username, level);
};

// All routes require authentication
router.use(authMiddleware);

/**
 * GET /api/branches/:level
 * Get all branches for a specific level
 */
router.get('/:level', async (req, res) => {
    try {
        const { level } = req.params;
        const tableName = getTableName(req, level);
        
        const result = await query(`SELECT * FROM ${tableName} ORDER BY id DESC`);
        res.json(result.rows);
    } catch (error) {
        console.error(`Error fetching branches level ${req.params.level}:`, error);
        
        if (error.message.includes('Invalid branch level')) {
            return res.status(400).json({ error: error.message });
        }
        
        res.status(500).json({ 
            error: 'Failed to fetch branches',
            message: error.message 
        });
    }
});

/**
 * GET /api/branches/:level/:id
 * Get single branch by ID
 */
router.get('/:level/:id', async (req, res) => {
    try {
        const { level, id } = req.params;
        const tableName = getTableName(req, level);
        
        const result = await query(`SELECT * FROM ${tableName} WHERE id = $1`, [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Branch not found' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error(`Error fetching branch:`, error);
        
        if (error.message.includes('Invalid branch level')) {
            return res.status(400).json({ error: error.message });
        }
        
        res.status(500).json({ 
            error: 'Failed to fetch branch',
            message: error.message 
        });
    }
});

/**
 * POST /api/branches/:level
 * Create new branch
 */
router.post('/:level', async (req, res) => {
    try {
        const { level } = req.params;
        const { branch_id, title, content, isShow, isAdd } = req.body;
        const tableName = getTableName(req, level);
        
        // Validation
        if (!title || !content) {
            return res.status(400).json({ 
                error: 'Title and content are required' 
            });
        }
        
        const result = await query(
            `INSERT INTO ${tableName} (branch_id, title, content, isShow, isAdd) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [branch_id || null, title, content, isShow || false, isAdd || false]
        );
        
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(`Error creating branch:`, error);
        
        if (error.message.includes('Invalid branch level')) {
            return res.status(400).json({ error: error.message });
        }
        
        res.status(500).json({ 
            error: 'Failed to create branch',
            message: error.message 
        });
    }
});

/**
 * PATCH /api/branches/:level/:id
 * Update branch
 */
router.patch('/:level/:id', async (req, res) => {
    try {
        const { level, id } = req.params;
        const { branch_id, title, content, isShow, isAdd } = req.body;
        const tableName = getTableName(req, level);
        
        // Check if branch exists
        const existingBranch = await query(`SELECT * FROM ${tableName} WHERE id = $1`, [id]);
        if (existingBranch.rows.length === 0) {
            return res.status(404).json({ error: 'Branch not found' });
        }
        
        // Build dynamic update query
        const updates = [];
        const values = [];
        let paramCount = 1;
        
        if (branch_id !== undefined) {
            updates.push(`branch_id = $${paramCount++}`);
            values.push(branch_id);
        }
        if (title !== undefined) {
            updates.push(`title = $${paramCount++}`);
            values.push(title);
        }
        if (content !== undefined) {
            updates.push(`content = $${paramCount++}`);
            values.push(content);
        }
        if (isShow !== undefined) {
            updates.push(`isShow = $${paramCount++}`);
            values.push(isShow);
        }
        if (isAdd !== undefined) {
            updates.push(`isAdd = $${paramCount++}`);
            values.push(isAdd);
        }
        
        if (updates.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }
        
        values.push(id);
        const updateQuery = `UPDATE ${tableName} SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`;
        
        const result = await query(updateQuery, values);
        res.json(result.rows[0]);
    } catch (error) {
        console.error(`Error updating branch:`, error);
        
        if (error.message.includes('Invalid branch level')) {
            return res.status(400).json({ error: error.message });
        }
        
        res.status(500).json({
            error: 'Failed to update branch',
            message: error.message
        });
    }
});

/**
 * DELETE /api/branches/:level/:id
 * Delete branch
 */
router.delete('/:level/:id', async (req, res) => {
    try {
        const { level, id } = req.params;
        const tableName = getTableName(req, level);

        const result = await query(`DELETE FROM ${tableName} WHERE id = $1 RETURNING *`, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Branch not found' });
        }

        res.json({
            message: 'Branch deleted successfully',
            deletedBranch: result.rows[0]
        });
    } catch (error) {
        console.error(`Error deleting branch:`, error);

        if (error.message.includes('Invalid branch level')) {
            return res.status(400).json({ error: error.message });
        }

        res.status(500).json({
            error: 'Failed to delete branch',
            message: error.message
        });
    }
});

export default router;

