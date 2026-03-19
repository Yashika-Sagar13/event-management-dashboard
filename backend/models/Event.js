const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  category: {
    type: String,
    enum: ['conference', 'workshop', 'seminar', 'meetup', 'webinar', 'other'],
    default: 'other',
  },
  date: {
    type: Date,
    required: [true, 'Event date is required'],
  },
  registrationDeadline: {
    type: Date,
    required: [true, 'Registration deadline is required'],
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
  },
  isOnline: {
    type: Boolean,
    default: false,
  },
  maxCapacity: {
    type: Number,
    required: [true, 'Max capacity is required'],
    min: 1,
  },
  registrationCount: {
    type: Number,
    default: 0,
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'cancelled', 'completed'],
    default: 'published',
  },
  imageUrl: {
    type: String,
    default: '',
  },
  tags: [String],
}, { timestamps: true });

// Virtual: spots remaining
eventSchema.virtual('spotsRemaining').get(function () {
  return this.maxCapacity - this.registrationCount;
});

// Virtual: is full
eventSchema.virtual('isFull').get(function () {
  return this.registrationCount >= this.maxCapacity;
});

eventSchema.set('toJSON', { virtuals: true });
eventSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Event', eventSchema);
