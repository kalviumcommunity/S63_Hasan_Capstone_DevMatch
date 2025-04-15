const express = require('express');
const router = express.Router();
const ConnectionRequest = require('../models/connectionRequest');
const User = require("../models/user")

// GET all connection requests
router.get('/', async (req, res) => {
  try {
    const requests = await ConnectionRequest.find().populate('sender receiver');
    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching requests', error: err });
  }
});

// GET requests received by a user
router.get('/received/:userId', async (req, res) => {
  try {
    const receivedRequests = await ConnectionRequest.find({ receiver: req.params.userId }).populate('sender');
    res.status(200).json(receivedRequests);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching received requests', error: err });
  }
});

// GET requests sent by a user
router.get('/sent/:userId', async (req, res) => {
  try {
    const sentRequests = await ConnectionRequest.find({ sender: req.params.userId }).populate('receiver');
    res.status(200).json(sentRequests);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching sent requests', error: err });
  }
});

// POST a new connection request
router.post('/', async (req, res) => {
  const { sender, receiver } = req.body;

  if (!sender || !receiver) {
    return res.status(400).json({ message: 'sender and receiver are required.' });
  }

  try {
    const newRequest = new ConnectionRequest({
      sender,
      receiver
    });

    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (err) {
    res.status(500).json({ message: 'Error sending request', error: err });
  }
});

// PUT update request status by ID
router.put('/:id', async (req, res) => {
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: 'Status is required.' });
  }

  try {
    const updatedRequest = await ConnectionRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.status(200).json(updatedRequest);
  } catch (err) {
    res.status(500).json({ message: 'Error updating request', error: err });
  }
});

module.exports = router;