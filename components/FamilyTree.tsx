"use client";

import { useEffect, useRef, useState } from "react";
import {
  select,
  hierarchy,
  tree,
  linkVertical,
  HierarchyPointLink,
  HierarchyPointNode,
} from "d3";

type TreeNode = {
  name: string;
  birthYear?: string;
  residence?: string;
  image?: string;
  children?: TreeNode[];
};

// ── Data keluarga lengkap ──────────────────────────────────────────────────
const familyData: TreeNode = {
  name: "Cadera",
  birthYear: "1940",
  residence: "Jakarta",
  image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lotnok",
  children: [
    {
      name: "Ramli",
      birthYear: "1965",
      residence: "Bandung",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ramli",
      children: [
        {
          name: "Dian",
          birthYear: "1990",
          residence: "Surabaya",
          image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dian",
          children: [
            {
              name: "Zahra",
              birthYear: "2015",
              residence: "Surabaya",
              image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Zahra",
            },
          ],
        },
        {
          name: "Budi",
          birthYear: "1993",
          residence: "Medan",
          image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Budi",
        },
      ],
    },
    {
      name: "Sari",
      birthYear: "1968",
      residence: "Yogyakarta",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sari",
      children: [
        {
          name: "Andi",
          birthYear: "1992",
          residence: "Yogyakarta",
          image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Andi",
        },
        {
          name: "Rina",
          birthYear: "1995",
          residence: "Bali",
          image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rina",
          children: [
            {
              name: "Kevin",
              birthYear: "2018",
              residence: "Bali",
              image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kevin",
            },
            {
              name: "Lila",
              birthYear: "2020",
              residence: "Bali",
              image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lila",
            },
          ],
        },
      ],
    },
    {
      name: "Hendra",
      birthYear: "1972",
      residence: "Makassar",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Hendra",
      children: [
        {
          name: "Tono",
          birthYear: "1998",
          residence: "Makassar",
          image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tono",
        },
      ],
    },
  ],
};

// Build breadcrumb path to a given node name
function findPath(
  root: TreeNode,
  target: string,
  path: TreeNode[] = []
): TreeNode[] | null {
  const newPath = [...path, root];
  if (root.name === target) return newPath;
  for (const child of root.children ?? []) {
    const result = findPath(child, target, newPath);
    if (result) return result;
  }
  return null;
}

const ANIM_DURATION = 380; // ms

