const express = require('express');
const router = express.Router();

// Mock request data
const requests = [
    { id: 1, fromUser: 1, toUser: 2, status: 'pending' },
    { id: 2, fromUser: 2, toUser: 1, status: 'accepted' }
];

// GET all requests
router.get('/', (req, res) => {
    res.status(200).json(requests);
});

// GET requests received by a user
router.get('/received/:userId', (req, res) => {
    const userId = parseInt(req.params.userId, 10);
    const receivedRequests = requests.filter(r => r.toUser === userId);
    res.status(200).json(receivedRequests);
});

// GET requests sent by a user
router.get('/sent/:userId', (req, res) => {
    const userId = parseInt(req.params.userId, 10);
    const sentRequests = requests.filter(r => r.fromUser === userId);
    res.status(200).json(sentRequests);
});

// POST a new request
router.post('/', (req, res) => {
    const { fromUser, toUser, status } = req.body;

    if (!fromUser || !toUser || !status) {
        return res.status(400).json({ message: 'fromUser, toUser, and status are required.' });
    }

    const newRequest = {
        id: requests.length + 1,
        fromUser,
        toUser,
        status
    };

    requests.push(newRequest);
    res.status(201).json(newRequest);
});

// PUT update request status by ID
router.put('/:id', (req, res) => {
    const requestId = parseInt(req.params.id, 10);
    const { status } = req.body;

    const requestIndex = requests.findIndex(r => r.id === requestId);

    if (requestIndex === -1) {
        return res.status(404).json({ message: 'Request not found' });
    }

    if (!status) {
        return res.status(400).json({ message: 'Status is required.' });
    }

    requests[requestIndex].status = status;

    res.status(200).json(requests[requestIndex]);
});

module.exports = router;