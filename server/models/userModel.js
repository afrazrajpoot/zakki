const db = require('../db/connection');
const bcrypt = require('bcryptjs');

const User = {
    // Function to create the table if it doesn't exist
    createTable: () => {
        const createTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            status VARCHAR(50) DEFAULT 'pending',  -- Added the 'status' column with default value 'pending'
            email VARCHAR(255) NOT NULL UNIQUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
    
        return new Promise((resolve, reject) => {
            db.query(createTableQuery, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },

    // Register function
    create: (username, password, email) => {
        return new Promise(async (resolve, reject) => {
            try {
                // Hash the password
                const hashedPassword = await bcrypt.hash(password, 10);

                // Insert the user into the database
                db.query(
                    'INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
                    [username, hashedPassword, email],
                    (err, results) => {
                        if (err) return reject(err);
                        resolve(results);
                    }
                );
            } catch (err) {
                reject(err);
            }
        });
    },

    // Find user by email
    findByEmail: (email) => {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },

    // Find user by ID
    findById: (id) => {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },

    // Update user information by email
    updateByEmail: (email, { username, status, password }) => {
        return new Promise(async (resolve, reject) => {
            try {
                // If a new password is provided, hash it
                let updateQuery = 'UPDATE users SET ';
                let params = [];

                if (username) {
                    updateQuery += 'username = ?, ';
                    params.push(username);
                }

                if (status) {
                    updateQuery += 'status = ?, ';
                    params.push(status);
                }

                if (password) {
                    // Hash the new password
                    const hashedPassword = await bcrypt.hash(password, 10);
                    updateQuery += 'password = ?, ';
                    params.push(hashedPassword);
                }

                // Remove trailing comma and space
                updateQuery = updateQuery.slice(0, -2); // To remove the last comma and space
                updateQuery += ' WHERE email = ?';
                params.push(email); // Add the email to the parameters

                // Execute the query
                db.query(updateQuery, params, (err, results) => {
                    if (err) return reject(err);
                    resolve(results);
                });
            } catch (err) {
                reject(err);
            }
        });
    },
};

module.exports = User;
