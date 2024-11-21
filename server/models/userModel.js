const db = require('../db/connection');
const bcrypt = require('bcrypt');

const User = {
    create: async (username, password) => {
        const hashedPassword = await bcrypt.hash(password, 10);
        return new Promise((resolve, reject) => {
            db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },

    findByUsername: (username) => {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }
};

module.exports = User;