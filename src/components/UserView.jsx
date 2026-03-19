"use client";

import { Calendar, MapPin, Users, CheckCircle, ArrowRight, Zap } from "lucide-react";
import AlertsDropdown from "./AlertsDropdown";

const ACCENTS = [
    { bar: "#4f46e5", tag: { bg: "#eef2ff", color: "#4f46e5" }, light: "#f5f3ff" },
    { bar: "#0ea5e9", tag: { bg: "#e0f2fe", color: "#0284c7" }, light: "#f0f9ff" },
    { bar: "#10b981", tag: { bg: "#d1fae5", color: "#059669" }, light: "#f0fdf4" },
    { bar: "#f59e0b", tag: { bg: "#fef3c7", color: "#b45309" }, light: "#fffbeb" },
];

// Parse "2026-04-15" → { day: "15", month: "APR" }
function parseDateParts(dateStr) {
    const d = new Date(dateStr);
    return {
        day: d.toLocaleDateString("en-US", { day: "2-digit" }),
        month: d.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
        year: d.getFullYear(),
    };
}

export default function UserView({ events, onRegister }) {
    const [featured, ...rest] = events;

    return (
        <div>
            {/* Header */}
            <div className="flex items-start justify-between mb-10">
                <div>
                    <span className="inline-block text-xs font-semibold text-indigo-500 tracking-widest uppercase mb-2 px-2.5 py-1 rounded-full"
                        style={{ background: '#eef2ff' }}>
                        Live events
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                        Discover &amp; Register
                    </h1>
                </div>
                <AlertsDropdown />
            </div>

            {events.length === 0 && (
                <div className="text-center py-20 text-slate-400">
                    <Calendar className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No events yet. Create one in Organizer view.</p>
                </div>
            )}

            {/* Featured card — horizontal, takes full width */}
            {featured && (
                <FeaturedCard event={featured} onRegister={onRegister} accent={ACCENTS[featured.id % ACCENTS.length]} />
            )}

            {/* Remaining cards — asymmetric three-column bento */}
            {rest.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {rest.map((event, i) => (
                        <RegularCard
                            key={event.id}
                            event={event}
                            onRegister={onRegister}
                            accent={ACCENTS[event.id % ACCENTS.length]}
                            delay={(i + 1) * 70}
                            // Make the last card in an odd count span 2 cols on sm
                            wide={rest.length % 2 !== 0 && i === rest.length - 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

/* ── Featured: horizontal split — date block left, content right ── */
function FeaturedCard({ event, onRegister, accent }) {
    const { day, month, year } = parseDateParts(event.date);
    const fill = Math.min(Math.round((event.registrations / event.capacity) * 100), 100);

    return (
        <div className="pop-in rounded-2xl border border-slate-200 bg-white overflow-hidden"
            style={{ boxShadow: '0 2px 16px rgba(79,70,229,0.08)' }}>
            <div className="flex flex-col sm:flex-row">

                {/* Left — date block with accent bg */}
                <div className="sm:w-44 flex-shrink-0 flex flex-col items-center justify-center py-8 px-6"
                    style={{ background: accent.light }}>
                    <span className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: accent.bar }}>{month}</span>
                    <span className="text-6xl font-black leading-none" style={{ color: accent.bar }}>{day}</span>
                    <span className="text-xs text-slate-400 mt-1">{year}</span>
                    {/* Location pill */}
                    <span className="mt-4 flex items-center gap-1 text-xs text-slate-500 text-center">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        {event.location}
                    </span>
                </div>

                {/* Right — content */}
                <div className="flex-1 p-6 flex flex-col">
                    <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                            <span className="tag text-xs font-semibold rounded-full px-2.5 py-0.5"
                                style={{ background: accent.tag.bg, color: accent.tag.color }}>
                                ✦ Featured
                            </span>
                            <h2 className="text-xl font-bold text-slate-900 mt-2 leading-snug">{event.title}</h2>
                        </div>
                    </div>

                    <p className="text-sm text-slate-500 leading-relaxed flex-1 mb-5">{event.description}</p>

                    <div className="flex items-center justify-between gap-4 flex-wrap">
                        {/* Seat fill pill */}
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                <Users className="w-3.5 h-3.5" />
                                <span>{event.registrations}/{event.capacity} seats</span>
                            </div>
                            <div className="w-24 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                                <div className="h-full rounded-full bar-grow"
                                    style={{ '--bar-w': `${fill}%`, width: `${fill}%`, background: accent.bar }} />
                            </div>
                            <span className="text-xs text-slate-400">{fill}%</span>
                        </div>

                        {/* Button — pill style with arrow, not full-width */}
                        {event.isRegistered ? (
                            <span className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600 px-4 py-2 rounded-full"
                                style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                                <CheckCircle className="w-4 h-4" /> Registered
                            </span>
                        ) : (
                            <button
                                onClick={() => onRegister(event.id)}
                                className="flex items-center gap-2 text-sm font-semibold text-white px-5 py-2.5 rounded-full cursor-pointer transition-all duration-200 hover:brightness-110 hover:-translate-y-px"
                                style={{ background: accent.bar, boxShadow: `0 3px 12px ${accent.bar}40` }}>
                                Register Now <ArrowRight className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ── Regular cards — compact, varied feel ── */
function RegularCard({ event, onRegister, accent, delay, wide }) {
    const { day, month } = parseDateParts(event.date);
    const fill = Math.min(Math.round((event.registrations / event.capacity) * 100), 100);

    return (
        <div
            className={`pop-in bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col transition-all duration-250 hover:-translate-y-1 hover:shadow-lg hover:border-indigo-200 ${wide ? "sm:col-span-2 lg:col-span-1" : ""}`}
            style={{ animationDelay: `${delay}ms`, boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}
        >
            {/* Top strip — accent color with date floated right */}
            <div className="h-16 relative flex items-end px-4 pb-3"
                style={{ background: accent.light }}>
                <span className="tag text-xs font-semibold rounded-full px-2.5 py-0.5"
                    style={{ background: accent.tag.bg, color: accent.tag.color }}>
                    Upcoming
                </span>
                {/* Date badge floated top-right */}
                <div className="absolute top-3 right-4 text-right leading-none">
                    <span className="block text-2xl font-black" style={{ color: accent.bar }}>{day}</span>
                    <span className="block text-[10px] font-bold tracking-widest uppercase" style={{ color: accent.bar }}>{month}</span>
                </div>
            </div>

            <div className="p-4 flex flex-col flex-1">
                <h3 className="font-semibold text-slate-900 text-sm leading-snug mb-2">{event.title}</h3>

                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3">
                    <MapPin className="w-3 h-3" /> {event.location}
                </div>

                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-4 flex-1">
                    {event.description}
                </p>

                {/* Capacity bar */}
                <div className="mb-4">
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                        <span>{event.registrations}/{event.capacity} seats</span>
                        <span>{fill}%</span>
                    </div>
                    <div className="h-1 rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full rounded-full bar-grow"
                            style={{ '--bar-w': `${fill}%`, width: `${fill}%`, background: accent.bar }} />
                    </div>
                </div>

                {/* Button — inline icon-right, not full-width, sits left */}
                {event.isRegistered ? (
                    <span className="self-start flex items-center gap-1.5 text-xs font-semibold text-emerald-600 px-3 py-1.5 rounded-full"
                        style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                        <CheckCircle className="w-3.5 h-3.5" /> Registered
                    </span>
                ) : (
                    <button
                        onClick={() => onRegister(event.id)}
                        className="self-start flex items-center gap-1.5 text-xs font-semibold text-white px-4 py-1.5 rounded-full cursor-pointer transition-all duration-200 hover:brightness-110 hover:-translate-y-px"
                        style={{ background: accent.bar, boxShadow: `0 2px 8px ${accent.bar}30` }}>
                        <Zap className="w-3 h-3" /> Register <ArrowRight className="w-3 h-3" />
                    </button>
                )}
            </div>
        </div>
    );
}
