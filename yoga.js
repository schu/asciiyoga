// Yoga poses as technical ASCII stick figures.
//
// Every segment is an absolute direction in degrees, like a compass drawn on
// paper: 0 = right, 90 = up, 180 = left, -90 = down.
// "side" poses are seen from the figure's right, facing right (+x).
// "front" poses face the viewer; the figure's left side is screen-right.
//
//   torso  pelvis -> chest      neck  chest -> head
//   arms   [upper arm, forearm] per side
//   legs   [thigh, shin, foot]  per side; foot null = toes point at the viewer
//   gaze   optional line-of-sight angle. Defaults: side view looks straight
//          out of the face; front view looks at the viewer.
(function () {
  const POSES = [
    {
      id: "mountain", name: "Mountain", sanskrit: "Tadasana", view: "front",
      desc: "The foundation of all standing poses: grounded feet, long spine.",
      torso: 90, neck: 90,
      arms: { left: [-85, -88], right: [-95, -92] },
      legs: { left: [-90, -90, null], right: [-90, -90, null] },
    },
    {
      id: "tree", name: "Tree", sanskrit: "Vrksasana", view: "front",
      desc: "A one-legged balance with the foot resting on the inner standing leg.",
      torso: 90, neck: 90,
      arms: { left: [75, 115], right: [105, 65] },
      legs: { left: [-90, -90, null], right: [-130, -25, -90] },
    },
    {
      id: "warrior-2", name: "Warrior II", sanskrit: "Virabhadrasana II", view: "front",
      desc: "A wide lunge with arms extended, gazing past the front hand.",
      torso: 90, neck: 90, gaze: 180,
      arms: { left: [0, 0], right: [180, 180] },
      legs: { left: [-35, -35, null], right: [-170, -90, 180] },
    },
    {
      id: "chair", name: "Chair", sanskrit: "Utkatasana", view: "side",
      desc: "Sit back into an invisible chair with arms reaching overhead.",
      torso: 70, neck: 75,
      arms: { left: [75, 78], right: [75, 78] },
      legs: { left: [-25, -105, 0], right: [-25, -105, 0] },
    },
    {
      id: "forward-fold", name: "Standing Forward Fold", sanskrit: "Uttanasana", view: "side",
      desc: "Hinge from the hips and let the upper body hang toward the legs.",
      torso: -40, neck: -55,
      arms: { left: [-95, -95], right: [-95, -95] },
      legs: { left: [-90, -90, 0], right: [-90, -90, 0] },
    },
    {
      id: "downward-dog", name: "Downward-Facing Dog", sanskrit: "Adho Mukha Svanasana", view: "side",
      desc: "An inverted V that stretches the hamstrings, calves and shoulders.",
      torso: -45, neck: -55,
      arms: { left: [-50, -50], right: [-50, -50] },
      legs: { left: [-115, -115, 0], right: [-115, -115, 0] },
    },
    {
      id: "plank", name: "Forearm Plank", sanskrit: "Phalakasana (variation)", view: "side",
      desc: "A straight line from head to heels, supported on the forearms.",
      torso: 6, neck: 10, gaze: -45,
      arms: { left: [-90, 0], right: [-90, 0] },
      legs: { left: [-174, -174, -100], right: [-174, -174, -100] },
    },
    {
      id: "cobra", name: "Cobra", sanskrit: "Bhujangasana", view: "side",
      desc: "A gentle backbend from lying prone, opening the chest.",
      torso: 45, neck: 60, gaze: 10,
      arms: { left: [-100, -12], right: [-100, -12] },
      legs: { left: [180, 180, 180], right: [180, 180, 180] },
    },
    {
      id: "locust", name: "Locust", sanskrit: "Salabhasana", view: "side",
      desc: "Lift chest, arms and legs from the floor to strengthen the back body.",
      torso: 20, neck: 30, gaze: -15,
      arms: { left: [-165, -165], right: [-165, -165] },
      legs: { left: [170, 170, 170], right: [170, 170, 170] },
    },
    {
      id: "bridge", name: "Bridge", sanskrit: "Setu Bandha Sarvangasana", view: "side",
      desc: "Lift the hips from lying on your back, opening the hip flexors.",
      torso: -155, neck: 180,
      arms: { left: [0, 0], right: [0, 0] },
      legs: { left: [15, -95, 0], right: [15, -95, 0] },
    },
    {
      id: "seated-forward-fold", name: "Seated Forward Fold", sanskrit: "Paschimottanasana", view: "side",
      desc: "Fold forward over straight legs from a tall seated position.",
      torso: 40, neck: 25, gaze: 0,
      arms: { left: [0, -54], right: [0, -54] }, // hands hold the feet
      legs: { left: [0, 0, 90], right: [0, 0, 90] },
    },
  ];

  // Segment lengths in metres, roughly an adult.
  const LEN = { torso: 0.5, neck: 0.1, head: 0.1, upperArm: 0.3, forearm: 0.27, thigh: 0.45, shin: 0.43 };
  const FOOT = { side: 0.15, front: 0.07 };
  const HALF_WIDTH = { shoulder: 0.18, hip: 0.1 }; // front view only

  // Character grid: a monospace cell is about twice as tall as it is wide.
  const ROWS_PER_M = 14;
  const COLS_PER_M = 27;

  const rad = (deg) => (deg * Math.PI) / 180;
  const step = ([x, y], deg, len) => [x + len * Math.cos(rad(deg)), y + len * Math.sin(rad(deg))];

  // Pose -> geometry in metres, floored so the lowest point sits on y = 0.
  function solve(pose) {
    const front = pose.view === "front";
    const pelvis = [0, 0];
    const chest = step(pelvis, pose.torso, LEN.torso);
    const neckTop = step(chest, pose.neck, LEN.neck);
    const head = step(neckTop, pose.neck, LEN.head);
    const across = pose.torso - 90; // toward the figure's left (screen-right) in front view
    const offset = (p, side, w) => (front ? step(p, across + (side === "left" ? 0 : 180), w) : p);

    const segs = [], joints = [], ends = [];
    const add = (a, b, side, kind = "torso") => segs.push({ a, b, side, kind });
    add(pelvis, chest, "mid");
    add(chest, head, "mid"); // runs into the head glyph, so the neck always connects
    for (const side of ["left", "right"]) {
      const sh = offset(chest, side, HALF_WIDTH.shoulder);
      const hip = offset(pelvis, side, HALF_WIDTH.hip);
      if (front) { add(chest, sh, "mid"); add(pelvis, hip, "mid"); }
      const [ua, fa] = pose.arms[side];
      const elbow = step(sh, ua, LEN.upperArm);
      const wrist = step(elbow, fa, LEN.forearm);
      add(sh, elbow, side, "arm");
      add(elbow, wrist, side, "arm");
      const [th, sn, ft] = pose.legs[side];
      const knee = step(hip, th, LEN.thigh);
      const ankle = step(knee, sn, LEN.shin);
      add(hip, knee, side, "leg");
      add(knee, ankle, side, "leg");
      joints.push(
        { p: sh, side, kind: "arm" }, { p: elbow, side, kind: "arm" },
        { p: hip, side, kind: "leg" }, { p: knee, side, kind: "leg" }, { p: ankle, side, kind: "leg" });
      ends.push({ p: wrist, dir: fa, side, kind: "arm" });
      if (ft === null) {
        ends.push({ p: ankle, dir: null, side, kind: "leg" });
      } else {
        const toe = step(ankle, ft, FOOT[pose.view]);
        add(ankle, toe, side, "leg");
        ends.push({ p: toe, dir: ft, side, kind: "leg" });
      }
    }

    const gaze = pose.gaze !== undefined ? pose.gaze : front ? null : pose.neck - 90;
    const all = segs.flatMap((s) => [s.a, s.b]);
    const minY = Math.min(head[1] - LEN.head, ...all.map((p) => p[1]));
    const lift = ([x, y]) => [x, y - minY];
    return {
      head: lift(head),
      gaze,
      segs: segs.map((s) => ({ ...s, a: lift(s.a), b: lift(s.b) })),
      joints: joints.map((j) => ({ ...j, p: lift(j.p) })),
      ends: ends.map((e) => ({ ...e, p: lift(e.p) })),
    };
  }

  // Screen-space angle of a direction, corrected for the cell aspect ratio.
  const screenAngle = (deg) =>
    (Math.atan2(Math.sin(rad(deg)) * ROWS_PER_M, Math.cos(rad(deg)) * COLS_PER_M) * 180) / Math.PI;

  function lineChar(a) {
    const t = ((a % 180) + 180) % 180; // fold to [0, 180)
    if (t < 22.5 || t >= 157.5) return "-";
    if (t < 67.5) return "/";
    if (t < 112.5) return "|";
    return "\\";
  }

  function arrowChar(deg) {
    const a = ((screenAngle(deg) % 360) + 360) % 360;
    if (a < 45 || a >= 315) return ">";
    if (a < 135) return "^";
    if (a < 225) return "<";
    return "v";
  }

  const esc = (c) => (c === "<" ? "&lt;" : c === ">" ? "&gt;" : c === "&" ? "&amp;" : c);

  // Returns HTML for a <pre>: the figure drawn on a character grid.
  // Options: labels = false drops the view label and the scale bar (for thumbnails).
  function toAscii(pose, { labels = true } = {}) {
    const g = solve(pose);
    const front = pose.view === "front";
    const far = front ? null : "left"; // side view: left limbs are behind

    // Head glyph and line of sight share one direction, snapped to the 8 grid
    // directions, so the eye and the dotted line always line up.
    const dir8 = g.gaze === null ? null : ((Math.round(screenAngle(g.gaze) / 45) % 8) + 8) % 8;
    const STEPS = [[1, 0], [1, -1], [0, -1], [-1, -1], [-1, 0], [-1, 1], [0, 1], [1, 1]]; // [col, row], row grows down
    const EYES = [">", ">", "^", "<", "<", "<", "v", ">"];
    let glyph;
    if (front) glyph = dir8 === null ? "(o o)" : STEPS[dir8][0] < 0 ? "(oo )" : STEPS[dir8][0] > 0 ? "( oo)" : "(o o)";
    else glyph = "(" + EYES[dir8] + ")";
    const half = Math.floor(glyph.length / 2);
    const SIGHT_LEN = 4; // three dots and an arrowhead

    // Extents in metres, including the head glyph and room for the line of sight.
    const reach = dir8 === null ? [0, 0] :
      [STEPS[dir8][0] * (half + SIGHT_LEN), -STEPS[dir8][1] * SIGHT_LEN];
    const pts = [...g.segs.flatMap((s) => [s.a, s.b]),
      [g.head[0] - (half + 1) / COLS_PER_M, g.head[1]], [g.head[0] + (half + 1) / COLS_PER_M, g.head[1]],
      [g.head[0] + reach[0] / COLS_PER_M, g.head[1] + reach[1] / ROWS_PER_M]];
    const xMin = Math.min(...pts.map((p) => p[0]));
    const xMax = Math.max(...pts.map((p) => p[0]));
    const yMax = Math.max(...pts.map((p) => p[1]));

    const PAD = 2;
    const width = Math.max(Math.round((xMax - xMin) * COLS_PER_M) + 2 * PAD + 1, COLS_PER_M + 4);
    const xOff = (width - Math.round((xMax - xMin) * COLS_PER_M)) / 2;
    const floorRow = Math.round(yMax * ROWS_PER_M) + 2; // the row just below y = 0
    const height = floorRow + 1;
    const grid = Array.from({ length: height }, () => Array.from({ length: width }, () => null));

    const col = (x) => Math.round((x - xMin) * COLS_PER_M + xOff);
    const row = (y) => 1 + Math.round((yMax - y) * ROWS_PER_M);
    const put = (p, ch, cls, prio) => putCell(row(p[1]), col(p[0]), ch, cls, prio);
    function putCell(r, c, ch, cls, prio) {
      if (r < 0 || r >= floorRow || c < 0 || c >= width) return;
      const cur = grid[r][c];
      if (cur && cur.prio > prio) return;
      if (cur && cur.prio === prio && !/\bfar\b/.test(cur.cls) && /\bfar\b/.test(cls)) return; // near side wins
      grid[r][c] = { ch, cls, prio };
    }
    // Classes: arm | leg | torso, plus far (behind) or near.
    const cls = (side, kind) => `${kind} ${side === far ? "far" : "near"}`;

    // 1. Limb and torso lines, one cell per step along the longer axis.
    for (const s of g.segs) {
      const c0 = col(s.a[0]), r0 = row(s.a[1]), c1 = col(s.b[0]), r1 = row(s.b[1]);
      const ch = lineChar((Math.atan2(r0 - r1, c1 - c0) * 180) / Math.PI);
      const n = Math.max(1, Math.abs(c1 - c0), Math.abs(r1 - r0));
      for (let i = 0; i <= n; i++) putCell(Math.round(r0 + ((r1 - r0) * i) / n), Math.round(c0 + ((c1 - c0) * i) / n), ch, cls(s.side, s.kind), 1);
    }
    // 2. Joints.
    for (const j of g.joints) put(j.p, "+", cls(j.side, j.kind), 2);
    // 3. Hands and toes: an arrowhead in the direction they point, "o" toward the viewer.
    for (const e of g.ends) put(e.p, e.dir === null ? "o" : arrowChar(e.dir), cls(e.side, e.kind) + " end", 3);
    // 4. Line of sight, starting in the cell just outside the head glyph.
    const hr = row(g.head[1]), hc = col(g.head[0]);
    if (dir8 !== null) {
      const [dc, dr] = STEPS[dir8];
      const cells = [];
      for (let k = 0; k < SIGHT_LEN; k++) {
        const r = hr + dr * (1 + k), c = dc === 0 ? hc : hc + dc * (half + 1 + k);
        if (r < 0 || r >= floorRow || c < 0 || c >= width) break; // stop at the floor or edge
        cells.push([r, c]);
      }
      cells.forEach(([r, c], k) => putCell(r, c, k === cells.length - 1 ? EYES[dir8] : ".", "gaze", 4));
    }
    // 5. The head with its eyes, on top of everything.
    [...glyph].forEach((ch, i) => {
      const c = hc - half + i;
      if (hr >= 0 && hr < floorRow && c >= 0 && c < width) grid[hr][c] = { ch, cls: "head", prio: 5 };
    });

    // Floor with hatching.
    grid[floorRow] = Array.from({ length: width }, (_, i) => ({ ch: i % 2 ? " " : "/", cls: "floor" }));

    const lines = grid.map((r) =>
      r.map((cell) => (cell ? `<span class="${cell.cls}">${esc(cell.ch)}</span>` : " ")).join("").replace(/\s+$/, ""));

    // Title and scale bar.
    const label = front ? "FRONT VIEW" : "SIDE VIEW - from right";
    const bar = "|" + "1 m".padStart(Math.floor((COLS_PER_M - 2 + 3) / 2), "-").padEnd(COLS_PER_M - 2, "-") + "|";
    if (!labels) return lines.slice(1).join("\n");
    return [`<span class="label top">${label}</span>`, ...lines.slice(1), `<span class="label bottom">${bar}</span>`].join("\n");
  }

  globalThis.Yoga = { POSES, toAscii };
})();
