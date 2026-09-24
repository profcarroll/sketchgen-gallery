// Ancient agriculture: a terraced hillside under a drifting sun. The crop sways
// on its own; a click tills a patch and sows shoots that grow over a few seconds.

const TERRACES = 7;
const MAX_SHOOTS = 300;
const GROW_FRAMES = 180;
let y0, th;
let stalks = [];   // the standing crop: {fx, t, k, ph}
let shoots = [];   // sown by the viewer: {fx, fy, born, h, ph}
let tilled = [];   // dark soil where a click landed: {fx, fy, born}

function setup() {
  createCanvas(windowWidth, windowHeight);
  layout();
  // 16 stalks in each of 5 furrows on each terrace: enough to read as a field,
  // few enough that every one is a single line() per frame.
  for (let t = 0; t < TERRACES; t++)
    for (let k = 0; k < 5; k++)
      for (let n = 0; n < 16; n++)
        stalks.push({ fx: 0.02 + ((n + random()) / 16) * 0.96, t, k, ph: random(TWO_PI) });
  strokeCap(ROUND);
}

function layout() {
  y0 = height * 0.18;               // sky above, field below
  th = (height - y0) / TERRACES;
}

function windowResized() { resizeCanvas(windowWidth, windowHeight); layout(); }

// Top edge of terrace i at x: a slow wave so the steps read as land, not ruled lines.
function edgeY(i, x) { return y0 + i * th + sin(x * 0.004 + i * 1.7) * th * 0.08; }

// The irrigation channel's path, t from the crest (0) to the foot of the hill (1).
function channelX(t) { return width * (0.5 + 0.28 * sin(t * 3.0)); }
function channelY(t) { return y0 + t * (height - y0); }

function draw() {
  // frameCount keeps time so the sketch moves on its own with no clock or input.
  const s = (frameCount * 0.0004) % 1;                   // the sun's day: 0 dawn, 1 dusk
  const tint = lerpColor(color(255, 205, 90), color(200, 70, 50), s);
  background(lerpColor(color(225, 190, 140), color(120, 60, 70), s));

  // the sun, low, drifting left to right along a shallow arc
  const sx = width * (0.05 + 0.9 * s);
  const sy = y0 * 0.6 - sin(s * PI) * y0 * 0.35;
  noStroke();
  fill(255, 240, 200, 60); circle(sx, sy, y0 * 0.6);
  fill(tint); circle(sx, sy, y0 * 0.32);

  // terraces: a filled band, a shadowed riser at its lip, five furrows
  const step = width / 24;
  for (let i = 0; i < TERRACES; i++) {
    const base = i % 2 === 0 ? color(196, 138, 62) : color(150, 96, 48);
    fill(lerpColor(base, tint, 0.35));
    noStroke();
    beginShape();
    for (let x = 0; x <= width + step; x += step) vertex(x, edgeY(i, x));
    for (let x = width + step; x >= 0; x -= step)
      vertex(x, i === TERRACES - 1 ? height + 2 : edgeY(i + 1, x));
    endShape(CLOSE);
    noFill();
    stroke(90, 55, 30, 140); strokeWeight(th * 0.08);
    beginShape();
    for (let x = 0; x <= width + step; x += step) vertex(x, edgeY(i, x) + th * 0.04);
    endShape();
    stroke(80, 48, 26, 160); strokeWeight(2);
    for (let k = 0; k < 5; k++) {
      const d = th * (0.25 + 0.15 * k);
      beginShape();
      for (let x = 0; x <= width + step; x += step) vertex(x, edgeY(i, x) + d);
      endShape();
    }
  }

  // the standing crop, swaying in every furrow
  const stalkCol = lerpColor(color(230, 210, 120), color(190, 120, 70), s);
  stroke(stalkCol); strokeWeight(1.5);
  for (const st of stalks) {
    const x = st.fx * width;
    const y = edgeY(st.t, x) + th * (0.25 + 0.15 * st.k);
    const sway = sin(frameCount * 0.05 + x * 0.03 + st.ph) * 3;
    line(x, y, x + sway, y - th * 0.18);
  }

  // the channel: its bed, its water, then glints running downhill
  noFill();
  stroke(70, 45, 30); strokeWeight(9);
  beginShape(); for (let j = 0; j <= 40; j++) vertex(channelX(j / 40), channelY(j / 40)); endShape();
  stroke(70, 120, 150); strokeWeight(5);
  beginShape(); for (let j = 0; j <= 40; j++) vertex(channelX(j / 40), channelY(j / 40)); endShape();
  noStroke(); fill(220, 240, 255, 220);
  for (let j = 0; j < 16; j++) {
    const t = (j / 16 + frameCount * 0.004) % 1;
    circle(channelX(t), channelY(t), 3);
  }

  // tilled soil, fading as the shoots take it over
  for (const p of tilled) {
    const a = 1 - constrain((frameCount - p.born) / GROW_FRAMES, 0, 1);
    fill(70, 42, 24, 200 * a);
    ellipse(p.fx * width, p.fy * height, 70, 26);
  }

  // the viewer's crop growing in: quick out of the soil, slow to ripen
  strokeWeight(2);
  for (const sh of shoots) {
    const age = constrain((frameCount - sh.born) / GROW_FRAMES, 0, 1);
    const grow = 1 - (1 - age) * (1 - age);
    const x = sh.fx * width, y = sh.fy * height;
    const sway = sin(frameCount * 0.05 + x * 0.03 + sh.ph) * 3 * grow;
    stroke(lerpColor(color(90, 170, 70), stalkCol, age));
    line(x, y, x + sway, y - sh.h * grow);
    if (grow > 0.4) {                                     // two leaves once it has height
      const lx = x + sway * 0.6, ly = y - sh.h * grow * 0.6;
      line(lx, ly, lx - 6, ly - 5);
      line(lx, ly, lx + 6, ly - 5);
    }
  }
}

function mousePressed() {
  // Sow a cluster where the click lands, kept on the field below the sky.
  const fy = constrain(mouseY, y0 + 4, height - 4) / height;
  tilled.push({ fx: mouseX / width, fy, born: frameCount });
  while (tilled.length > 40) tilled.shift();
  for (let n = 0; n < 12; n++) {
    shoots.push({
      fx: (mouseX + random(-32, 32)) / width,
      fy: constrain(mouseY + random(-10, 10), y0 + 4, height - 4) / height,
      born: frameCount, h: random(th * 0.22, th * 0.36), ph: random(TWO_PI),
    });
  }
  while (shoots.length > MAX_SHOOTS) shoots.shift();
}
