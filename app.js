const express = require('express');
const session = require('express-session');
const { Pool } = require('pg');
const app = express();

// Database pool configuration
const pool = new Pool({
    user: 'avnadmin',
    host: 'pg-2751700a-sir-nergy.f.aivencloud.com',
    database: 'defaultdb',
    password: 'AVNS_6wHqKt9KIjV5M7PJ02S',
    port: 20647,
    ssl: { rejectUnauthorized: false }
});
module.exports.pool = pool;

app.use(express.json());
app.use(express.static('public'));

// Session configuration
app.use(session({
    secret: 'your_secret_key', // Replace with a secure key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set `secure: true` if using HTTPS
}));

// Login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await pool.query(
            'SELECT * FROM users WHERE username = $1 AND password = $2',
            [username, password]
        );

        if (result.rows.length > 0) {
            req.session.loggedIn = true;
            res.redirect('/department.html'); // Redirect to department.html
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Middleware to protect routes
function requireLogin(req, res, next) {
    if (req.session.loggedIn) {
        next();
    } else {
        res.redirect('/index.html');
    }
}

// Protect the department page
app.get('/department.html', requireLogin, (req, res) => {
    res.sendFile(__dirname + '/public/department.html');
});

// Import and use department routes
const departmentRoutes = require('./routes/departmentRoutes');
app.use('/api/departments', departmentRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
