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

// POST a new profile
router.post('/', (req, res) => {
    const { userId, bio, github, skills } = req.body;

    if (!userId || !bio || !github || !skills || !Array.isArray(skills)) {
        return res.status(400).json({ message: 'Invalid input. All fields are required.' });
    }

    const newProfile = {
        userId,
        bio,
        github,
        skills
    };

    profiles.push(newProfile);
    res.status(201).json(newProfile);
});

// PUT update profile by userId
router.put('/:userId', (req, res) => {
    const userId = parseInt(req.params.userId, 10);
    const { bio, github, skills } = req.body;

    const profileIndex = profiles.findIndex(p => p.userId === userId);

    if (profileIndex === -1) {
        return res.status(404).json({ message: 'Profile not found' });
    }

    if (bio) profiles[profileIndex].bio = bio;
    if (github) profiles[profileIndex].github = github;
    if (skills && Array.isArray(skills)) profiles[profileIndex].skills = skills;

    res.status(200).json(profiles[profileIndex]);
});

// DELETE profile by userId
router.delete('/:userId', (req, res) => {
    const userId = parseInt(req.params.userId, 10);
    const profileIndex = profiles.findIndex(p => p.userId === userId);

    if (profileIndex === -1) {
        return res.status(404).json({ message: 'Profile not found' });
    }

    profiles.splice(profileIndex, 1);
    res.status(200).json({ message: 'Profile deleted successfully' });
});

module.exports = router;
