const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  techStack: [{
    type: String,
    required: true
  }],
  type: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract'],
    required: true
  },
  experienceLevel: {
    type: String,
    enum: ['Junior', 'Mid', 'Senior'],
    required: true
  },
  matchPercentage: {
    type: Number,
    min: 0,
    max: 100
  },
  applicants: {
    type: Number,
    default: 0
  },
  deadline: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Open', 'Closed', 'Draft'],
    default: 'Open'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  requirements: [{
    type: String
  }],
  responsibilities: [{
    type: String
  }],
  location: {
    type: String,
    required: true
  },
  salary: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'USD'
    }
  },
  savedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  roles: [
    {
      title: { type: String, required: true },
      count: { type: Number, required: true },
      filled: { type: Number, default: 0 },
      skills: [{ type: String }],
      applicants: { type: Number, default: 0 }
    }
  ],
  duration: {
    type: String,
    required: false
  },
  workHours: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});

// Calculate time left until deadline
projectSchema.virtual('timeLeft').get(function() {
  const now = new Date();
  const diff = this.deadline - now;
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  
  if (days < 0) return 'Expired';
  if (days === 0) return 'Last day';
  if (days === 1) return '1 day left';
  if (days <= 7) return `${days} days left`;
  if (days <= 30) return `${Math.ceil(days/7)} weeks left`;
  return `${Math.ceil(days/30)} months left`;
});

// Calculate match percentage based on user skills
projectSchema.methods.calculateMatchPercentage = function(userSkills) {
  if (!userSkills || userSkills.length === 0) return 0;
  
  const matchingSkills = this.techStack.filter(skill => 
    userSkills.includes(skill)
  );
  
  return Math.round((matchingSkills.length / this.techStack.length) * 100);
};

module.exports = mongoose.model('Project', projectSchema);