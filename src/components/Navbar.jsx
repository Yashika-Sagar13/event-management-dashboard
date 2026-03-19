"use client";

import { CalendarDays, User, Settings } from "lucide-react";

export default function Navbar({ activeView, onViewChange }) {
    const tabs = [
        { id: "user", label: "User", icon: User },
        { id: "organizer", label: "Organizer", icon: Settings },
    ];

    return (
        <nav className="sticky top-0 z-50 bg-white border-b border-slate-200/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-15" style={{ height: 60 }}>

                    {/* Brand */}
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ background: '#4f46e5' }}>
                            <CalendarDays className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-semibold text-slate-800 text-sm sm:text-base tracking-tight">
                            Event Management Dashboard
                        </span>
                    </div>

                    {/* View toggle */}
                    <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100">
                        {tabs.map(({ id, label, icon: Icon }) => (
                            <button
                                key={id}
                                onClick={() => onViewChange(id)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer"
                                style={activeView === id ? {
                                    background: '#fff',
                                    color: '#4f46e5',
                                    boxShadow: '0 1px 4px rgba(0,0,0,0.10)',
                                } : {
                                    color: '#6b7280',
                                }}
                            >
                                <Icon className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">{label}</span>
                            </button>
                        ))}
                    </div>

                </div>
            </div>
        </nav>
    );
}
