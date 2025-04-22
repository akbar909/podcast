import mongoose from 'mongoose';

const hostProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  podcastName: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  topics: [{
    type: String,
    required: true
  }],
  availability: [{
    day: {
      type: String,
      required: true
    },
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    }
  }],
  rating: {
    type: Number,
    default: 0
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  social: {
    twitter: String,
    linkedin: String,
    website: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const HostProfile = mongoose.model('HostProfile', hostProfileSchema);

export default HostProfile;