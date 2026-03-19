const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 4000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:3000";

app.use(
  cors({
    origin: CLIENT_ORIGIN,
  })
);
app.use(express.json());

const events = [
  {
    id: 1,
    title: "Tech Innovation Summit 2026",
    date: "2026-04-15",
    location: "Convention Center, San Francisco",
    description:
      "Join industry leaders to explore breakthroughs in AI, quantum computing, and sustainable tech.",
    capacity: 200,
    registrations: 142,
  },
  {
    id: 2,
    title: "Creative Design Workshop",
    date: "2026-03-22",
    location: "Design Hub, New York",
    description:
      "A full-day hands-on workshop covering UI/UX best practices, design systems, and Figma workflows.",
    capacity: 50,
    registrations: 38,
  },
  {
    id: 3,
    title: "Startup Networking Mixer",
    date: "2026-03-25",
    location: "Rooftop Lounge, Austin",
    description:
      "Connect with founders, investors, and builders in the local startup ecosystem.",
    capacity: 100,
    registrations: 67,
  },
  {
    id: 4,
    title: "Cloud Architecture Deep Dive",
    date: "2026-04-02",
    location: "Virtual Event",
    description:
      "Advanced patterns for multi-cloud deployments, serverless architecture, and infrastructure-as-code.",
    capacity: 300,
    registrations: 189,
  },
];

const registeredEventIds = new Set();
let nextId = events.length + 1;

function serializeEvent(event) {
  return {
    ...event,
    isRegistered: registeredEventIds.has(event.id),
  };
}

function buildStats() {
  const totalRegistrations = events.reduce(
    (sum, event) => sum + event.registrations,
    0
  );
  const totalCapacity = events.reduce((sum, event) => sum + event.capacity, 0);

  return {
    totalRegistrations,
    totalCapacity,
    totalEvents: events.length,
    seatsLeft: Math.max(0, totalCapacity - totalRegistrations),
    fillRate:
      totalCapacity > 0
        ? Math.round((totalRegistrations / totalCapacity) * 100)
        : 0,
  };
}

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/events", (_req, res) => {
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  res.json({
    events: sortedEvents.map(serializeEvent),
    stats: buildStats(),
  });
});

app.get("/api/events/stats", (_req, res) => {
  res.json(buildStats());
});

app.post("/api/events", (req, res) => {
  const { title, date, description = "", capacity, location = "TBD" } = req.body ?? {};

  if (!title || !date || !capacity) {
    return res.status(400).json({
      message: "title, date, and capacity are required",
    });
  }

  const parsedCapacity = Number.parseInt(capacity, 10);
  if (!Number.isFinite(parsedCapacity) || parsedCapacity <= 0) {
    return res.status(400).json({
      message: "capacity must be a positive number",
    });
  }

  const event = {
    id: nextId++,
    title: String(title).trim(),
    date,
    description: String(description).trim(),
    capacity: parsedCapacity,
    location: String(location).trim() || "TBD",
    registrations: 0,
  };

  events.unshift(event);
  return res.status(201).json({
    event: serializeEvent(event),
    stats: buildStats(),
  });
});

app.post("/api/events/:id/register", (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  const event = events.find((item) => item.id === id);

  if (!event) {
    return res.status(404).json({ message: "event not found" });
  }

  if (registeredEventIds.has(id)) {
    return res.status(409).json({ message: "already registered for this event" });
  }

  if (event.registrations >= event.capacity) {
    return res.status(409).json({ message: "event is full" });
  }

  event.registrations += 1;
  registeredEventIds.add(id);

  return res.json({
    event: serializeEvent(event),
    stats: buildStats(),
  });
});

app.listen(PORT, () => {
  console.log(`Event backend running on http://localhost:${PORT}`);
});
