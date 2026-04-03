"use client";
import React, { useEffect, useRef } from "react";
import { select, easeBackOut } from "d3";
import { 
  TreeNode, 
  familyData, 
  ANCESTORS, 
  FIXED_SLOTS, 
  ALL_EDGES, 
  flattenTree, 
  getSubtreeNames, 
  getDepthMap 
} from "@/constants/familyData";

// ── Props ────────────────────────────────────────────────────────────────────
interface FamilyTreeProps {
  currentRoot: TreeNode;
  onNavigate: (node: TreeNode) => void;
  animating: boolean;
  setAnimating: (animating: boolean) => void;
}

// ── Constants ─────────────────────────────────────────────────────────────────
const ANIM  = 400;
const R     = 32;
const IMG_W = 1208;
const IMG_H = 988;

export default function FamilyTree({ 
  currentRoot, 
  onNavigate, 
  animating, 
  setAnimating 
}: FamilyTreeProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRef       = useRef<SVGSVGElement | null>(null);
  const animRef      = useRef(animating);

  useEffect(() => { animRef.current = animating; }, [animating]);

  // ── Draw ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current || !svgRef.current) return;
    const W = containerRef.current.clientWidth;
    const H = containerRef.current.clientHeight;

    const svg = select(svgRef.current);
    svg.selectAll("*").remove();
    svg.attr("width", W).attr("height", H);

    // Defs
    const defs = svg.append("defs");
    
    // Drop Shadow
    const shad = defs.append("filter").attr("id", "sh");
    shad.append("feDropShadow").attr("dx",0).attr("dy",1.5).attr("stdDeviation",2)
      .attr("flood-color","rgba(0,0,0,0.1)");

    // Removed local blurred background and rect; handled globally by page.tsx.

    // 1. Main Sharp Tree Image
    svg.append("image")
      .attr("href", "/tree-bg2.png")
      .attr("width", W).attr("height", H).attr("x",0).attr("y",0)
      .attr("preserveAspectRatio","xMidYMid meet")
      .attr("opacity", 0.95);

    // Scaling helpers
    const scale  = Math.min(W / IMG_W, H / IMG_H);
    const iW     = IMG_W * scale;
    const iH     = IMG_H * scale;
    const offX   = (W - iW) / 2;
    const offY   = (H - iH) / 2;
    const toXY   = (xp: number, yp: number): [number, number] =>
      [offX + xp * iW, offY + yp * iH];

    // Visibility
    const isRootAtMain = currentRoot.name === familyData.name;
    const subNames     = getSubtreeNames(currentRoot);

    // Clip paths
    Object.keys(FIXED_SLOTS).forEach(name => {
      defs.append("clipPath").attr("id", `cp-${name.replace(/[\s.]/g,"_")}`)
        .append("circle").attr("r", R - 2);
    });

    // Content
    const g = svg.append("g").attr("class","tree-content").style("opacity","0");

    // ── Connections (Links) - Darker for Light Theme ────────────────────────────
    const visEdges = ALL_EDGES.filter(([a,b]) =>
      isRootAtMain ? true : subNames.has(a) && subNames.has(b)
    );
    visEdges.forEach(([pName, cName], i) => {
      const ps = FIXED_SLOTS[pName]; const cs = FIXED_SLOTS[cName];
      if (!ps || !cs) return;
      const [px,py] = toXY(...ps);
      const [cx,cy] = toXY(...cs);
      const my = (py + cy) / 2;
      g.append("path")
        .attr("fill","none")
        .attr("stroke","#78350f").attr("stroke-width",1.2) // Darker brown
        .attr("stroke-opacity",0).attr("stroke-linecap","round")
        .attr("d",`M${px},${py} C${px},${my} ${cx},${my} ${cx},${cy}`)
        .transition().delay(i*30 + ANIM*0.2).duration(ANIM*0.8)
        .attr("stroke-opacity", 0.28);
    });

    // ── Nodes ─────────────────────────────────────────────────────────────
    const toRender = [
      ...flattenTree(familyData).map(d => ({ data: d, isAnc: false })),
      ...(isRootAtMain ? ANCESTORS.map(d => ({ data: d as TreeNode, isAnc: true })) : []),
    ];

    toRender.forEach(({ data: nd, isAnc }, i) => {
      const slot = FIXED_SLOTS[nd.name];
      if (!slot) return;
      if (!isAnc && !subNames.has(nd.name)) return;

      const [nx, ny] = toXY(...slot);
      const isCurrentFocus = nd.name === currentRoot.name;
      const hasKids  = !isAnc && !!(nd.children?.length);
      const clipId   = `cp-${nd.name.replace(/[\s.]/g,"_")}`;

      const isGreen = i % 2 === 0;
      const ringCol  = isAnc ? "#b45309" // Warm gold/brown
        : isCurrentFocus  ? "#f59e0b" // Amber for active focus
        : isGreen     ? "#10b981" // Emerald green
        : "#3b82f6"; // Blue

      const glowCol = isCurrentFocus ? "rgba(245,158,11,0.15)"
        : isGreen ? "rgba(16,185,129,0.08)"
        : "rgba(59,130,246,0.08)";

      const nodeG = g.append("g")
        .attr("transform",`translate(${nx},${ny})`)
        .style("opacity",0)
        .style("cursor", hasKids && !isCurrentFocus ? "pointer" : "default");

      nodeG.transition()
        .delay(i * 45 + ANIM * 0.1)
        .duration(ANIM * 0.8)
        .style("opacity",1);

      // Glow effect - Subtle light shadows corresponding to ring color
      nodeG.append("circle").attr("r", R+5)
        .attr("fill", glowCol)
        .attr("stroke", ringCol).attr("stroke-opacity",0.2).attr("stroke-width",1);

      // White base circle
      nodeG.append("circle").attr("r", R+1.5).attr("fill","white").style("filter","url(#sh)");

      // Avatar
      nodeG.append("image")
        .attr("href", nd.image ?? "")
        .attr("x",-(R-2)).attr("y",-(R-2))
        .attr("width",(R-2)*2).attr("height",(R-2)*2)
        .attr("clip-path",`url(#${clipId})`)
        .attr("preserveAspectRatio","xMidYMid slice");

      // Outer ring
      nodeG.append("circle").attr("r",R)
        .attr("fill","none").attr("stroke",ringCol).attr("stroke-width",2.0);

      // Name banner - Refined for Contrast
      const bW=76, bH=16, bY=R+4;
      nodeG.append("rect")
        .attr("x",-bW/2).attr("y",bY)
        .attr("width",bW).attr("height",bH).attr("rx",8)
        .attr("fill","rgba(255,255,255,0.98)")
        .attr("stroke","rgba(15,23,42,0.05)").attr("stroke-width",1);
      
      nodeG.append("text")
        .attr("x",0).attr("y",bY+11.2).attr("text-anchor","middle")
        .attr("font-family","'Outfit', sans-serif")
        .attr("font-size","8.5px").attr("font-weight","900")
        .attr("fill","#0f172a").text(nd.name.toUpperCase());

      if (nd.birthYear) {
        // Pill capsule background for the year (ensures perfect contrast over tree background)
        const yW = 36, yH = 13, yY = bY + bH + 2;
        nodeG.append("rect")
          .attr("x", -yW/2).attr("y", yY)
          .attr("width", yW).attr("height", yH).attr("rx", 6)
          .attr("fill", "rgba(255,255,255,0.95)")
          .attr("stroke", "rgba(15,23,42,0.08)").attr("stroke-width", 1)
          .style("filter", "url(#sh)");

        // Crisp dark text inside the pill
        nodeG.append("text")
          .attr("x", 0).attr("y", yY + 9)
          .attr("text-anchor", "middle")
          .attr("font-family", "'Outfit', sans-serif")
          .attr("font-size", "7.5px")
          .attr("font-weight", "800")
          .attr("letter-spacing", "0.5px")
          .attr("fill", "#0f172a")
          .text(nd.birthYear);
      }

      // Root/Ancestor decorators
      if (isCurrentFocus && isRootAtMain) {
        nodeG.append("text").attr("x",R-2).attr("y",-(R-2)-1)
          .attr("text-anchor","middle").attr("font-size","10px").text("👑");
      }

      // Expand badge
      if (hasKids && !isCurrentFocus) {
        nodeG.append("circle").attr("cx",R-1).attr("cy",-(R-1))
          .attr("r",6.5).attr("fill","#2563eb")
          .attr("stroke","white").attr("stroke-width",1.2);
        nodeG.append("text").attr("x",R-1).attr("y",-(R-1)+3.5)
          .attr("text-anchor","middle")
          .attr("font-size","8.5px").attr("font-weight","900")
          .attr("fill","white").text("›");
      }

      if (isAnc) {
        nodeG.append("text").attr("x",R-2).attr("y",-(R-2))
          .attr("text-anchor","middle").attr("font-size","10px").text("🕌");
      }

      // Interactions
      if (hasKids && !isCurrentFocus) {
        nodeG
          .on("pointerenter", function() {
            select(this).raise().transition().duration(100).ease(easeBackOut)
              .attr("transform",`translate(${nx},${ny}) scale(1.08)`);
          })
          .on("pointerleave", function() {
            select(this).transition().duration(100)
              .attr("transform",`translate(${nx},${ny}) scale(1)`);
          })
          .on("click", function() {
            if (animRef.current) return;
            onNavigate(nd);
          });
      }
    });

    // Final fade
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (!svgRef.current) return;
      const el = svgRef.current.querySelector<SVGGElement>(".tree-content");
      if (el) { el.style.transition = `opacity ${ANIM}ms ease-out`; el.style.opacity = "1"; }
      setAnimating(false);
    }));
  }, [currentRoot]);

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden flex items-center justify-center">
      <svg ref={svgRef} className="w-full h-full block max-w-[1400px] max-h-[1000px] drop-shadow-sm" />
    </div>
  );
}
