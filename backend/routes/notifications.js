const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Event = require('../models/Event');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/notifications
// @desc    Get all notifications for logged-in user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('notifications');
    const notifications = user.notifications.sort((a, b) => b.createdAt - a.createdAt);
    res.json({ success: true, notifications });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   PUT /api/notifications/mark-read
// @desc    Mark all notifications as read
// @access  Private
router.put('/mark-read', protect, async (req, res) => {
  try {
    await User.updateOne(
      { _id: req.user._id },
      { $set: { 'notifications.$[].read': true } }
    );
    res.json({ success: true, message: 'All notifications marked as read.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   POST /api/notifications/broadcast/:eventId
// @desc    Organizer sends notification to all registered users of an event
// @access  Organizer / Admin
router.post('/broadcast/:eventId', protect, authorize('organizer', 'admin'), async (req, res) => {
  try {
    const { message } = req.body;
    const Registration = require('../models/Registration');

    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found.' });

    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    // Get all confirmed registrations
    const registrations = await Registration.find({ event: event._id, status: 'confirmed' }).select('user');
    const userIds = registrations.map((r) => r.user);

    // Add notification to each user
    await User.updateMany(
      { _id: { $in: userIds } },
      { $push: { notifications: { message } } }
    );

    res.json({ success: true, message: `Notification sent to ${userIds.length} users.` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
