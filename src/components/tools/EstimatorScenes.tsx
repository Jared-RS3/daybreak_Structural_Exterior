/* ==========================================================================
   Drawings for the instant repair estimate: the house in cutaway, and a
   closer look at each part of it. All on a 1000 × 560 canvas, so the
   hotspots in lib/estimator.ts (in percent) land on what they point at.
   Flat and quiet, like the other drawings on the site; the numbered markers
   and labels are HTML on top, so they stay sharp and clickable.
   ========================================================================== */

const C = {
  sky: "#dde8ef",
  soil: "#8f6f4e",
  soilDark: "#765a3e",
  grass: "#7ba65a",
  concrete: "#bcb7ae",
  concreteDark: "#9c978e",
  slab: "#c9c5bc",
  interior: "#f1ece3",
  wood: "#c9a46c",
  woodDark: "#9c7744",
  roof: "#4a4f57",
  siding: "#e3ddd1",
  glass: "#cfe0ea",
  water: "#79b0d4",
  crack: "#2f2620",
  mold: "#3f5a3a",
  dark: "#4b3d30",
};

function Svg({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 1000 560" aria-hidden className="block size-full" preserveAspectRatio="xMidYMid meet">
      {children}
    </svg>
  );
}

function Patterns() {
  return (
    <defs>
      <pattern id="est-brick" width="40" height="20" patternUnits="userSpaceOnUse">
        <rect width="40" height="20" fill="#b1604a" />
        <path d="M0 .75H40M0 10.75H40M20 0V10M0 10V20M40 10V20" stroke="#dccdbd" strokeWidth="1.5" />
      </pattern>
      <pattern id="est-block" width="60" height="30" patternUnits="userSpaceOnUse">
        <rect width="60" height="30" fill={C.concrete} />
        <path d="M0 .75H60M0 15.75H60M30 0V15M0 15V30M60 15V30" stroke={C.concreteDark} strokeWidth="1.5" />
      </pattern>
      <pattern id="est-block-in" width="80" height="40" patternUnits="userSpaceOnUse">
        <rect width="80" height="40" fill="#d6d1c8" />
        <path d="M0 .75H80M0 20.75H80M40 0V20M0 20V40M80 20V40" stroke="#c2bdb3" strokeWidth="1.5" />
      </pattern>
      <pattern id="est-lap" width="120" height="28" patternUnits="userSpaceOnUse">
        <rect width="120" height="28" fill="#dcd6c8" />
        <rect y="22" width="120" height="6" fill="#c3bba9" />
      </pattern>
      <pattern id="est-siding" width="40" height="16" patternUnits="userSpaceOnUse">
        <rect width="40" height="16" fill={C.siding} />
        <path d="M0 15.25H40" stroke="#c9c1b2" strokeWidth="1.5" />
      </pattern>
    </defs>
  );
}

/** The whole house in cutaway: brick front on the left, the rooms, the
    basement and crawl space below, the garage and the driveway. */
