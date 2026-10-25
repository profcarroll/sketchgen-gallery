let rootSystems = [];
const numRoots = 150;
const maxDepth = 6;
const branchFactor = 2;
const rootLength = 80;
const pulseSpeed = 0.005;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize root systems
  for (let i = 0; i < numRoots; i++) {
    const angle = random(TWO_PI);
    const distance = random(50, 200);
    const startX = width/2 + cos(angle) * distance;
    const startY = height/2 + sin(angle) * distance;
    
    rootSystems.push({
      x: startX,
      y: startY,
      angle: angle,
      depth: 0,
      hue: (i * 12) % 360,
      phase: random(TWO_PI),
      segments: []
    });
  }
}

function draw() {
  background(0, 0, 5, 0.03);
  
  // Batch all lines into one shape for performance
  beginShape(LINES);
  
  // Draw each root system
  for (let i = 0; i < rootSystems.length; i++) {
    const root = rootSystems[i];
    
    // Calculate pulsing effect
    const pulse = sin(frameCount * pulseSpeed + root.phase) * 0.1;
    const scale = 1 + pulse;
    
    // Draw root system recursively
    drawRoot(root, scale);
  }
  
  endShape();
}

function drawRoot(root, scale) {
  if (root.depth > maxDepth) return;
  
  const hue = (frameCount * 0.3 + root.hue) % 360;
  stroke(hue, 70, 85, 0.7);
  noFill();
  
  // Start from current position
  let x1 = root.x;
  let y1 = root.y;
  
  // Draw segments with branching
  for (let i = 0; i < 4; i++) {
    const length = rootLength * scale / 4;
    
    // Random angle variation for natural look
    const angle = root.angle + random(-0.2, 0.2);
    
    // Calculate end point
    const x2 = x1 + cos(angle) * length;
    const y2 = y1 + sin(angle) * length;
    
    // Add to batched lines
    vertex(x1, y1);
    vertex(x2, y2);
    
    // Update current position
    x1 = x2;
    y1 = y2;
    
    // Occasionally branch
    if (root.depth < maxDepth && random() < 0.25) {
      const newRoot = {
        x: x1,
        y: y1,
        angle: angle + random(-0.4, 0.4),
        depth: root.depth + 1,
        hue: (root.hue + random(40)) % 360,
        phase: random(TWO_PI)
      };
      
      // Recursively draw branch
      drawRoot(newRoot, scale * 0.7);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
