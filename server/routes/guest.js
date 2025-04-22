import express from 'express';
import { authenticate } from '../middleware/auth.js';
import HostProfile from '../models/HostProfile.js';
import PodcastRequest from '../models/PodcastRequest.js';

const router = express.Router();

// Create a new podcast request
router.post('/requests', authenticate, async (req, res) => {
  try {
    const { topic, description, preferredTimes } = req.body;
    
    const request = new PodcastRequest({
      guestId: req.user._id,
      topic,
      description,
      preferredTimes
    });
    
    await request.save();
    
    res.status(201).json(request);
  } catch (error) {
    console.error('Error creating request:', error);
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

// Get all requests for the authenticated guest
router.get('/requests', authenticate, async (req, res) => {
  try {
    const requests = await PodcastRequest.find({ guestId: req.user._id })
      .populate('matchedHost', 'name email')
      .sort('-createdAt');
    
    res.json(requests);
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

// Get matching hosts for a guest's request
router.get('/matching-hosts/:requestId', authenticate, async (req, res) => {
  try {
    const request = await PodcastRequest.findById(req.params.requestId);
    
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }
    
    if (request.guestId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    const matchingHosts = await HostProfile.find({
      topics: request.topic
    }).populate('userId', 'name email');
    
    res.json(matchingHosts);
  } catch (error) {
    console.error('Error fetching matching hosts:', error);
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

// Update a podcast request
router.put('/requests/:id', authenticate, async (req, res) => {
  try {
    const { topic, description, preferredTimes } = req.body;
    
    const request = await PodcastRequest.findOne({
      _id: req.params.id,
      guestId: req.user._id
    });
    
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }
    
    if (request.status !== 'pending') {
      return res.status(400).json({ error: 'Cannot update non-pending request' });
    }
    
    request.topic = topic;
    request.description = description;
    request.preferredTimes = preferredTimes;
    
    await request.save();
    
    res.json(request);
  } catch (error) {
    console.error('Error updating request:', error);
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

// Cancel a podcast request
router.post('/cancel-request/:id', authenticate, async (req, res) => {
  try {
    const request = await PodcastRequest.findOne({
      _id: req.params.id,
      guestId: req.user._id
    });
    
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }
    
    if (!['pending', 'matched'].includes(request.status)) {
      return res.status(400).json({ error: 'Cannot cancel scheduled or completed request' });
    }
    
    request.status = 'cancelled';
    await request.save();
    
    res.json(request);
  } catch (error) {
    console.error('Error cancelling request:', error);
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

// Host cancels a podcast request (decline)
router.post('/host-cancel-request/:id', authenticate, async (req, res) => {
  try {
    const request = await PodcastRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }
    if (request.status !== 'pending') {
      return res.status(400).json({ error: 'Cannot decline non-pending request' });
    }
    request.status = 'declined';
    await request.save();
    res.json(request);
  } catch (error) {
    console.error('Error declining request:', error);
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

export default router;