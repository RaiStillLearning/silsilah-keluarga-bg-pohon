import FamilyTree from "@/components/FamilyTree";

export default function Home() {
  return (
    <div
      className="relative w-full h-screen flex items-center justify-center"
      style={{
        background:
          "radial-gradient(ellipse at 50% 70%, #d4b896 0%, #b8956a 40%, #8b6340 100%)",
      }}
    >
      {/* Subtle texture overlay */}
      <div
        style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />

      {/* Title */}
      <div
        style={{
          position: "absolute", top: 28, left: "50%",
          transform: "translateX(-50%)",
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: 22, fontWeight: 700,
          color: "rgba(255,255,255,0.92)",
          textShadow: "0 2px 12px rgba(0,0,0,0.35)",
          letterSpacing: "0.05em",
          whiteSpace: "nowrap",
          zIndex: 5,
        }}
      >
      </div>

      <FamilyTree />
    </div>
  );
}
