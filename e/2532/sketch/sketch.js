let lines = [];
const numLines = 800;
const maxDepth = 5;
const branchFactor = 2;
const lineWidth = 1.2;
const pulseSpeed = 0.01;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize lines with random starting points and directions
  for (let i = 0; i < numLines; i++) {
    const angle = random(TWO_PI);
    const distance = random(50, 200);
    const startX = width/2 + cos(angle) * distance;
    const startY = height/2 + sin(angle) * distance;
    
    lines.push({
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
  background(0, 0, 5, 0.05);
  
  // Batch all lines into one shape for performance
  beginShape(LINES);
  
  // Draw each line system
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Calculate pulsing effect
    const pulse = sin(frameCount * pulseSpeed + line.phase) * 0.1;
    const scale = 1 + pulse;
    
    // Draw line system recursively
    drawLine(line, scale);
  }
  
  endShape();
}

function drawLine(line, scale) {
  if (line.depth > maxDepth) return;
  
  const hue = (frameCount * 0.3 + line.hue) % 360;
  stroke(hue, 70, 85, 0.7);
  noFill();
  
  // Start from current position
  let x1 = line.x;
  let y1 = line.y;
  
  // Draw segments with branching
  for (let i = 0; i < 3; i++) {
    const length = 40 * scale / 3;
    
    // Random angle variation for natural look
    const angle = line.angle + random(-0.2, 0.2);
    
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
    if (line.depth < maxDepth && random() < 0.3) {
      const newLine = {
        x: x1,
        y: y1,
        angle: angle + random(-0.5, 0.5),
        depth: line.depth + 1,
        hue: (line.hue + random(40)) % 360,
        phase: random(TWO_PI)
      };
      
      // Recursively draw branch
      drawLine(newLine, scale * 0.8);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
