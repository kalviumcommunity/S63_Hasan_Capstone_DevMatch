const express = require('express');
const router = express.Router();

// Mock user data (shared across routes)
const users = [
    { id: 1, name: 'Hasan', skills: ['Java', 'React'] },
    { id: 2, name: 'Rahul', skills: ['Python', 'UI/UX'] }
];

// GET all users
router.get('/', (req, res) => {
    res.status(200).json(users);
});

// GET user by ID
router.get('/:id', (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const user = users.find(u => u.id === userId);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
});

module.exports = router;