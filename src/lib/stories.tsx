import type { ReactNode } from "react";

export type StoryPage = {
  text: string;
  bg: string; // gradient class
  scene: ReactNode;
};

export type Story = {
  id: string;
  title: string;
  emoji: string;
  cover: string; // gradient
  pages: StoryPage[];
};

const sun = (
  <circle cx="80" cy="60" r="28" fill="#FFE680" />
);
const grass = (
  <rect x="0" y="240" width="400" height="60" fill="#A8E6A3" />
);
const cloud = (x: number, y: number) => (
  <g key={`c${x}${y}`} fill="#fff" opacity="0.9">
    <circle cx={x} cy={y} r="14" />
    <circle cx={x + 14} cy={y - 4} r="18" />
    <circle cx={x + 30} cy={y} r="14" />
  </g>
);

const Scene = ({ children }: { children: ReactNode }) => (
  <svg viewBox="0 0 400 300" className="h-full w-full">
    {children}
  </svg>
);

export const STORIES: Story[] = [
  {
    id: "caterpillar",
    title: "Tilly the Tiny Caterpillar",
    emoji: "🐛",
    cover: "from-mint to-butter",
    pages: [
      {
        text: "Tilly the tiny caterpillar woke up under a big green leaf.",
        bg: "from-mint to-butter",
        scene: (
          <Scene>
            {sun}
            {cloud(280, 50)}
            {grass}
            <ellipse cx="200" cy="170" rx="120" ry="60" fill="#7ec97e" />
            <g transform="translate(170,180)">
              <circle cx="0" cy="0" r="14" fill="#a8e6a3" />
              <circle cx="20" cy="0" r="14" fill="#a8e6a3" />
              <circle cx="40" cy="0" r="14" fill="#a8e6a3" />
              <circle cx="60" cy="-2" r="16" fill="#7ec97e" />
              <circle cx="64" cy="-8" r="3" fill="#222" />
            </g>
          </Scene>
        ),
      },
      {
        text: "On Monday she nibbled one juicy red apple. Crunch!",
        bg: "from-pink to-butter",
        scene: (
          <Scene>
            {sun}
            {grass}
            <circle cx="200" cy="160" r="70" fill="#ff8a8a" />
            <rect x="196" y="84" width="8" height="20" fill="#6b4226" />
            <ellipse cx="220" cy="88" rx="14" ry="8" fill="#7ec97e" transform="rotate(-20 220 88)" />
            <circle cx="180" cy="160" r="4" fill="#fff" opacity=".7" />
          </Scene>
        ),
      },
      {
        text: "On Tuesday she ate two sweet yellow pears. Yum yum!",
        bg: "from-butter to-mint",
        scene: (
          <Scene>
            {sun}
            {grass}
            {[140, 240].map((x) => (
              <g key={x}>
                <path d={`M${x} 120 Q${x - 30} 180 ${x} 220 Q${x + 30} 180 ${x} 120 Z`} fill="#ffe680" />
                <rect x={x - 2} y="108" width="4" height="14" fill="#6b4226" />
              </g>
            ))}
          </Scene>
        ),
      },
      {
        text: "On Wednesday she gobbled three purple plums. So tasty!",
        bg: "from-lilac to-pink",
        scene: (
          <Scene>
            {sun}
            {grass}
            {[120, 200, 280].map((x) => (
              <circle key={x} cx={x} cy="180" r="36" fill="#c8a8ff" />
            ))}
          </Scene>
        ),
      },
      {
        text: "Then Tilly spun a soft cocoon and slept for many days.",
        bg: "from-sky to-lilac",
        scene: (
          <Scene>
            <rect width="400" height="300" fill="#1e2a4a" />
            <circle cx="60" cy="50" r="3" fill="#fff" />
            <circle cx="120" cy="80" r="2" fill="#fff" />
            <circle cx="320" cy="60" r="3" fill="#fff" />
            <circle cx="350" cy="120" r="2" fill="#fff" />
            <circle cx="80" cy="160" r="2" fill="#fff" />
            <ellipse cx="200" cy="200" rx="60" ry="80" fill="#ffefb5" />
            <path d="M170 160 Q200 140 230 160" stroke="#caa472" strokeWidth="3" fill="none" />
          </Scene>
        ),
      },
      {
        text: "Pop! Out flew Tilly the beautiful rainbow butterfly!",
        bg: "from-pink to-sky",
        scene: (
          <Scene>
            {sun}
            {cloud(60, 80)}
            {cloud(290, 60)}
            <g transform="translate(200,160)">
              <ellipse cx="-40" cy="-10" rx="40" ry="50" fill="#ff8a8a" />
              <ellipse cx="40" cy="-10" rx="40" ry="50" fill="#a0c4ff" />
              <ellipse cx="-35" cy="40" rx="32" ry="36" fill="#ffe680" />
              <ellipse cx="35" cy="40" rx="32" ry="36" fill="#a8e6a3" />
              <rect x="-4" y="-40" width="8" height="90" rx="4" fill="#222" />
              <circle cx="0" cy="-44" r="6" fill="#222" />
            </g>
          </Scene>
        ),
      },
    ],
  },
  {
    id: "moon",
    title: "Luna's Moon Adventure",
    emoji: "🌙",
    cover: "from-sky to-lilac",
    pages: [
      {
        text: "Luna looked up at the big round moon and waved hello.",
        bg: "from-sky to-lilac",
        scene: (
          <Scene>
            <rect width="400" height="300" fill="#1e2a4a" />
            <circle cx="300" cy="80" r="50" fill="#fff8c4" />
            <circle cx="60" cy="50" r="2" fill="#fff" />
            <circle cx="120" cy="90" r="2" fill="#fff" />
            <circle cx="180" cy="40" r="2" fill="#fff" />
            <g transform="translate(180,200)">
              <circle r="22" fill="#ffd6e0" />
              <circle cx="-7" cy="-3" r="2" fill="#222" />
              <circle cx="7" cy="-3" r="2" fill="#222" />
              <path d="M-6 6 Q0 10 6 6" stroke="#222" strokeWidth="2" fill="none" />
            </g>
          </Scene>
        ),
      },
      {
        text: "A friendly rocket whooshed down and offered her a ride.",
        bg: "from-pink to-sky",
        scene: (
          <Scene>
            <rect width="400" height="300" fill="#1e2a4a" />
            <g transform="translate(200,150)">
              <path d="M0 -70 Q30 0 0 70 Q-30 0 0 -70 Z" fill="#ff8a8a" />
              <circle cy="-10" r="14" fill="#a0c4ff" />
              <path d="M-30 30 L-50 70 L-10 50 Z" fill="#ffe680" />
              <path d="M30 30 L50 70 L10 50 Z" fill="#ffe680" />
              <path d="M-10 60 Q0 100 10 60" fill="#ffb480" />
            </g>
          </Scene>
        ),
      },
      {
        text: "Up they zoomed past sparkly stars and silly comets.",
        bg: "from-lilac to-sky",
        scene: (
          <Scene>
            <rect width="400" height="300" fill="#1e2a4a" />
            {[40, 100, 160, 220, 280, 340].map((x, i) => (
              <polygon key={x} points={`${x},${20 + i * 15} ${x + 4},${30 + i * 15} ${x + 14},${32 + i * 15} ${x + 6},${40 + i * 15} ${x + 8},${50 + i * 15} ${x},${44 + i * 15} ${x - 8},${50 + i * 15} ${x - 6},${40 + i * 15} ${x - 14},${32 + i * 15} ${x - 4},${30 + i * 15}`} fill="#ffe680" />
            ))}
            <path d="M60 240 Q160 200 260 230" stroke="#a0c4ff" strokeWidth="6" fill="none" />
          </Scene>
        ),
      },
      {
        text: "On the moon they bounced high. Boing! Boing! Boing!",
        bg: "from-butter to-pink",
        scene: (
          <Scene>
            <rect width="400" height="300" fill="#2a1e4a" />
            <ellipse cx="200" cy="260" rx="220" ry="40" fill="#e8e2f5" />
            <circle cx="120" cy="250" r="14" fill="#cfc6e0" />
            <circle cx="300" cy="248" r="10" fill="#cfc6e0" />
            <g transform="translate(200,160)">
              <circle r="22" fill="#ffd6e0" />
              <path d="M-6 6 Q0 12 6 6" stroke="#222" strokeWidth="2" fill="none" />
              <circle cx="-7" cy="-3" r="2" fill="#222" />
              <circle cx="7" cy="-3" r="2" fill="#222" />
            </g>
          </Scene>
        ),
      },
      {
        text: "When she got tired, the moon gave her a cozy goodnight.",
        bg: "from-sky to-lilac",
        scene: (
          <Scene>
            <rect width="400" height="300" fill="#1e2a4a" />
            <circle cx="200" cy="150" r="100" fill="#fff8c4" />
            <path d="M180 130 Q200 120 220 130" stroke="#caa472" strokeWidth="3" fill="none" />
            <path d="M180 170 Q200 185 220 170" stroke="#caa472" strokeWidth="3" fill="none" />
          </Scene>
        ),
      },
    ],
  },
  {
    id: "bear",
    title: "Benny Bear's Honey Hunt",
    emoji: "🐻",
    cover: "from-butter to-peach",
    pages: [
      {
        text: "Benny Bear sniffed the air. He smelled sweet golden honey!",
        bg: "from-butter to-peach",
        scene: (
          <Scene>
            {sun}{grass}
            <g transform="translate(180,170)">
              <circle r="40" fill="#caa472" />
              <circle cx="-22" cy="-30" r="14" fill="#caa472" />
              <circle cx="22" cy="-30" r="14" fill="#caa472" />
              <circle r="20" cy="10" fill="#ffe680" />
              <circle cx="-8" cy="-2" r="3" fill="#222" />
              <circle cx="8" cy="-2" r="3" fill="#222" />
              <circle cy="10" r="4" fill="#222" />
            </g>
          </Scene>
        ),
      },
      {
        text: "He climbed the tall tree, paw over paw, all the way up.",
        bg: "from-mint to-butter",
        scene: (
          <Scene>
            {sun}{grass}
            <rect x="180" y="80" width="40" height="180" fill="#6b4226" />
            <circle cx="200" cy="80" r="70" fill="#7ec97e" />
            <g transform="translate(220,160)">
              <circle r="20" fill="#caa472" />
              <circle r="10" cy="6" fill="#ffe680" />
            </g>
          </Scene>
        ),
      },
      {
        text: "Buzzy bees flew round and round. Buzz buzz buzz!",
        bg: "from-butter to-pink",
        scene: (
          <Scene>
            {sun}{grass}
            {[100, 200, 300].map((x, i) => (
              <g key={x} transform={`translate(${x},${120 + i * 10})`}>
                <ellipse rx="16" ry="11" fill="#ffe680" />
                <rect x="-12" y="-11" width="6" height="22" fill="#222" />
                <rect x="6" y="-11" width="6" height="22" fill="#222" />
                <ellipse cx="-2" cy="-12" rx="10" ry="6" fill="#fff" opacity=".7" />
              </g>
            ))}
          </Scene>
        ),
      },
      {
        text: "Benny shared his honey pot and the bees became his friends.",
        bg: "from-mint to-sky",
        scene: (
          <Scene>
            {sun}{grass}
            <g transform="translate(160,180)">
              <ellipse rx="40" ry="36" fill="#ff8a8a" />
              <rect x="-30" y="-40" width="60" height="12" rx="4" fill="#caa472" />
              <path d="M-10 -28 Q0 -10 10 -28" stroke="#ffe680" strokeWidth="6" fill="none" />
            </g>
            <g transform="translate(280,140)">
              <ellipse rx="14" ry="10" fill="#ffe680" />
              <rect x="-10" y="-10" width="5" height="20" fill="#222" />
            </g>
          </Scene>
        ),
      },
    ],
  },
  {
    id: "fish",
    title: "Bubbles the Brave Little Fish",
    emoji: "🐟",
    cover: "from-sky to-mint",
    pages: [
      {
        text: "Deep in the blue blue sea swam Bubbles the little fish.",
        bg: "from-sky to-mint",
        scene: (
          <Scene>
            <rect width="400" height="300" fill="#a0c4ff" />
            <g transform="translate(200,150)">
              <ellipse rx="40" ry="22" fill="#ff8a8a" />
              <polygon points="-40,0 -70,-20 -70,20" fill="#ff8a8a" />
              <circle cx="14" cy="-5" r="4" fill="#fff" />
              <circle cx="15" cy="-5" r="2" fill="#222" />
            </g>
            <circle cx="100" cy="80" r="6" fill="#fff" opacity=".7" />
            <circle cx="140" cy="60" r="4" fill="#fff" opacity=".7" />
          </Scene>
        ),
      },
      {
        text: "She found a coral castle full of colors. Wow!",
        bg: "from-pink to-sky",
        scene: (
          <Scene>
            <rect width="400" height="300" fill="#7ec1ff" />
            <rect x="0" y="240" width="400" height="60" fill="#ffd6a8" />
            {[80, 160, 240, 320].map((x, i) => (
              <g key={x} transform={`translate(${x},${200})`}>
                <rect x="-20" y="0" width="40" height="40" fill={["#ff8a8a", "#ffe680", "#c8a8ff", "#a8e6a3"][i]} />
                <polygon points="-20,0 0,-20 20,0" fill={["#ff8a8a", "#ffe680", "#c8a8ff", "#a8e6a3"][i]} />
              </g>
            ))}
          </Scene>
        ),
      },
      {
        text: "A big shadow swam by. Bubbles felt brave and waved hello.",
        bg: "from-lilac to-sky",
        scene: (
          <Scene>
            <rect width="400" height="300" fill="#5a8fd9" />
            <g transform="translate(260,140)">
              <ellipse rx="80" ry="40" fill="#3a5d99" />
              <polygon points="-80,0 -120,-30 -120,30" fill="#3a5d99" />
              <circle cx="40" cy="-10" r="4" fill="#fff" />
            </g>
            <g transform="translate(120,180)">
              <ellipse rx="24" ry="14" fill="#ff8a8a" />
              <polygon points="-24,0 -42,-12 -42,12" fill="#ff8a8a" />
            </g>
          </Scene>
        ),
      },
      {
        text: "They became friends and danced together in the sunny waves.",
        bg: "from-butter to-sky",
        scene: (
          <Scene>
            <rect width="400" height="300" fill="#7ec1ff" />
            <path d="M0 60 Q100 30 200 60 T400 60" stroke="#ffe680" strokeWidth="6" fill="none" />
            <g transform="translate(140,160)">
              <ellipse rx="28" ry="16" fill="#ff8a8a" />
              <polygon points="-28,0 -48,-14 -48,14" fill="#ff8a8a" />
            </g>
            <g transform="translate(260,180)">
              <ellipse rx="50" ry="26" fill="#3a5d99" />
              <polygon points="-50,0 -76,-20 -76,20" fill="#3a5d99" />
            </g>
          </Scene>
        ),
      },
    ],
  },
  {
    id: "garden",
    title: "Poppy Plants a Rainbow Garden",
    emoji: "🌷",
    cover: "from-pink to-mint",
    pages: [
      {
        text: "Poppy had a little bag of magic rainbow seeds.",
        bg: "from-pink to-butter",
        scene: (
          <Scene>
            {sun}{grass}
            <g transform="translate(180,180)">
              <circle r="30" fill="#ffd6e0" />
              <circle cx="-10" cy="-4" r="3" fill="#222" />
              <circle cx="10" cy="-4" r="3" fill="#222" />
              <path d="M-8 8 Q0 14 8 8" stroke="#222" strokeWidth="2" fill="none" />
            </g>
            <g transform="translate(260,200)">
              <rect x="-20" y="-20" width="40" height="40" fill="#caa472" />
              {[-10, 0, 10].map((x) => (
                <circle key={x} cx={x} cy="-5" r="3" fill={["#ff8a8a", "#ffe680", "#a0c4ff"][x / 10 + 1]} />
              ))}
            </g>
          </Scene>
        ),
      },
      {
        text: "She dug little holes and tucked the seeds in cozy dirt.",
        bg: "from-mint to-butter",
        scene: (
          <Scene>
            {sun}
            <rect x="0" y="180" width="400" height="120" fill="#caa472" />
            {[80, 160, 240, 320].map((x) => (
              <ellipse key={x} cx={x} cy="200" rx="12" ry="6" fill="#6b4226" />
            ))}
          </Scene>
        ),
      },
      {
        text: "Drip drop went the rain. The seeds drank and drank.",
        bg: "from-sky to-mint",
        scene: (
          <Scene>
            {cloud(120, 60)}{cloud(260, 50)}
            {[80, 130, 180, 230, 280, 330].map((x, i) => (
              <line key={x} x1={x} y1={100 + (i % 2) * 10} x2={x - 6} y2={140 + (i % 2) * 10} stroke="#a0c4ff" strokeWidth="3" />
            ))}
            <rect x="0" y="180" width="400" height="120" fill="#caa472" />
          </Scene>
        ),
      },
      {
        text: "Up popped flowers in red, yellow, blue, and purple!",
        bg: "from-pink to-lilac",
        scene: (
          <Scene>
            {sun}{grass}
            {[
              { x: 80, c: "#ff8a8a" },
              { x: 160, c: "#ffe680" },
              { x: 240, c: "#a0c4ff" },
              { x: 320, c: "#c8a8ff" },
            ].map((f) => (
              <g key={f.x} transform={`translate(${f.x},200)`}>
                <rect x="-2" y="0" width="4" height="50" fill="#7ec97e" />
                {[0, 72, 144, 216, 288].map((deg) => (
                  <ellipse key={deg} rx="8" ry="14" fill={f.c} transform={`rotate(${deg}) translate(0,-14)`} />
                ))}
                <circle r="6" fill="#ffe680" />
              </g>
            ))}
          </Scene>
        ),
      },
      {
        text: "Poppy danced in her rainbow garden. What a happy day!",
        bg: "from-butter to-pink",
        scene: (
          <Scene>
            {sun}{grass}
            <path d="M40 240 Q200 60 360 240" stroke="#ff8a8a" strokeWidth="14" fill="none" />
            <path d="M40 240 Q200 80 360 240" stroke="#ffe680" strokeWidth="14" fill="none" />
            <path d="M40 240 Q200 100 360 240" stroke="#a8e6a3" strokeWidth="14" fill="none" />
            <path d="M40 240 Q200 120 360 240" stroke="#a0c4ff" strokeWidth="14" fill="none" />
            <path d="M40 240 Q200 140 360 240" stroke="#c8a8ff" strokeWidth="14" fill="none" />
            <g transform="translate(200,220)">
              <circle r="22" fill="#ffd6e0" />
              <path d="M-6 4 Q0 12 6 4" stroke="#222" strokeWidth="2" fill="none" />
            </g>
          </Scene>
        ),
      },
    ],
  },
  {
    id: "puppy",
    title: "Pip the Puppy Finds a Friend",
    emoji: "🐶",
    cover: "from-peach to-pink",
    pages: [
      {
        text: "Pip was a little puppy with a very waggy tail.",
        bg: "from-peach to-butter",
        scene: (
          <Scene>
            {sun}{grass}
            <g transform="translate(200,180)">
              <ellipse rx="50" ry="30" fill="#ffefb5" />
              <circle cx="-40" cy="-10" r="24" fill="#ffefb5" />
              <ellipse cx="-52" cy="-22" rx="8" ry="14" fill="#caa472" />
              <ellipse cx="-30" cy="-22" rx="8" ry="14" fill="#caa472" />
              <circle cx="-46" cy="-12" r="2" fill="#222" />
              <circle cx="-36" cy="-12" r="2" fill="#222" />
              <circle cx="-44" cy="-2" r="3" fill="#222" />
              <path d="M50 -20 Q70 -40 60 -10" stroke="#ffefb5" strokeWidth="14" fill="none" strokeLinecap="round" />
            </g>
          </Scene>
        ),
      },
      {
        text: "He saw a fluffy kitten sitting all alone by the tree.",
        bg: "from-mint to-butter",
        scene: (
          <Scene>
            {sun}{grass}
            <rect x="60" y="80" width="30" height="180" fill="#6b4226" />
            <circle cx="75" cy="80" r="60" fill="#7ec97e" />
            <g transform="translate(240,200)">
              <ellipse rx="34" ry="22" fill="#caa472" />
              <circle cx="-26" cy="-8" r="18" fill="#caa472" />
              <polygon points="-36,-22 -28,-8 -22,-22" fill="#caa472" />
              <polygon points="-30,-22 -22,-8 -16,-22" fill="#caa472" />
              <circle cx="-30" cy="-8" r="2" fill="#222" />
              <circle cx="-22" cy="-8" r="2" fill="#222" />
            </g>
          </Scene>
        ),
      },
      {
        text: "Pip wagged hello. The kitten purred and rubbed his nose.",
        bg: "from-pink to-butter",
        scene: (
          <Scene>
            {sun}{grass}
            <g transform="translate(140,200)">
              <ellipse rx="34" ry="22" fill="#ffefb5" />
              <circle cx="26" cy="-8" r="20" fill="#ffefb5" />
              <circle cx="22" cy="-8" r="2" fill="#222" />
              <circle cx="30" cy="-8" r="2" fill="#222" />
            </g>
            <g transform="translate(240,200)">
              <ellipse rx="32" ry="20" fill="#caa472" />
              <circle cx="-22" cy="-8" r="18" fill="#caa472" />
              <circle cx="-26" cy="-8" r="2" fill="#222" />
              <circle cx="-18" cy="-8" r="2" fill="#222" />
            </g>
            <path d="M188 188 Q200 178 212 188" stroke="#ff8a8a" strokeWidth="2" fill="none" />
          </Scene>
        ),
      },
      {
        text: "Now Pip and Kitten play together every single sunny day.",
        bg: "from-sky to-butter",
        scene: (
          <Scene>
            {sun}{cloud(80, 60)}{cloud(300, 50)}{grass}
            <path d="M100 220 Q200 160 300 220" stroke="#ff8a8a" strokeWidth="6" fill="none" strokeDasharray="6 6" />
            <circle cx="100" cy="220" r="14" fill="#ffefb5" />
            <circle cx="300" cy="220" r="14" fill="#caa472" />
          </Scene>
        ),
      },
    ],
  },
];
