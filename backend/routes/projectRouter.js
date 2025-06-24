const express = require('express');
const router = express.Router();
const Project = require('../models/project');
const Application = require('../models/application');

// Get project matches
router.get('/matches', async (req, res) => {
  try {
    const { techStack, type, experienceLevel } = req.query;
    const userSkills = techStack ? techStack.split(',') : [];  // Use selected tech stacks as user skills
    
    // Build filter query
    const query = { status: 'Open' };
    if (type && type !== 'all') {
      query.type = type;
    }
    if (experienceLevel && experienceLevel !== 'all') {
      query.experienceLevel = experienceLevel;
    }

    // Get projects matching the filters
    const projects = await Project.find(query)
      .populate('createdBy', 'name company')
      .sort({ createdAt: -1 });

    // Calculate match percentage for each project based on filters
    const projectsWithMatch = projects.map(project => {
      const doc = project.toObject();
      
      // Calculate tech stack match (case-insensitive)
      const matchingSkills = project.techStack.filter(tech => 
        userSkills.some(skill => skill.toLowerCase() === tech.toLowerCase())
      );

      // Calculate match percentage based on matching skills
      const techStackMatchPercentage = userSkills.length > 0 
        ? Math.round((matchingSkills.length / project.techStack.length) * 100)
        : 0;

      // Add experience level match bonus (10%)
      let totalMatchPercentage = techStackMatchPercentage;
      if (experienceLevel && experienceLevel !== 'all' && project.experienceLevel === experienceLevel) {
        totalMatchPercentage = Math.min(100, totalMatchPercentage + 10);
      }

      doc.matchPercentage = totalMatchPercentage;
      doc.timeLeft = project.timeLeft;
      return doc;
    });

    // Sort by match percentage (highest first)
    projectsWithMatch.sort((a, b) => b.matchPercentage - a.matchPercentage);

    res.json(projectsWithMatch);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching project matches', error: err.message });
  }
});

// Get all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find()
      .populate('createdBy', 'name company')
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching projects', error: err.message });
  }
});

// Get a single project
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('createdBy', 'name company')
      .populate('savedBy', 'name');
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching project', error: err.message });
  }
});

// Create a new project
router.post('/', async (req, res) => {
  try {
    const project = new Project({
      ...req.body
    });
    
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ message: 'Error creating project', error: err.message });
  }
});

// Update a project
router.put('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    Object.assign(project, req.body);
    await project.save();
    
    res.json(project);
  } catch (err) {
    res.status(400).json({ message: 'Error updating project', error: err.message });
  }
});

// Delete a project
router.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    await project.remove();
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting project', error: err.message });
  }
});

// Save/unsave a project
router.post('/:id/save', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    const userId = req.body.userId; // Get userId from request body since no auth
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const savedIndex = project.savedBy.indexOf(userId);
    if (savedIndex === -1) {
      project.savedBy.push(userId);
    } else {
      project.savedBy.splice(savedIndex, 1);
    }
    
    await project.save();
    res.json({ saved: savedIndex === -1 });
  } catch (err) {
    res.status(500).json({ message: 'Error saving project', error: err.message });
  }
});

// Get projects by user ID
router.get('/user/:userId', async (req, res) => {
  try {
    const projects = await Project.find({ createdBy: req.params.userId })
      .populate('createdBy', 'name company')
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user projects', error: err.message });
  }
});

// Get projects that a user has joined (applied and accepted)
router.get('/joined/:userId', async (req, res) => {
  try {
    // Find all accepted applications for this user
    const applications = await Application.find({
      user: req.params.userId,
      status: 'accepted'
    }).populate({
      path: 'project',
      populate: {
        path: 'createdBy',
        select: 'name company'
      }
    });

    // Extract and format the projects
    const projects = applications
      .map(app => app.project)
      .filter(project => project !== null) // Remove any null projects
      .map(project => ({
        ...project.toObject(),
        applicationStatus: 'accepted'
      }));

    res.json(projects);
  } catch (err) {
    res.status(500).json({ 
      message: 'Error fetching joined projects', 
      error: err.message 
    });
  }
});

module.exports = router;