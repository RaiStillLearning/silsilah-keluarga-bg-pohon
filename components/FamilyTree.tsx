"use client";
import { useEffect, useRef, useState } from "react";
import { select } from "d3";

// ── Types ────────────────────────────────────────────────────────────────────
type TreeNode = {
  name: string;
  birthYear?: string;
  residence?: string;
  image?: string;
  children?: TreeNode[];
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function flattenTree(n: TreeNode): TreeNode[] {
  return [n, ...(n.children ?? []).flatMap(flattenTree)];
}
function getSubtreeNames(n: TreeNode): Set<string> {
  const s = new Set<string>([n.name]);
  (n.children ?? []).forEach(c => getSubtreeNames(c).forEach(x => s.add(x)));
  return s;
}
function getDepthMap(n: TreeNode, d = 0): Record<string, number> {
  const m: Record<string, number> = { [n.name]: d };
  (n.children ?? []).forEach(c => Object.assign(m, getDepthMap(c, d + 1)));
  return m;
}
function findPath(root: TreeNode, target: string, path: TreeNode[] = []): TreeNode[] | null {
  const p = [...path, root];
  if (root.name === target) return p;
  for (const c of root.children ?? []) { const r = findPath(c, target, p); if (r) return r; }
  return null;
}

// ── Family data (20 tree members) ────────────────────────────────────────────
const familyData: TreeNode = {
  name: "Cadera", birthYear: "1940", residence: "Jakarta",
  image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Cadera",
  children: [
    {
      name: "Ramli", birthYear: "1965", residence: "Bandung",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ramli",
      children: [
        {
          name: "Dian", birthYear: "1990", residence: "Surabaya",
          image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dian",
          children: [{
            name: "Zahra", birthYear: "2015", residence: "Surabaya",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Zahra",
            children: [
              { name: "Dinda", birthYear: "2033", residence: "Surabaya", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dinda33" },
              { name: "Ahmad", birthYear: "2035", residence: "Surabaya", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmad35" },
              { name: "Putri", birthYear: "2036", residence: "Surabaya", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Putri36" },
            ],
          }],
        },
        { name: "Budi", birthYear: "1993", residence: "Medan", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Budi" },
      ],
    },
    {
      name: "Sari", birthYear: "1968", residence: "Yogyakarta",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sari",
      children: [
        { name: "Andi", birthYear: "1992", residence: "Yogyakarta", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Andi" },
        {
          name: "Rina", birthYear: "1995", residence: "Bali",
          image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rina",
          children: [
            {
              name: "Kevin", birthYear: "2018", residence: "Bali",
              image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kevin",
              children: [
                { name: "Rafi", birthYear: "2038", residence: "Bali", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rafi38" },
                { name: "Nisa", birthYear: "2040", residence: "Bali", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nisa40" },
              ],
            },
            {
              name: "Lila", birthYear: "2020", residence: "Bali",
              image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lila",
              children: [
                { name: "Ariel", birthYear: "2039", residence: "Bali", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ariel39" },
              ],
            },
          ],
        },
      ],
    },
    {
      name: "Hendra", birthYear: "1972", residence: "Makassar",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Hendra",
      children: [{
        name: "Tono", birthYear: "1998", residence: "Makassar",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tono",
        children: [
          { name: "Bagas", birthYear: "2025", residence: "Makassar", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bagas25" },
          { name: "Cinta", birthYear: "2027", residence: "Makassar", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Cinta27" },
        ],
      }],
    },
  ],
};

// ── 2 standalone ancestors (shown at bottom row, no parent–child edges) ───────
const ANCESTORS = [
  { name: "H. Hamid",     birthYear: "1910", residence: "Jakarta",  image: "https://api.dicebear.com/7.x/avataaars/svg?seed=HHamid10" },
  { name: "Hj. Fatimah",  birthYear: "1913", residence: "Jakarta",  image: "https://api.dicebear.com/7.x/avataaars/svg?seed=HjFatimah" },
];

// ── Fixed slot positions: exact circle centers detected from tree-bg.png ──────
// Image: 1240 × 1627 px. Values = (xPct, yPct) of image.
// [0](.138,.096) [1](.312,.071) [2](.428,.135) [3](.541,.071) [4](.655,.121)
// [5](.769,.059) [6](.851,.127) [7](.158,.247) [8](.246,.164) [9](.395,.234)
// [10](.581,.220) [11](.822,.233) [12](.143,.411) [13](.414,.374) [14](.585,.364)
// [15](.840,.400) [16](.148,.544) [17](.480,.495) [18](.813,.590)
// [19](.178,.689) [20](.491,.703) [21](.787,.726)
const FIXED_SLOTS: Record<string, [number, number]> = {
  // Gen 4 – top row
  Dinda:        [0.138, 0.096],
  Ahmad:        [0.312, 0.071],
  Rafi:         [0.428, 0.135],
  Nisa:         [0.541, 0.071],
  Ariel:        [0.655, 0.121],
  Bagas:        [0.769, 0.059],
  Cinta:        [0.851, 0.127],
  // Gen 3 – upper-mid
  Zahra:        [0.158, 0.247],
  Putri:        [0.246, 0.164],
  Kevin:        [0.395, 0.234],
  Lila:         [0.581, 0.220],
  Tono:         [0.822, 0.233],
  // Gen 2 – middle
  Dian:         [0.143, 0.411],
  Budi:         [0.414, 0.374],
  Andi:         [0.585, 0.364],
  Rina:         [0.840, 0.400],
  // Gen 1 – lower-mid
  Ramli:        [0.148, 0.544],
  Sari:         [0.480, 0.495],
  Hendra:       [0.813, 0.590],
  // Gen 0 + ancestors – bottom row
  "H. Hamid":   [0.178, 0.689],
  Cadera:       [0.491, 0.703],
  "Hj. Fatimah":[0.787, 0.726],
};

// All parent→child edges in the family tree
const ALL_EDGES: [string, string][] = [
  ["Cadera","Ramli"],["Cadera","Sari"],["Cadera","Hendra"],
  ["Ramli","Dian"],["Ramli","Budi"],
  ["Sari","Andi"],["Sari","Rina"],
  ["Hendra","Tono"],
  ["Dian","Zahra"],
  ["Rina","Kevin"],["Rina","Lila"],
  ["Zahra","Dinda"],["Zahra","Ahmad"],["Zahra","Putri"],
  ["Kevin","Rafi"],["Kevin","Nisa"],
  ["Lila","Ariel"],
  ["Tono","Bagas"],["Tono","Cinta"],
];

// ── Constants ─────────────────────────────────────────────────────────────────
const ANIM  = 360;
const R     = 36;         // node radius px
const IMG_W = 1240;
const IMG_H = 1627;

// ── Component ─────────────────────────────────────────────────────────────────
export default function FamilyTree() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRef       = useRef<SVGSVGElement | null>(null);

  const [currentRoot, setCurrentRoot] = useState<TreeNode>(familyData);
  const [breadcrumb,  setBreadcrumb]  = useState<TreeNode[]>([familyData]);
  const [animating,   setAnimating]   = useState(false);

  const animRef    = useRef(false);
  const rootRef    = useRef<TreeNode>(familyData);
  animRef.current  = animating;
  rootRef.current  = currentRoot;

  const doNavigate = (node: TreeNode, crumb: TreeNode[]) => {
    if (animRef.current) return;
    if (node.name === rootRef.current.name) return;
    animRef.current = true;
    setAnimating(true);
    select(svgRef.current!)
      .selectAll<SVGGElement, unknown>(".tree-content")
      .transition().duration(ANIM).style("opacity", "0")
      .on("end", () => { setCurrentRoot(node); setBreadcrumb(crumb); rootRef.current = node; });
  };

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
    const shad = defs.append("filter").attr("id", "sh");
    shad.append("feDropShadow").attr("dx",0).attr("dy",2).attr("stdDeviation",3)
      .attr("flood-color","rgba(0,0,0,0.28)");

    // Background – full image, no crop
    svg.append("image")
      .attr("href", "/tree-bg.png")
      .attr("width", W).attr("height", H).attr("x",0).attr("y",0)
      .attr("preserveAspectRatio","xMidYMid meet")
      .attr("opacity", 0.88);

    // Convert image% → SVG px (with "meet" letterboxing)
    const scale  = Math.min(W / IMG_W, H / IMG_H);
    const iW     = IMG_W * scale;
    const iH     = IMG_H * scale;
    const offX   = (W - iW) / 2;
    const offY   = (H - iH) / 2;
    const toXY   = (xp: number, yp: number): [number, number] =>
      [offX + xp * iW, offY + yp * iH];

    // Which nodes are visible?
    const isRoot    = currentRoot.name === familyData.name;
    const subNames  = getSubtreeNames(currentRoot);
    const depthMap  = getDepthMap(currentRoot); // depth relative to currentRoot

    // Clip paths
    const allNames = Object.keys(FIXED_SLOTS);
    allNames.forEach(name => {
      defs.append("clipPath").attr("id", `cp-${name.replace(/[\s.]/g,"_")}`)
        .append("circle").attr("r", R - 2);
    });

    // Content group
    const g = svg.append("g").attr("class","tree-content").style("opacity","0");

    // ── Edges ─────────────────────────────────────────────────────────────
    const visEdges = ALL_EDGES.filter(([a,b]) =>
      isRoot ? true : subNames.has(a) && subNames.has(b)
    );
    visEdges.forEach(([pName, cName], i) => {
      const ps = FIXED_SLOTS[pName]; const cs = FIXED_SLOTS[cName];
      if (!ps || !cs) return;
      const [px,py] = toXY(...ps);
      const [cx,cy] = toXY(...cs);
      const my = (py + cy) / 2;
      g.append("path")
        .attr("fill","none")
        .attr("stroke","#7a4020").attr("stroke-width",1.8)
        .attr("stroke-opacity",0).attr("stroke-linecap","round")
        .attr("d",`M${px},${py} C${px},${my} ${cx},${my} ${cx},${cy}`)
        .transition().delay(i*40 + ANIM*0.2).duration(ANIM*0.8)
        .attr("stroke-opacity", 0.6);
    });

    // ── Nodes ─────────────────────────────────────────────────────────────
    // family members
    const familyMembers = flattenTree(familyData);
    const toRender: { data: TreeNode; isAnc: boolean }[] = [
      ...familyMembers.map(d => ({ data: d, isAnc: false })),
      ...(isRoot ? ANCESTORS.map(d => ({ data: d as TreeNode, isAnc: true })) : []),
    ];

    toRender.forEach(({ data: nd, isAnc }, i) => {
      const slot = FIXED_SLOTS[nd.name];
      if (!slot) return;
      // In sub-tree view, only show sub-tree members
      if (!isAnc && !subNames.has(nd.name)) return;

      const [nx, ny] = toXY(...slot);
      const depth    = isAnc ? -1 : (depthMap[nd.name] ?? 0);
      const isRootNode = nd.name === currentRoot.name;
      const hasKids  = !isAnc && !!(nd.children?.length);
      const clipId   = `cp-${nd.name.replace(/[\s.]/g,"_")}`;

      const ringCol  = isAnc ? "#a0826d"
        : isRootNode  ? "#78350f"
        : hasKids     ? "#3b82f6"
        : "#9ca3af";

      const nodeG = g.append("g")
        .attr("transform",`translate(${nx},${ny})`)
        .style("opacity",0)
        .style("cursor", hasKids && !isRootNode ? "pointer" : "default");

      nodeG.transition()
        .delay(i * 55 + ANIM * 0.1)
        .duration(ANIM * 0.85)
        .style("opacity",1);

      // Glow
      nodeG.append("circle").attr("r", R+7)
        .attr("fill", isAnc ? "rgba(160,130,109,0.10)" : isRootNode ? "rgba(120,53,15,0.15)" : hasKids ? "rgba(59,130,246,0.13)" : "rgba(150,150,150,0.07)")
        .attr("stroke", ringCol).attr("stroke-opacity",0.32).attr("stroke-width",1.5);

      // White base
      nodeG.append("circle").attr("r", R+2).attr("fill","white").style("filter","url(#sh)");

      // Photo
      nodeG.append("image")
        .attr("href", nd.image ?? "")
        .attr("x",-(R-2)).attr("y",-(R-2))
        .attr("width",(R-2)*2).attr("height",(R-2)*2)
        .attr("clip-path",`url(#${clipId})`)
        .attr("preserveAspectRatio","xMidYMid slice");

      // Border
      nodeG.append("circle").attr("r",R)
        .attr("fill","none").attr("stroke",ringCol).attr("stroke-width",2.8);

      // Name banner
      const bW=88, bH=19, bY=R+5;
      nodeG.append("rect")
        .attr("x",-bW/2).attr("y",bY)
        .attr("width",bW).attr("height",bH).attr("rx",9)
        .attr("fill","rgba(254,243,199,0.96)")
        .attr("stroke","rgba(161,98,7,0.42)").attr("stroke-width",1);
      nodeG.append("text")
        .attr("x",0).attr("y",bY+12.5).attr("text-anchor","middle")
        .attr("font-family","system-ui,sans-serif")
        .attr("font-size","10.5px").attr("font-weight","700")
        .attr("fill","#78350f").text(nd.name);

      // Birth year
      if (nd.birthYear) {
        nodeG.append("text")
          .attr("x",0).attr("y",bY+bH+11).attr("text-anchor","middle")
          .attr("font-family","system-ui,sans-serif")
          .attr("font-size","9px").attr("font-weight","500")
          .attr("fill","#6b7280").text(`🎂 ${nd.birthYear}`);
      }

      // Crown for root
      if (isRootNode) {
        nodeG.append("text").attr("x",R-2).attr("y",-(R-2))
          .attr("text-anchor","middle").attr("font-size","13px").text("👑");
      }

      // Blue expand badge
      if (hasKids && !isRootNode) {
        nodeG.append("circle").attr("cx",R-2).attr("cy",-(R-2))
          .attr("r",8).attr("fill","#3b82f6")
          .attr("stroke","white").attr("stroke-width",2);
        nodeG.append("text").attr("x",R-2).attr("y",-(R-2)+4)
          .attr("text-anchor","middle")
          .attr("font-size","10px").attr("font-weight","700")
          .attr("fill","white").text("›");
      }

      // Ancestor label
      if (isAnc) {
        nodeG.append("text").attr("x",R-2).attr("y",-(R-2))
          .attr("text-anchor","middle").attr("font-size","12px").text("🕌");
      }

      // Hover + click
      if (hasKids && !isRootNode) {
        nodeG
          .on("pointerenter", function() {
            select(this).raise().transition().duration(100)
              .attr("transform",`translate(${nx},${ny}) scale(1.10)`);
          })
          .on("pointerleave", function() {
            select(this).transition().duration(100)
              .attr("transform",`translate(${nx},${ny}) scale(1)`);
          })
          .on("click", function() {
            if (animRef.current) return;
            const path = findPath(familyData, nd.name) ?? [];
            doNavigate(nd, path);
          });
      }

      void depth;
    });

    // Fade in
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (!svgRef.current) return;
      const el = svgRef.current.querySelector<SVGGElement>(".tree-content");
      if (el) { el.style.transition = `opacity ${ANIM}ms cubic-bezier(.4,0,.2,1)`; el.style.opacity = "1"; }
      animRef.current = false;
      setAnimating(false);
    }));
  }, [currentRoot]); // eslint-disable-line react-hooks/exhaustive-deps

  const goToBreadcrumb = (node: TreeNode, i: number) => {
    if (node.name === rootRef.current.name) return;
    doNavigate(node, breadcrumb.slice(0, i + 1));
  };

  return (
    <div ref={containerRef} className="relative overflow-hidden"
      style={{
        height: "min(92vh, 860px)",
        width:  "calc(min(92vh, 860px) * 0.762)",
        borderRadius: 20, flexShrink: 0,
        boxShadow: "0 24px 64px rgba(0,0,0,0.38), 0 6px 24px rgba(0,0,0,0.20)",
        background: "#f5ede0",
      }}
    >
      {/* Breadcrumb */}
      {breadcrumb.length > 1 && (
        <nav style={{
          position:"absolute", top:12, left:"50%", transform:"translateX(-50%)",
          zIndex:10, display:"flex", alignItems:"center", gap:5,
          background:"rgba(255,255,255,0.90)", backdropFilter:"blur(16px)",
          WebkitBackdropFilter:"blur(16px)", borderRadius:40,
          padding:"5px 14px", boxShadow:"0 4px 20px rgba(0,0,0,0.15)",
          border:"1.5px solid rgba(255,255,255,0.9)",
          fontFamily:"system-ui,sans-serif", fontSize:12, fontWeight:600,
          userSelect:"none", whiteSpace:"nowrap", maxWidth:"88%", overflowX:"auto",
        }}>
          {breadcrumb.map((node, i) => (
            <span key={node.name} style={{display:"flex",alignItems:"center",gap:5}}>
              <button onClick={() => goToBreadcrumb(node, i)} style={{
                background: i===breadcrumb.length-1 ? "rgba(107,58,31,0.12)" : "transparent",
                border:"none", borderRadius:20, padding:"3px 9px",
                cursor: i===breadcrumb.length-1 ? "default" : "pointer",
                color: i===breadcrumb.length-1 ? "#92400e" : "#374151",
                fontWeight: i===breadcrumb.length-1 ? 700 : 500, fontSize:12,
                display:"flex", alignItems:"center", gap:5,
              }}>
                <img src={node.image} alt={node.name}
                  style={{width:18,height:18,borderRadius:"50%",objectFit:"cover"}} />
                {node.name}
              </button>
              {i < breadcrumb.length-1 &&
                <span style={{color:"#9ca3af",fontSize:11}}>›</span>}
            </span>
          ))}
        </nav>
      )}

      {/* Hint */}
      {currentRoot === familyData && (
        <div style={{
          position:"absolute", bottom:18, left:"50%", transform:"translateX(-50%)",
          zIndex:10, background:"rgba(255,255,255,0.80)", backdropFilter:"blur(10px)",
          borderRadius:40, padding:"5px 16px", fontSize:11, fontWeight:500,
          color:"#6b7280", fontFamily:"system-ui,sans-serif",
          boxShadow:"0 2px 12px rgba(0,0,0,0.10)",
          border:"1px solid rgba(255,255,255,0.8)",
          animation:"pulse-hint 2.5s ease-in-out infinite", whiteSpace:"nowrap",
        }}>
          💡 Klik lingkaran biru untuk melihat cabang keturunan
        </div>
      )}

      <svg ref={svgRef} className="w-full h-full block" />

      <style>{`
        @keyframes pulse-hint {
          0%,100%{opacity:.7;transform:translateX(-50%) translateY(0)}
          50%{opacity:1;transform:translateX(-50%) translateY(-3px)}
        }
      `}</style>
    </div>
  );
}
