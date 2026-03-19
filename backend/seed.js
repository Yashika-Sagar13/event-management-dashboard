#!/usr/bin/env node

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Event = require('./models/Event');

dotenv.config();

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Event.deleteMany({});
    console.log('Cleared existing data');

    // Create demo users
    const demoUsers = [
      {
        name: 'John Organizer',
        email: 'organizer@demo.com',
        password: 'password',
        role: 'organizer',
      },
      {
        name: 'Jane User',
        email: 'user@demo.com',
        password: 'password',
        role: 'user',
      },
      {
        name: 'Admin User',
        email: 'admin@demo.com',
        password: 'password',
        role: 'admin',
      },
    ];

    const users = await User.create(demoUsers);
    console.log(`Created ${users.length} demo users`);

    // Create demo events
    const organizerId = users[0]._id;
    const demoEvents = [
      {
        title: 'Tech Innovation Summit 2026',
        description: 'Join industry leaders to explore breakthroughs in AI, quantum computing, and sustainable tech.',
        date: new Date('2026-04-15'),
        registrationDeadline: new Date('2026-04-10'),
        location: 'Convention Center, San Francisco',
        isOnline: false,
        maxCapacity: 200,
        registrationCount: 142,
        organizer: organizerId,
        status: 'published',
        category: 'conference',
        tags: ['AI', 'Tech', 'Innovation'],
      },
      {
        title: 'Creative Design Workshop',
        description: 'A full-day hands-on workshop covering UI/UX best practices, design systems, and Figma workflows.',
        date: new Date('2026-03-22'),
        registrationDeadline: new Date('2026-03-15'),
        location: 'Design Hub, New York',
        isOnline: false,
        maxCapacity: 50,
        registrationCount: 38,
        organizer: organizerId,
        status: 'published',
        category: 'workshop',
        tags: ['Design', 'UX', 'Figma'],
      },
      {
        title: 'Startup Networking Mixer',
        description: 'Connect with founders, investors, and builders in the local startup ecosystem.',
        date: new Date('2026-03-25'),
        registrationDeadline: new Date('2026-03-20'),
        location: 'Rooftop Lounge, Austin',
        isOnline: false,
        maxCapacity: 100,
        registrationCount: 67,
        organizer: organizerId,
        status: 'published',
        category: 'meetup',
        tags: ['Startup', 'Networking'],
      },
      {
        title: 'Cloud Architecture Deep Dive',
        description: 'Advanced patterns for multi-cloud deployments, serverless architecture, and infrastructure-as-code.',
        date: new Date('2026-04-02'),
        registrationDeadline: new Date('2026-03-28'),
        location: 'Virtual Event',
        isOnline: true,
        maxCapacity: 300,
        registrationCount: 189,
        organizer: organizerId,
        status: 'published',
        category: 'webinar',
        tags: ['Cloud', 'Architecture', 'DevOps'],
      },
    ];

    const events = await Event.create(demoEvents);
    console.log(`Created ${events.length} demo events`);

    console.log('\nDemo data seeded successfully!');
    console.log('\nYou can now login with:');
    console.log('  Organizer: organizer@demo.com / password');
    console.log('  User: user@demo.com / password');
    console.log('  Admin: admin@demo.com / password');

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
