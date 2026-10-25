let helix = [];
let connections = [];
let time = 0;
const baseRadius = 150;
const helixHeight = 400;
const strandCount = 2;
const baseCount = 100;
const bondDuration = 180; // frames

// Base colors and labels
const bases = [
  { name: 'A', color: [255, 100, 100], label: 'A' }, // Adenine - Red
  { name: 'T', color: [100, 255, 100], label: 'T' }, // Thymine - Green
  { name: 'C', color: [100, 100, 255], label: 'C' }, // Cytosine - Blue
  { name: 'G', color: [255, 255, 100], label: 'G' }  // Guanine - Yellow
];

function setup() {
  createCanvas(800, 600, WEBGL);
  colorMode(RGB);
  
  // Create the double helix structure
  for (let i = 0; i < baseCount; i++) {
    const angle = map(i, 0, baseCount, 0, TWO_PI * strandCount);
    const height = map(i, 0, baseCount, -helixHeight/2, helixHeight/2);
    
    // Two strands
    for (let s = 0; s < strandCount; s++) {
      const offset = s === 0 ? 0 : PI;
      const x = cos(angle + offset) * baseRadius;
      const y = sin(angle + offset) * baseRadius;
      
      const baseIndex = i % bases.length;
      helix.push({
        x: x,
        y: y,
        z: height,
        base: bases[baseIndex],
        index: i,
        strand: s
      });
    }
  }
}

function draw() {
  background(0);
  time += 0.01;
  
  // Camera movement
  rotateX(time * 0.1);
  rotateY(time * 0.2);
  
  // Draw bases
  for (let base of helix) {
    push();
    translate(base.x, base.y, base.z);
    
    // Oscillate slightly
    const osc = sin(time + base.index * 0.1) * 5;
    scale(1 + osc * 0.05);
    
    noStroke();
    fill(base.base.color[0], base.base.color[1], base.base.color[2]);
    sphere(8);
    
    // Draw label
    fill(255);
    textSize(12);
    textAlign(CENTER, CENTER);
    text(base.base.label, 0, 0);
    
    pop();
  }
  
  // Manage connections
  if (frameCount % 30 === 0) {
    // Form new connections
    for (let i = 0; i < helix.length; i++) {
      const baseA = helix[i];
      for (let j = i + 1; j < helix.length; j++) {
        const baseB = helix[j];
        
        // Check if they are complementary and close enough
        if (
          ((baseA.base.name === 'A' && baseB.base.name === 'T') ||
           (baseA.base.name === 'T' && baseB.base.name === 'A') ||
           (baseA.base.name === 'C' && baseB.base.name === 'G') ||
           (baseA.base.name === 'G' && baseB.base.name === 'C')) &&
          dist(baseA.x, baseA.y, baseA.z, baseB.x, baseB.y, baseB.z) < 30
        ) {
          // Add a new connection if one doesn't exist
          let exists = false;
          for (let c of connections) {
            if ((c.baseA === baseA && c.baseB === baseB) ||
                (c.baseA === baseB && c.baseB === baseA)) {
              exists = true;
              break;
            }
          }
          
          if (!exists) {
            connections.push({
              baseA: baseA,
              baseB: baseB,
              age: 0
            });
          }
        }
      }
    }
    
    // Remove old connections
    connections = connections.filter(c => c.age < bondDuration);
  }
  
  // Update and draw connections
  for (let i = connections.length - 1; i >= 0; i--) {
    const c = connections[i];
    c.age++;
    
    const progress = map(c.age, 0, bondDuration, 0, 1);
    const opacity = map(progress, 0, 0.5, 255, 0);
    
    push();
    stroke(255, 255, 255, opacity * 0.7);
    strokeWeight(1);
    line(c.baseA.x, c.baseA.y, c.baseA.z, c.baseB.x, c.baseB.y, c.baseB.z);
    pop();
  }
}
