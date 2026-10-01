let helix = [];
let basePairs = [];
let bonds = [];
let singleStrands = [];
let time = 0;
const numBases = 16;
const radius = 120;
const pitch = 25;
const baseRadius = 10;
let unzipStart = -1;
let unzipEnd = -1;
let unzipPhase = 0;
let strandSeparation = false;

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
  
  // Set up unzip section
  unzipStart = floor(numBases * 0.3);
  unzipEnd = floor(numBases * 0.7);
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
    const wave = sin(time + i * 0.5) * 12;
    const x = base.x + wave * cos(base.angle);
    const z = base.z + wave * sin(base.angle);
    const y = base.y + sin(time + i * 0.3) * 7;
    
    // Draw base
    push();
    translate(x, y, z);
    noStroke();
    fill(getBaseColor(basePairs[i].base1.type));
    sphere(baseRadius);
    
    // Draw base label
    fill(255);
    textSize(14);
    textAlign(CENTER, CENTER);
    text(basePairs[i].base1.type, 0, 0, 0);
    pop();
    
    // Draw complementary base on opposite strand
    const pairX = base.pairX + wave * cos(base.angle + PI);
    const pairZ = base.pairZ + wave * sin(base.angle + PI);
    const pairY = base.pairY + sin(time + i * 0.3) * 7;
    
    push();
    translate(pairX, pairY, pairZ);
    noStroke();
    fill(getBaseColor(basePairs[i].base2.type));
    sphere(baseRadius);
    
    // Draw base label
    fill(255);
    textSize(14);
    textAlign(CENTER, CENTER);
    text(basePairs[i].base2.type, 0, 0, 0);
    pop();
    
    // Update hydrogen bonds
    if (i > 0 && i < helix.length - 1) {
      updateBonds(i, x, y, z, pairX, pairY, pairZ);
    }
  }
  
  // Draw hydrogen bonds
  drawHydrogenBonds();
  
  // Unzip animation for specific section
  if (unzipStart >= 0 && unzipEnd >= 0) {
    const unzipTime = sin(time * 2) * 0.5 + 0.5;
    const angleOffset = map(unzipTime, 0, 1, 0, PI/4);
    
    // Gradually increase the unzipping effect
    unzipPhase = min(unzipPhase + 0.02, 1.0);
    
    for (let i = unzipStart; i < unzipEnd; i++) {
      if (i >= helix.length) continue;
      
      const base = helix[i];
      const wave = sin(time + i * 0.5) * 12;
      
      // Unzip the base pairs
      const x1 = base.x + wave * cos(base.angle);
      const z1 = base.z + wave * sin(base.angle);
      const y1 = base.y + sin(time + i * 0.3) * 7;
      
      const pairX = base.pairX + wave * cos(base.angle + PI);
      const pairZ = base.pairZ + wave * sin(base.angle + PI);
      const pairY = base.pairY + sin(time + i * 0.3) * 7;
      
      // Apply unzip effect
      const dx1 = (cos(base.angle + angleOffset) - cos(base.angle)) * radius * 0.3;
      const dz1 = (sin(base.angle + angleOffset) - sin(base.angle)) * radius * 0.3;
      const dx2 = (cos(base.angle + PI - angleOffset) - cos(base.angle + PI)) * radius * 0.3;
      const dz2 = (sin(base.angle + PI - angleOffset) - sin(base.angle + PI)) * radius * 0.3;
      
      // Draw unzipped base pairs
      push();
      translate(x1 + dx1, y1, z1 + dz1);
      noStroke();
      fill(getBaseColor(basePairs[i].base1.type));
      sphere(baseRadius);
      fill(255);
      textSize(14);
      textAlign(CENTER, CENTER);
      text(basePairs[i].base1.type, 0, 0, 0);
      pop();
      
      push();
      translate(pairX + dx2, pairY, pairZ + dz2);
      noStroke();
      fill(getBaseColor(basePairs[i].base2.type));
      sphere(baseRadius);
      fill(255);
      textSize(14);
      textAlign(CENTER, CENTER);
      text(basePairs[i].base2.type, 0, 0, 0);
      pop();
      
      // Create floating single strands after unzipping
      if (unzipPhase > 0.7 && !strandSeparation) {
        createSingleStrand(i, x1 + dx1, y1, z1 + dz1, basePairs[i].base1.type);
        createSingleStrand(i, pairX + dx2, pairY, pairZ + dz2, basePairs[i].base2.type);
        strandSeparation = true;
      }
    }
  }
  
  // Update and draw floating single strands
  updateAndDrawSingleStrands();
}

function updateBonds(index, base1X, base1Y, base1Z, base2X, base2Y, base2Z) {
  const bond = {
    start: { x: base1X, y: base1Y, z: base1Z },
    end: { x: base2X, y: base2Y, z: base2Z },
    active: random() > 0.8
  };
  
  if (bond.active) {
    bonds.push(bond);
  }
}

function drawHydrogenBonds() {
  stroke(255, 100);
  strokeWeight(1);
  noFill();
  
  // Draw hydrogen bonds between base pairs
  for (let i = 0; i < bonds.length; i++) {
    const bond = bonds[i];
    line(bond.start.x, bond.start.y, bond.start.z,
         bond.end.x, bond.end.y, bond.end.z);
  }
  
  // Remove old bonds
  if (bonds.length > 80) {
    bonds.splice(0, 5);
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

function createSingleStrand(index, x, y, z, type) {
  singleStrands.push({
    id: index,
    position: { x, y, z },
    velocity: {
      x: random(-1, 1),
      y: random(-1, 1),
      z: random(-1, 1)
    },
    type: type,
    life: 1.0
  });
}

function updateAndDrawSingleStrands() {
  for (let i = singleStrands.length - 1; i >= 0; i--) {
    const strand = singleStrands[i];
    
    // Update position
    strand.position.x += strand.velocity.x;
    strand.position.y += strand.velocity.y;
    strand.position.z += strand.velocity.z;
    
    // Add some drift and fade out
    strand.velocity.x *= 0.99;
    strand.velocity.y *= 0.99;
    strand.velocity.z *= 0.99;
    strand.life -= 0.005;
    
    // Draw strand
    push();
    translate(strand.position.x, strand.position.y, strand.position.z);
    noStroke();
    fill(getBaseColor(strand.type));
    sphere(baseRadius * 0.8);
    
    // Draw base label
    fill(255);
    textSize(12);
    textAlign(CENTER, CENTER);
    text(strand.type, 0, 0, 0);
    pop();
    
    // Remove dead strands
    if (strand.life <= 0) {
      singleStrands.splice(i, 1);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
