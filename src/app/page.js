"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import UserView from "@/components/UserView";
import OrganizerView from "@/components/OrganizerView";
import { createEvent, fetchEvents, registerForEvent } from "@/lib/api";

export default function Home() {
  const [activeView, setActiveView] = useState("user");
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadEvents() {
      try {
        setLoading(true);
        const data = await fetchEvents();
        if (!cancelled) {
          setEvents(data.events || []);
          setError("");
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Unable to load events.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadEvents();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleRegister(id) {
    try {
      const data = await registerForEvent(id);
      setEvents((prev) =>
        prev.map((event) => (event.id === id ? data.event : event))
      );
      setError("");
    } catch (err) {
      setError(err.message || "Unable to complete registration.");
    }
  }

  async function handleCreate(data) {
    try {
      const response = await createEvent(data);
      setEvents((prev) => [response.event, ...prev]);
      setError("");
    } catch (err) {
      setError(err.message || "Unable to create event.");
      throw err;
    }
  }

  return (
    <div className="flex-1 flex flex-col" style={{ background: "#f8f9fc" }}>
      <Navbar activeView={activeView} onViewChange={setActiveView} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-10 text-sm text-slate-500">
            Loading events from the backend...
          </div>
        ) : activeView === "user" ? (
          <UserView events={events} onRegister={handleRegister} />
        ) : (
          <OrganizerView events={events} onCreateEvent={handleCreate} />
        )}
      </main>

      <footer className="py-4 border-t border-slate-200/60">
        <p className="text-center text-xs text-slate-400">
          © 2026 Event Management Dashboard
        </p>
      </footer>
    </div>
  );
}
