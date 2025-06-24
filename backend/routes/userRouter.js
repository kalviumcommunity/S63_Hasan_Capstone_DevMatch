const express = require('express');
const ConnectionRequest = require('../models/connectionRequest')
const User = require('../models/user');
const Project = require('../models/project');
const auth = require('../middleware/auth');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcryptjs');

// Configure multer for profile picture uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/profiles/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Not an image! Please upload an image.'), false);
        }
    }
});

// GET all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching users', error: err });
    }
});

// GET current user profile
router.get('/profile', auth, async (req, res) => {
    try {
        // The user is already attached to the request by the auth middleware
        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching user profile', error: err });
    }
});

// UPDATE current user profile
router.put('/profile', auth, upload.single('profilePic'), async (req, res) => {
    try {
        const { name, email, title, bio, skills, profilePicUrl } = req.body;
        
        // Parse skills if it's a string
        const parsedSkills = typeof skills === 'string' ? JSON.parse(skills) : skills;
        
        // Prepare update object
        const updateData = {
            ...(name && { name }),
            ...(email && { email }),
            ...(title && { title }),
            ...(bio && { bio }),
            ...(parsedSkills && { skills: parsedSkills })
        };

        // Handle profile picture - either from file upload or URL
        if (req.file) {
            updateData.profilePic = `/uploads/profiles/${req.file.filename}`;
        } else if (profilePicUrl) {
            // Validate URL
            try {
                new URL(profilePicUrl);
                updateData.profilePic = profilePicUrl;
            } catch (e) {
                return res.status(400).json({ message: 'Invalid profile picture URL' });
            }
        }
        
        // Find the user and update
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');
        
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.status(200).json(updatedUser);
    } catch (err) {
        console.error('Profile update error:', err);
        res.status(500).json({ message: 'Error updating user profile', error: err.message });
    }
});

// GET user's projects
router.get('/projects', auth, async (req, res) => {
    try {
        const projects = await Project.find({ createdBy: req.user._id });
        res.status(200).json(projects);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching user projects', error: err });
    }
});

// Find users with matching skills
router.get('/matches', auth, async (req, res) => {
  try {
    const { techStack } = req.query;
    const techStackArray = techStack ? techStack.split(',') : [];

    // Get all users except the current user
    const users = await User.find({
      _id: { $ne: req.user._id } // Exclude current user
    }).select('-password'); // Exclude password field

    // Calculate match percentage for each user
    const usersWithMatches = users.map(user => {
      const userSkills = user.skills || [];
      
      // Calculate matching skills
      const matchingSkills = userSkills.filter(skill => 
        techStackArray.some(tech => 
          tech.toLowerCase() === skill.toLowerCase()
        )
      );

      // Calculate match percentage based on shared skills
      const matchPercentage = techStackArray.length > 0
        ? Math.round((matchingSkills.length / Math.max(techStackArray.length, userSkills.length)) * 100)
        : 0;

      return {
        ...user.toObject(),
        matchPercentage,
        matchingSkills: matchingSkills // Include the matching skills in response
      };
    });

    // Sort by match percentage (highest first)
    usersWithMatches.sort((a, b) => b.matchPercentage - a.matchPercentage);

    res.json(usersWithMatches);
  } catch (err) {
    res.status(500).json({ 
      message: 'Error finding matching users', 
      error: err.message 
    });
  }
});

// Change password route
router.put('/change-password', auth, async (req, res) => {
    try {
        const { password, newPassword } = req.body;
        
        // Get user from database
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify current password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        // Update password
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Password changed successfully' });
    } catch (err) {
        console.error('Password change error:', err);
        res.status(500).json({ message: 'Error changing password', error: err.message });
    }
});

// Delete current user's account
router.delete('/delete', auth, async (req, res) => {
    try {
        // Get user from database
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Delete user's projects
        await Project.deleteMany({ createdBy: req.user._id });

        // Delete user's connection requests
        await ConnectionRequest.deleteMany({
            $or: [
                { sender: req.user._id },
                { receiver: req.user._id }
            ]
        });

        // Delete the user
        await User.findByIdAndDelete(req.user._id);

        res.status(200).json({ message: 'Account deleted successfully' });
    } catch (err) {
        console.error('Account deletion error:', err);
        res.status(500).json({ message: 'Error deleting account', error: err.message });
    }
});

// IMPORTANT: Define static routes before dynamic ones to avoid route conflicts
router.get('/friends', auth, async (req, res) => {
  try {
    // First, verify the user exists
    const userExists = await User.exists({ _id: req.user._id });
    if (!userExists) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    // Then get the user with populated friends
    const user = await User.findById(req.user._id)
      .populate({
        path: 'friends',
        select: 'name email profilePic title skills'
      });

    // Return empty array if no friends
    const friends = user.friends || [];
    return res.status(200).json(friends);
  } catch (err) {
    console.error('Error fetching friends list:', err);
    return res.status(500).json({ 
      success: false,
      message: 'Error fetching friends list',
      error: err.message
    });
  }
});

