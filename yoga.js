// Yoga poses as technical ASCII stick figures.
//
// Every segment is an absolute direction in degrees, like a compass drawn on
// paper: 0 = right, 90 = up, 180 = left, -90 = down.
// "side" poses are seen from the figure's right, facing right (+x).
// "front" poses face the viewer; the figure's left side is screen-right.
//
//   level  difficulty: "easy" | "medium" | "difficult"
//   torso  pelvis -> chest      neck  chest -> head
//   arms   [upper arm, forearm] per side
//   legs   [thigh, shin, foot]  per side; foot null = toes point at the viewer
//   gaze   optional line-of-sight angle. Defaults: side view looks straight
//          out of the face; front view looks at the viewer.
(function () {
  const POSES = [
    {
      id: "mountain", name: "Mountain", sanskrit: "Tadasana", view: "front", level: "easy",
      desc: "The foundation of all standing poses: grounded feet, long spine.",
      torso: 90, neck: 90,
      arms: { left: [-85, -88], right: [-95, -92] },
      legs: { left: [-90, -90, null], right: [-90, -90, null] },
    },
    {
      id: "upward-salute", name: "Upward Salute", sanskrit: "Urdhva Hastasana", view: "front", level: "easy",
      desc: "Stand tall and sweep both arms overhead, palms facing each other.",
      torso: 90, neck: 90, gaze: 90,
      arms: { left: [80, 85], right: [100, 95] },
      legs: { left: [-90, -90, null], right: [-90, -90, null] },
    },
    {
      id: "tree", name: "Tree", sanskrit: "Vrksasana", view: "front", level: "easy",
      desc: "A one-legged balance with the foot resting on the inner standing leg.",
      torso: 90, neck: 90,
      arms: { left: [75, 115], right: [105, 65] },
      legs: { left: [-90, -90, null], right: [-130, -25, -90] },
    },
    {
      id: "chair", name: "Chair", sanskrit: "Utkatasana", view: "side", level: "easy",
      desc: "Sit back into an invisible chair with arms reaching overhead.",
      torso: 70, neck: 75,
      arms: { left: [75, 78], right: [75, 78] },
      legs: { left: [-25, -105, 0], right: [-25, -105, 0] },
    },
    {
      id: "forward-fold", name: "Standing Forward Fold", sanskrit: "Uttanasana", view: "side", level: "easy",
      desc: "Hinge from the hips and let the upper body hang toward the legs.",
      torso: -40, neck: -55,
      arms: { left: [-95, -95], right: [-95, -95] },
      legs: { left: [-90, -90, 0], right: [-90, -90, 0] },
    },
    {
      id: "half-forward-fold", name: "Half Forward Fold", sanskrit: "Ardha Uttanasana", view: "side", level: "easy",
      desc: "Lift halfway out of a forward fold with a long, flat back.",
      torso: 0, neck: 5,
      arms: { left: [-95, -95], right: [-95, -95] },
      legs: { left: [-90, -90, 0], right: [-90, -90, 0] },
    },
    {
      id: "wide-legged-forward-fold", name: "Wide-Legged Forward Fold", sanskrit: "Prasarita Padottanasana", view: "front", level: "easy",
      desc: "Fold forward between wide legs, crown of the head toward the floor.",
      torso: -90, neck: -90,
      arms: { left: [180, -90], right: [0, -90] },
      legs: { left: [-115, -115, null], right: [-65, -65, null] }, // torso inverted: left side is screen-left
    },
    {
      id: "pyramid", name: "Pyramid", sanskrit: "Parsvottanasana", view: "side", level: "medium",
      desc: "Fold over a straight front leg with the back leg anchored behind.",
      torso: -40, neck: -55,
      arms: { left: [-63, -63], right: [-63, -63] },
      legs: { left: [-110, -110, 0], right: [-70, -70, 0] },
    },
    {
      id: "warrior-1", name: "Warrior I", sanskrit: "Virabhadrasana I", view: "side", level: "easy",
      desc: "Lunge with the front knee bent, back leg long and arms reaching up.",
      torso: 90, neck: 90,
      arms: { left: [90, 90], right: [90, 90] },
      legs: { left: [-142, -142, 0], right: [-15, -95, 0] },
    },
    {
      id: "warrior-2", name: "Warrior II", sanskrit: "Virabhadrasana II", view: "front", level: "easy",
      desc: "A wide lunge with arms extended, gazing past the front hand.",
      torso: 90, neck: 90, gaze: 180,
      arms: { left: [0, 0], right: [180, 180] },
      legs: { left: [-35, -35, null], right: [-170, -90, 180] },
    },
    {
      id: "reverse-warrior", name: "Reverse Warrior", sanskrit: "Viparita Virabhadrasana", view: "front", level: "easy",
      desc: "From Warrior II, arc back over the straight leg and reach the front arm up.",
      torso: 70, neck: 70, gaze: 90,
      arms: { left: [-70, -70], right: [80, 85] },
      legs: { left: [-35, -35, null], right: [-170, -90, 180] },
    },
    {
      id: "warrior-3", name: "Warrior III", sanskrit: "Virabhadrasana III", view: "side", level: "medium",
      desc: "Balance on one leg with the body and lifted leg in one horizontal line.",
      torso: 0, neck: 0,
      arms: { left: [0, 0], right: [0, 0] },
      legs: { left: [180, 180, 180], right: [-90, -90, 0] },
    },
    {
      id: "triangle", name: "Triangle", sanskrit: "Trikonasana", view: "front", level: "medium",
      desc: "Straight legs wide apart, torso tilted over the front leg, arms in one vertical line.",
      torso: 160, neck: 160, gaze: 90,
      arms: { left: [90, 90], right: [-90, -90] },
      legs: { left: [-60, -60, null], right: [-120, -120, 180] },
    },
    {
      id: "extended-side-angle", name: "Extended Side Angle", sanskrit: "Utthita Parsvakonasana", view: "front", level: "medium",
      desc: "Bend the front knee, hand to the floor, top arm reaching long over the ear.",
      torso: 155, neck: 155, gaze: 120,
      arms: { left: [150, 150], right: [-100, -95] },
      legs: { left: [-35, -35, null], right: [-170, -90, 180] },
    },
    {
      id: "half-moon", name: "Half Moon", sanskrit: "Ardha Chandrasana", view: "front", level: "medium",
      desc: "Balance on one leg and one hand, the other leg and arm open to the sky.",
      torso: -160, neck: -160, gaze: 90,
      arms: { left: [90, 90], right: [-90, -90] },
      legs: { left: [10, 10, null], right: [-90, -90, 180] },
    },
    {
      id: "goddess", name: "Goddess", sanskrit: "Utkata Konasana", view: "front", level: "easy",
      desc: "A wide squat with knees over the ankles and arms bent like a cactus.",
      torso: 90, neck: 90,
      arms: { left: [0, 90], right: [180, 90] },
      legs: { left: [-20, -90, 0], right: [-160, -90, 180] },
    },
    {
      id: "garland", name: "Garland", sanskrit: "Malasana", view: "side", level: "medium",
      desc: "A deep squat, heels down, elbows pressing the knees open, hands at the heart.",
      torso: 80, neck: 85,
      arms: { left: [-50, 120], right: [-50, 120] },
      legs: { left: [20, -100, 0], right: [20, -100, 0] },
    },
    {
      id: "dancer", name: "Dancer", sanskrit: "Natarajasana", view: "side", level: "difficult",
      desc: "Balance on one leg, kick the back foot up into the hand, front arm reaching forward.",
      torso: 75, neck: 80,
      arms: { left: [177, 177], right: [40, 40] },
      legs: { left: [170, 90, 100], right: [-90, -90, 0] },
    },
    {
      id: "high-lunge", name: "High Lunge", sanskrit: "Ashta Chandrasana", view: "side", level: "medium",
      desc: "Front knee bent, back heel lifted, arms reaching up from a tall torso.",
      torso: 85, neck: 90,
      arms: { left: [90, 90], right: [90, 90] },
      legs: { left: [-153, -153, -70], right: [-15, -95, 0] },
    },
    {
      id: "low-lunge", name: "Low Lunge", sanskrit: "Anjaneyasana", view: "side", level: "easy",
      desc: "Lower the back knee to the floor and lift the arms, opening the front of the hip.",
      torso: 80, neck: 85,
      arms: { left: [95, 95], right: [95, 95] },
      legs: { left: [-110, 180, 180], right: [0, -90, 0] },
    },
    {
      id: "downward-dog", name: "Downward-Facing Dog", sanskrit: "Adho Mukha Svanasana", view: "side", level: "easy",
      desc: "An inverted V that stretches the hamstrings, calves and shoulders.",
      torso: -45, neck: -55,
      arms: { left: [-50, -50], right: [-50, -50] },
      legs: { left: [-115, -115, 0], right: [-115, -115, 0] },
    },
    {
      id: "high-plank", name: "High Plank", sanskrit: "Phalakasana", view: "side", level: "easy",
      desc: "Arms straight under the shoulders, one line from head to heels.",
      torso: 18, neck: 15, gaze: -60,
      arms: { left: [-90, -90], right: [-90, -90] },
      legs: { left: [-162, -162, -100], right: [-162, -162, -100] },
    },
    {
      id: "plank", name: "Forearm Plank", sanskrit: "Phalakasana (variation)", view: "side", level: "medium",
      desc: "A straight line from head to heels, supported on the forearms.",
      torso: 6, neck: 10, gaze: -45,
      arms: { left: [-90, 0], right: [-90, 0] },
      legs: { left: [-174, -174, -100], right: [-174, -174, -100] },
    },
    {
      id: "chaturanga", name: "Four-Limbed Staff", sanskrit: "Chaturanga Dandasana", view: "side", level: "medium",
      desc: "Lower from plank until the elbows bend to 90 degrees, body hovering in one line.",
      torso: 5, neck: 5, gaze: -60,
      arms: { left: [-175, -90], right: [-175, -90] },
      legs: { left: [-175, -175, -100], right: [-175, -175, -100] },
    },
    {
      id: "upward-dog", name: "Upward-Facing Dog", sanskrit: "Urdhva Mukha Svanasana", view: "side", level: "medium",
      desc: "Straight arms lift the chest, thighs off the floor, tops of the feet down.",
      torso: 55, neck: 70, gaze: 20,
      arms: { left: [-92, -92], right: [-92, -92] },
      legs: { left: [-170, -170, 180], right: [-170, -170, 180] },
    },
    {
      id: "side-plank", name: "Side Plank", sanskrit: "Vasisthasana", view: "front", level: "medium",
      desc: "Balance on one hand and the outer edge of the feet, top arm to the sky.",
      torso: 28, neck: 28, gaze: 90,
      arms: { left: [-90, -90], right: [90, 90] },
      legs: { left: [-152, -152, null], right: [-152, -152, null] },
    },
    {
      id: "cat", name: "Cat", sanskrit: "Marjaryasana", view: "side", level: "easy",
      desc: "On hands and knees, round the spine and let the head drop.",
      torso: 14, neck: -60,
      arms: { left: [-90, -90], right: [-90, -90] },
      legs: { left: [-90, 180, 180], right: [-90, 180, 180] },
    },
    {
      id: "cow", name: "Cow", sanskrit: "Bitilasana", view: "side", level: "easy",
      desc: "On hands and knees, drop the belly and lift the chest and gaze.",
      torso: 14, neck: 50, gaze: 20,
      arms: { left: [-90, -90], right: [-90, -90] },
      legs: { left: [-90, 180, 180], right: [-90, 180, 180] },
    },
    {
      id: "child", name: "Child's Pose", sanskrit: "Balasana", view: "side", level: "easy",
      desc: "Sit back on the heels and fold forward, forehead down, arms long.",
      torso: -5, neck: -10,
      arms: { left: [-12, 0], right: [-12, 0] },
      legs: { left: [-20, 180, 180], right: [-20, 180, 180] },
    },
    {
      id: "cobra", name: "Cobra", sanskrit: "Bhujangasana", view: "side", level: "easy",
      desc: "A gentle backbend from lying prone, opening the chest.",
      torso: 45, neck: 60, gaze: 10,
      arms: { left: [-100, -12], right: [-100, -12] },
      legs: { left: [180, 180, 180], right: [180, 180, 180] },
    },
    {
      id: "sphinx", name: "Sphinx", sanskrit: "Salamba Bhujangasana", view: "side", level: "easy",
      desc: "Lie on the belly and prop the chest up on the forearms, elbows under the shoulders.",
      torso: 37, neck: 70, gaze: 0,
      arms: { left: [-90, 0], right: [-90, 0] },
      legs: { left: [180, 180, 180], right: [180, 180, 180] },
    },
    {
      id: "locust", name: "Locust", sanskrit: "Salabhasana", view: "side", level: "easy",
      desc: "Lift chest, arms and legs from the floor to strengthen the back body.",
      torso: 20, neck: 30, gaze: -15,
      arms: { left: [-165, -165], right: [-165, -165] },
      legs: { left: [170, 170, 170], right: [170, 170, 170] },
    },
    {
      id: "bow-pose", name: "Bow", sanskrit: "Dhanurasana", view: "side", level: "medium",
      desc: "Lie on the belly, hold the ankles and lift chest and thighs like a drawn bow.",
      torso: 25, neck: 45, gaze: 10,
      arms: { left: [162, 162], right: [162, 162] },
      legs: { left: [160, 30, 90], right: [160, 30, 90] },
    },
    {
      id: "camel", name: "Camel", sanskrit: "Ustrasana", view: "side", level: "medium",
      desc: "Kneel tall, press the hips forward and reach back for the heels.",
      torso: 160, neck: -170,
      arms: { left: [-76, -76], right: [-76, -76] },
      legs: { left: [-75, 180, 180], right: [-75, 180, 180] },
    },
    {
      id: "pigeon", name: "Pigeon", sanskrit: "Eka Pada Rajakapotasana", view: "side", level: "medium",
      desc: "Front leg folded under the body, back leg long behind, chest lifted.",
      torso: 90, neck: 90,
      arms: { left: [-95, -95], right: [-95, -95] },
      legs: { left: [-170, -170, 180], right: [-20, 180, 180] },
    },
    {
      id: "staff", name: "Staff", sanskrit: "Dandasana", view: "side", level: "easy",
      desc: "Sit tall with straight legs together, hands pressing the floor beside the hips.",
      torso: 90, neck: 90,
      arms: { left: [-120, -60], right: [-120, -60] },
      legs: { left: [0, 0, 90], right: [0, 0, 90] },
    },
    {
      id: "seated-forward-fold", name: "Seated Forward Fold", sanskrit: "Paschimottanasana", view: "side", level: "easy",
      desc: "Fold forward over straight legs from a tall seated position.",
      torso: 40, neck: 25, gaze: 0,
      arms: { left: [0, -54], right: [0, -54] }, // hands hold the feet
      legs: { left: [0, 0, 90], right: [0, 0, 90] },
    },
    {
      id: "easy", name: "Easy Pose", sanskrit: "Sukhasana", view: "front", level: "easy",
      desc: "Sit cross-legged with a tall spine, hands resting on the thighs.",
      torso: 90, neck: 90,
      arms: { left: [-76, -76], right: [-104, -104] },
      legs: { left: [-15, 185, null], right: [-165, -5, null] },
    },
    {
      id: "bound-angle", name: "Bound Angle", sanskrit: "Baddha Konasana", view: "front", level: "easy",
      desc: "Sit with the soles of the feet together and the knees falling open.",
      torso: 90, neck: 90,
      arms: { left: [-95, -95], right: [-85, -85] },
      legs: { left: [-10, 195, null], right: [-170, -15, null] },
    },
    {
      id: "boat", name: "Boat", sanskrit: "Navasana", view: "side", level: "medium",
      desc: "Balance on the sitting bones, legs lifted and arms reaching forward.",
      torso: 115, neck: 100,
      arms: { left: [10, 10], right: [10, 10] },
      legs: { left: [45, 45, 45], right: [45, 45, 45] },
    },
    {
      id: "bridge", name: "Bridge", sanskrit: "Setu Bandha Sarvangasana", view: "side", level: "easy",
      desc: "Lift the hips from lying on your back, opening the hip flexors.",
      torso: -155, neck: 180,
      arms: { left: [0, 0], right: [0, 0] },
      legs: { left: [15, -95, 0], right: [15, -95, 0] },
    },
    {
      id: "wheel", name: "Wheel", sanskrit: "Urdhva Dhanurasana", view: "side", level: "difficult",
      desc: "A full backbend: press up on hands and feet and lift the whole body into an arch.",
      torso: -150, neck: -120, gaze: -120,
      arms: { left: [-95, -95], right: [-95, -95] },
      legs: { left: [-60, -95, 0], right: [-60, -95, 0] },
    },
    {
      id: "fish", name: "Fish", sanskrit: "Matsyasana", view: "side", level: "medium",
      desc: "Lie on the back, lift the chest on the forearms and rest the crown of the head down.",
      torso: 160, neck: -150,
      arms: { left: [-35, 0], right: [-35, 0] },
      legs: { left: [0, 0, 30], right: [0, 0, 30] },
    },
    {
      id: "happy-baby", name: "Happy Baby", sanskrit: "Ananda Balasana", view: "side", level: "easy",
      desc: "Lie on the back, knees toward the armpits, hands holding the shins or feet.",
      torso: 180, neck: 180,
      arms: { left: [71, 71], right: [71, 71] },
      legs: { left: [135, 90, 180], right: [135, 90, 180] },
    },
    {
      id: "legs-up-the-wall", name: "Legs Up the Wall", sanskrit: "Viparita Karani", view: "side", level: "easy",
      desc: "Lie on the back with the legs resting straight up, arms relaxed by the sides.",
      torso: 180, neck: 180,
      arms: { left: [0, 0], right: [0, 0] },
      legs: { left: [90, 90, 180], right: [90, 90, 180] },
    },
    {
      id: "shoulder-stand", name: "Shoulder Stand", sanskrit: "Salamba Sarvangasana", view: "side", level: "medium",
      desc: "Rest on the shoulders, hands supporting the back, legs straight up.",
      torso: -90, neck: 180, gaze: 90,
      arms: { left: [0, 135], right: [0, 135] },
      legs: { left: [90, 90, 90], right: [90, 90, 90] },
    },
    {
      id: "plow", name: "Plow", sanskrit: "Halasana", view: "side", level: "medium",
      desc: "From shoulder stand, lower the straight legs over the head, toes to the floor.",
      torso: -80, neck: 180, gaze: 90,
      arms: { left: [0, 0], right: [0, 0] },
      legs: { left: [-148, -148, -120], right: [-148, -148, -120] },
    },
    {
      id: "headstand", name: "Headstand", sanskrit: "Salamba Sirsasana", view: "side", level: "difficult",
      desc: "Upside down on the crown of the head and forearms, legs straight up.",
      torso: -90, neck: -90,
      arms: { left: [-115, 5], right: [-115, 5] },
      legs: { left: [90, 90, 90], right: [90, 90, 90] },
    },
    {
      id: "crow", name: "Crow", sanskrit: "Bakasana", view: "side", level: "difficult",
      desc: "Balance on the hands with the knees resting on the upper arms, feet lifted.",
      torso: -30, neck: -10, gaze: -30,
      arms: { left: [-100, -80], right: [-100, -80] },
      legs: { left: [-48, 150, 180], right: [-48, 150, 180] },
    },
    {
      id: "corpse", name: "Corpse", sanskrit: "Savasana", view: "side", level: "easy",
      desc: "Lie flat on the back, arms by the sides, and let everything rest.",
      torso: 180, neck: 180,
      arms: { left: [0, 0], right: [0, 0] },
      legs: { left: [0, 0, 60], right: [0, 0, 60] },
    },
  ];

  // Courses: ordered subsets of POSES, by id. A pose may appear more than once.
  // level is the course's overall difficulty, judged by hand like a pose's.
  const PLANS = [
    {
      id: "sun-salutation", name: "Sun Salutation", level: "medium",
      desc: "The classic warm-up: one round from standing, through plank and the dogs, back to standing.",
      poses: ["mountain", "upward-salute", "forward-fold", "half-forward-fold", "high-plank", "chaturanga",
              "upward-dog", "downward-dog", "half-forward-fold", "forward-fold", "upward-salute", "mountain"],
    },
    {
      id: "gentle-start", name: "Gentle Start", level: "easy",
      desc: "Easy poses only: a calm first practice with a few standing poses and a lot of floor work.",
      poses: ["mountain", "upward-salute", "tree", "chair", "warrior-2", "reverse-warrior", "cat", "cow",
              "child", "sphinx", "bridge", "happy-baby", "corpse"],
    },
    {
      id: "standing-strength", name: "Standing Strength", level: "medium",
      desc: "Build legs and balance: warriors, side angles and one-legged balances.",
      poses: ["mountain", "chair", "warrior-1", "high-lunge", "warrior-3", "warrior-2", "triangle",
              "extended-side-angle", "half-moon", "goddess", "tree", "dancer", "mountain"],
    },
    {
      id: "hip-opener", name: "Hip Opener", level: "easy",
      desc: "Lunges, squats and seated poses that open the hips after a day of sitting.",
      poses: ["mountain", "goddess", "garland", "low-lunge", "downward-dog", "pigeon", "bound-angle",
              "easy", "happy-baby", "corpse"],
    },
    {
      id: "core-and-arms", name: "Core and Arms", level: "medium",
      desc: "Plank variations, Boat and Crow, with Downward Dog and Child's Pose to recover.",
      poses: ["downward-dog", "high-plank", "plank", "side-plank", "chaturanga", "upward-dog",
              "downward-dog", "boat", "crow", "child"],
    },
    {
      id: "evening-wind-down", name: "Evening Wind-Down", level: "easy",
      desc: "Slow, restful floor poses to end the day.",
      poses: ["easy", "cat", "cow", "child", "seated-forward-fold", "bound-angle", "happy-baby",
              "legs-up-the-wall", "corpse"],
    },
    {
      id: "backbends-and-inversions", name: "Backbends and Inversions", level: "difficult",
      desc: "An advanced course: build up to Wheel and Headstand, then cool down.",
      poses: ["cobra", "locust", "bow-pose", "camel", "bridge", "wheel", "child", "shoulder-stand",
              "plow", "fish", "headstand", "child", "corpse"],
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
    // The head glyph is a single text row, so its center can rest on the lowest row.
    const minY = Math.min(head[1], ...all.map((p) => p[1]));
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

  globalThis.Yoga = { POSES, PLANS, toAscii };
})();
