import React from 'react';
import { NavLink, Routes, Route } from 'react-router-dom';
import Winners from '../components/Winners.tsx'; // Adjust import path if needed

interface LayoutProps {
  children?: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="layout-container min-h-screen bg-slate-900 text-white flex flex-col">
      {/* Navigation Header */}
      <header className="p-4 bg-[#060710] border-b border-[#232742] flex gap-4">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `px-4 py-2 rounded-lg font-mono text-xs font-bold transition-all ${
              isActive
                ? 'bg-cyan-500 text-slate-900'
                : 'bg-[#161830] text-slate-300 hover:text-white'
            }`
          }
        >
          GARAGE
        </NavLink>
        <NavLink
          to="/winners"
          className={({ isActive }) =>
            `px-4 py-2 rounded-lg font-mono text-xs font-bold transition-all ${
              isActive
                ? 'bg-cyan-500 text-slate-900'
                : 'bg-[#161830] text-slate-300 hover:text-white'
            }`
          }
        >
          WINNERS
        </NavLink>
      </header>

      {/* View Switcher */}
      <main className="flex-1">
        <Routes>
          {/* '/' renders the Garage content passed as children from App.tsx */}
          <Route path="/" element={<>{children}</>} />

          {/* '/winners' renders the Winners component */}
          <Route path="/winners" element={<Winners />} />
        </Routes>
      </main>
    </div>
  );
}
