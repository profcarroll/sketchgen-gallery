let fogParticles = [];
const NUM_FOG = 80;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();

  for (let i = 0; i < NUM_FOG; i++) {
    fogParticles.push({
      x: random(width),
      y: random(height * 0.3, height * 0.85),
      rx: random(120, 260),
      ry: random(40, 90),
      speed: random(0.3, 0.9),
      noiseSeed: random(1000),
      baseAlpha: random(15, 35),
    });
  }
}

function draw() {
  background(6, 12, 28);
  let t = frameCount * 0.015;

  // Distant stars
  fill(210, 225, 255, 140);
  for (let i = 0; i < 40; i++) {
    let sx = ((i * 137.5) % width);
    let sy = ((i * 89.3) % (height * 0.5));
    let twinkle = sin(t * 2 + i) * 0.5 + 0.5;
    ellipse(sx, sy, 1.5 + twinkle, 1.5 + twinkle);
  }

  let lhX = width * 0.15;
  let lhY = height * 0.42;

  let beamAngle = sin(t * 0.6) * 0.75 + 0.35;
  let beamSpread = 0.22;
  let beamLength = max(width, height) * 1.3;

  for (let p of fogParticles) {
    p.x += p.speed;
    if (p.x - p.rx > width) p.x = -p.rx;

    let angleToFog = atan2(p.y - lhY, p.x - lhX);
    let diff = abs(sin((angleToFog - beamAngle) * 0.5));
    let inBeam = diff < 0.12 ? map(diff, 0, 0.12, 1.0, 0.0) : 0;

    let r = lerp(45, 230, inBeam);
    let g = lerp(60, 220, inBeam);
    let b = lerp(90, 190, inBeam);
    let a = p.baseAlpha + inBeam * 65;

    fill(r, g, b, a);
    let wobbleY = sin(t + p.noiseSeed) * 8;
    ellipse(p.x, p.y + wobbleY, p.rx, p.ry);
  }

  let steps = 14;
  for (let s = steps; s >= 1; s--) {
    let spread = beamSpread * (s / steps);
    let a1 = beamAngle - spread;
    let a2 = beamAngle + spread;
    let alpha = map(s, 1, steps, 25, 4);

    fill(255, 245, 200, alpha);
    beginShape();
    vertex(lhX, lhY);
    vertex(lhX + cos(a1) * beamLength, lhY + sin(a1) * beamLength);
    vertex(lhX + cos(a2) * beamLength, lhY + sin(a2) * beamLength);
    endShape(CLOSE);
  }

  fill(4, 9, 22);
  rect(0, height * 0.75, width, height * 0.25);

  strokeWeight(2);
  for (let row = 0; row < 6; row++) {
    let yRow = height * (0.75 + row * 0.045);
    stroke(20 + row * 8, 40 + row * 10, 70 + row * 12, 160);
    noFill();
    beginShape();
    for (let x = 0; x <= width; x += 40) {
      let wave = sin(x * 0.012 + t * 2 + row) * (4 + row * 2);
      vertex(x, yRow + wave);
    }
    endShape();
  }
  noStroke();

  let waterHitX = lhX + cos(beamAngle) * ((height * 0.82 - lhY) / max(0.1, sin(beamAngle)));
  if (waterHitX > 0 && waterHitX < width && sin(beamAngle) > 0.05) {
    fill(255, 240, 180, 45);
    ellipse(waterHitX, height * 0.82, 180, 25);
  }

  fill(8, 11, 18);
  beginShape();
  vertex(0, height);
  vertex(0, lhY + 40);
  vertex(width * 0.08, lhY + 50);
  vertex(width * 0.14, lhY + 42);
  vertex(width * 0.20, lhY + 70);
  vertex(width * 0.26, height * 0.76);
  vertex(width * 0.22, height);
  endShape(CLOSE);

  fill(12, 15, 24);
  quad(lhX - 12, lhY + 42, lhX + 12, lhY + 42, lhX + 8, lhY + 6, lhX - 8, lhY + 6);
  rect(lhX - 14, lhY + 2, 28, 5);
  rect(lhX - 10, lhY - 14, 20, 16);
  arc(lhX, lhY - 14, 20, 16, PI, TWO_PI);

  fill(255, 250, 210, 220);
  ellipse(lhX, lhY - 6, 9, 9);
  fill(255, 240, 180, 60);
  ellipse(lhX, lhY - 6, 26, 26);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
