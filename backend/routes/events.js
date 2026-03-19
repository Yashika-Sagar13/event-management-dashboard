const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// ⚠️ IMPORTANT: Specific routes MUST come before parameterized routes (:id)

// @route   GET /api/events/organizer/my-events
// @desc    Get all events created by the logged-in organizer
// @access  Organizer / Admin
router.get('/organizer/my-events', protect, authorize('organizer', 'admin'), async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: events.length, events });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/events
// @desc    Get all published events (with optional filters)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, search, upcoming } = req.query;
    let query = { status: 'published' };

    if (category) query.category = category;
    if (search) query.title = { $regex: search, $options: 'i' };
    if (upcoming === 'true') query.date = { $gte: new Date() };

    const events = await Event.find(query)
      .populate('organizer', 'name email')
      .sort({ date: 1 });

    res.json({ success: true, count: events.length, events });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/events/:id
// @desc    Get single event
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('organizer', 'name email');
    if (!event) return res.status(404).json({ success: false, message: 'Event not found.' });
    res.json({ success: true, event });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   POST /api/events
// @desc    Create a new event
// @access  Organizer / Admin only
router.post('/', protect, authorize('organizer', 'admin'), async (req, res) => {
  try {
    const { title, description, date, registrationDeadline, location, maxCapacity, category, isOnline, tags } = req.body;
    
    // Validation
    if (!title || !description || !date || !registrationDeadline || !location || !maxCapacity) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide all required fields: title, description, date, registrationDeadline, location, maxCapacity' 
      });
    }

    if (new Date(registrationDeadline) > new Date(date)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Registration deadline must be before event date' 
      });
    }

    const event = await Event.create({
      title,
      description,
      date,
      registrationDeadline,
      location,
      maxCapacity,
      category: category || 'other',
      isOnline: isOnline || false,
      tags: tags || [],
      organizer: req.user._id
    });

    res.status(201).json({ success: true, event });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// @route   PUT /api/events/:id
// @desc    Update an event
// @access  Organizer (own events) / Admin
router.put('/:id', protect, authorize('organizer', 'admin'), async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found.' });

    // Only the organizer or admin can update
    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this event.' });
    }

    event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, event });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// @route   DELETE /api/events/:id
// @desc    Delete an event
// @access  Organizer (own events) / Admin
router.delete('/:id', protect, authorize('organizer', 'admin'), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found.' });

    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this event.' });
    }

    await event.deleteOne();
    res.json({ success: true, message: 'Event deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
