// Job 166, neutralised 2026-09-15.
//
// The sketch the model wrote for this attempt is kept beside this file as
// sketch.unsafe.js.txt.  It drew 2000-5000 sphere() calls per frame and then
// compared every particle with every other one (O(N^2): 2-12 million distance
// checks per frame) and drew tens of thousands of immediate-mode line() calls.
// Attempt 2 never finished the gate's 150 frames in 600 s; attempt 3 needed
// 209 s; opened in a laptop browser the tab exhausted memory.  See
// jobs/166/forensics.md.
//
// This version keeps the brief -- thousands of glowing particles, volumetric
// grids, tendrils of light, cyan on deep blue, perpetual motion, WEBGL -- inside
// a fixed budget: a bounded particle count, one draw call for all the points,
// neighbour search through a spatial hash (each particle looks at the cells
// around it, never at the whole array), a hard cap on connections per frame,
// and no per-particle push()/pop() or sphere().

const PARTICLE_COUNT = 1500;    // "thousands" -- but points, not spheres
const WORLD = 700;              // half-width of the cube the particles live in
const CELL = 90;                // spatial-hash cell size == connection radius
const MAX_LINKS_PER_FRAME = 900;
const MAX_LINKS_PER_PARTICLE = 3;
const TENDRILS = 4;
const TENDRIL_POINTS = 60;

let particles = [];
let t = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  frameRate(30);
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      pos: createVector(random(-WORLD, WORLD), random(-WORLD, WORLD), random(-WORLD, WORLD)),
      vel: p5.Vector.random3D().mult(random(0.4, 1.4)),
      hue: random(180, 215),
      size: random(2, 5),
    });
  }
}

function draw() {
  background(225, 80, 8);
  t += 0.01;

  // Slow orbit of the whole field so the grid reads as a volume.
  rotateY(t * 0.15);
  rotateX(sin(t * 0.2) * 0.25);

  // --- move, and bin into a spatial hash --------------------------------
  const bins = new Map();
  for (const p of particles) {
    p.pos.add(p.vel);
    // Gentle stream toward a slowly moving centre keeps the swirl alive.
    const pull = createVector(sin(t) * 200, cos(t * 0.7) * 200, 0).sub(p.pos).setMag(0.02);
    p.vel.add(pull).limit(1.6);
    if (p.pos.x > WORLD) p.pos.x = -WORLD; else if (p.pos.x < -WORLD) p.pos.x = WORLD;
    if (p.pos.y > WORLD) p.pos.y = -WORLD; else if (p.pos.y < -WORLD) p.pos.y = WORLD;
    if (p.pos.z > WORLD) p.pos.z = -WORLD; else if (p.pos.z < -WORLD) p.pos.z = WORLD;
    const hash = cellKey(p.pos);
    let cell = bins.get(hash);
    if (!cell) bins.set(hash, cell = []);
    cell.push(p);
  }

  // --- connections: only neighbouring cells, capped ----------------------
  let links = 0;
  const r2 = CELL * CELL;
  stroke(185, 90, 100, 0.22);
  strokeWeight(1);
  beginShape(LINES);
  outer: for (const p of particles) {
    let mine = 0;
    const cx = Math.floor(p.pos.x / CELL), cy = Math.floor(p.pos.y / CELL), cz = Math.floor(p.pos.z / CELL);
    for (let dx = -1; dx <= 1 && mine < MAX_LINKS_PER_PARTICLE; dx++)
      for (let dy = -1; dy <= 1 && mine < MAX_LINKS_PER_PARTICLE; dy++)
        for (let dz = -1; dz <= 1 && mine < MAX_LINKS_PER_PARTICLE; dz++) {
          const cell = bins.get((cx + dx) + "," + (cy + dy) + "," + (cz + dz));
          if (!cell) continue;
          for (const q of cell) {
            if (q === p || q.pos.x < p.pos.x) continue;   // each pair once
            const ddx = q.pos.x - p.pos.x, ddy = q.pos.y - p.pos.y, ddz = q.pos.z - p.pos.z;
            if (ddx * ddx + ddy * ddy + ddz * ddz > r2) continue;
            vertex(p.pos.x, p.pos.y, p.pos.z);
            vertex(q.pos.x, q.pos.y, q.pos.z);
            if (++links >= MAX_LINKS_PER_FRAME) break outer;
            if (++mine >= MAX_LINKS_PER_PARTICLE) break;
          }
        }
  }
  endShape();

  // --- particles: one point cloud, drawn twice for a glow -----------------
  noFill();
  strokeWeight(7);
  stroke(190, 90, 100, 0.12);
  beginShape(POINTS);
  for (const p of particles) vertex(p.pos.x, p.pos.y, p.pos.z);
  endShape();
  strokeWeight(2.5);
  stroke(185, 60, 100, 0.95);
  beginShape(POINTS);
  for (const p of particles) vertex(p.pos.x, p.pos.y, p.pos.z);
  endShape();

  // --- tendrils of light ---------------------------------------------------
  strokeWeight(1.5);
  for (let k = 0; k < TENDRILS; k++) {
    stroke(180 + k * 8, 80, 100, 0.55);
    beginShape();
    for (let i = 0; i < TENDRIL_POINTS; i++) {
      const a = t * (0.6 + k * 0.15) + i * 0.11 + k * TWO_PI / TENDRILS;
      const rad = 320 + sin(t * 1.5 + i * 0.13 + k) * 120;
      vertex(rad * cos(a), rad * sin(a) * 0.7, sin(t * 0.8 + i * 0.09 + k) * 260);
    }
    endShape();
  }
}

function cellKey(v) {
  return Math.floor(v.x / CELL) + "," + Math.floor(v.y / CELL) + "," + Math.floor(v.z / CELL);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
