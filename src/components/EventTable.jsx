"use client";

import { Users, Calendar } from "lucide-react";

const BARS = ["#4f46e5", "#0ea5e9", "#10b981", "#f59e0b"];

export default function EventTable({ events }) {
    if (events.length === 0) {
        return (
            <div className="bg-white rounded-2xl border border-slate-200 flex flex-col items-center justify-center py-14 text-center" style={{ minHeight: 200 }}>
                <Calendar className="w-9 h-9 text-slate-300 mb-2" />
                <p className="text-sm text-slate-400">No events yet. Use the form to create one.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden h-full flex flex-col">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-base font-semibold text-slate-900">Your Events</h2>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600">
                    {events.length} total
                </span>
            </div>

            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-slate-100">
                            {["Event", "Date", "Capacity", "Registered", "Fill Rate"].map(h => (
                                <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {events.map((event) => {
                            const fill = Math.min(Math.round((event.registrations / event.capacity) * 100), 100);
                            const bar = BARS[event.id % BARS.length];
                            return (
                                <tr key={event.id}
                                    className="border-b border-slate-50 transition-colors hover:bg-slate-50/70 duration-150">
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: bar }} />
                                            <span className="font-medium text-slate-800">{event.title}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5 text-slate-500">{event.date}</td>
                                    <td className="px-5 py-3.5 text-slate-500">{event.capacity}</td>
                                    <td className="px-5 py-3.5">
                                        <span className="flex items-center gap-1.5 font-semibold" style={{ color: bar }}>
                                            <Users className="w-3.5 h-3.5 opacity-70" /> {event.registrations}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-20 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                                                <div className="h-full rounded-full bar-grow"
                                                    style={{ '--bar-w': `${fill}%`, width: `${fill}%`, background: bar }} />
                                            </div>
                                            <span className="text-xs text-slate-400">{fill}%</span>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Mobile stacked */}
            <div className="sm:hidden divide-y divide-slate-100">
                {events.map(event => {
                    const fill = Math.min(Math.round((event.registrations / event.capacity) * 100), 100);
                    const bar = BARS[event.id % BARS.length];
                    return (
                        <div key={event.id} className="p-4 space-y-2">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full" style={{ background: bar }} />
                                <p className="font-medium text-slate-800 text-sm">{event.title}</p>
                            </div>
                            <div className="flex justify-between text-xs text-slate-400">
                                <span>{event.date}</span>
                                <span className="font-semibold" style={{ color: bar }}>{event.registrations}/{event.capacity}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                                    <div className="h-full rounded-full" style={{ width: `${fill}%`, background: bar }} />
                                </div>
                                <span className="text-xs text-slate-400">{fill}%</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
