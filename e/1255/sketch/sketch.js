const SHARD_COLORS = [
  [20, 190, 110],  // Emerald
  [30, 100, 235],  // Sapphire
  [245, 195, 45],  // Gold
  [165, 45, 225],  // Violet
];

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(10, 10, 14);

  let cx = width * 0.5;
  let cy = height * 0.5;
  let hexR = min(width, height) * 0.38;
  let t = frameCount * 0.02;

  push();
  translate(cx, cy);

  // 1. Draw forward-motion kaleidoscope facets
  let numSectors = 6;
  let sectorAngle = TWO_PI / numSectors;
  let layers = 16;

  for (let l = layers; l >= 1; l--) {
    let progress = ((l + (t * 2)) % layers) / layers;
    // Non-linear forward acceleration towards viewer
    let r1 = pow(progress, 2.2) * (hexR * 1.25);
    let r2 = pow(min(1.0, progress + 1.0 / layers), 2.2) * (hexR * 1.25);
    let rot = t * 0.5 + l * 0.12;

    let col = SHARD_COLORS[l % SHARD_COLORS.length];
    let alpha = map(progress, 0, 1, 40, 240);

    for (let s = 0; s < numSectors; s++) {
      let aBase = s * sectorAngle + rot;
      
      fill(col[0], col[1], col[2], alpha);
      stroke(255, 255, 255, alpha * 0.4);
      strokeWeight(1);

      beginShape();
      vertex(cos(aBase) * r1, sin(aBase) * r1);
      vertex(cos(aBase + sectorAngle * 0.5) * r2, sin(aBase + sectorAngle * 0.5) * r2);
      vertex(cos(aBase + sectorAngle) * r1, sin(aBase + sectorAngle) * r1);
      endShape(CLOSE);
    }
  }
  pop();

  // 2. Matte mask: cover everything outside the central hexagon
  let outerR = max(width, height) * 1.5;
  fill(10, 10, 14);
  noStroke();

  for (let i = 0; i < 6; i++) {
    let a1 = i * (PI / 3);
    let a2 = (i + 1) * (PI / 3);
    let x1 = cx + cos(a1) * hexR;
    let y1 = cy + sin(a1) * hexR;
    let x2 = cx + cos(a2) * hexR;
    let y2 = cy + sin(a2) * hexR;
    let farX1 = cx + cos(a1) * outerR;
    let farY1 = cy + sin(a1) * outerR;
    let farX2 = cx + cos(a2) * outerR;
    let farY2 = cy + sin(a2) * outerR;

    beginShape();
    vertex(x1, y1);
    vertex(x2, y2);
    vertex(farX2, farY2);
    vertex(farX1, farY1);
    endShape(CLOSE);
  }

  // 3. Hexagonal aperture border rim
  noFill();
  stroke(220, 200, 140, 220);
  strokeWeight(3.5);
  beginShape();
  for (let i = 0; i < 6; i++) {
    let a = i * (PI / 3);
    vertex(cx + cos(a) * hexR, cy + sin(a) * hexR);
  }
  endShape(CLOSE);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
