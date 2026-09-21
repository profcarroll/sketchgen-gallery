// Dusk balloons. All motion runs off frameCount, never the clock.
const PALETTE = ['#ff6b5a', '#1fa6a0', '#ffc23d', '#fff1d6', '#c2384a', '#3b5bdb'];
const HAZE = '#f0a08a';
let balloons = [], clouds = [], stars = [], bursts = [], env = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Half-outline of an envelope in radius units: round on top, pinching toward the burner.
  for (let i = 0; i <= 12; i++) {
    const a = PI * 0.93 * i / 12, c = cos(a);
    env.push({ s: sin(a) * (c < 0 ? 1 - 0.35 * c * c : 1), y: -c * 1.15 });
  }
  for (let i = 0; i < 7; i++) balloons.push(makeBalloon(random(0.08, 0.92), random(height), false));
  balloons.sort((a, b) => a.z - b.z);
  for (let i = 0; i < 5; i++) {
    clouds.push({ xf: random(), yf: random(0.15, 0.75), sp: random(0.3, 0.9), w: random(0.25, 0.5) });
  }
  for (let i = 0; i < 50; i++) stars.push({ x: random(), y: random(0.55), ph: random(TWO_PI) });
}

// z is depth: near balloons are bigger, faster and less hazed than far ones.
function makeBalloon(xf, y, extra) {
  const z = random();
  const cols = shuffle(PALETTE).slice(0, 3).map(h => lerpColor(color(h), color(HAZE), (1 - z) * 0.55));
  return { xf, y, z, extra, cols, ph: random(TWO_PI), lift: 0 };
}

const radius = b => min(width, height) * 0.11 * lerp(0.45, 1.25, b.z);

function draw() {
  const t = frameCount;
  drawSky();
  stroke(255);
  strokeWeight(2);
  for (const s of stars) {
    stroke(255, 255, 255, 110 + 110 * sin(t * 0.04 + s.ph));
    point(s.x * width, s.y * height);
  }
  noStroke();
  for (const c of clouds) {
    const cw = c.w * width, x = ((c.xf * width + t * c.sp) % (width + 2 * cw)) - cw, y = c.yf * height;
    fill(255, 190, 170, 55);
    for (let j = 0; j < 5; j++) ellipse(x + j * cw * 0.22, y + sin(j * 1.7) * cw * 0.05, cw * 0.45, cw * 0.22);
  }
  for (let i = balloons.length - 1; i >= 0; i--) {
    const b = balloons[i], r = radius(b);
    b.lift *= 0.95;
    b.y -= lerp(0.35, 1.1, b.z) + b.lift + sin(t * 0.03 + b.ph) * 0.15;
    if (b.y < -2.8 * r) {
      if (b.extra) { balloons.splice(i, 1); continue; }
      b.y = height + 1.5 * r;
      b.xf = random(0.08, 0.92);
    }
  }
  for (const b of balloons) drawBalloon(b, t);
  drawBursts();
}

function drawSky() {
  const g = drawingContext.createLinearGradient(0, 0, 0, height);
  g.addColorStop(0, '#171a4a');
  g.addColorStop(0.5, '#5d3b7d');
  g.addColorStop(0.8, '#e6707c');
  g.addColorStop(1, '#ffbb70');
  // save/restore: p5 caches fillStyle and would skip resetting it after a raw gradient
  drawingContext.save();
  drawingContext.fillStyle = g;
  drawingContext.fillRect(0, 0, width, height);
  drawingContext.restore();
}

function drawBalloon(b, t) {
  const r = radius(b), drift = t * 0.012 * (0.6 + b.z) + b.ph;
  push();
  translate(b.xf * width + sin(drift) * 0.25 * r, b.y);
  rotate(sin(drift + 1.2) * 0.05);
  stroke(40, 20, 60, 50);
  strokeWeight(1);
  const N = 6;
  for (let k = 0; k < N; k++) {
    const f0 = -1 + 2 * k / N, f1 = -1 + 2 * (k + 1) / N;
    fill(b.cols[k % 3]);
    beginShape();
    for (const p of env) vertex(f0 * p.s * r, p.y * r);
    for (let i = env.length - 1; i >= 0; i--) vertex(f1 * env[i].s * r, env[i].y * r);
    endShape(CLOSE);
  }
  noStroke();
  fill(255, 255, 255, 45);
  ellipse(-0.35 * r, -0.35 * r, 0.5 * r, 0.9 * r);
  // the basket hangs from the skirt and swings a little out of step with the envelope
  translate(0, 0.9 * r);
  rotate(sin(t * 0.02 + b.ph) * 0.07);
  stroke(70, 40, 30, 200);
  strokeWeight(max(1, r * 0.02));
  line(-0.5 * r, 0, -0.17 * r, 1.1 * r);
  line(0.5 * r, 0, 0.17 * r, 1.1 * r);
  noStroke();
  fill(150, 100, 60);
  rect(-0.17 * r, 1.1 * r, 0.34 * r, 0.28 * r, r * 0.03);
  const fl = noise(t * 0.15 + b.ph * 10);
  fill(255, 140, 40, 160);
  ellipse(0, 0.25 * r, 0.12 * r, (0.22 + 0.2 * fl) * r);
  fill(255, 230, 140);
  ellipse(0, 0.28 * r, 0.06 * r, (0.12 + 0.1 * fl) * r);
  pop();
}

// A click's warm flash, drawn as one radial gradient that widens and fades over 70 frames.
function drawBursts() {
  for (let i = bursts.length - 1; i >= 0; i--) {
    const u = bursts[i], k = 1 - u.age / 70;
    const R = max(width, height) * (0.12 + 0.6 * u.age / 70);
    const g = drawingContext.createRadialGradient(u.x, u.y, 0, u.x, u.y, R);
    g.addColorStop(0, `rgba(255,214,140,${0.8 * k * k})`);
    g.addColorStop(1, 'rgba(255,150,70,0)');
    drawingContext.save();
    drawingContext.fillStyle = g;
    drawingContext.fillRect(0, 0, width, height);
    drawingContext.restore();
    if (++u.age > 70) bursts.splice(i, 1);
  }
}

function mousePressed() {
  bursts.push({ x: mouseX, y: mouseY, age: 0 });
  const reach = min(width, height) * 0.6;
  for (const b of balloons) {
    const near = exp(-sq(dist(mouseX, mouseY, b.xf * width, b.y) / reach));
    b.lift += 7 * near * (0.5 + b.z);
  }
  if (balloons.length < 10) {
    const b = makeBalloon(constrain(mouseX / width, 0.05, 0.95), 0, true);
    b.y = height + 1.5 * radius(b);
    balloons.push(b);
    balloons.sort((p, q) => p.z - q.z);
  }
  return false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