export function HouseScene() {
  return (
    <Svg>
      <Patterns />
      <rect width="1000" height="360" fill={C.sky} />
      <circle cx="70" cy="300" r="70" fill="#a9c58f" />
      <circle cx="950" cy="290" r="80" fill="#a9c58f" />
      <rect y="356" width="1000" height="204" fill={C.soil} />
      {[[60, 420], [210, 470], [700, 460], [860, 430], [930, 500], [560, 520]].map(([x, y]) => (
        <ellipse key={`${x}-${y}`} cx={x} cy={y} rx="14" ry="5" fill={C.soilDark} />
      ))}
      <rect y="348" width="1000" height="10" fill={C.grass} />

      {/* Garage */}
      <polygon points="628,236 735,172 842,236" fill="#565c65" />
      <rect x="640" y="232" width="190" height="120" fill="url(#est-siding)" stroke="#a69e8f" />
      <rect x="668" y="262" width="134" height="90" fill="#cbc4b6" />
      {[280, 298, 316, 334].map((y) => (
        <path key={y} d={`M668 ${y}H802`} stroke="#b3ab9b" strokeWidth="2" />
      ))}
      <rect x="690" y="241" width="56" height="7" fill="#eef0f2" />
      <rect x="806" y="268" width="22" height="60" fill="#f7f3ea" opacity="0.6" />
      <rect x="640" y="350" width="190" height="10" fill={C.concreteDark} />

      {/* Driveway: one section has dropped */}
      <rect x="832" y="350" width="58" height="11" fill={C.slab} />
      <polygon points="893,356 946,360 946,371 893,367" fill="#b0aba2" />
      <rect x="949" y="350" width="51" height="11" fill={C.slab} />
      <path d="M850 350l6 5-4 6" stroke={C.crack} strokeWidth="1.5" fill="none" />

      {/* Roof and chimney */}
      <rect x="520" y="86" width="30" height="60" fill="#8a4b3b" />
      <polygon points="128,178 392,58 656,178" fill={C.roof} />

      {/* Brick front, with a stair-step crack */}
      <rect x="150" y="176" width="130" height="176" fill="url(#est-brick)" />
      <rect x="182" y="204" width="62" height="70" fill={C.glass} stroke="#f4efe6" strokeWidth="6" />
      <path d="M232 290v10h20v10h-20v10h20v10h-20v10h20v12" stroke={C.crack} strokeWidth="3" fill="none" />

      {/* Rooms, cut open */}
      <rect x="280" y="176" width="360" height="176" fill={C.interior} />
      <rect x="276" y="176" width="7" height="176" fill="#8c8578" />
      <rect x="634" y="176" width="8" height="176" fill="#8c8578" />
      <rect x="452" y="176" width="6" height="176" fill="#ddd5c8" />
      <rect x="380" y="214" width="56" height="58" fill={C.glass} stroke="#fff" strokeWidth="5" />
      <rect x="300" y="310" width="96" height="34" rx="6" fill="#7c8794" />
      <rect x="296" y="300" width="20" height="44" rx="5" fill="#6a7582" />
      <rect x="500" y="300" width="112" height="44" fill="#d1c6b5" />
      <rect x="505" y="222" width="102" height="28" fill="#d1c6b5" />
      <circle cx="560" cy="282" r="5" fill="#9aa3ad" />

      {/* Floor framing */}
      <rect x="280" y="352" width="360" height="18" fill={C.wood} />
      {Array.from({ length: 15 }, (_, i) => (
        <rect key={i} x={290 + i * 24} y="355" width="10" height="12" fill={C.woodDark} />
      ))}

      {/* Foundation wall, the soil cut away in front of it */}
      <rect x="150" y="352" width="130" height="166" fill="url(#est-block)" />
      <rect x="140" y="516" width="152" height="14" fill={C.concreteDark} />

      {/* Basement */}
      <rect x="283" y="370" width="177" height="140" fill="#d8d2c7" />
      <path d="M300 380l8 22-6 18 9 26-5 20" stroke={C.crack} strokeWidth="2" fill="none" />
      {[[340, 410], [356, 422], [330, 430]].map(([x, y]) => (
        <ellipse key={`${x}-${y}`} cx={x} cy={y} rx="9" ry="6" fill="#f6f4ee" opacity="0.9" />
      ))}
      <rect x="400" y="430" width="44" height="78" fill="none" stroke="#a69e8f" strokeWidth="3" />
      <path d="M400 456h44M400 482h44" stroke="#a69e8f" strokeWidth="3" />
      <rect x="283" y="508" width="185" height="12" fill={C.concreteDark} />
      <ellipse cx="370" cy="507" rx="44" ry="5" fill={C.water} />
      <rect x="460" y="370" width="12" height="152" fill={C.concreteDark} />

      {/* Crawl space */}
      <rect x="472" y="370" width="162" height="58" fill={C.dark} />
      <rect x="472" y="426" width="162" height="12" fill={C.soilDark} />
      <rect x="520" y="370" width="14" height="58" fill={C.concrete} />
      <rect x="586" y="370" width="14" height="58" fill={C.concrete} />
      <ellipse cx="560" cy="428" rx="26" ry="4" fill={C.water} opacity="0.85" />
      <rect x="634" y="352" width="12" height="92" fill="url(#est-block)" />
    </Svg>
  );
}

