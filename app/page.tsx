import FamilyTree from "@/components/FamilyTree";

export default function Home() {
  return (
    <div className="relative w-full h-screen flex items-center justify-center bg-[#f5f5dc]">
      {/* 🌳 D3 Tree (SVG) handles both the background and zoomable cards */}
      <FamilyTree />
    </div>
  );
}