export default function FamilyTree() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // ── React state (for rendering) ──────────────────────────────────────────
  const [currentRoot, setCurrentRoot] = useState<TreeNode>(familyData);
  const [breadcrumb, setBreadcrumb] = useState<TreeNode[]>([familyData]);
  const [animating, setAnimating] = useState(false);

  // ── Refs that mirror state — NEVER stale inside event handlers ───────────
  // This is the core fix: the click handler reads from refs, NOT from
  // the React state closure which can be captured at the wrong moment.
  const animatingRef = useRef(false);
  const currentRootRef = useRef<TreeNode>(familyData);

  // Keep refs in sync with state after every render
  animatingRef.current = animating;
  currentRootRef.current = currentRoot;

  // ── Core navigate function — reads from refs, safe from stale closures ───
  // This is NOT a useCallback; being a plain function is intentional so it
  // always uses the latest ref values without needing dependency arrays.
  const doNavigate = (node: TreeNode, crumb: TreeNode[]) => {
    // Guard: use ref so we always read the true live value
    if (animatingRef.current) return;
    if (node.name === currentRootRef.current.name) return;

    // Lock immediately via ref (synchronous) and state (async re-render)
    animatingRef.current = true;
    setAnimating(true);

    // Phase 1: fade-out current tree
    const svg = select(svgRef.current!);
    svg
      .selectAll<SVGGElement, unknown>(".tree-content")
      .transition()
      .duration(ANIM_DURATION)
      .style("opacity", "0")
      .on("end", () => {
        // Phase 2: update React state → triggers draw effect
        setCurrentRoot(node);
        setBreadcrumb(crumb);
        // Also update the ref synchronously so subsequent
        // guard checks are correct before React re-renders
        currentRootRef.current = node;
      });
  };

  // ── Draw effect — runs whenever currentRoot changes ─────────────────────
  useEffect(() => {
    if (!containerRef.current || !svgRef.current) return;

    const width  = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const svg = select(svgRef.current);
    svg.selectAll("*").remove();
    svg.attr("width", width).attr("height", height);

    // ── SVG filters ──────────────────────────────────────────────────────
    const defs = svg.append("defs");
    defs
      .append("filter")
      .attr("id", "blur-bg")
      .append("feGaussianBlur")
      .attr("stdDeviation", "2.5");

    // ── Background image ─────────────────────────────────────────────────
    svg
      .append("image")
      .attr("href", "/tree-bg.png")
      .attr("width", width)
      .attr("height", height)
      .attr("x", 0)
      .attr("y", 0)
      .attr("preserveAspectRatio", "xMidYMid slice")
      .attr("opacity", 0.55)
      .style("filter", "url(#blur-bg)");

    // ── Canopy bounding box ──────────────────────────────────────────────
    const canopyLeft   = width  * 0.12;
    const canopyRight  = width  * 0.88;
    const canopyTop    = height * 0.06;
    const canopyBottom = height * 0.72;
    const canopyW = canopyRight - canopyLeft;
    const canopyH = canopyBottom - canopyTop;

    const nodeWidth  = 210;
    const nodeHeight = 108;

    // ── D3 tree layout ───────────────────────────────────────────────────
    const root = hierarchy<TreeNode>(currentRoot);
    const treeLayout = tree<TreeNode>().size([
      canopyW - nodeWidth,
      canopyH - nodeHeight,
    ]);
    treeLayout(root);

    // ── Content group (starts invisible for fade-in) ─────────────────────
    const g = svg
      .append("g")
      .attr("class", "tree-content")
      .attr(
        "transform",
        `translate(${canopyLeft + nodeWidth / 2}, ${canopyTop + nodeHeight / 2})`
      )
      .style("opacity", "0");

    // ── Links ────────────────────────────────────────────────────────────
    const links = root.links() as HierarchyPointLink<TreeNode>[];
    const linkGen = linkVertical<
      HierarchyPointLink<TreeNode>,
      HierarchyPointNode<TreeNode>
    >()
      .x((d) => d.x)
      .y((d) => d.y);

    g.selectAll(".link")
      .data(links)
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("fill", "none")
      .attr("stroke", "#6B3A1F")
      .attr("stroke-width", 3.5)
      .attr("stroke-opacity", 0)
      .attr("stroke-linecap", "round")
      .attr("d", linkGen)
      .transition()
      .delay((_d, i) => i * 60 + ANIM_DURATION * 0.25)
      .duration(ANIM_DURATION * 0.7)
      .attr("stroke-opacity", 0.8);

    // ── Nodes ────────────────────────────────────────────────────────────
    const descendants = root.descendants() as HierarchyPointNode<TreeNode>[];

    const node = g
      .selectAll(".node")
      .data(descendants)
      .enter()
      .append("g")
      .attr("class", "node")
      .attr(
        "transform",
        (d) =>
          `translate(${(d.x || 0) - nodeWidth / 2}, ${
            (d.y || 0) - nodeHeight / 2
          })`
      )
      .style("opacity", 0);

    node
      .transition()
      .delay((_d, i) => i * 70 + ANIM_DURATION * 0.15)
      .duration(ANIM_DURATION * 0.8)
      .style("opacity", 1);

    const fo = node
      .append("foreignObject")
      .attr("width", nodeWidth)
      .attr("height", nodeHeight)
      .style("overflow", "visible");

    fo.append("xhtml:div")
      .style("width", `${nodeWidth}px`)
      .style("height", `${nodeHeight}px`)
      .html((d) => {
        const hasChildren = d.data.children && d.data.children.length > 0;
        const isRoot = d.depth === 0;
        const ringColor = isRoot
          ? "rgba(107,58,31,0.55)"
          : hasChildren
          ? "rgba(59,130,246,0.55)"
          : "rgba(107,58,31,0.30)";
        const glowColor = isRoot
          ? "rgba(107,58,31,0.18)"
          : hasChildren
          ? "rgba(59,130,246,0.13)"
          : "transparent";
        const badge = isRoot
          ? `<span style="
              margin-top:3px;font-size:9px;font-weight:700;letter-spacing:.5px;
              color:#92400e;background:rgba(254,243,199,0.95);
              padding:2px 6px;border-radius:20px;width:fit-content;
              border:1px solid rgba(180,120,30,0.3);
            ">👑 ROOT</span>`
          : hasChildren
          ? `<span style="
              margin-top:3px;font-size:9px;font-weight:700;letter-spacing:.5px;
              color:#1e40af;background:rgba(219,234,254,0.95);
              padding:2px 6px;border-radius:20px;width:fit-content;
              border:1px solid rgba(59,130,246,0.3);
            ">🔍 Klik untuk masuk</span>`
          : "";

        return `
          <div
            data-node="${d.data.name}"
            style="
              display:flex;align-items:center;gap:10px;padding:10px;
              width:${nodeWidth}px;height:${nodeHeight}px;box-sizing:border-box;
              background:rgba(255,255,255,0.88);
              backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);
              border:1.5px solid rgba(255,255,255,0.80);
              border-radius:18px;
              box-shadow:0 4px 22px rgba(0,0,0,0.18),0 0 0 2px ${glowColor};
              transition:transform .18s cubic-bezier(.34,1.56,.64,1),box-shadow .18s;
              cursor:${hasChildren && !isRoot ? "pointer" : "default"};
              font-family:system-ui,sans-serif;
              outline:2px solid ${hasChildren && !isRoot ? "rgba(59,130,246,0.25)" : "transparent"};
            "
            onmouseenter="
              this.style.transform='scale(1.07)';
              this.style.boxShadow='0 10px 36px rgba(0,0,0,0.28),0 0 0 2px ${ringColor}';
            "
            onmouseleave="
              this.style.transform='scale(1)';
              this.style.boxShadow='0 4px 22px rgba(0,0,0,0.18),0 0 0 2px ${glowColor}';
            "
          >
            <img
              src="${d.data.image}"
              style="
                width:56px;height:56px;border-radius:50%;flex-shrink:0;
                border:2.5px solid ${ringColor};
                object-fit:cover;background:#e5e7eb;
                box-shadow:0 2px 8px rgba(0,0,0,0.14);
              "
              alt="${d.data.name}"
            />
            <div style="display:flex;flex-direction:column;min-width:0;flex:1;overflow:hidden;">
              <span style="
                font-size:14px;font-weight:700;color:#1f2937;
                white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
              ">${d.data.name}</span>
              ${
                d.data.birthYear
                  ? `<span style="margin-top:3px;font-size:10px;font-weight:600;color:#92400e;
                      background:rgba(254,243,199,0.9);padding:2px 6px;border-radius:4px;width:fit-content;">
                      🎂 ${d.data.birthYear}</span>`
                  : ""
              }
              ${
                d.data.residence
                  ? `<span style="margin-top:2px;font-size:10px;font-weight:500;color:#065f46;
                      white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                      📍 ${d.data.residence}</span>`
                  : ""
              }
              ${badge}
            </div>
          </div>`;
      });

    // ── Fade-in content group ────────────────────────────────────────────
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!svgRef.current) return;
        const contentEl =
          svgRef.current.querySelector<SVGGElement>(".tree-content");
        if (contentEl) {
          contentEl.style.transition = `opacity ${ANIM_DURATION}ms cubic-bezier(.4,0,.2,1)`;
          contentEl.style.opacity = "1";
        }
        // Unlock: reset BOTH ref and state so next click is immediately allowed
        animatingRef.current = false;
        setAnimating(false);
      });
    });

    // ── Click handler — reads from REFS, never stale ─────────────────────
    const svgEl = svgRef.current!;
    const handleClick = (e: MouseEvent) => {
      // Guard via ref — always the live value, no stale closure issue
      if (animatingRef.current) return;

      const card = (e.target as HTMLElement).closest<HTMLElement>(
        "[data-node]"
      );
      if (!card) return;
      const nodeName = card.getAttribute("data-node");
      if (!nodeName) return;

      // Walk subtree of the CURRENT root (via ref)
      const findNode = (n: TreeNode): TreeNode | null => {
        if (n.name === nodeName) return n;
        for (const c of n.children ?? []) {
          const res = findNode(c);
          if (res) return res;
        }
        return null;
      };

      // Use currentRootRef so we always search the live tree
      const clicked = findNode(currentRootRef.current);
      if (!clicked || !clicked.children?.length) return;

      // Don't navigate into the root card itself
      const hier = hierarchy(currentRootRef.current);
      const clickedHier = hier
        .descendants()
        .find((d) => d.data.name === nodeName);
      if (!clickedHier || clickedHier.depth === 0) return;

      const globalPath = findPath(familyData, nodeName) ?? [];
      doNavigate(clicked, globalPath);
    };

    svgEl.addEventListener("click", handleClick);
    return () => {
      svgEl.removeEventListener("click", handleClick);
    };
  // Only re-run when the displayed root changes, NOT when animating changes.
  // All animating guards now go through animatingRef (the ref), not state.
  }, [currentRoot]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Breadcrumb back navigation ───────────────────────────────────────────
  const goToBreadcrumb = (node: TreeNode, index: number) => {
    if (node.name === currentRootRef.current.name) return;
    const newCrumb = breadcrumb.slice(0, index + 1);
    doNavigate(node, newCrumb);
  };

  return (
    <div ref={containerRef} className="w-full h-full overflow-hidden relative">
      {/* ── Breadcrumb nav ── */}
      {breadcrumb.length > 1 && (
        <nav
          style={{
            position: "absolute",
            top: 14,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "rgba(255,255,255,0.82)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            borderRadius: 40,
            padding: "6px 16px",
            boxShadow: "0 4px 24px rgba(0,0,0,0.14)",
            border: "1.5px solid rgba(255,255,255,0.85)",
            fontFamily: "system-ui,sans-serif",
            fontSize: 13,
            fontWeight: 600,
            userSelect: "none",
            whiteSpace: "nowrap",
            maxWidth: "90vw",
            overflowX: "auto",
          }}
        >
          {breadcrumb.map((node, i) => (
            <span
              key={node.name}
              style={{ display: "flex", alignItems: "center", gap: 6 }}
            >
              <button
                onClick={() => goToBreadcrumb(node, i)}
                style={{
                  background:
                    i === breadcrumb.length - 1
                      ? "rgba(107,58,31,0.12)"
                      : "transparent",
                  border: "none",
                  borderRadius: 20,
                  padding: "3px 10px",
                  cursor:
                    i === breadcrumb.length - 1 ? "default" : "pointer",
                  color:
                    i === breadcrumb.length - 1 ? "#92400e" : "#374151",
                  fontWeight: i === breadcrumb.length - 1 ? 700 : 500,
                  fontSize: 13,
                  transition: "background .15s, color .15s",
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                }}
                onMouseEnter={(e) => {
                  if (i < breadcrumb.length - 1)
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "rgba(59,130,246,0.1)";
                }}
                onMouseLeave={(e) => {
                  if (i < breadcrumb.length - 1)
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "transparent";
                }}
              >
                <img
                  src={node.image}
                  alt={node.name}
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
                {node.name}
              </button>
              {i < breadcrumb.length - 1 && (
                <span style={{ color: "#9ca3af", fontSize: 12 }}>›</span>
              )}
            </span>
          ))}
        </nav>
      )}

      {/* ── Hint label ── */}
      {currentRoot === familyData && (
        <div
          style={{
            position: "absolute",
            bottom: 28,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10,
            background: "rgba(255,255,255,0.75)",
            backdropFilter: "blur(12px)",
            borderRadius: 40,
            padding: "6px 18px",
            fontSize: 12,
            fontWeight: 500,
            color: "#6b7280",
            fontFamily: "system-ui,sans-serif",
            boxShadow: "0 2px 12px rgba(0,0,0,0.10)",
            border: "1px solid rgba(255,255,255,0.8)",
            animation: "pulse-hint 2.5s ease-in-out infinite",
            whiteSpace: "nowrap",
          }}
        >
          💡 Klik kartu biru untuk melihat keturunannya
        </div>
      )}

      <svg ref={svgRef} className="w-full h-full block" />

      <style>{`
        @keyframes pulse-hint {
          0%, 100% { opacity: 0.7; transform: translateX(-50%) translateY(0); }
          50% { opacity: 1; transform: translateX(-50%) translateY(-3px); }
        }
      `}</style>
    </div>
  );
}