/** The foundation wall from outside, below grade. */
export function FoundationScene() {
  return (
    <Svg>
      <Patterns />
      <rect width="1000" height="170" fill={C.sky} />
      <rect y="164" width="1000" height="12" fill={C.grass} />
      <rect y="174" width="1000" height="386" fill={C.soil} />
      {[[90, 260], [140, 400], [880, 300], [920, 450], [60, 500]].map(([x, y]) => (
        <ellipse key={`${x}-${y}`} cx={x} cy={y} rx="18" ry="6" fill={C.soilDark} />
      ))}
      {/* The house above grade */}
      <rect x="250" y="0" width="500" height="122" fill="url(#est-siding)" />
      <rect x="560" y="18" width="110" height="80" fill={C.glass} stroke="#f4efe6" strokeWidth="6" />
      {/* The wall */}
      <rect x="250" y="120" width="500" height="362" fill="url(#est-block)" />
      {/* 1. Stair-step crack along the mortar joints */}
      <path d="M330 122v25h30v30h30v30h30v30h30" stroke={C.crack} strokeWidth="4" fill="none" />
      {/* 2. Leaking crack */}
      <path d="M640 136l-6 22 8 18-5 22" stroke={C.crack} strokeWidth="3" fill="none" />
      <path d="M637 200v26M642 204v18" stroke={C.water} strokeWidth="3" strokeLinecap="round" />
      {/* 3. Horizontal crack, soil pushing in */}
      <path d="M252 302C400 312 600 312 748 302" stroke={C.crack} strokeWidth="5" fill="none" />
      {[270, 330].map((y) => (
        <g key={y}>
          <path d={`M120 ${y}H220`} stroke="#f1e6d6" strokeWidth="4" />
          <path d={`M208 ${y - 10}l14 10-14 10`} stroke="#f1e6d6" strokeWidth="4" fill="none" />
        </g>
      ))}
      {/* 4. Footing, dropped at the right-hand corner */}
      <rect x="236" y="482" width="380" height="24" fill={C.concreteDark} />
      <polygon points="616,488 770,500 770,524 616,512" fill={C.concreteDark} />
      <polygon points="616,482 750,482 750,497 616,488" fill={C.crack} />
    </Svg>
  );
}

/** Inside the basement, looking at one wall. */
export function BasementScene() {
  return (
    <Svg>
      <Patterns />
      <rect width="1000" height="440" fill="url(#est-block-in)" />
      <rect width="1000" height="44" fill={C.wood} />
      {Array.from({ length: 13 }, (_, i) => (
        <rect key={i} x={10 + i * 80} y="0" width="18" height="44" fill={C.woodDark} />
      ))}
      <rect x="110" y="60" width="140" height="64" fill="#eef3f6" stroke="#bdb8ae" strokeWidth="4" />
      {/* 1. Leaking crack */}
      <path d="M300 120l-10 50 14 46-12 52 10 50-8 40" stroke={C.crack} strokeWidth="4" fill="none" />
      <rect x="292" y="300" width="10" height="110" fill={C.water} opacity="0.45" />
      {/* 2. White staining */}
      {[[620, 220, 38], [668, 250, 30], [700, 210, 24], [640, 280, 26], [700, 290, 20]].map(([x, y, r]) => (
        <ellipse key={`${x}-${y}`} cx={x} cy={y} rx={r} ry={r * 0.7} fill="#faf9f5" opacity="0.92" />
      ))}
      {/* 3. Wet band where wall meets floor */}
      <rect y="404" width="1000" height="36" fill="#8f8a80" opacity="0.55" />
      <rect y="438" width="1000" height="122" fill="#aaa59c" />
      {/* 4. Standing water */}
      <ellipse cx="410" cy="498" rx="150" ry="24" fill={C.water} opacity="0.9" />
      {/* 5. Sump and discharge pipe */}
      <ellipse cx="850" cy="486" rx="62" ry="15" fill="#3f444b" />
      <rect x="842" y="150" width="16" height="336" fill="#f2f2f2" stroke="#c4c4c4" />
      <rect x="842" y="136" width="158" height="16" fill="#f2f2f2" stroke="#c4c4c4" />
    </Svg>
  );
}

