const { validationResult } = require('express-validator');
const User = require('../models/userModel');

const jwt = require('jsonwebtoken');
const { default: axios } = require('axios');
const bcrypt = require('bcryptjs');
const db = require('../db/connection');
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key'; // Replace with a secure environment variable
const executeQuery = (query, params = []) => {
    return new Promise((resolve, reject) => {
        db.query(query, params, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};
const authController = {
    signup: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        const { username, password, email } = req.body;
    
        try {
            // Check if the user already exists
            const existingUser = await User.findByEmail(email);
            if (existingUser.length > 0) {
                return res.status(400).json({ error: 'User with this email already exists' });
            }
    
            // Hash the password using bcryptjs
          
    
            // Create the user
            const result = await User.create(username, password, email);
            const newUser = await User.findById(result.insertId);
    
            if (!newUser || newUser.length === 0) {
                throw new Error('Failed to retrieve newly created user');
            }
    
            res.status(201).json({
                message: 'User registered successfully',
                user: newUser[0],
            });
        } catch (error) {
            console.error('Signup Error:', error.message);
            res.status(500).json({ error: 'User registration failed' });
        }
    },
    

    login: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        const { email, password } = req.body;
    
        try {
            const users = await User.findByEmail(email);
    
            if (users.length === 0) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }
    
            const user = users[0];
    
            // Compare passwords using bcryptjs
            const isPasswordValid = await bcrypt.compare(password, user.password);
    
            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }
    
            // Generate JWT token
            const token = jwt.sign(
                { userId: user.id, username: user.username },
                JWT_SECRET,
                { expiresIn: '1d' }
            );
    
            res.status(200).json({
                message: 'Login successful',
                token,
                user,
            });
        } catch (error) {
            console.error('Login Error:', error.message);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    
    updateUser :async (req, res) => {
        const { username, status, password, email, totalSpot } = req.body;
    
        // Log the request body for debugging
        console.log(req.body);
    
        // Validate that the email is provided
        if (!email) {
            return res.status(400).json({ error: 'Email is required to update user' });
        }
    
        try {
            // Step 1: Update the user in the database by email
            const result = await User.updateByEmail(email, { username, status, password, totalSpot });
    
            // If no rows were affected, it means the user email was not found
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'User not found' });
            }
    
            // Step 2: Handle dynamic status for user approval or rejection
            let paymentStatus = 'pending';  // Default status (for rejection)
    
            // If the user status is "approve", set the payment status to "approved"
            if (status && status.toLowerCase() === 'approve') {
                paymentStatus = 'Approve';  // Update the payment status to approved
    
                // Decrement totalSpot in the addspot table
                const updateAddSpotQuery = `
                    UPDATE addspot
                    SET totalSpot = totalSpot - ?
                    WHERE id = 1; -- Assuming only one record exists in the addspot table
                `;
                const spotUpdateResult = await executeQuery(updateAddSpotQuery, [totalSpot]);
    
                if (spotUpdateResult.affectedRows === 0) {
                    return res.status(404).json({ error: 'No addSpot record found to update' });
                }
            }
            if (status && status.toLowerCase() === 'reject') {
                paymentStatus = 'Reject';  // Update the payment status to approved
    
                // Decrement totalSpot in the addspot table
                const updateAddSpotQuery = `
                    UPDATE addspot
                    SET totalSpot = totalSpot + ?
                    WHERE id = 1; -- Assuming only one record exists in the addspot table
                `;
                const spotUpdateResult = await executeQuery(updateAddSpotQuery, [totalSpot]);
    
                if (spotUpdateResult.affectedRows === 0) {
                    return res.status(404).json({ error: 'No addSpot record found to update' });
                }
            }
            // If the status is "reject", keep the payment status as "pending"
    
            // Step 3: Dynamically update payment status in the payments table
            const updatePaymentStatusQuery = `
                UPDATE payments
                SET status = ?
                WHERE user_id = (SELECT id FROM users WHERE email = ?)
            `;
            const paymentStatusUpdateResult = await executeQuery(updatePaymentStatusQuery, [paymentStatus, email]);
    
            if (paymentStatusUpdateResult.affectedRows === 0) {
                return res.status(404).json({ error: 'No payments found for the user' });
            }
    
            // Respond with success
            res.status(200).json({
                message: 'User updated successfully',
                affectedRows: result.affectedRows, // Number of rows updated in users table
            });
        } catch (err) {
            console.error('Error updating user:', err.message);
            res.status(500).json({ error: 'Internal server error', details: err.message });
        }
    },
    
    socialLogin: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        const { username, email } = req.body;
    
        try {
            // Check if the user already exists
            let user = await User.findByEmail(email);
    
            if (user.length > 0) {
                // User exists, log them in
                user = user[0]; // Extract user object from array
            } else {
                // Create a new user
                const hashedPassword = await bcrypt.hash('@#$@#$', 10); // Secure placeholder password
                const result = await User.create(username, hashedPassword, email);
                user = await User.findById(result.insertId); // Get newly created user
                if (!user || user.length === 0) {
                    throw new Error('Failed to retrieve newly created user');
                }
                user = user[0];
            }
    
            // Generate JWT token
            const token = jwt.sign(
                { userId: user.id, username: user.username },
                JWT_SECRET,
                { expiresIn: '1d' }
            );
    
            return res.status(200).json({
                message: 'Login successful',
                token,
                user,
            });
        } catch (error) {
            console.error('Social Login Error:', error.message);
            res.status(500).json({ error: 'Social login failed' });
        }
    },
    getTopUsers : (req, res) => {
        const query = `
          SELECT * 
          FROM users 
          ORDER BY totalSpot DESC 
          LIMIT 10
        `;
      
        db.query(query, (err, results) => {
          if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({
              success: false,
              message: 'An error occurred while fetching users',
            });
          }
      
          res.status(200).json({
            success: true,
            data: results,
          });
        });
      }
      

    
};

module.exports = authController;
