"use client";
import React, { useState } from "react";
import FamilyTree from "@/components/FamilyTree";
import Sidebar from "@/components/Sidebar";
import { 
  TreeNode, 
  familyData, 
  findPath 
} from "@/constants/familyData";

export default function Home() {
  const [currentRoot, setCurrentRoot] = useState<TreeNode>(familyData);
  const [breadcrumb, setBreadcrumb] = useState<TreeNode[]>([familyData]);
  const [animating, setAnimating] = useState(false);

  const handleNavigate = (node: TreeNode) => {
    if (animating) return;
    if (node.name === currentRoot.name) return;

    setAnimating(true);
    const path = findPath(familyData, node.name) || [node];
    setCurrentRoot(node);
    setBreadcrumb(path);
  };

  const isRootAtMain = currentRoot.name === familyData.name;

  return (
    <div className="flex h-screen w-full bg-[#FFF8F0] overflow-hidden selection:bg-blue-100 selection:text-blue-900 font-sans">
      
      {/* 1. Sidebar - Modern Light Glass */}
      <Sidebar 
        currentRoot={currentRoot} 
        onNavigate={handleNavigate} 
      />

      {/* 2. Main Content Area */}
      <main className="flex-1 relative flex flex-col min-w-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.8)_0%,rgba(255,248,240,0)_70%)]">
        
        {/* Full-screen Warm Brown Ambient Background (No Green) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {/* Soft base background */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#FFF8F0] via-[#f7e9da] to-[#eddbce]  opacity-90" />
          
          {/* Rich brown and golden blurs simulating depth of field wood tones */}
          <div className="absolute top-[-20%] left-[10%] w-[70%] h-[70%] bg-[#8B5A2B]/15 blur-[200px] rounded-full mix-blend-multiply" />
          <div className="absolute bottom-[-10%] right-[5%] w-[80%] h-[60%] bg-[#A0522D]/10 blur-[200px] rounded-full mix-blend-multiply" />
          <div className="absolute top-[20%] right-[-10%] w-[40%] h-[50%] bg-[#CD853F]/15 blur-[200px] rounded-full mix-blend-multiply" />
        </div>

        {/* Soft atmospheric overlay */}
        <div className="absolute inset-0 bg-[#FFF8F0]/30 mix-blend-overlay pointer-events-none z-0" />

        {/* 3. Top Header / Navigation - Inverted Colors */}
        <header className="px-10 py-8 flex items-center justify-between z-30 shrink-0 select-none">
          <div className="flex flex-col gap-4">
            <h1 className="text-[13px] font-black text-slate-900/20 tracking-[0.4em] uppercase flex items-center gap-3">
              <span className="w-6 h-[1.5px] bg-blue-500/40 rounded-full" /> 
              Silsilah Keluarga
            </h1>
            
            {/* Minimalist Breadcrumb Bar - Outside the tree */}
            {breadcrumb.length > 0 && (
              <nav className="flex items-center gap-1.5 bg-white/60 border border-white rounded-2xl px-2.5 py-2 ring-1 ring-slate-200/50 backdrop-blur-3xl shadow-sm">
                {breadcrumb.map((node, i) => (
                  <div key={node.name} className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleNavigate(node)}
                      className={`flex items-center gap-2.5 pr-4 pl-2 py-1.5 rounded-xl transition-all duration-300 ${
                        i === breadcrumb.length - 1 
                          ? "bg-slate-900/5 text-slate-900 font-black ring-1 ring-slate-200" 
                          : "text-slate-400 hover:text-slate-700 hover:bg-slate-50 font-bold"
                      }`}
                    >
                      <img src={node.image} alt="" className="w-5.5 h-5.5 rounded-   border border-white shadow-sm p-0.5 bg-white" />
                      <span className="text-[10px] tracking-widest uppercase">{node.name}</span>
                    </button>
                    {i < breadcrumb.length - 1 && (
                      <span className="text-slate-300 text-[10px] px-1 font-black">/</span>
                    )}
                  </div>
                ))}
              </nav>
            )}
          </div>

          {/* Top-Right Info Badge - Inverted */}
          {/* <div className="flex items-center gap-8 bg-white/80 border border-white rounded-3xl pl-6 pr-3 py-2.5 backdrop-blur-xl shadow-md ring-1 ring-slate-200/20">
            <div className="text-right">
              <p className="text-[9px] font-black text-slate-900/20 uppercase tracking-[0.25em] mb-0.5">Focus View</p>
              <p className="text-slate-950 font-black text-sm tracking-widest uppercase">{currentRoot.name}</p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-xl shadow-inner ring-1 ring-slate-100">
              {isRootAtMain ? "👑" : "🌳"}
            </div>
          </div> */}
        </header>

        {/* 4. Tree Canvas Area - Full Screen Experience */}
        <div className="flex-1 relative z-10 w-full h-full min-h-0">
          <div className="absolute inset-0 flex items-center justify-center">
            
            {/* The Tree Visualization */}
            <div className="w-full h-full">
              <FamilyTree 
                currentRoot={currentRoot} 
                onNavigate={handleNavigate}
                animating={animating}
                setAnimating={setAnimating}
              />
            </div>

            {/* Hint Overlay - Redesigned for Light Theme */}
            {/* {isRootAtMain && (
              <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-4 px-8 py-5 bg-white/90 text-slate-900 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-slate-100 backdrop-blur-2xl animate-bounce z-40 transform-gpu cursor-default ring-1 ring-slate-200/50">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                  Click <span className="text-blue-600 font-black">Blue Nodes</span> to reveal descendants
                </p>
              </div>
            )} */}
          </div>
        </div>

      </main>
    </div>
  );
}
