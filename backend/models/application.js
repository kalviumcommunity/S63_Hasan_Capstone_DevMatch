const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  coverLetter: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Ensure a user can only apply once to a project
applicationSchema.index({ project: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema); 