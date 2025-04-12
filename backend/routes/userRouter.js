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

// POST a new user
router.post('/', (req, res) => {
    const { name, skills } = req.body;

    if (!name || !skills || !Array.isArray(skills)) {
        return res.status(400).json({ message: 'Invalid input. Name and skills are required.' });
    }

    const newUser = {
        id: users.length + 1,
        name,
        skills
    };

    users.push(newUser);
    res.status(201).json(newUser);
});

// PUT update user by ID
router.put('/:id', (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const { name, skills } = req.body;

    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found' });
    }

    if (name) users[userIndex].name = name;
    if (skills && Array.isArray(skills)) users[userIndex].skills = skills;

    res.status(200).json(users[userIndex]);
});

module.exports = router;