import mongoose from 'mongoose';

const podcastRequestSchema = new mongoose.Schema({
  guestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  topic: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  preferredTimes: [{
    type: String,
    required: true
  }],
  status: {
    type: String,
    enum: ['pending', 'matched', 'scheduled', 'completed', 'declined', 'cancelled'],
    default: 'pending'
  },
  matchedHost: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  scheduledTime: {
    date: Date,
    timeSlot: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const PodcastRequest = mongoose.model('PodcastRequest', podcastRequestSchema);

export default PodcastRequest;