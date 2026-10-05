let helix = [];
let basePairs = [];
let bonds = [];
let time = 0;
const numBases = 24;
const radius = 150;
const pitch = 30;
const baseRadius = 8;
let unzipPhase = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create DNA helix structure
  for (let i = 0; i < numBases; i++) {
    const angle = (i / numBases) * TWO_PI * 2;
    const y = (i / numBases) * pitch * 2 - pitch;
    const x = cos(angle) * radius;
    const z = sin(angle) * radius;
    
    // Create base pairs
    const pairAngle = angle + PI;
    const pairY = y;
    const pairX = cos(pairAngle) * radius;
    const pairZ = sin(pairAngle) * radius;
    
    helix.push({ x, y, z, angle, pairX, pairY, pairZ, id: i });
    
    // Store base pairs for hydrogen bonding
    basePairs.push({
      base1: { x, y, z, type: getRandomBase(), id: i },
      base2: { x: pairX, y: pairY, z: pairZ, type: getComplementaryBase(getRandomBase()), id: i + numBases }
    });
  }
}

function draw() {
  background(0);
  time += 0.01;
  
  // Camera rotation
  rotateY(time * 0.15);
  rotateX(sin(time * 0.2) * 0.1);
  
  // Draw helix structure with dynamic motion
  for (let i = 0; i < helix.length; i++) {
    const base = helix[i];
    
    // Add dynamic movement to the helix
    const wave = sin(time + i * 0.5) * 10;
    const x = base.x + wave * cos(base.angle);
    const z = base.z + wave * sin(base.angle);
    const y = base.y + sin(time + i * 0.3) * 5;
    
    // Draw base
    push();
    translate(x, y, z);
    noStroke();
    fill(getBaseColor(basePairs[i].base1.type));
    sphere(baseRadius);
    
    // Draw base label
    fill(255);
    textSize(12);
    textAlign(CENTER, CENTER);
    text(basePairs[i].base1.type, 0, 0, 0);
    pop();
    
    // Draw complementary base on opposite strand
    const pairX = base.pairX + wave * cos(base.angle + PI);
    const pairZ = base.pairZ + wave * sin(base.angle + PI);
    const pairY = base.pairY + sin(time + i * 0.3) * 5;
    
    push();
    translate(pairX, pairY, pairZ);
    noStroke();
    fill(getBaseColor(basePairs[i].base2.type));
    sphere(baseRadius);
    
    // Draw base label
    fill(255);
    textSize(12);
    textAlign(CENTER, CENTER);
    text(basePairs[i].base2.type, 0, 0, 0);
    pop();
    
    // Update hydrogen bonds for specific section
    if (i > 0 && i < helix.length - 1) {
      updateBonds(i, x, y, z, pairX, pairY, pairZ);
    }
  }
  
  // Draw hydrogen bonds
  drawHydrogenBonds();
  
  // Unzip animation for central section
  unzipPhase = (sin(time * 0.5) + 1) / 2;
  const unzipStart = floor(numBases * 0.3);
  const unzipEnd = floor(numBases * 0.7);
  
  for (let i = unzipStart; i < unzipEnd; i++) {
    if (i >= helix.length) continue;
    
    const base = helix[i];
    const wave = sin(time + i * 0.5) * 10;
    
    // Unzip the base pairs
    const x1 = base.x + wave * cos(base.angle);
    const z1 = base.z + wave * sin(base.angle);
    const y1 = base.y + sin(time + i * 0.3) * 5;
    
    const pairX = base.pairX + wave * cos(base.angle + PI);
    const pairZ = base.pairZ + wave * sin(base.angle + PI);
    const pairY = base.pairY + sin(time + i * 0.3) * 5;
    
    // Apply unzip effect
    const separation = map(unzipPhase, 0, 1, 0, 40);
    const dx1 = cos(base.angle + PI/2) * separation;
    const dz1 = sin(base.angle + PI/2) * separation;
    const dx2 = cos(base.angle + PI - PI/2) * separation;
    const dz2 = sin(base.angle + PI - PI/2) * separation;
    
    // Draw unzipped base pairs
    push();
    translate(x1 + dx1, y1, z1 + dz1);
    noStroke();
    fill(getBaseColor(basePairs[i].base1.type));
    sphere(baseRadius);
    fill(255);
    textSize(12);
    textAlign(CENTER, CENTER);
    text(basePairs[i].base1.type, 0, 0, 0);
    pop();
    
    push();
    translate(pairX + dx2, pairY, pairZ + dz2);
    noStroke();
    fill(getBaseColor(basePairs[i].base2.type));
    sphere(baseRadius);
    fill(255);
    textSize(12);
    textAlign(CENTER, CENTER);
    text(basePairs[i].base2.type, 0, 0, 0);
    pop();
    
    // Create temporary hydrogen bonds between unzipped pairs
    if (unzipPhase > 0.3) {
      const bondActive = sin(time * 5 + i) > 0;
      if (bondActive) {
        const bond = {
          start: { x: x1 + dx1, y: y1, z: z1 + dz1 },
          end: { x: pairX + dx2, y: pairY, z: pairZ + dz2 }
        };
        bonds.push(bond);
      }
    }
  }
  
  // Remove old bonds
  if (bonds.length > 100) {
    bonds.splice(0, 5);
  }
}

function updateBonds(index, base1X, base1Y, base1Z, base2X, base2Y, base2Z) {
  // Only create bonds at certain positions for visual clarity
  if (index % 4 === 0) {
    const bond = {
      start: { x: base1X, y: base1Y, z: base1Z },
      end: { x: base2X, y: base2Y, z: base2Z }
    };
    
    // Only add new bonds occasionally
    if (random() > 0.8) {
      bonds.push(bond);
    }
  }
}

function drawHydrogenBonds() {
  stroke(255, 150);
  strokeWeight(1);
  noFill();
  
  // Draw hydrogen bonds between base pairs
  for (let i = 0; i < bonds.length; i++) {
    const bond = bonds[i];
    line(bond.start.x, bond.start.y, bond.start.z,
         bond.end.x, bond.end.y, bond.end.z);
  }
}

function getRandomBase() {
  const bases = ['A', 'T', 'C', 'G'];
  return random(bases);
}

function getComplementaryBase(base) {
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

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
