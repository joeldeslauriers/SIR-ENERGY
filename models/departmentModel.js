const pool = require('../app').pool; // Import the pool from app.js

// Retrieve all departments
async function getDepartments() {
    const res = await pool.query('SELECT id, department_number, department_name AS name FROM departments');
    return res.rows;
  }
  
// Add department function
const addDepartment = async (department_number, department_name) => {
    try {
      const query = `
        INSERT INTO departments (department_number, department_name)
        VALUES ($1, $2)
        RETURNING *;
      `;
      const values = [department_number, department_name];
  
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error adding department:', error);
      throw error;
    }
  };
  
  // Update a department
  async function updateDepartment(id, name) {
    const res = await pool.query(
      'UPDATE departments SET department_name = $1 WHERE id = $2 RETURNING *',
      [name, id]
    );
    return res.rows[0];
  }
  
  // Delete a department
  async function deleteDepartment(id) {
    const res = await pool.query('DELETE FROM departments WHERE id = $1 RETURNING *', [id]);
    return res.rows[0];
  }
  
  module.exports = {
    getDepartments,
    addDepartment,
    updateDepartment,
    deleteDepartment,
  };