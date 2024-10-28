const express = require('express');
const router = express.Router();
const { getDepartments, addDepartment, updateDepartment, deleteDepartment } = require('../models/departmentModel');

// GET /api/departments - Retrieve all departments
router.get('/', async (req, res) => {
    try {
        const departments = await getDepartments();
        res.json(departments);
    } catch (error) {
        console.error('Error retrieving departments:', error);
        res.status(500).send('Error retrieving departments');
    }
});

// POST /api/departments - Add a new department
router.post('/', async (req, res) => {
    const { department_number, department_name } = req.body;

    if (!department_number || !department_name) {
        return res.status(400).json({ error: 'Department number and name are required' });
    }

    try {
        const newDepartment = await addDepartment(department_number, department_name);
        res.status(201).json(newDepartment);
    } catch (error) {
        console.error('Error adding department:', error);
        res.status(500).json({ error: 'Error adding department' });
    }
});

// PUT /api/departments/:id - Update an existing department
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { department_name } = req.body;
    try {
        const updatedDepartment = await updateDepartment(id, department_name);
        res.json(updatedDepartment);
    } catch (error) {
        console.error('Error updating department:', error);
        res.status(500).send('Error updating department');
    }
});

// DELETE /api/departments/:id - Delete a department
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await deleteDepartment(id);
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting department:', error);
        res.status(500).send('Error deleting department');
    }
});

module.exports = router;
