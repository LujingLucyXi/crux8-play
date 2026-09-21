// Bespoke flat-vector illustration per archetype.
// One cohesive style: rounded ink outlines, warm flat fills, a soft accent
// scene tile with climbing motifs, and a character acting out the archetype.
// Returned as a complete <svg> string so the result screen AND the server
// share card render the exact same artwork (no Satori SVG quirks).

const INK = "#22323C";
const SKIN = "#F2C6A0";
const SKIN_SH = "#E0A87F";
const WHITE = "#FCF8F0";
const HAIR = "#33241F";

function darken(hex: string, f = 0.5): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return (
    "#" +
    [r, g, b].map((v) => Math.round(v * f).toString(16).padStart(2, "0")).join("")
  );
}
function lighten(hex: string, f = 0.5): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const mix = (v: number) => Math.round(v + (255 - v) * f);
  return "#" + [r, g, b].map((v) => mix(v).toString(16).padStart(2, "0")).join("");
}

// Rounded scene tile with a soft accent gradient + faint climbing holds.
function frame(accent: string): string {
  const top = lighten(accent, 0.35);
  const bot = darken(accent, 0.82);
  return (
    `<rect x="4" y="4" width="232" height="232" rx="44" fill="url(#bg)"/>` +
    `<rect x="4" y="4" width="232" height="232" rx="44" fill="none" stroke="${WHITE}" stroke-width="6" opacity="0.9"/>` +
    // faint climbing holds
    `<g fill="${WHITE}" opacity="0.14">` +
    `<path d="M40 70 q14 -10 22 2 q6 12 -8 16 q-18 4 -14 -18Z"/>` +
    `<circle cx="198" cy="150" r="12"/>` +
    `<path d="M56 186 q10 -8 18 0 q6 8 -4 14 q-14 6 -14 -14Z"/>` +
    `</g>` +
    `<defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">` +
    `<stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bot}"/>` +
    `</linearGradient></defs>`
  );
}

function head(cx: number, cy: number, opts: { hair?: string; r?: number } = {}): string {
  const r = opts.r ?? 20;
  const hair = opts.hair ?? HAIR;
  return (
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${SKIN}" stroke="${INK}" stroke-width="5"/>` +
    `<path d="M${cx - r - 1} ${cy - 4} a${r + 1} ${r + 1} 0 0 1 ${2 * (r + 1)} 0 q-${r} -14 -${2 * (r + 1)} 0Z" fill="${hair}"/>`
  );
}

