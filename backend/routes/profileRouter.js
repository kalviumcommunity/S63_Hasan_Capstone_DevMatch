const express = require('express');
const router = express.Router();

// Mock profile data
const profiles = [
    { userId: 1, bio: 'Full Stack Developer', github: 'https://github.com/hasan', skills: ['Java', 'React'] },
    { userId: 2, bio: 'UI/UX Designer', github: 'https://github.com/rahul', skills: ['Python', 'Figma'] }
];

// GET all profiles
router.get('/', (req, res) => {
    res.status(200).json(profiles);
});

// GET profile by userId
router.get('/:userId', (req, res) => {
    const userId = parseInt(req.params.userId, 10);
    const profile = profiles.find(p => p.userId === userId);

    if (!profile) {
        return res.status(404).json({ message: 'Profile not found' });
    }

    res.status(200).json(profile);
});

module.exports = router;
