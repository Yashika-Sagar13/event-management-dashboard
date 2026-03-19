"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import UserView from "@/components/UserView";
import OrganizerView from "@/components/OrganizerView";

const INITIAL_EVENTS = [
  {
    id: 1,
    title: "Tech Innovation Summit 2026",
    date: "2026-04-15",
    location: "Convention Center, San Francisco",
    description: "Join industry leaders to explore breakthroughs in AI, quantum computing, and sustainable tech.",
    capacity: 200,
    registrations: 142,
    isRegistered: false,
  },
  {
    id: 2,
    title: "Creative Design Workshop",
    date: "2026-03-22",
    location: "Design Hub, New York",
    description: "A full-day hands-on workshop covering UI/UX best practices, design systems, and Figma workflows.",
    capacity: 50,
    registrations: 38,
    isRegistered: false,
  },
  {
    id: 3,
    title: "Startup Networking Mixer",
    date: "2026-03-25",
    location: "Rooftop Lounge, Austin",
    description: "Connect with founders, investors, and builders in the local startup ecosystem.",
    capacity: 100,
    registrations: 67,
    isRegistered: false,
  },
  {
    id: 4,
    title: "Cloud Architecture Deep Dive",
    date: "2026-04-02",
    location: "Virtual Event",
    description: "Advanced patterns for multi-cloud deployments, serverless architecture, and infrastructure-as-code.",
    capacity: 300,
    registrations: 189,
    isRegistered: false,
  },
];

let nextId = 5;

export default function Home() {
  const [activeView, setActiveView] = useState("user");
  const [events, setEvents] = useState(INITIAL_EVENTS);

  function handleRegister(id) {
    setEvents(prev =>
      prev.map(e => e.id === id ? { ...e, registrations: e.registrations + 1, isRegistered: true } : e)
    );
  }

  function handleCreate(data) {
    setEvents(prev => [{ id: nextId++, ...data, registrations: 0, isRegistered: false }, ...prev]);
  }

  return (
    <div className="flex-1 flex flex-col" style={{ background: '#f8f9fc' }}>
      <Navbar activeView={activeView} onViewChange={setActiveView} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === "user"
          ? <UserView events={events} onRegister={handleRegister} />
          : <OrganizerView events={events} onCreateEvent={handleCreate} />
        }
      </main>

      <footer className="py-4 border-t border-slate-200/60">
        <p className="text-center text-xs text-slate-400">
          © 2026 Event Management Dashboard
        </p>
      </footer>
    </div>
  );
}
