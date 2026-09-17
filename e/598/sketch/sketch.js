let strands = [];
let bonds = [];
let basePairs = {
  'A': 'T',
  'T': 'A',
  'C': 'G',
  'G': 'C'
};

function setup() {
  createCanvas(800, 600, WEBGL);
  noStroke();
  
  // Generate DNA strands
  for (let i = 0; i < 200; i++) {
    const angle = i * 0.2;
    const radius = 150 + sin(i * 0.1) * 30;
    const x = cos(angle) * radius;
    const y = sin(angle * 0.7) * 100;
    const z = sin(angle) * radius;
    
    const base = random(['A', 'T', 'C', 'G']);
    strands.push({x, y, z, base});
  }
  
  // Precompute possible bonds
  for (let i = 0; i < strands.length; i++) {
    for (let j = i + 10; j < strands.length; j += 20) {
      if (basePairs[strands[i].base] === strands[j].base) {
        bonds.push({i, j});
      }
    }
  }
}

function draw() {
  background(20);
  
  // Rotate the view
  rotateY(frameCount * 0.005);
  rotateX(sin(frameCount * 0.001) * 0.1);
  
  // Draw the backbone
  beginShape(POINTS);
  for (let i = 0; i < strands.length; i++) {
    const s = strands[i];
    vertex(s.x, s.y, s.z);
  }
  endShape();
  
  // Draw hydrogen bonds
  beginShape(LINES);
  for (let i = 0; i < bonds.length; i++) {
    const b = bonds[i];
    const s1 = strands[b.i];
    const s2 = strands[b.j];
    
    // Calculate bond strength based on proximity and time
    const dx = s1.x - s2.x;
    const dy = s1.y - s2.y;
    const dz = s1.z - s2.z;
    const dist = sqrt(dx*dx + dy*dy + dz*dz);
    
    if (dist < 300 && dist > 50) {
      // Make the bond pulse
      const pulse = sin(frameCount * 0.05 + i) * 0.5 + 0.5;
      const opacity = map(dist, 50, 300, 255, 0) * pulse;
      
      stroke(255, 255, 255, opacity);
      vertex(s1.x, s1.y, s1.z);
      vertex(s2.x, s2.y, s2.z);
    }
  }
  endShape();
  
  // Draw base labels
  for (let i = 0; i < strands.length; i += 10) {
    const s = strands[i];
    push();
    translate(s.x, s.y, s.z);
    fill(255);
    textSize(16);
    textAlign(CENTER, CENTER);
    text(s.base, 0, 0);
    pop();
  }
}
