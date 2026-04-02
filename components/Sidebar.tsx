"use client";
import React, { useState } from "react";
import { 
  TreeNode, 
  familyData, 
  flattenTree, 
  ANCESTORS 
} from "@/constants/familyData";

interface SidebarProps {
  onNavigate: (node: TreeNode) => void;
  currentRoot: TreeNode;
}

export default function Sidebar({ onNavigate, currentRoot }: SidebarProps) {
  const [search, setSearch] = useState("");
  const [activeMenu, setActiveMenu] = useState("Home");
  
  const allMembers = [...flattenTree(familyData), ...(currentRoot.name === familyData.name ? ANCESTORS as TreeNode[] : [])];
  const filtered = allMembers.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  const menuItems = [
    { name: "Home", icon: "🏠" },
    { name: "Events", icon: "📅" },
    { name: "Gallery", icon: "🖼️" },
    { name: "Settings", icon: "⚙️" },
  ];

  return (
    <aside className="w-72 h-full flex flex-col border-r border-slate-200/50 bg-white/40 backdrop-blur-3xl z-20 shrink-0 select-none">
      
      {/* 1. Brand Section */}
      {/* <div className="p-8 pb-6 flex items-center gap-3"> */}
        {/* <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-lg shadow-[0_5px_15px_rgba(37,99,235,0.2)]">🌳</div> */}
        {/* <h1 className="text-lg font-black text-slate-900 tracking-widest uppercase">Family</h1> */}
      {/* </div> */}

      {/* 2. Global Navigation */}
      <nav className="px-4 mb-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={() => setActiveMenu(item.name)}
            className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-200 group ${
              activeMenu === item.name 
                ? "bg-slate-900/5 text-slate-900 ring-1 ring-slate-200/50" 
                : "text-slate-400 hover:text-slate-700 hover:bg-slate-100/50"
            }`}
          >
            <span className={`text-lg transition-transform group-hover:scale-110 ${activeMenu === item.name ? "grayscale-0" : "grayscale opacity-40"}`}>
              {item.icon}
            </span>
            <span className="text-sm font-bold tracking-wide">{item.name}</span>
            {activeMenu === item.name && (
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.4)]" />
            )}
          </button>
        ))}
      </nav>

      <div className="px-8 my-4">
        <div className="h-px bg-slate-200/50" />
      </div>

      {/* 3. Search Section */}
      {/* <div className="px-6 mb-6">
        <div className="relative group">
          <div className="absolute left-3.5 top-3.5 text-slate-300 group-focus-within:text-blue-500 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </div>
          <input
            type="text"
            placeholder="Search family..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-[13px] text-slate-700 placeholder-slate-300 outline-none focus:bg-white focus:ring-1 focus:ring-blue-500/20 transition-all shadow-sm"
          />
        </div>
      </div> */}

      {/* 4. Family Member List */}
      {/* <div className="flex-1 overflow-y-auto px-4 space-y-1.5 custom-scrollbar pb-10">
        <p className="px-4 text-[10px] font-black text-slate-300 uppercase tracking-[0.25em] mb-4">Tree Members</p>
        
        {filtered.map((member) => {
          const isActive = currentRoot.name === member.name;
          const isAnc = ANCESTORS.some(a => a.name === member.name);

          return (
            <button
              key={member.name}
              onClick={() => onNavigate(member)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
                isActive 
                  ? "bg-blue-600/5 text-slate-900 ring-1 ring-blue-500/10 shadow-sm" 
                  : "text-slate-400 hover:text-slate-700 hover:bg-slate-50"
              }`}
            >
              <div className="relative flex-shrink-0">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className={`w-9 h-9 rounded-full bg-slate-50 border p-0.5 transition-colors ${
                    isActive ? "border-blue-500/20 shadow-sm" : "border-slate-100"
                  }`}
                />
                {isAnc && (
                  <span className="absolute -top-1 -right-1 text-[8px] bg-amber-500/90 p-0.5 rounded-full ring-1 ring-white shadow-sm font-bold">🕌</span>
                )}
              </div>
              <div className="text-left overflow-hidden">
                <p className={`text-[13px] font-bold truncate ${isActive ? "text-slate-900" : "text-slate-600"}`}>
                  {member.name}
                </p>
                <p className="text-[10px] text-slate-400 font-medium truncate">
                  {member.birthYear || "N/A"} • {member.residence}
                </p>
              </div>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.3)]" />
              )}
            </button>
          );
        })}
      </div> */}

      {/* Sidebar Footer - Inverted */}
      {/* <div className="p-6">
        <div className="bg-white/60 rounded-2xl px-4 py-3 flex items-center gap-3 border border-slate-200/50 backdrop-blur-md shadow-sm">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm shadow-inner">👤</div>
          <div>
            <p className="text-[11px] font-black text-slate-800">Arkha Akhana</p>
            <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">Admin Control</p>
          </div>
        </div>
      </div> */}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.1); }
      `}</style>
    </aside>
  );
}