// Each scene draws INSIDE the frame. Returns inner markup.
function scene(id: string, accent: string): string {
  const dk = darken(accent, 0.55);
  const lt = lighten(accent, 0.4);
  switch (id) {
    case "send-machine":
      return (
        // dyno lunge to a hold, fire at feet
        `<circle cx="176" cy="52" r="15" fill="${WHITE}" stroke="${INK}" stroke-width="5"/>` +
        head(96, 96, { r: 19 }) +
        `<path d="M96 116 q26 6 26 34 l-6 30" fill="none" stroke="${INK}" stroke-width="16" stroke-linecap="round"/>` +
        `<path d="M100 122 L150 70" stroke="${SKIN}" stroke-width="15" stroke-linecap="round"/>` +
        `<path d="M92 128 L64 150" stroke="${SKIN}" stroke-width="14" stroke-linecap="round"/>` +
        `<path d="M112 176 l14 34 M104 178 l-10 34" stroke="${INK}" stroke-width="15" stroke-linecap="round"/>` +
        // fire
        `<path d="M92 214 q-14 -22 4 -34 q-4 16 10 12 q10 20 -14 22Z" fill="${accent}" stroke="${INK}" stroke-width="4"/>` +
        `<path d="M120 214 q-10 -16 3 -25 q-3 12 7 9 q7 15 -10 16Z" fill="${lt}" stroke="${INK}" stroke-width="3"/>`
      );
    case "flex-lord":
      return (
        // shirtless one-arm hang, phone on tripod filming, chalk cloud, sparkle
        `<circle cx="176" cy="44" r="13" fill="${WHITE}" stroke="${INK}" stroke-width="5"/>` +
        // chalk cloud
        `<g fill="${WHITE}" opacity="0.85"><circle cx="82" cy="150" r="18"/><circle cx="104" cy="158" r="14"/><circle cx="66" cy="160" r="12"/></g>` +
        head(112, 84, { r: 19 }) +
        // raised gripping arm
        `<path d="M120 78 L166 46" stroke="${SKIN}" stroke-width="15" stroke-linecap="round"/>` +
        // torso with abs
        `<path d="M112 104 q18 4 16 30 l-4 26 q-14 6 -26 0 l-4 -26 q-2 -26 18 -30Z" fill="${SKIN}" stroke="${INK}" stroke-width="5"/>` +
        `<path d="M104 122 h18 M104 134 h18" stroke="${SKIN_SH}" stroke-width="3"/>` +
        // flex arm
        `<path d="M100 110 q-30 4 -22 34" fill="none" stroke="${SKIN}" stroke-width="14" stroke-linecap="round"/>` +
        `<path d="M108 172 l10 32 M100 174 l-8 32" stroke="${INK}" stroke-width="14" stroke-linecap="round"/>` +
        // tripod + phone
        `<path d="M186 150 l-8 40 M186 150 l8 40 M186 150 v-8" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>` +
        `<rect x="176" y="120" width="22" height="34" rx="5" fill="${dk}" stroke="${INK}" stroke-width="4"/>` +
        `<circle cx="187" cy="137" r="4" fill="${WHITE}"/>` +
        `<path d="M150 60 l0 12 M144 66 l12 0" stroke="${WHITE}" stroke-width="4" stroke-linecap="round"/>`
      );
    case "heartbreaker":
      return (
        // suave figure, big heart with carabiner-arrow, floating hearts
        `<path d="M120 92 q22 -30 44 -8 q18 20 -44 54 q-62 -34 -44 -54 q22 -22 44 8Z" fill="${accent}" stroke="${INK}" stroke-width="5"/>` +
        // arrow through heart
        `<path d="M84 78 L172 150" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>` +
        `<path d="M172 150 l-4 -14 l14 6Z" fill="${INK}"/>` +
        head(70, 176, { r: 17 }) +
        `<circle cx="66" cy="174" r="3" fill="${INK}"/>` +
        `<path d="M60 182 q8 6 16 0" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>` +
        // small floating hearts
        `<path d="M188 74 q6 -8 12 -2 q5 6 -12 16 q-17 -10 -12 -16 q6 -6 12 2Z" fill="${lt}" stroke="${INK}" stroke-width="3"/>` +
        `<path d="M40 118 q4 -6 9 -2 q4 4 -9 12 q-13 -8 -9 -12 q5 -4 9 2Z" fill="${WHITE}" opacity="0.9"/>`
      );
    case "beta-scientist":
      return (
        // studying a hold with a magnifying glass, question mark, clipboard
        head(92, 78, { r: 19, hair: "#2A2320" }) +
        // glasses
        `<circle cx="85" cy="80" r="6" fill="none" stroke="${INK}" stroke-width="3"/><circle cx="99" cy="80" r="6" fill="none" stroke="${INK}" stroke-width="3"/><path d="M91 80 h2" stroke="${INK}" stroke-width="3"/>` +
        `<path d="M92 98 q20 4 18 30 l-4 30 q-16 6 -28 0 l-2 -30 q0 -26 16 -30Z" fill="${dk}" stroke="${INK}" stroke-width="5"/>` +
        // arm holding magnifier
        `<path d="M104 116 L142 138" stroke="${SKIN}" stroke-width="13" stroke-linecap="round"/>` +
        `<circle cx="158" cy="150" r="22" fill="${WHITE}" opacity="0.5" stroke="${INK}" stroke-width="6"/>` +
        `<path d="M174 166 l18 18" stroke="${INK}" stroke-width="8" stroke-linecap="round"/>` +
        // hold under magnifier
        `<path d="M150 148 q10 -8 18 2 q4 10 -8 12 q-16 2 -10 -14Z" fill="${accent}" stroke="${INK}" stroke-width="3"/>` +
        `<path d="M78 162 l8 30 M90 164 l4 30" stroke="${INK}" stroke-width="13" stroke-linecap="round"/>` +
        // question mark
        `<text x="52" y="70" font-family="sans-serif" font-size="34" font-weight="800" fill="${WHITE}">?</text>`
      );
    case "sensei":
      return (
        // headband master pointing up, teaching a small student
        head(84, 78, { r: 20, hair: "#241C18" }) +
        `<path d="M62 74 h44" stroke="${accent}" stroke-width="8" stroke-linecap="round"/>` +
        `<path d="M104 74 l16 6 M104 80 l16 -2" stroke="${accent}" stroke-width="5" stroke-linecap="round"/>` +
        `<path d="M84 100 q22 4 20 30 l-4 30 q-18 6 -30 0 l-2 -30 q0 -26 16 -30Z" fill="${dk}" stroke="${INK}" stroke-width="5"/>` +
        // pointing-up arm
        `<path d="M96 116 L118 70" stroke="${SKIN}" stroke-width="13" stroke-linecap="round"/>` +
        `<circle cx="120" cy="64" r="6" fill="${SKIN}" stroke="${INK}" stroke-width="3"/>` +
        `<path d="M74 160 l8 30 M86 162 l4 30" stroke="${INK}" stroke-width="13" stroke-linecap="round"/>` +
        // small student
        `<circle cx="176" cy="150" r="13" fill="${SKIN}" stroke="${INK}" stroke-width="4"/>` +
        `<path d="M176 164 q14 2 13 20 l-2 18 q-11 4 -22 0 l-2 -18 q0 -18 13 -20Z" fill="${lt}" stroke="${INK}" stroke-width="4"/>`
      );
    case "zen-master":
      return (
        // meditating cross-legged on a floating hold, aura rings
        `<circle cx="120" cy="120" r="66" fill="none" stroke="${WHITE}" stroke-width="4" opacity="0.5"/>` +
        `<circle cx="120" cy="120" r="52" fill="none" stroke="${WHITE}" stroke-width="3" opacity="0.35"/>` +
        head(120, 92, { r: 19 }) +
        `<path d="M112 90 q4 3 8 0 M112 96 q8 5 16 0" fill="none" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>` +
        `<path d="M120 110 q26 4 24 30 q-24 8 -48 0 q-2 -26 24 -30Z" fill="${dk}" stroke="${INK}" stroke-width="5"/>` +
        // lotus legs
        `<path d="M92 150 q28 18 56 0 q-6 16 -28 16 q-22 0 -28 -16Z" fill="${SKIN}" stroke="${INK}" stroke-width="4"/>` +
        // resting hands
        `<circle cx="98" cy="144" r="6" fill="${SKIN}" stroke="${INK}" stroke-width="3"/><circle cx="142" cy="144" r="6" fill="${SKIN}" stroke="${INK}" stroke-width="3"/>` +
        // floating hold
        `<path d="M100 186 q20 -10 40 0 q6 14 -20 16 q-26 -2 -20 -16Z" fill="${accent}" stroke="${INK}" stroke-width="4"/>`
      );
    case "chiller":
      return (
        // lounging on a crash pad, sunglasses, cold drink
        `<rect x="34" y="150" width="172" height="44" rx="14" fill="${dk}" stroke="${INK}" stroke-width="5"/>` +
        `<path d="M34 172 h172" stroke="${INK}" stroke-width="3" opacity="0.5"/>` +
        // reclining body
        `<path d="M60 150 q40 -14 96 -2 q10 6 0 12 q-52 -10 -96 2 q-8 -6 0 -12Z" fill="${lt}" stroke="${INK}" stroke-width="4"/>` +
        head(72, 132, { r: 18 }) +
        // sunglasses
        `<path d="M62 130 h20 M62 130 v6 h8 v-6 M74 130 v6 h8 v-6" stroke="${INK}" stroke-width="4" fill="none"/>` +
        // arm behind head + drink
        `<path d="M150 148 l4 -30" stroke="${SKIN}" stroke-width="11" stroke-linecap="round"/>` +
        `<rect x="150" y="96" width="16" height="24" rx="3" fill="${WHITE}" stroke="${INK}" stroke-width="4"/>` +
        `<path d="M158 96 v-10" stroke="${INK}" stroke-width="3"/>` +
        // Zzz
        `<text x="150" y="70" font-family="sans-serif" font-size="26" font-weight="800" fill="${WHITE}">z</text>` +
        `<text x="168" y="56" font-family="sans-serif" font-size="18" font-weight="800" fill="${WHITE}">z</text>`
      );
    case "hype-beast":
      return (
        // megaphone, sound waves
        head(84, 84, { r: 19 }) +
        `<path d="M72 88 q12 10 24 0" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>` +
        `<path d="M84 104 q22 4 20 30 l-4 28 q-18 6 -30 0 l-2 -28 q0 -26 16 -30Z" fill="${dk}" stroke="${INK}" stroke-width="5"/>` +
        `<path d="M100 120 L134 108" stroke="${SKIN}" stroke-width="13" stroke-linecap="round"/>` +
        // megaphone
        `<path d="M132 96 l40 -16 v52 l-40 -16Z" fill="${accent}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
        `<rect x="126" y="100" width="10" height="24" rx="3" fill="${lt}" stroke="${INK}" stroke-width="4"/>` +
        // sound waves
        `<path d="M182 84 q14 22 0 44 M196 74 q22 34 0 64" fill="none" stroke="${WHITE}" stroke-width="5" stroke-linecap="round"/>` +
        `<path d="M74 168 l8 28 M86 170 l4 28" stroke="${INK}" stroke-width="13" stroke-linecap="round"/>`
      );
    case "competitor":
      return (
        // trophy on podium, medal
        `<rect x="96" y="150" width="48" height="52" rx="4" fill="${accent}" stroke="${INK}" stroke-width="5"/>` +
        `<rect x="48" y="176" width="48" height="26" rx="4" fill="${lt}" stroke="${INK}" stroke-width="5"/>` +
        `<rect x="144" y="188" width="48" height="14" rx="4" fill="${dk}" stroke="${INK}" stroke-width="5"/>` +
        `<text x="112" y="188" font-family="sans-serif" font-size="26" font-weight="800" fill="${WHITE}">1</text>` +
        // trophy
        `<path d="M100 60 h40 v14 q0 22 -20 26 q-20 -4 -20 -26Z" fill="${WHITE}" stroke="${INK}" stroke-width="5"/>` +
        `<path d="M100 66 q-16 0 -14 16 q2 10 14 8 M140 66 q16 0 14 16 q-2 10 -14 8" fill="none" stroke="${INK}" stroke-width="5"/>` +
        `<rect x="112" y="98" width="16" height="14" fill="${WHITE}" stroke="${INK}" stroke-width="4"/>` +
        `<rect x="102" y="112" width="36" height="10" rx="3" fill="${WHITE}" stroke="${INK}" stroke-width="4"/>` +
        `<text x="113" y="86" font-family="sans-serif" font-size="20" font-weight="800" fill="${accent}">★</text>`
      );
    case "dirtbag":
      return (
        // camper van, chalk bag, mountains
        `<path d="M30 120 l30 -40 h60 l10 40Z" fill="${dk}" stroke="${INK}" stroke-width="4" opacity="0.6"/>` +
        `<path d="M150 130 l34 -46 l34 46Z" fill="${lt}" stroke="${INK}" stroke-width="4" opacity="0.6"/>` +
        // van body
        `<rect x="44" y="118" width="150" height="70" rx="16" fill="${accent}" stroke="${INK}" stroke-width="6"/>` +
        `<rect x="150" y="112" width="46" height="30" rx="10" fill="${accent}" stroke="${INK}" stroke-width="6"/>` +
        `<rect x="158" y="120" width="30" height="20" rx="5" fill="${WHITE}" stroke="${INK}" stroke-width="4"/>` +
        `<rect x="62" y="134" width="34" height="30" rx="5" fill="${WHITE}" opacity="0.85" stroke="${INK}" stroke-width="4"/>` +
        `<path d="M62 150 h34 M79 134 v30" stroke="${INK}" stroke-width="3"/>` +
        `<circle cx="80" cy="192" r="16" fill="${INK}"/><circle cx="80" cy="192" r="6" fill="${WHITE}"/>` +
        `<circle cx="168" cy="192" r="16" fill="${INK}"/><circle cx="168" cy="192" r="6" fill="${WHITE}"/>` +
        // chalk bag hanging
        `<path d="M118 150 q-12 0 -12 14 q0 12 12 12 q12 0 12 -12 q0 -14 -12 -14Z" fill="${WHITE}" stroke="${INK}" stroke-width="4"/>`
      );
    case "gym-rat":
      return (
        // wall panel full of holds + lanyard keycard
        `<rect x="40" y="34" width="120" height="150" rx="12" fill="${dk}" stroke="${INK}" stroke-width="5"/>` +
        `<g stroke="${INK}" stroke-width="3">` +
        `<path d="M64 66 q12 -8 20 2 q4 12 -10 14 q-18 2 -10 -16Z" fill="${accent}"/>` +
        `<circle cx="128" cy="72" r="12" fill="${lt}"/>` +
        `<path d="M70 116 q12 -8 20 2 q4 12 -10 14 q-18 2 -10 -16Z" fill="${WHITE}"/>` +
        `<circle cx="128" cy="126" r="10" fill="${accent}"/>` +
        `<path d="M62 156 q12 -8 20 2 q4 12 -10 14 q-18 2 -10 -16Z" fill="${lt}"/>` +
        `<circle cx="126" cy="164" r="11" fill="${WHITE}"/>` +
        `</g>` +
        // lanyard + keycard
        `<path d="M186 40 l-14 60" stroke="${accent}" stroke-width="6"/>` +
        `<rect x="160" y="98" width="40" height="54" rx="6" fill="${WHITE}" stroke="${INK}" stroke-width="5"/>` +
        `<circle cx="180" cy="116" r="9" fill="${accent}"/>` +
        `<path d="M168 134 h24 M168 142 h16" stroke="${INK}" stroke-width="3"/>`
      );
    case "project-slayer":
      return (
        // roped climber facing a bullseye target on the wall
        `<circle cx="164" cy="96" r="42" fill="${WHITE}" stroke="${INK}" stroke-width="5"/>` +
        `<circle cx="164" cy="96" r="28" fill="${accent}"/>` +
        `<circle cx="164" cy="96" r="14" fill="${WHITE}"/>` +
        `<circle cx="164" cy="96" r="5" fill="${accent}"/>` +
        // rope
        `<path d="M60 200 q-14 -60 26 -80" fill="none" stroke="${lt}" stroke-width="6" stroke-linecap="round"/>` +
        head(80, 88, { r: 18 }) +
        `<path d="M80 104 q20 4 18 28 l-4 28 q-16 6 -26 0 l-2 -28 q0 -24 14 -28Z" fill="${dk}" stroke="${INK}" stroke-width="5"/>` +
        `<path d="M96 116 L124 100" stroke="${SKIN}" stroke-width="12" stroke-linecap="round"/>` +
        `<path d="M72 158 l6 30 M86 160 l4 30" stroke="${INK}" stroke-width="12" stroke-linecap="round"/>`
      );
    case "flow-state":
      return (
        // figure riding a wave of holds
        `<path d="M20 168 q40 -34 80 0 q40 34 120 0 v40 H20Z" fill="${accent}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>` +
        `<path d="M28 176 q40 -26 78 0 q40 26 106 0" fill="none" stroke="${WHITE}" stroke-width="4" opacity="0.6"/>` +
        head(112, 84, { r: 18 }) +
        `<path d="M112 100 q20 4 18 26 l-4 24 q-16 6 -26 0 l-2 -24 q0 -22 14 -26Z" fill="${dk}" stroke="${INK}" stroke-width="5"/>` +
        // outstretched arms, surfing
        `<path d="M100 112 L64 96 M124 112 L160 100" stroke="${SKIN}" stroke-width="12" stroke-linecap="round"/>` +
        `<path d="M104 148 l-6 22 M120 148 l6 22" stroke="${INK}" stroke-width="12" stroke-linecap="round"/>` +
        `<path d="M44 120 q10 4 4 14 M182 122 q-10 4 -4 14" fill="none" stroke="${WHITE}" stroke-width="4" stroke-linecap="round"/>`
      );
    case "social-butterfly":
      return (
        // figure with butterfly wings + two chat bubbles
        `<path d="M120 120 q-46 -44 -74 -8 q-16 26 22 40 q34 12 52 -12Z" fill="${accent}" stroke="${INK}" stroke-width="5"/>` +
        `<path d="M120 120 q46 -44 74 -8 q16 26 -22 40 q-34 12 -52 -12Z" fill="${lt}" stroke="${INK}" stroke-width="5"/>` +
        `<circle cx="72" cy="112" r="7" fill="${WHITE}"/><circle cx="168" cy="112" r="7" fill="${WHITE}"/>` +
        head(120, 96, { r: 17 }) +
        `<path d="M120 112 q16 2 15 24 l-3 26 q-12 5 -24 0 l-3 -26 q0 -22 15 -24Z" fill="${dk}" stroke="${INK}" stroke-width="5"/>` +
        // chat bubbles
        `<path d="M40 54 h44 q8 0 8 8 v18 q0 8 -8 8 h-30 l-12 10 v-10 q-8 0 -8 -8 v-18 q0 -8 6 -8Z" fill="${WHITE}" stroke="${INK}" stroke-width="4"/>` +
        `<path d="M156 44 h44 q8 0 8 8 v16 q0 8 -8 8 h-28 l-12 10 v-10 q-8 0 -8 -8 v-16 q0 -8 4 -8Z" fill="${WHITE}" stroke="${INK}" stroke-width="4"/>`
      );
    case "wildcard":
      return (
        // playing card + dice + varied holds
        `<g transform="rotate(-12 96 120)"><rect x="60" y="70" width="72" height="100" rx="12" fill="${WHITE}" stroke="${INK}" stroke-width="5"/>` +
        `<text x="70" y="98" font-family="sans-serif" font-size="26" font-weight="800" fill="${accent}">A</text>` +
        `<path d="M96 108 q16 -10 22 6 q4 16 -22 30 q-26 -14 -22 -30 q6 -16 22 -6Z" fill="${accent}"/></g>` +
        // dice
        `<g transform="rotate(10 168 150)"><rect x="146" y="128" width="46" height="46" rx="10" fill="${accent}" stroke="${INK}" stroke-width="5"/>` +
        `<circle cx="158" cy="140" r="4" fill="${WHITE}"/><circle cx="180" cy="140" r="4" fill="${WHITE}"/><circle cx="169" cy="151" r="4" fill="${WHITE}"/><circle cx="158" cy="162" r="4" fill="${WHITE}"/><circle cx="180" cy="162" r="4" fill="${WHITE}"/></g>` +
        // sparkle
        `<path d="M172 66 l0 16 M164 74 l16 0" stroke="${WHITE}" stroke-width="5" stroke-linecap="round"/>`
      );
    default:
      return head(120, 110, { r: 30 });
  }
}

export function archetypeArtSvg(id: string, accent: string): string {
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">` +
    frame(accent) +
    scene(id, accent) +
    `</svg>`
  );
}

export function archetypeArtDataUri(id: string, accent: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(archetypeArtSvg(id, accent))}`;
}