/** Crawl space: joists above, bare ground below. */
export function CrawlScene() {
  return (
    <Svg>
      <Patterns />
      <rect width="1000" height="560" fill={C.dark} />
      <rect width="1000" height="96" fill={C.wood} />
      {Array.from({ length: 15 }, (_, i) => (
        <rect key={i} x={i * 70} y="60" width="24" height="56" fill={C.woodDark} />
      ))}
      {/* 4. Sagging joist */}
      <path d="M640 112Q780 186 920 112" stroke={C.woodDark} strokeWidth="22" fill="none" />
      {/* 1. Mold on the joists */}
      {[[170, 80, 26], [220, 96, 18], [260, 72, 22], [300, 100, 14], [140, 104, 12]].map(([x, y, r]) => (
        <ellipse key={`${x}-${y}`} cx={x} cy={y} rx={r} ry={r * 0.75} fill={C.mold} opacity="0.85" />
      ))}
      {/* 2. Sweating duct */}
      <rect x="400" y="150" width="390" height="36" rx="18" fill="#a9adb2" />
      {[440, 500, 560, 620, 680, 740].map((x, i) => (
        <circle key={x} cx={x} cy={196 + (i % 2) * 10} r="4" fill={C.water} />
      ))}
      <rect y="120" width="40" height="320" fill="url(#est-block)" />
      <rect x="960" y="120" width="40" height="320" fill="url(#est-block)" />
      {/* Ground, torn vapor barrier, 3. standing water */}
      <rect y="420" width="1000" height="140" fill={C.soilDark} />
      <polygon points="40,428 300,422 330,446 290,470 250,452 200,478 40,470" fill="#e6e3dc" opacity="0.92" />
      <ellipse cx="700" cy="482" rx="160" ry="20" fill={C.water} opacity="0.85" />
    </Svg>
  );
}

/** Floor framing from the side: rim joist, joists on the beam, posts. */
export function FramingScene() {
  return (
    <Svg>
      <rect width="1000" height="560" fill={C.dark} />
      {/* Floor above, dipping on the right: 1. sagging floor */}
      <path d="M0 0H1000V34Q780 76 600 34H0Z" fill={C.interior} />
      <path d="M0 34H600Q780 76 1000 34V54Q780 96 600 54H0Z" fill={C.wood} />
      {Array.from({ length: 16 }, (_, i) => {
        const x = 50 + i * 60;
        const sag = x > 600 ? Math.sin(((x - 600) / 400) * Math.PI) * 20 : 0;
        return <rect key={x} x={x} y={54 + sag} width="22" height={66} fill={C.woodDark} />;
      })}
      {/* 4. Rotted rim joist */}
      <rect x="0" y="34" width="44" height="140" fill="#7d5a32" />
      {[[16, 70], [28, 110], [14, 140]].map(([x, y]) => (
        <ellipse key={`${x}-${y}`} cx={x} cy={y} rx="12" ry="16" fill="#3e2c19" />
      ))}
      {/* 2. Main beam, cracked */}
      <rect x="44" y="120" width="956" height="48" fill="#8c6a3d" />
      <path d="M480 122l14 12-10 10 16 12-8 10" stroke={C.crack} strokeWidth="4" fill="none" />
      {/* 3. Posts, one leaning */}
      <rect x="220" y="168" width="26" height="262" fill="#a68252" />
      <rect x="540" y="168" width="26" height="262" fill="#a68252" transform="rotate(7 553 430)" />
      <rect x="840" y="168" width="26" height="262" fill="#a68252" />
      <rect y="430" width="1000" height="130" fill={C.soilDark} />
      <rect x="200" y="424" width="66" height="14" fill={C.concrete} />
      <rect x="820" y="424" width="66" height="14" fill={C.concrete} />
    </Svg>
  );
}

