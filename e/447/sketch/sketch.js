let strands = [];
let basePairs = [];
let separation = 0;
let maxSeparation = 100;
let angle = 0;

function setup() {
  createCanvas(600, 600, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create the double helix structure
  for (let i = 0; i < 20; i++) {
    let x = cos(i * 0.5) * 100;
    let y = i * 10;
    let z = sin(i * 0.5) * 100;

    // Base pairs
    let base = {
      type: ['A', 'T', 'C', 'G'][floor(random(4))],
      x: x,
      y: y,
      z: z,
      angle: i * 0.5,
      size: 10
    };

    basePairs.push(base);
  }

  // Create the two complementary strands
  for (let i = 0; i < basePairs.length; i++) {
    let bp = basePairs[i];
    let x = bp.x;
    let y = bp.y;
    let z = bp.z;

    let complementary = {
      type: getComplement(bp.type),
      x: x,
      y: y,
      z: z + 20,
      angle: bp.angle,
      size: 10
    };

    strands.push({ base: bp, complement: complementary });
  }
}

function draw() {
  background(0);
  noStroke();

  // Rotate the scene
  rotateY(angle);

  // Animate separation
  if (separation < maxSeparation) {
    separation += 0.5;
  }

  // Draw the DNA strands
  for (let i = 0; i < strands.length; i++) {
    let strand = strands[i];
    let bp = strand.base;
    let comp = strand.complement;

    // Base pair connection
    stroke(255);
    strokeWeight(1);
    line(bp.x, bp.y, bp.z, comp.x, comp.y, comp.z);

    // Base pair spheres
    noStroke();
    fill(getBaseColor(bp.type));
    sphere(bp.size);

    fill(getBaseColor(comp.type));
    sphere(comp.size);

    // Move the complementary strand outward
    let dx = (comp.x - bp.x) * 0.05;
    let dy = (comp.y - bp.y) * 0.05;
    let dz = (comp.z - bp.z) * 0.05;

    comp.x += dx;
    comp.y += dy;
    comp.z += dz;
  }

  // Draw growing new strands
  for (let i = 0; i < basePairs.length; i++) {
    let bp = basePairs[i];
    let x = bp.x + cos(bp.angle) * separation;
    let y = bp.y;
    let z = bp.z + sin(bp.angle) * separation;

    fill(getBaseColor(bp.type));
    sphere(bp.size);
  }

  angle += 0.01;
}

function getComplement(base) {
  switch (base) {
    case 'A': return 'T';
    case 'T': return 'A';
    case 'C': return 'G';
    case 'G': return 'C';
    default: return 'A';
  }
}

function getBaseColor(type) {
  switch (type) {
    case 'A': return color(255, 100, 100); // Red
    case 'T': return color(100, 255, 100); // Green
    case 'C': return color(100, 100, 255); // Blue
    case 'G': return color(255, 255, 100); // Yellow
    default: return color(255);
  }
}
