import { useRef, useState } from "react";

const COLORS = [
  "#ff6fa0","#ff9f43","#ffd166","#06d6a0","#118ab2","#a29bfe",
  "#fd79a8","#00cec9","#e17055","#55efc4","#fdcb6e","#6c5ce7",
  "#ffffff","#dfe6e9","#b2bec3","#636e72","#2d3436","#000000",
];

// Better SVG drawings
const IMAGES = [
  {
    name: "Cat 🐱",
    viewBox: "0 0 200 200",
    elements: [
      // body
      { type: "ellipse", props: { cx:100, cy:130, rx:50, ry:45, fill:"none", stroke:"#333", strokeWidth:3 } },
      // head
      { type: "circle", props: { cx:100, cy:75, r:35, fill:"none", stroke:"#333", strokeWidth:3 } },
      // left ear
      { type: "polygon", props: { points:"70,50 60,25 85,45", fill:"none", stroke:"#333", strokeWidth:3 } },
      // right ear
      { type: "polygon", props: { points:"130,50 140,25 115,45", fill:"none", stroke:"#333", strokeWidth:3 } },
      // left eye
      { type: "circle", props: { cx:88, cy:70, r:6, fill:"none", stroke:"#333", strokeWidth:2 } },
      // right eye
      { type: "circle", props: { cx:112, cy:70, r:6, fill:"none", stroke:"#333", strokeWidth:2 } },
      // nose
      { type: "polygon", props: { points:"100,80 96,86 104,86", fill:"none", stroke:"#333", strokeWidth:2 } },
      // mouth
      { type: "path", props: { d:"M96,87 Q100,93 104,87", fill:"none", stroke:"#333", strokeWidth:2 } },
      // whiskers left
      { type: "line", props: { x1:60, y1:82, x2:90, y2:84, stroke:"#333", strokeWidth:1.5 } },
      { type: "line", props: { x1:60, y1:88, x2:90, y2:87, stroke:"#333", strokeWidth:1.5 } },
      // whiskers right
      { type: "line", props: { x1:140, y1:82, x2:110, y2:84, stroke:"#333", strokeWidth:1.5 } },
      { type: "line", props: { x1:140, y1:88, x2:110, y2:87, stroke:"#333", strokeWidth:1.5 } },
      // tail
      { type: "path", props: { d:"M150,155 Q180,140 175,120 Q170,105 160,115", fill:"none", stroke:"#333", strokeWidth:3 } },
      // legs
      { type: "rect", props: { x:70, y:165, width:18, height:25, rx:9, fill:"none", stroke:"#333", strokeWidth:2 } },
      { type: "rect", props: { x:112, y:165, width:18, height:25, rx:9, fill:"none", stroke:"#333", strokeWidth:2 } },
    ],
  },
  {
    name: "Dog 🐶",
    viewBox: "0 0 200 200",
    elements: [
      // body
      { type: "ellipse", props: { cx:100, cy:135, rx:55, ry:45, fill:"none", stroke:"#333", strokeWidth:3 } },
      // head
      { type: "circle", props: { cx:100, cy:75, r:38, fill:"none", stroke:"#333", strokeWidth:3 } },
      // floppy left ear
      { type: "ellipse", props: { cx:68, cy:65, rx:18, ry:28, fill:"none", stroke:"#333", strokeWidth:2.5, transform:"rotate(-15,68,65)" } },
      // floppy right ear
      { type: "ellipse", props: { cx:132, cy:65, rx:18, ry:28, fill:"none", stroke:"#333", strokeWidth:2.5, transform:"rotate(15,132,65)" } },
      // left eye
      { type: "circle", props: { cx:87, cy:68, r:6, fill:"none", stroke:"#333", strokeWidth:2 } },
      // right eye
      { type: "circle", props: { cx:113, cy:68, r:6, fill:"none", stroke:"#333", strokeWidth:2 } },
      // nose
      { type: "ellipse", props: { cx:100, cy:82, rx:9, ry:6, fill:"none", stroke:"#333", strokeWidth:2 } },
      // mouth
      { type: "path", props: { d:"M91,89 Q100,98 109,89", fill:"none", stroke:"#333", strokeWidth:2 } },
      // tongue
      { type: "ellipse", props: { cx:100, cy:96, rx:7, ry:9, fill:"none", stroke:"#333", strokeWidth:2 } },
      // tail
      { type: "path", props: { d:"M155,145 Q175,130 170,110", fill:"none", stroke:"#333", strokeWidth:3 } },
      // legs
      { type: "rect", props: { x:65, y:167, width:18, height:25, rx:9, fill:"none", stroke:"#333", strokeWidth:2 } },
      { type: "rect", props: { x:117, y:167, width:18, height:25, rx:9, fill:"none", stroke:"#333", strokeWidth:2 } },
    ],
  },
  {
    name: "Star ⭐",
    viewBox: "0 0 200 200",
    elements: [
      { type: "polygon", props: { points:"100,20 120,70 175,70 130,105 148,155 100,122 52,155 70,105 25,70 80,70", fill:"none", stroke:"#333", strokeWidth:3 } },
      { type: "circle", props: { cx:100, cy:100, r:15, fill:"none", stroke:"#333", strokeWidth:2 } },
    ],
  },
  {
    name: "House 🏠",
    viewBox: "0 0 200 200",
    elements: [
      // house body
      { type: "rect", props: { x:30, y:100, width:140, height:90, fill:"none", stroke:"#333", strokeWidth:3 } },
      // roof
      { type: "polygon", props: { points:"20,105 100,30 180,105", fill:"none", stroke:"#333", strokeWidth:3 } },
      // door
      { type: "rect", props: { x:82, y:145, width:36, height:45, rx:18, fill:"none", stroke:"#333", strokeWidth:2 } },
      // window left
      { type: "rect", props: { x:42, y:118, width:35, height:30, rx:4, fill:"none", stroke:"#333", strokeWidth:2 } },
      { type: "line", props: { x1:59, y1:118, x2:59, y2:148, stroke:"#333", strokeWidth:1.5 } },
      { type: "line", props: { x1:42, y1:133, x2:77, y2:133, stroke:"#333", strokeWidth:1.5 } },
      // window right
      { type: "rect", props: { x:123, y:118, width:35, height:30, rx:4, fill:"none", stroke:"#333", strokeWidth:2 } },
      { type: "line", props: { x1:140, y1:118, x2:140, y2:148, stroke:"#333", strokeWidth:1.5 } },
      { type: "line", props: { x1:123, y1:133, x2:158, y2:133, stroke:"#333", strokeWidth:1.5 } },
      // chimney
      { type: "rect", props: { x:130, y:45, width:20, height:35, fill:"none", stroke:"#333", strokeWidth:2 } },
      // smoke
      { type: "path", props: { d:"M135,42 Q132,30 138,20 Q144,10 140,2", fill:"none", stroke:"#333", strokeWidth:1.5 } },
    ],
  },
  {
    name: "Flower 🌸",
    viewBox: "0 0 200 200",
    elements: [
      // stem
      { type: "line", props: { x1:100, y1:130, x2:100, y2:185, stroke:"#333", strokeWidth:3 } },
      // leaf left
      { type: "ellipse", props: { cx:82, cy:160, rx:18, ry:9, fill:"none", stroke:"#333", strokeWidth:2, transform:"rotate(-30,82,160)" } },
      // leaf right
      { type: "ellipse", props: { cx:118, cy:160, rx:18, ry:9, fill:"none", stroke:"#333", strokeWidth:2, transform:"rotate(30,118,160)" } },
      // center
      { type: "circle", props: { cx:100, cy:95, r:22, fill:"none", stroke:"#333", strokeWidth:3 } },
      // petals
      { type: "ellipse", props: { cx:100, cy:60, rx:14, ry:22, fill:"none", stroke:"#333", strokeWidth:2 } },
      { type: "ellipse", props: { cx:100, cy:130, rx:14, ry:22, fill:"none", stroke:"#333", strokeWidth:2 } },
      { type: "ellipse", props: { cx:65, cy:95, rx:22, ry:14, fill:"none", stroke:"#333", strokeWidth:2 } },
      { type: "ellipse", props: { cx:135, cy:95, rx:22, ry:14, fill:"none", stroke:"#333", strokeWidth:2 } },
      { type: "ellipse", props: { cx:76, cy:71, rx:14, ry:22, fill:"none", stroke:"#333", strokeWidth:2, transform:"rotate(-45,76,71)" } },
      { type: "ellipse", props: { cx:124, cy:71, rx:14, ry:22, fill:"none", stroke:"#333", strokeWidth:2, transform:"rotate(45,124,71)" } },
      { type: "ellipse", props: { cx:76, cy:119, rx:14, ry:22, fill:"none", stroke:"#333", strokeWidth:2, transform:"rotate(45,76,119)" } },
      { type: "ellipse", props: { cx:124, cy:119, rx:14, ry:22, fill:"none", stroke:"#333", strokeWidth:2, transform:"rotate(-45,124,119)" } },
    ],
  },
  {
    name: "Sun ☀️",
    viewBox: "0 0 200 200",
    elements: [
      { type: "circle", props: { cx:100, cy:100, r:40, fill:"none", stroke:"#333", strokeWidth:3 } },
      { type: "line", props: { x1:100, y1:15, x2:100, y2:45, stroke:"#333", strokeWidth:3 } },
      { type: "line", props: { x1:100, y1:155, x2:100, y2:185, stroke:"#333", strokeWidth:3 } },
      { type: "line", props: { x1:15, y1:100, x2:45, y2:100, stroke:"#333", strokeWidth:3 } },
      { type: "line", props: { x1:155, y1:100, x2:185, y2:100, stroke:"#333", strokeWidth:3 } },
      { type: "line", props: { x1:36, y1:36, x2:57, y2:57, stroke:"#333", strokeWidth:3 } },
      { type: "line", props: { x1:143, y1:143, x2:164, y2:164, stroke:"#333", strokeWidth:3 } },
      { type: "line", props: { x1:164, y1:36, x2:143, y2:57, stroke:"#333", strokeWidth:3 } },
      { type: "line", props: { x1:57, y1:143, x2:36, y2:164, stroke:"#333", strokeWidth:3 } },
      { type: "circle", props: { cx:88, cy:90, r:5, fill:"none", stroke:"#333", strokeWidth:2 } },
      { type: "circle", props: { cx:112, cy:90, r:5, fill:"none", stroke:"#333", strokeWidth:2 } },
      { type: "path", props: { d:"M88,110 Q100,120 112,110", fill:"none", stroke:"#333", strokeWidth:2 } },
    ],
  },
];

