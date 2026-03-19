"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, Clock } from "lucide-react";

const MOCK_ALERTS = [
    { id: 1, title: "Tech Innovation Summit", time: "Tomorrow, 10:00 AM", dot: "#4f46e5" },
    { id: 2, title: "Creative Design Workshop", time: "Mar 22, 2:00 PM", dot: "#0ea5e9" },
    { id: 3, title: "Startup Networking Mixer", time: "Mar 25, 6:00 PM", dot: "#10b981" },
];

export default function AlertsDropdown() {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        function close(e) {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        }
        document.addEventListener("mousedown", close);
        return () => document.removeEventListener("mousedown", close);
    }, []);

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen(!open)}
                className="relative p-2 rounded-lg transition-colors duration-200 cursor-pointer"
                style={{ color: '#6b7280' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#eef2ff'; e.currentTarget.style.color = '#4f46e5'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#6b7280'; }}
                aria-label="Alerts"
            >
                <Bell className="w-5 h-5" />
                <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 flex items-center justify-center rounded-full text-[10px] font-bold text-white"
                    style={{ background: '#ef4444', minWidth: 18, minHeight: 18 }}>
                    {MOCK_ALERTS.length}
                </span>
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden fade-slide z-50">
                    <div className="px-4 py-3 border-b border-slate-100">
                        <p className="text-sm font-semibold text-slate-800">Upcoming Events</p>
                    </div>
                    <ul>
                        {MOCK_ALERTS.map(alert => (
                            <li key={alert.id}
                                className="px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer border-b border-slate-50 last:border-0">
                                <div className="flex items-start gap-3">
                                    <span className="pulse mt-1.5 w-2 h-2 rounded-full flex-shrink-0"
                                        style={{ background: alert.dot }} />
                                    <div>
                                        <p className="text-sm font-medium text-slate-800">{alert.title}</p>
                                        <div className="flex items-center gap-1 mt-0.5 text-xs text-slate-400">
                                            <Clock className="w-3 h-3" /> {alert.time}
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
