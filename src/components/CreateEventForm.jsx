"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

const EMPTY = { title: "", date: "", description: "", capacity: "" };

export default function CreateEventForm({ onCreateEvent }) {
    const [form, setForm] = useState(EMPTY);
    const [busy, setBusy] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        if (!form.title || !form.date || !form.capacity) return;
        setBusy(true);
        try {
            await new Promise(r => setTimeout(r, 350));
            await onCreateEvent({
                title: form.title,
                date: form.date,
                description: form.description,
                capacity: parseInt(form.capacity, 10),
                location: "TBD"
            });
            setForm(EMPTY);
        } finally {
            setBusy(false);
        }
    }

    const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

    return (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden h-full flex flex-col">
            <div className="px-5 py-4 border-b border-slate-100">
                <h2 className="text-base font-semibold text-slate-900">Create New Event</h2>
                <p className="text-xs text-slate-400 mt-0.5">Fill in the details below.</p>
            </div>

            <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4 flex-1">
                <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">Event Title *</label>
                    <input type="text" value={form.title} onChange={e => set("title", e.target.value)}
                        placeholder="e.g. Product Launch 2026" className="field" required />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1.5">Date *</label>
                        <input type="date" value={form.date} onChange={e => set("date", e.target.value)} className="field" required />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1.5">Capacity *</label>
                        <input type="number" min="1" value={form.capacity} onChange={e => set("capacity", e.target.value)}
                            placeholder="100" className="field" required />
                    </div>
                </div>

                <div className="flex-1">
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">Description</label>
                    <textarea rows={3} value={form.description} onChange={e => set("description", e.target.value)}
                        placeholder="What makes this event special?" className="field resize-none" />
                </div>

                <button type="submit" disabled={busy}
                    className="btn-primary w-full flex items-center justify-center gap-2 py-2.5"
                    style={busy ? { opacity: 0.7 } : {}}>
                    {busy
                        ? <><span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Publishing...</>
                        : <><Plus className="w-4 h-4" /> Publish Event</>
                    }
                </button>
            </form>
        </div>
    );
}