function renderElement(el: any, idx: number) {
  const { type, props } = el;
  if (type === "ellipse") return <ellipse key={idx} {...props} />;
  if (type === "circle") return <circle key={idx} {...props} />;
  if (type === "rect") return <rect key={idx} {...props} />;
  if (type === "polygon") return <polygon key={idx} {...props} />;
  if (type === "line") return <line key={idx} {...props} />;
  if (type === "path") return <path key={idx} {...props} />;
  return null;
}

export function ColoringPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const [color, setColor] = useState("#ff6fa0");
  const [brushSize, setBrushSize] = useState(12);
  const [imageIdx, setImageIdx] = useState(0);
  const [mode, setMode] = useState<"draw"|"erase">("draw");

  const image = IMAGES[imageIdx];

  function getPos(e: React.PointerEvent<HTMLCanvasElement>) {
    const c = canvasRef.current!; const r = c.getBoundingClientRect();
    return { x: ((e.clientX-r.left)/r.width)*600, y: ((e.clientY-r.top)/r.height)*600 };
  }
  function startDraw(e: React.PointerEvent<HTMLCanvasElement>) {
    drawing.current = true;
    const ctx = canvasRef.current!.getContext("2d")!;
    const { x, y } = getPos(e); ctx.beginPath(); ctx.moveTo(x, y);
  }
  function draw(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return;
    const ctx = canvasRef.current!.getContext("2d")!;
    const { x, y } = getPos(e);
    ctx.lineTo(x, y); ctx.lineWidth = mode==="erase" ? brushSize*3 : brushSize;
    ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.strokeStyle = mode==="erase" ? "#ffffff" : color; ctx.stroke();
  }
  function endDraw() { drawing.current = false; }
  function clear() { const c = canvasRef.current!; c.getContext("2d")!.clearRect(0,0,600,600); }

  return (
    <div className="card-soft mx-auto max-w-3xl p-4">
      <div className="mb-3 flex flex-wrap gap-2 justify-between">
        <div className="flex gap-2 flex-wrap">
          {IMAGES.map((img,i) => (
            <button key={i} onClick={() => { setImageIdx(i); clear(); }}
              className={`rounded-xl px-3 py-1 text-sm font-bold transition ${imageIdx===i ? "bg-pink text-white" : "bg-muted"}`}>
              {img.name}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={() => setMode(mode==="draw"?"erase":"draw")}
            className={`rounded-xl px-3 py-2 text-sm font-bold ${mode==="erase" ? "bg-foreground text-background" : "bg-muted"}`}>
            {mode==="erase" ? "🧹 Eraser" : "✏️ Draw"}
          </button>
          <button onClick={clear} className="rounded-xl bg-muted px-3 py-2 text-sm font-bold">↻ Clear</button>
        </div>
      </div>

      <div className="mb-3 flex items-center gap-3">
        <span className="text-xs font-bold">Size:</span>
        {[6,12,20,32].map(s => (
          <button key={s} onClick={() => setBrushSize(s)}
            className={`rounded-full transition ${brushSize===s ? "ring-2 ring-foreground" : ""}`}
            style={{ width:s+16, height:s+16, background:color, minWidth:22 }} />
        ))}
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {COLORS.map(c => (
          <button key={c} onClick={() => { setColor(c); setMode("draw"); }}
            className={`h-9 w-9 rounded-full border-4 transition hover:scale-110 ${color===c&&mode==="draw" ? "border-foreground scale-110" : "border-transparent"}`}
            style={{ background:c, boxShadow:c==="#ffffff"?"inset 0 0 0 1px #ddd":"none" }} />
        ))}
      </div>

      <div className="relative mx-auto rounded-2xl overflow-hidden bg-white shadow-md" style={{ width:"100%", maxWidth:600, aspectRatio:"1" }}>
        <svg viewBox={image.viewBox} className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex:2 }}>
          {image.elements.map((el, i) => renderElement(el, i))}
        </svg>
        <canvas ref={canvasRef} width={600} height={600}
          onPointerDown={startDraw} onPointerMove={draw} onPointerUp={endDraw} onPointerLeave={endDraw}
          className="absolute inset-0 w-full h-full touch-none" style={{ zIndex:1 }} />
      </div>
      <p className="mt-2 text-center text-sm text-muted-foreground">🎨 Color inside the lines or draw freely!</p>
    </div>
  );
}
