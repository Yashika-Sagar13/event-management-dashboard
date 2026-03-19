"use client";

import CreateEventForm from "./CreateEventForm";
import EventTable from "./EventTable";

export default function OrganizerView({ events, onCreateEvent }) {
    const totalReg = events.reduce((s, e) => s + e.registrations, 0);
    const totalCap = events.reduce((s, e) => s + e.capacity, 0);
    const fillRate = totalCap > 0 ? Math.round((totalReg / totalCap) * 100) : 0;

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <span className="inline-block text-xs font-semibold text-indigo-500 tracking-widest uppercase mb-2 px-2.5 py-1 rounded-full"
                    style={{ background: '#eef2ff' }}>
                    Management
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">Organizer Dashboard</h1>
                <p className="text-slate-400 mt-1 text-sm">Publish events and track registrations in real time.</p>
            </div>

            {/* Bento stats — not uniform, one wide + two stacked */}
            {events.length > 0 && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

                    {/* Wide card — total registrations, gets 2 cols */}
                    <div className="col-span-2 bg-white rounded-2xl border border-slate-200 p-5 flex items-center justify-between pop-in"
                        style={{ boxShadow: '0 1px 8px rgba(79,70,229,0.07)', animationDelay: '0ms' }}>
                        <div>
                            <p className="text-xs font-medium text-slate-400 mb-1">Total Registrations</p>
                            <p className="text-4xl font-black text-indigo-600 leading-none">{totalReg}</p>
                            <p className="text-xs text-slate-400 mt-2">across {events.length} events</p>
                        </div>
                        {/* Sparkline-style range visual */}
                        <div className="hidden sm:flex flex-col gap-1 items-end">
                            {events.slice(0, 4).map(e => {
                                const w = Math.max(16, Math.round((e.registrations / (totalCap || 1)) * 120));
                                return (
                                    <div key={e.id} className="h-2 rounded-full bg-indigo-200"
                                        style={{ width: w, background: '#c7d2fe' }} />
                                );
                            })}
                        </div>
                    </div>

                    {/* Events created */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-5 pop-in"
                        style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.04)', animationDelay: '60ms' }}>
                        <p className="text-xs font-medium text-slate-400 mb-1">Events</p>
                        <p className="text-4xl font-black leading-none" style={{ color: '#0ea5e9' }}>{events.length}</p>
                        <p className="text-xs text-slate-400 mt-2">created</p>
                    </div>

                    {/* Seats available */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-5 pop-in"
                        style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.04)', animationDelay: '120ms' }}>
                        <p className="text-xs font-medium text-slate-400 mb-1">Seats Left</p>
                        <p className="text-4xl font-black leading-none" style={{ color: '#10b981' }}>
                            {Math.max(0, totalCap - totalReg)}
                        </p>
                        <p className="text-xs text-slate-400 mt-2">{fillRate}% filled</p>
                    </div>

                </div>
            )}

            {/* Form + Table */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="lg:col-span-1">
                    <CreateEventForm onCreateEvent={onCreateEvent} />
                </div>
                <div className="lg:col-span-2">
                    <EventTable events={events} />
                </div>
            </div>
        </div>
    );
}
