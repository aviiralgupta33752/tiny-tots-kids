import { useRef, useState } from "react";

const COLORS = [
  "#ff6fa0","#ff9f43","#ffd166","#06d6a0","#118ab2","#a29bfe",
  "#fd79a8","#00cec9","#e17055","#55efc4","#fdcb6e","#6c5ce7",
  "#ffffff","#dfe6e9","#b2bec3","#636e72","#2d3436","#000000",
];

const IMAGES: { name: string; paths: string[] }[] = [
  {
    name: "Cat 🐱",
    paths: [
      "M 150 300 Q 150 200 200 150 Q 250 100 300 150 Q 350 100 400 150 Q 450 200 450 300 Q 450 380 300 400 Q 150 380 150 300 Z",
      "M 200 150 L 170 80 L 230 130 Z",
      "M 400 150 L 430 80 L 370 130 Z",
      "M 260 220 Q 300 210 340 220",
      "M 270 260 Q 300 280 330 260",
      "M 300 240 L 300 260",
    ],
  },
  {
    name: "Star ⭐",
    paths: [
      "M 300 80 L 340 200 L 460 200 L 365 270 L 400 390 L 300 320 L 200 390 L 235 270 L 140 200 L 260 200 Z",
    ],
  },
  {
    name: "House 🏠",
    paths: [
      "M 150 300 L 150 450 L 450 450 L 450 300 Z",
      "M 120 310 L 300 150 L 480 310 Z",
      "M 250 450 L 250 350 L 350 350 L 350 450 Z",
      "M 170 330 L 230 330 L 230 390 L 170 390 Z",
    ],
  },
  {
    name: "Sun ☀️",
    paths: [
      "M 300 300 m -80 0 a 80 80 0 1 0 160 0 a 80 80 0 1 0 -160 0",
      "M 300 160 L 300 200 M 300 400 L 300 440 M 160 300 L 200 300 M 400 300 L 440 300",
      "M 213 213 L 241 241 M 387 387 L 359 359 M 387 213 L 359 241 M 213 387 L 241 359",
    ],
  },
  {
    name: "Flower 🌸",
    paths: [
      "M 300 300 m -40 0 a 40 40 0 1 0 80 0 a 40 40 0 1 0 -80 0",
      "M 300 200 m -30 0 a 30 55 0 1 0 60 0 a 30 55 0 1 0 -60 0",
      "M 300 400 m -30 0 a 30 55 0 1 0 60 0 a 30 55 0 1 0 -60 0",
      "M 200 300 m 0 -30 a 55 30 0 1 0 0 60 a 55 30 0 1 0 0 -60",
      "M 400 300 m 0 -30 a 55 30 0 1 0 0 60 a 55 30 0 1 0 0 -60",
      "M 300 400 L 300 480",
      "M 280 460 Q 300 450 320 460",
    ],
  },
];

export function ColoringPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const [color, setColor] = useState("#ff6fa0");
  const [brushSize, setBrushSize] = useState(12);
  const [imageIdx, setImageIdx] = useState(0);
  const [mode, setMode] = useState<"draw"|"erase">("draw");

  const image = IMAGES[imageIdx];

  function getPos(e: React.PointerEvent<HTMLCanvasElement>) {
    const c = canvasRef.current!;
    const r = c.getBoundingClientRect();
    return {
      x: ((e.clientX - r.left) / r.width) * c.width,
      y: ((e.clientY - r.top) / r.height) * c.height,
    };
  }

  function startDraw(e: React.PointerEvent<HTMLCanvasElement>) {
    drawing.current = true;
    const ctx = canvasRef.current!.getContext("2d")!;
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  }

  function draw(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return;
    const ctx = canvasRef.current!.getContext("2d")!;
    const { x, y } = getPos(e);
    ctx.lineTo(x, y);
    ctx.lineWidth = mode === "erase" ? brushSize * 3 : brushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = mode === "erase" ? "#ffffff" : color;
    ctx.stroke();
  }

  function endDraw() { drawing.current = false; }

  function clear() {
    const c = canvasRef.current!;
    c.getContext("2d")!.clearRect(0, 0, c.width, c.height);
  }

  return (
    <div className="card-soft mx-auto max-w-3xl p-4">
      <div className="mb-4 flex flex-wrap items-center gap-2 justify-between">
        {/* Image picker */}
        <div className="flex gap-2 flex-wrap">
          {IMAGES.map((img, i) => (
            <button
              key={i}
              onClick={() => { setImageIdx(i); clear(); }}
              className={`rounded-xl px-3 py-1 text-sm font-bold transition ${imageIdx === i ? "bg-pink text-white" : "bg-muted"}`}
            >
              {img.name}
            </button>
          ))}
        </div>
        {/* Tools */}
        <div className="flex gap-2">
          <button
            onClick={() => setMode(mode === "draw" ? "erase" : "draw")}
            className={`rounded-xl px-3 py-2 text-sm font-bold ${mode === "erase" ? "bg-foreground text-background" : "bg-muted"}`}
          >
            {mode === "erase" ? "🧹 Erasing" : "✏️ Drawing"}
          </button>
          <button onClick={clear} className="rounded-xl bg-muted px-3 py-2 text-sm font-bold">↻ Clear</button>
        </div>
      </div>

      {/* Brush size */}
      <div className="mb-3 flex items-center gap-3">
        <span className="text-xs font-bold">Brush:</span>
        {[6, 12, 20, 32].map(s => (
          <button
            key={s}
            onClick={() => setBrushSize(s)}
            className={`rounded-full transition ${brushSize === s ? "ring-2 ring-foreground" : ""}`}
            style={{ width: s + 16, height: s + 16, background: color, minWidth: 22 }}
          />
        ))}
      </div>

      {/* Color palette */}
      <div className="mb-4 flex flex-wrap gap-2">
        {COLORS.map(c => (
          <button
            key={c}
            onClick={() => { setColor(c); setMode("draw"); }}
            className={`h-9 w-9 rounded-full border-4 transition hover:scale-110 ${color === c && mode === "draw" ? "border-foreground scale-110" : "border-transparent"}`}
            style={{ background: c, boxShadow: c === "#ffffff" ? "inset 0 0 0 1px #ddd" : "none" }}
          />
        ))}
      </div>

      {/* Canvas with SVG outline overlay */}
      <div className="relative mx-auto rounded-2xl overflow-hidden bg-white shadow-md" style={{ width: 600, maxWidth: "100%", aspectRatio: "1" }}>
        {/* SVG outline */}
        <svg
          viewBox="0 0 600 600"
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ zIndex: 2 }}
        >
          {image.paths.map((d, i) => (
            <path key={i} d={d} fill="none" stroke="#2d2d2d" strokeWidth="3" strokeLinecap="round" />
          ))}
          <text x="300" y="560" textAnchor="middle" fontSize="14" fill="#aaa">{image.name}</text>
        </svg>
        {/* Drawing canvas */}
        <canvas
          ref={canvasRef}
          width={600}
          height={600}
          onPointerDown={startDraw}
          onPointerMove={draw}
          onPointerUp={endDraw}
          onPointerLeave={endDraw}
          className="absolute inset-0 w-full h-full touch-none"
          style={{ zIndex: 1 }}
        />
      </div>

      <p className="mt-3 text-center text-sm text-muted-foreground">
        🎨 Color inside the lines or draw freely — it's your art!
      </p>
    </div>
  );
}
