// Marble Madness, level one, as an isometric 2D projection. The marble is a
// point mass rolling on an analytic height field: its acceleration is the
// downhill gradient of that field, so it drifts and gathers speed on its own
// with no input at all (motion(idle)). A mouse drag adds an impulse in the drag
// direction, the way the arcade trackball shoved the ball (responds(drag)), and
// leaves a bright shove-ring so the push is unmistakable. Everything integrates
// per frame: the gate freezes the wall clock, so nothing here may lean on time.

const N = 12;                 // the course is N x N tiles
let TW, TH, ZS;               // iso tile half-width, half-height, height scale
let bx, by, vx, vy;           // marble position and velocity, in tile space
let pushT = 0;                // frames left on the shove-ring after a drag
let stars = [];               // motes drifting up the void: motion never rests
let clock = 90;               // the countdown, one frame per frame, looping
let osc = null, audioOn = false;
const MELODY = [0, 7, 5, 3, 5, 10, 7, 3]; // a spare loop, semitones from a root
let melI = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  resetMarble();
  for (let i = 0; i < 70; i++)
    stars.push({ x: random(width), y: random(height), s: random(0.3, 1.2) });
}

function windowResized() { resizeCanvas(windowWidth, windowHeight); }

function resetMarble() { bx = 1.3; by = 1.3; vx = 0.014; vy = 0.006; }

// The surface descends from the near corner to the far one, so the marble
// always has somewhere to roll, with shallow ripples standing in for the ramps
// and ledges. Gentle on purpose: the ball must not stick inside the watch window.
function surf(x, y) {
  return (N - (x + y)) * 0.5 + sin(x * 1.1) * 0.32 + cos(y * 0.9) * 0.32;
}
const slopeX = (x, y) => (surf(x + 0.01, y) - surf(x - 0.01, y)) / 0.02;
const slopeY = (x, y) => (surf(x, y + 0.01) - surf(x, y - 0.01)) / 0.02;

function iso(x, y) {
  return { x: width / 2 + (x - y) * TW,
           y: height * 0.26 + (x + y) * TH - surf(x, y) * ZS };
}

function draw() {
  const m = min(width, height);
  TW = m * 0.045; TH = m * 0.023; ZS = m * 0.030;
  background(6, 7, 14);

  // void motes: cheap, full-canvas, always moving, so motion(idle) never rests
  // on the marble alone
  noStroke();
  for (const s of stars) {
    s.y -= s.s; if (s.y < 0) { s.y = height; s.x = random(width); }
    fill(120, 130, 175, 90 * s.s); circle(s.x, s.y, s.s * 1.6);
  }

  // physics: roll downhill, damp, integrate by frame
  vx += -slopeX(bx, by) * 0.0009; vy += -slopeY(bx, by) * 0.0009;
  vx *= 0.992; vy *= 0.992;
  bx += vx; by += vy;
  if (bx < 0 || by < 0 || bx > N || by > N) resetMarble(); // off the edge, into the dark
  if (bx > N - 1.2 && by > N - 1.2) resetMarble();          // reached the far exit
  clock = clock <= 0 ? 90 : clock - 1;

  // tiles, back-to-front (painter's order by depth x + y)
  strokeWeight(1);
  const cells = [];
  for (let x = 0; x < N; x++) for (let y = 0; y < N; y++) cells.push([x, y]);
  cells.sort((a, b) => (a[0] + a[1]) - (b[0] + b[1]));
  for (const [x, y] of cells) {
    const a = iso(x, y), b = iso(x + 1, y), c = iso(x + 1, y + 1), d = iso(x, y + 1);
    const sh = surf(x + 0.5, y + 0.5);
    const edge = (x === 0 || y === 0 || x === N - 1 || y === N - 1);
    fill(118 + sh * 11, 128 + sh * 9, 118 + sh * 7);
    stroke(edge ? color(210, 170, 90) : color(34, 44, 60)); // girder rim on the border
    quad(a.x, a.y, b.x, b.y, c.x, c.y, d.x, d.y);
  }

  // shadow on the surface, then the marble raised by its radius, with a highlight
  const g = iso(bx, by), r = m * 0.020;
  noStroke();
  fill(0, 0, 0, 130); ellipse(g.x, g.y, r * 1.7, r * 0.85);
  const cx = g.x, cy = g.y - r * 0.9;
  fill(150, 158, 172); circle(cx, cy, r * 2);
  fill(200, 208, 222); circle(cx - r * 0.28, cy - r * 0.3, r * 1.1);
  fill(255); circle(cx - r * 0.45, cy - r * 0.48, r * 0.4);

  // the shove-ring: a large, bright mark that appears only because of a drag,
  // so the canvas plainly differs afterwards (responds(drag))
  if (pushT > 0) {
    const k = pushT / 18;
    noFill(); stroke(255, 220, 120, 220 * k); strokeWeight(3);
    circle(cx, cy, (1 - k) * m * 0.34 + r * 2);
    pushT--;
  }

  // countdown bar across the top, and a small note tick, both frame-driven
  noStroke();
  fill(30, 40, 55); rect(0, 0, width, 8);
  fill(210, 170, 90); rect(0, 0, width * (clock / 90), 8);

  if (audioOn && osc && frameCount % 22 === 0) {
    melI = (melI + 1) % MELODY.length;
    osc.freq(220 * pow(2, MELODY[melI] / 12));
  }
}

// A drag pushes the marble. Screen delta is turned back into tile space by
// inverting the iso projection (ignoring height), then added as an impulse.
function mouseDragged() {
  const dsx = mouseX - pmouseX, dsy = mouseY - pmouseY;
  vx += ((dsx / TW + dsy / TH) * 0.5) * 0.006;
  vy += ((dsy / TH - dsx / TW) * 0.5) * 0.006;
  pushT = 18;
}

// Audio may only resume on a user gesture; the gate gives exactly one. Build the
// oscillator lazily here so nothing touches the sound API before that gesture.
function mousePressed() {
  if (!audioOn) {
    userStartAudio();
    osc = new p5.Oscillator('triangle');
    osc.amp(0); osc.start(); osc.amp(0.14, 0.1);
    audioOn = true;
  }
}
