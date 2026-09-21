let sky, balloons, clouds;
const STRIPES = [[200, 50, 40], [210, 165, 65], [50, 145, 135], [245, 235, 210]];

function setup() {
  createCanvas(windowWidth, windowHeight);
  sky = createGraphics(width, height);
  paintSky();

  let depths = [0.28, 0.36, 0.43, 0.52, 0.61, 0.72, 0.84, 0.97];
  balloons = [];
  for (let i = 0; i < 8; i++) {
    let d = depths[i];
    let sz = map(d, 0.25, 1, 35, 95);
    balloons.push({
      x: random(width * 0.05, width * 0.95),
      y: random(height * 0.08, height * 0.52),
      depth: d, w: sz, h: sz * 1.3,
      speed: map(d, 0.25, 1, 0.2, 0.06),
      bobPh: random(TWO_PI), bobF: random(0.008, 0.018), bobA: sz * 0.07,
      swayPh: random(TWO_PI), swayF: random(0.004, 0.01), swayA: sz * 0.04,
      stripe: floor(random(4)), flamePh: random(TWO_PI)
    });
  }
  balloons.sort((a, b) => a.depth - b.depth);

  clouds = [];
  for (let i = 0; i < 12; i++) {
    let blobs = [];
    for (let j = 0; j < 3; j++)
      blobs.push({ ox: random(-0.3, 0.4), oy: random(-0.25, 0.2),
                    sw: random(0.4, 1.0), sh: random(0.6, 1.2) });
    clouds.push({
      x: random(-300, width + 300), y: random(height * 0.1, height * 0.48),
      cw: random(180, 450), ch: random(25, 55),
      speed: random(0.03, 0.15), alpha: random(20, 60), blobs: blobs
    });
  }
}

function paintSky() {
  let g = sky;
  for (let y = 0; y < g.height; y++) {
    let t = y / g.height;
    let c = t < 0.3
      ? lerpColor(color(45, 20, 90), color(145, 70, 105), t / 0.3)
      : t < 0.6
        ? lerpColor(color(145, 70, 105), color(235, 175, 108), (t - 0.3) / 0.3)
        : lerpColor(color(235, 175, 108), color(255, 238, 185), (t - 0.6) / 0.4);
    g.stroke(c);
    g.line(0, y, g.width, y);
  }
  g.noStroke();
  let sx = g.width * 0.72, sy = g.height * 0.74;
  for (let r = 140; r > 0; r -= 6) {
    g.fill(255, 230, 160, map(r, 140, 0, 4, 60));
    g.ellipse(sx, sy, r * 2);
  }
  g.fill(255, 245, 215);
  g.ellipse(sx, sy, 40);
  hillLayer(g, 0.78, 100, 115, 155, 110, 1.5);
  hillLayer(g, 0.83, 75, 95, 135, 140, 3.2);
  hillLayer(g, 0.88, 50, 68, 110, 170, 5.0);
}

function hillLayer(g, base, r, gr, b, a, phase) {
  let f = 0.003 + (base - 0.78) * 0.02;
  g.fill(r, gr, b, a);
  g.beginShape();
  g.vertex(0, g.height);
  for (let x = 0; x <= g.width; x += 12)
    g.vertex(x, g.height * base + sin(x * f + phase) * 22 + sin(x * f * 2.5 + phase * 0.7) * 12);
  g.vertex(g.width, g.height);
  g.endShape(CLOSE);
}

function envR(t) {
  if (t <= 0.45) return sin(t / 0.45 * HALF_PI);
  return 1 - 0.78 * pow((t - 0.45) / 0.55, 1.4);
}

function draw() {
  image(sky, 0, 0);
  noStroke();
  for (let c of clouds) {
    c.x += c.speed;
    if (c.x > width + c.cw) c.x = -c.cw;
    fill(255, 250, 240, c.alpha);
    for (let b of c.blobs)
      ellipse(c.x + b.ox * c.cw, c.y + b.oy * c.ch, c.cw * b.sw, c.ch * b.sh);
  }
  for (let b of balloons) {
    b.x += b.speed;
    b.bobPh += b.bobF;
    b.swayPh += b.swayF;
    b.flamePh += 0.15;
    if (b.x > width + b.w * 2) b.x = -b.w * 2;
    drawBalloon(b);
  }
}

function drawBalloon(b) {
  let bx = b.x + sin(b.swayPh) * b.swayA;
  let by = b.y + sin(b.bobPh) * b.bobA;
  let hz = map(b.depth, 0.25, 1, 0.5, 1);
  let fog = [175, 165, 195];

  push();
  translate(bx, by);
  let np = 7, pa = PI / np, st = 10;
  for (let p = 0; p < np; p++) {
    let aL = -HALF_PI + p * pa, aR = aL + pa;
    let shade = 0.55 + 0.45 * cos((aL + aR) / 2);
    let col = STRIPES[(p + b.stripe) % 4];
    fill(lerp(fog[0], col[0] * shade, hz),
         lerp(fog[1], col[1] * shade, hz),
         lerp(fog[2], col[2] * shade, hz));
    noStroke();
    beginShape();
    for (let i = 0; i <= st; i++) {
      let t = i / st, r = envR(t);
      vertex(r * sin(aL) * b.w / 2, t * b.h);
    }
    for (let i = st; i >= 0; i--) {
      let t = i / st, r = envR(t);
      vertex(r * sin(aR) * b.w / 2, t * b.h);
    }
    endShape(CLOSE);
  }

  let ff = 0.6 + 0.4 * sin(b.flamePh);
  fill(255, 200, 80, 35 * ff * hz);
  ellipse(0, b.h * 0.88, b.w * 0.45, b.h * 0.22);

  let mr = envR(1) * b.w / 2;
  let bw = b.w * 0.22, bh = b.w * 0.1;
  let ry = b.h + b.w * 0.3;
  let sw = sin(b.swayPh * 1.3) * 2;

  stroke(lerp(fog[0], 90, hz), lerp(fog[1], 70, hz), lerp(fog[2], 50, hz));
  strokeWeight(max(0.5, b.w * 0.01));
  line(-mr * 0.7, b.h, sw - bw / 2, ry);
  line(mr * 0.7, b.h, sw + bw / 2, ry);
  line(-mr * 0.35, b.h, sw - bw / 4, ry);
  line(mr * 0.35, b.h, sw + bw / 4, ry);

  noStroke();
  fill(lerp(fog[0], 155, hz), lerp(fog[1], 115, hz), lerp(fog[2], 60, hz));
  rect(sw - bw / 2, ry, bw, bh, 2);

  let fh = b.w * 0.07 * ff;
  fill(255, 160 + 50 * ff, 40, 200 * hz);
  ellipse(sw, ry - fh / 2 - 1, b.w * 0.035, fh);
  fill(255, 240, 140, 150 * hz);
  ellipse(sw, ry - fh / 2, b.w * 0.018, fh * 0.6);
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  sky = createGraphics(width, height);
  paintSky();
}
