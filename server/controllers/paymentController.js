const db = require('../db/connection'); // Ensure you have a MySQL connection setup

// Helper function to execute queries
const executeQuery = (query, params = []) => {
    return new Promise((resolve, reject) => {
        db.query(query, params, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

exports.addPayment = async (req, res) => {
    const { email, wallet_address, currency, amount = 0, grid = 0 } = req.body;
    const user_id = req.user?.userId;

    // Validate required fields
    if (!email || !wallet_address || !currency) {
        return res.status(400).json({ error: 'Missing required fields: email, wallet_address, currency' });
    }

    if (!user_id) {
        return res.status(401).json({ error: 'User ID is missing or user is not authenticated' });
    }

    try {
        // Step 1: Create the `payments` table if it doesn't exist
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS payments (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) NOT NULL,
                wallet_address VARCHAR(255) NOT NULL,
                currency VARCHAR(255) NOT NULL,
                user_id INT NOT NULL,
                amount INT NOT NULL DEFAULT 0,
                grid INT NOT NULL DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
            );
        `;
        await executeQuery(createTableQuery);

        // Step 2: Insert data into the `payments` table
        const insertPaymentQuery = `
            INSERT INTO payments (email, wallet_address, currency, user_id, amount, grid)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const result = await executeQuery(insertPaymentQuery, [email, wallet_address, currency, user_id, amount, grid]);

        // Step 3: Respond with success
        res.status(201).json({
            message: 'Payment added successfully',
            paymentId: result.insertId,
        });
    } catch (err) {
        console.error('Error adding payment:', err.message);
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
};

exports.getPaymentData = async (req, res) => {
    try {
        const getAllPaymentsQuery = `
            SELECT p.id, p.email, p.wallet_address, p.currency, p.grid, p.amount, p.created_at, 
                   u.username, u.status, u.email AS user_email
            FROM payments p
            JOIN users u ON p.user_id = u.id
        `;
        const result = await executeQuery(getAllPaymentsQuery);

        if (result.length === 0) {
            return res.status(404).json({ message: 'No payment data found' });
        }

        res.status(200).json({
            message: 'All payment data retrieved successfully',
            payments: result,
        });
    } catch (err) {
        console.error('Error fetching payment data:', err.message);
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
};

exports.searchData = async (req, res) => {
    const { search } = req.query;

    try {
        // Base SQL query
        let sql = `
            SELECT p.id, p.email, p.wallet_address, p.currency, p.grid, p.amount, p.created_at, 
                   u.username, u.status, u.email AS user_email
            FROM payments p
            JOIN users u ON p.user_id = u.id
        `;

        const params = [];
        if (search) {
            // Use parameters to prevent SQL injection
            sql += `
                WHERE p.wallet_address LIKE ? OR u.username LIKE ?
            `;
            // Ensure the parameter value is correctly formatted for LIKE searches
            params.push(`%${search}%`, `%${search}%`);
        }

        console.log('SQL:', sql); // Debugging line to check the final query
        console.log('Params:', params); // Debugging line to check parameters

        // Execute the query
        const result = await executeQuery(sql, params);

        if (result.length === 0) {
            return res.status(404).json({ message: 'No matching payment data found' });
        }

        res.status(200).json({
            message: 'Search results retrieved successfully',
            payments: result,
        });
    } catch (err) {
        console.error('Error searching payment data:', err.message);
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
};


