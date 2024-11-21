const User = require('../controllers/authController');
const { validationResult } = require('express-validator');

const authController = {
    signup: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, password } = req.body;

        try {
            await User.create(username, password);
            res.status(201).json({ message: 'User  registered successfully' });
        } catch (error) {
            res.status(500).json({ error: 'User  registration failed' });
        }
    },

    login: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, password } = req.body;

        try {
            const results = await User.findByUsername(username);
            if (results.length === 0) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const user = results[0];
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            res.status(200).json({ message: 'Login successful', userId: user.id });
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

module.exports = authController;