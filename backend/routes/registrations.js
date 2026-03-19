const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// ⚠️ IMPORTANT: Specific routes MUST come before parameterized routes (:eventId)

// @route   GET /api/registrations/my-registrations
// @desc    Get all events the user has registered for
// @access  Private
router.get('/my-registrations', protect, async (req, res) => {
  try {
    const registrations = await Registration.find({ user: req.user._id, status: 'confirmed' })
      .populate('event', 'title date location category status imageUrl maxCapacity registrationCount')
      .sort({ registeredAt: -1 });

    res.json({ success: true, count: registrations.length, registrations });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   POST /api/registrations/:eventId
// @desc    Register user for an event
// @access  Private (users)
router.post('/:eventId', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);

    if (!event) return res.status(404).json({ success: false, message: 'Event not found.' });
    if (event.status !== 'published') return res.status(400).json({ success: false, message: 'Event is not available for registration.' });
    if (new Date() > event.registrationDeadline) return res.status(400).json({ success: false, message: 'Registration deadline has passed.' });
    if (event.isFull) return res.status(400).json({ success: false, message: 'Event is fully booked.' });

    // Check if already registered
    const existing = await Registration.findOne({ user: req.user._id, event: event._id });
    if (existing) return res.status(400).json({ success: false, message: 'You are already registered for this event.' });

    // Create registration
    const registration = await Registration.create({ user: req.user._id, event: event._id });

    // Increment registration count on event (real-time count update)
    event.registrationCount += 1;
    await event.save();

    // Send notification to user
    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        notifications: {
          message: `You have successfully registered for "${event.title}" on ${event.date.toDateString()}.`,
        },
      },
    });

    // Emit real-time update via Socket.IO (if io is set up in app)
    const io = req.app.get('io');
    if (io) {
      io.emit(`event:${event._id}:update`, {
        registrationCount: event.registrationCount,
        spotsRemaining: event.maxCapacity - event.registrationCount,
      });
    }

    res.status(201).json({ success: true, message: 'Registered successfully!', registration });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   DELETE /api/registrations/:eventId
// @desc    Cancel registration
// @access  Private (users)
router.delete('/:eventId', protect, async (req, res) => {
  try {
    const registration = await Registration.findOne({ user: req.user._id, event: req.params.eventId });
    if (!registration) return res.status(404).json({ success: false, message: 'Registration not found.' });

    registration.status = 'cancelled';
    registration.cancelledAt = new Date();
    await registration.save();

    // Decrement count
    const event = await Event.findByIdAndUpdate(req.params.eventId, { $inc: { registrationCount: -1 } }, { new: true });

    // Notify user
    await User.findByIdAndUpdate(req.user._id, {
      $push: { notifications: { message: `Your registration for "${event.title}" has been cancelled.` } },
    });

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.emit(`event:${event._id}:update`, {
        registrationCount: event.registrationCount,
        spotsRemaining: event.maxCapacity - event.registrationCount,
      });
    }

    res.json({ success: true, message: 'Registration cancelled.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/registrations/event/:eventId
// @desc    Get all registrations for an event (Organizer only)
// @access  Organizer / Admin
router.get('/event/:eventId', protect, authorize('organizer', 'admin'), async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found.' });

    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    const registrations = await Registration.find({ event: req.params.eventId, status: 'confirmed' })
      .populate('user', 'name email')
      .sort({ registeredAt: -1 });

    res.json({ success: true, count: registrations.length, registrations });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/registrations/my-registrations
// @desc    Get all events the user has registered for
// @access  Private
router.get('/my-registrations', protect, async (req, res) => {
  try {
    const registrations = await Registration.find({ user: req.user._id, status: 'confirmed' })
      .populate('event', 'title date location category status imageUrl maxCapacity registrationCount')
      .sort({ registeredAt: -1 });

    res.json({ success: true, count: registrations.length, registrations });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