/** The driveway from the side: a dropped slab and the ledge it leaves. */
export function DrivewayScene() {
  return (
    <Svg>
      <Patterns />
      <rect width="1000" height="300" fill={C.sky} />
      <rect x="0" y="40" width="180" height="262" fill="url(#est-siding)" />
      <rect x="40" y="110" width="140" height="192" fill="#cbc4b6" />
      <rect y="300" width="1000" height="260" fill={C.soil} />
      {/* 1. Slab with an open crack */}
      <rect x="180" y="290" width="240" height="26" fill={C.slab} />
      <path d="M296 290l-6 10 8 6-4 10" stroke={C.crack} strokeWidth="3" fill="none" />
      {/* 2. Sunken slab, soil washed out under it */}
      <polygon points="424,302 660,322 660,348 424,328" fill="#b8b3aa" />
      <polygon points="424,328 660,348 660,360 424,340" fill={C.soilDark} />
      {/* 3. The next slab, left standing: the ledge */}
      <rect x="664" y="290" width="240" height="26" fill={C.slab} />
      <rect x="908" y="290" width="92" height="26" fill={C.slab} />
    </Svg>
  );
}

/** A wall of lap siding close up: roof edge, a window, the ground. */
export function SidingScene() {
  return (
    <Svg>
      <Patterns />
      <rect width="1000" height="560" fill={C.sky} />
      {/* Roof edge, fascia and soffit; 1. rotted on the right */}
      <rect width="1000" height="60" fill={C.roof} />
      <rect y="60" width="1000" height="24" fill="#efe9df" />
      <rect y="84" width="1000" height="20" fill="#e2dccf" />
      {[[650, 64, 70], [720, 70, 60], [780, 88, 50]].map(([x, y, w]) => (
        <rect key={x} x={x} y={y} width={w} height="14" fill="#7d5a32" opacity="0.85" />
      ))}
      <rect x="748" y="88" width="34" height="12" fill={C.dark} />
      {/* The wall */}
      <rect y="104" width="1000" height="400" fill="url(#est-lap)" />
      <rect x="40" y="104" width="30" height="400" fill="#f4efe6" />
      {/* 2. Warped, faded boards */}
      <rect x="620" y="150" width="380" height="150" fill="#f7f3ea" opacity="0.55" />
      {[176, 204, 232, 260, 288].map((y) => (
        <path key={y} d={`M620 ${y}q48 -9 95 0t95 0t95 0t95 0`} stroke="#b9b09c" strokeWidth="3" fill="none" />
      ))}
      {/* Window, 4. with a water stain under it */}
      <rect x="380" y="170" width="180" height="190" fill={C.glass} stroke="#f4efe6" strokeWidth="14" />
      <path d="M470 177V353M387 265H553" stroke="#f4efe6" strokeWidth="6" />
      <rect x="370" y="360" width="200" height="14" fill="#f4efe6" />
      <path d="M432 374c-4 30 6 50 0 96M458 374c4 28-6 46 2 84" stroke="#8f877a" strokeWidth="14" opacity="0.45" fill="none" strokeLinecap="round" />
      {/* 3. Cracked board */}
      <path d="M170 296l26 6 18-8 28 10 22-6" stroke={C.crack} strokeWidth="3" fill="none" />
      {/* 5. Missing board, housewrap showing */}
      <rect x="700" y="390" width="170" height="26" fill="#eef0f2" />
      <path d="M712 398h40M770 398h40M828 398h30" stroke="#9bb0c4" strokeWidth="3" />
      {/* Ground */}
      <rect y="504" width="1000" height="56" fill={C.grass} />
      <ellipse cx="180" cy="508" rx="110" ry="40" fill="#6c9450" />
    </Svg>
  );
}

export const scenes = {
  foundation: FoundationScene,
  basement: BasementScene,
  crawl: CrawlScene,
  framing: FramingScene,
  driveway: DrivewayScene,
  siding: SidingScene,
};
