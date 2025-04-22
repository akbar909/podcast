import express from 'express';
import { authenticate } from '../middleware/auth.js';
import HostProfile from '../models/HostProfile.js';
import PodcastRequest from '../models/PodcastRequest.js';
// import AvailabilitySlot from '../models/AvailabilitySlot.js';  // Assuming you have a model for Availability Slots
// import Topic from '../models/Topic.js';  // Assuming you have a model for Topics

const router = express.Router();

// Create or update host profile
router.post('/profile', authenticate, async (req, res) => {
  try {
    const { podcastName, description, topics, availability, social } = req.body;
    
    let hostProfile = await HostProfile.findOne({ userId: req.user._id });
    
    if (hostProfile) {
      hostProfile = await HostProfile.findOneAndUpdate(
        { userId: req.user._id },
        { podcastName, description, topics, availability, social },
        { new: true }
      );
    } else {
      hostProfile = new HostProfile({
        userId: req.user._id,
        podcastName,
        description,
        topics,
        availability,
        social
      });
      await hostProfile.save();
    }
    
    res.json(hostProfile);
  } catch (error) {
    console.error('Error updating host profile:', error);
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

// Get host profile
router.get('/profile', authenticate, async (req, res) => {
  try {
    const hostProfile = await HostProfile.findOne({ userId: req.user._id });
    
    if (!hostProfile) {
      return res.status(404).json({ error: 'Host profile not found' });
    }
    
    res.json(hostProfile);
  } catch (error) {
    console.error('Error fetching host profile:', error);
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

// Get pending podcast requests that match host's topics
router.get('/matching-requests', authenticate, async (req, res) => {
  try {
    const hostProfile = await HostProfile.findOne({ userId: req.user._id });
    
    if (!hostProfile) {
      return res.status(404).json({ error: 'Host profile not found' });
    }
    
    const matchingRequests = await PodcastRequest.find({
      status: 'pending',
      topic: { $in: hostProfile.topics }
    }).populate('guestId', 'name email');
    
    res.json(matchingRequests);
  } catch (error) {
    console.error('Error fetching matching requests:', error);
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

// Accept a podcast request
router.post('/accept-request/:requestId', authenticate, async (req, res) => {
  try {
    const request = await PodcastRequest.findById(req.params.requestId);
    
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }
    
    if (request.status !== 'pending') {
      return res.status(400).json({ error: 'Request is no longer pending' });
    }
    
    request.status = 'matched';
    request.matchedHost = req.user._id;
    await request.save();
    
    res.json(request);
  } catch (error) {
    console.error('Error accepting request:', error);
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

// Schedule a matched podcast
router.post('/schedule-podcast/:requestId', authenticate, async (req, res) => {
  try {
    const { date, timeSlot } = req.body;
    
    const request = await PodcastRequest.findById(req.params.requestId);
    
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }
    
    if (request.status !== 'matched') {
      return res.status(400).json({ error: 'Request must be matched first' });
    }
    
    if (request.matchedHost.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    request.status = 'scheduled';
    request.scheduledTime = { date, timeSlot };
    await request.save();
    
    res.json(request);
  } catch (error) {
    console.error('Error scheduling podcast:', error);
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

// Get all availability slots for the logged-in user
router.get('/availability', authenticate, async (req, res) => {
  try {
    const availabilitySlots = await HostProfile.find({ userId: req.user._id });
    
    if (!availabilitySlots) {
      return res.status(404).json({ error: 'No availability slots found' });
    }
    
    res.json(availabilitySlots);
  } catch (error) {
    console.error('Error fetching availability slots:', error);
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

// Create a new availability slot
router.post('/availability', authenticate, async (req, res) => {
  try {
    const { day, startTime, endTime } = req.body;
    // Find the host profile for the current user
    const hostProfile = await HostProfile.findOne({ userId: req.user._id });
    if (!hostProfile) {
      return res.status(404).json({ error: 'Host profile not found' });
    }
    // Add the new slot to the availability array
    hostProfile.availability = hostProfile.availability || [];
    hostProfile.availability.push({ day, startTime, endTime });
    await hostProfile.save();
    res.json(hostProfile.availability);
  } catch (error) {
    console.error('Error adding availability slot:', error);
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

// Delete a specific availability slot
router.delete('/availability/:id', authenticate, async (req, res) => {
  try {
    const slot = await HostProfile.findByIdAndDelete(req.params.id);
    
    if (!slot) {
      return res.status(404).json({ error: 'Availability slot not found' });
    }
    
    res.json({ message: 'Availability slot deleted successfully' });
  } catch (error) {
    console.error('Error deleting availability slot:', error);
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

// Get all topics
router.get('/topics', authenticate, async (req, res) => {
  try {
    const topics = await HostProfile.find();
    
    if (!topics) {
      return res.status(404).json({ error: 'No topics found' });
    }
    
    res.json(topics);
  } catch (error) {
    console.error('Error fetching topics:', error);
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

// Create a new topic
router.post('/topics', authenticate, async (req, res) => {
  try {
    const { name } = req.body;
    const newTopic = new HostProfile({
      name,
    });
    await newTopic.save();
    
    res.json(newTopic);
  } catch (error) {
    console.error('Error adding topic:', error);
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

// Delete a specific topic
router.delete('/topics/:id', authenticate, async (req, res) => {
  try {
    const topic = await HostProfile.findByIdAndDelete(req.params.id);
    
    if (!topic) {
      return res.status(404).json({ error: 'Topic not found' });
    }
    
    res.json({ message: 'Topic deleted successfully' });
  } catch (error) {
    console.error('Error deleting topic:', error);
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

// Get all podcast requests (for hosts to view all guest requests)
router.get('/all-requests', authenticate, async (req, res) => {
  try {
    const requests = await PodcastRequest.find()
      .populate('guestId', 'name email')
      .populate('matchedHost', 'name email')
      .sort('-createdAt');
    res.json(requests);
  } catch (error) {
    console.error('Error fetching all podcast requests:', error);
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

export default router;