// Get friend requests
router.get('/friend-requests', auth, async (req, res) => {
  try {
    // First, verify the user exists
    const userExists = await User.exists({ _id: req.user._id });
    if (!userExists) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    // Then get the user with populated friend requests
    const user = await User.findById(req.user._id)
      .populate({
        path: 'friendRequests.user',
        select: 'name email profilePic title'
      });

    // Filter pending requests
    const pendingRequests = user.friendRequests.filter(
      request => request.status === 'pending'
    );

    return res.status(200).json(pendingRequests);
  } catch (err) {
    return res.status(500).json({ 
      success: false,
      message: 'Error fetching friend requests'
    });
  }
});

// Send friend request
router.post('/friend-request/:userId', auth, async (req, res) => {
  try {
    const receiverId = req.params.userId;
    const senderId = req.user._id;

    // Check if users exist
    const [sender, receiver] = await Promise.all([
      User.findById(senderId),
      User.findById(receiverId)
    ]);

    if (!sender || !receiver) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if friend request already exists
    const existingRequest = receiver.friendRequests.find(
      request => request.user.toString() === senderId.toString()
    );

    if (existingRequest) {
      return res.status(400).json({ message: 'Friend request already sent' });
    }

    // Check if already friends
    if (receiver.friends.includes(senderId)) {
      return res.status(400).json({ message: 'Already friends' });
    }

    // Add friend request
    receiver.friendRequests.push({
      user: senderId,
      status: 'pending'
    });

    await receiver.save();

    res.status(200).json({ message: 'Friend request sent successfully' });
  } catch (err) {
    console.error('Error sending friend request:', err);
    res.status(500).json({ message: 'Error sending friend request', error: err.message });
  }
});

// Accept friend request
router.post('/friend-request/:userId/accept', auth, async (req, res) => {
  try {
    const senderId = req.params.userId;
    const receiverId = req.user._id;

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find and update the friend request
    const requestIndex = receiver.friendRequests.findIndex(
      request => request.user.toString() === senderId.toString() && request.status === 'pending'
    );

    if (requestIndex === -1) {
      return res.status(404).json({ message: 'Friend request not found' });
    }

    // Update request status
    receiver.friendRequests[requestIndex].status = 'accepted';

    // Add to friends list for both users
    receiver.friends.push(senderId);
    await receiver.save();

    const sender = await User.findById(senderId);
    if (sender) {
      sender.friends.push(receiverId);
      await sender.save();
    }

    res.status(200).json({ message: 'Friend request accepted' });
  } catch (err) {
    console.error('Error accepting friend request:', err);
    res.status(500).json({ message: 'Error accepting friend request', error: err.message });
  }
});

// Reject friend request
router.post('/friend-request/:userId/reject', auth, async (req, res) => {
  try {
    const senderId = req.params.userId;
    const receiverId = req.user._id;

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find and update the friend request
    const requestIndex = receiver.friendRequests.findIndex(
      request => request.user.toString() === senderId.toString() && request.status === 'pending'
    );

    if (requestIndex === -1) {
      return res.status(404).json({ message: 'Friend request not found' });
    }

    // Update request status
    receiver.friendRequests[requestIndex].status = 'rejected';
    await receiver.save();

    res.status(200).json({ message: 'Friend request rejected' });
  } catch (err) {
    console.error('Error rejecting friend request:', err);
    res.status(500).json({ message: 'Error rejecting friend request', error: err.message });
  }
});

// Remove friend
router.delete('/friends/:userId', auth, async (req, res) => {
  try {
    const friendId = req.params.userId;
    const userId = req.user._id;

    // Remove from both users' friend lists
    await Promise.all([
      User.findByIdAndUpdate(userId, { $pull: { friends: friendId } }),
      User.findByIdAndUpdate(friendId, { $pull: { friends: userId } })
    ]);

    res.status(200).json({ message: 'Friend removed successfully' });
  } catch (err) {
    console.error('Error removing friend:', err);
    res.status(500).json({ message: 'Error removing friend', error: err.message });
  }
});

// GET user by ID (after specific routes to prevent conflicts)
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching user', error: err });
    }
});

// POST a new user
router.post('/', async (req, res) => {
    const { name, email, password, bio, profilePic, connections } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email and password are required.' });
    }
    try {
        const newUser = new User({
            name,
            email,
            password,
            bio,
            profilePic,
            connections
        });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).json({ message: 'Error creating user', error: err });
    }
});

// PUT update user by ID
router.put('/:id', async (req, res) => {
    const { name, email, password, bio, profilePic, connections } = req.body;
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { name, email, password, bio, profilePic, connections },
            { new: true }
        );
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json({ message: 'Error updating user', error: err });
    }
});

// DELETE user by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting user', error: err });
    }
});

module.exports = router;