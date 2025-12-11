import express from 'express';
import { query } from '../config/db.js';

const router = express.Router();

// Get all branches3
router.get('/', async (req, res) => {
    try {
        const result = await query('SELECT * FROM branches3 ORDER BY id DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching branches3:', error);
        res.status(500).json({ 
            error: 'Failed to fetch branches3',
            message: error.message 
        });
    }
});

// Get single branch3 by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await query('SELECT * FROM branches3 WHERE id = $1', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Branch not found' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching branch3:', error);
        res.status(500).json({ 
            error: 'Failed to fetch branch3',
            message: error.message 
        });
    }
});

// Create new branch3
router.post('/', async (req, res) => {
    try {
        const { branch_id, title, content, isShow, isAdd } = req.body;
        
        // Validation
        if (!title || !content) {
            return res.status(400).json({ 
                error: 'Title and content are required' 
            });
        }
        
        const result = await query(
            'INSERT INTO branches3 (branch_id, title, content, isShow, isAdd) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [branch_id || null, title, content, isShow || false, isAdd || false]
        );
        
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating branch3:', error);
        res.status(500).json({ 
            error: 'Failed to create branch3',
            message: error.message 
        });
    }
});

// Update branch3
router.patch('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { branch_id, title, content, isShow, isAdd } = req.body;
        
        // Check if branch exists
        const existingBranch = await query('SELECT * FROM branches3 WHERE id = $1', [id]);
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
        const updateQuery = `UPDATE branches3 SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`;
        
        const result = await query(updateQuery, values);
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating branch3:', error);
        res.status(500).json({ 
            error: 'Failed to update branch3',
            message: error.message 
        });
    }
});

// Delete branch3
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const result = await query('DELETE FROM branches3 WHERE id = $1 RETURNING *', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Branch not found' });
        }
        
        res.json({ 
            message: 'Branch deleted successfully',
            deletedBranch: result.rows[0]
        });
    } catch (error) {
        console.error('Error deleting branch3:', error);
        res.status(500).json({ 
            error: 'Failed to delete branch3',
            message: error.message 
        });
    }
});

export default router;
