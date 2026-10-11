let rods = [];
let springs = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  colorMode(HSB, 360, 100, 100, 1);

  // Create a grid of rods
  const rodSize = 80;
  const spacing = rodSize * 1.2;
  const cols = Math.ceil(width / spacing) + 2;
  const rows = Math.ceil(height / spacing) + 2;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * spacing;
      const y = row * spacing;
      
      // Create a rod with segments
      const segments = [];
      const numSegments = 5;
      for (let i = 0; i < numSegments; i++) {
        segments.push({
          x: x,
          y: y + i * (rodSize / numSegments),
          angle: 0,
          targetAngle: 0
        });
      }
      
      rods.push({
        segments: segments,
        x: x,
        y: y,
        size: rodSize,
        hue: 240 + (col + row) * 3
      });
    }
  }

  // Create springs between adjacent rods
  for (let row = 0; row < rows - 1; row++) {
    for (let col = 0; col < cols - 1; col++) {
      const idx1 = row * cols + col;
      const idx2 = row * cols + col + 1;
      const idx3 = (row + 1) * cols + col;
      
      if (idx1 < rods.length && idx2 < rods.length) {
        springs.push({ rodA: idx1, rodB: idx2 });
      }
      if (idx1 < rods.length && idx3 < rods.length) {
        springs.push({ rodA: idx1, rodB: idx3 });
      }
    }
  }
}

function draw() {
  background(0);
  time += 0.01;

  // Update rod angles based on spring tension
  for (let i = 0; i < rods.length; i++) {
    const rod = rods[i];
    const targetAngle = sin(time + i * 0.2) * 0.3;
    
    for (let j = 0; j < rod.segments.length; j++) {
      const segment = rod.segments[j];
      segment.targetAngle = targetAngle;
      
      // Smooth the angle transition
      segment.angle += (segment.targetAngle - segment.angle) * 0.1;
    }
  }

  // Apply spring forces between rods
  for (let spring of springs) {
    const rodA = rods[spring.rodA];
    const rodB = rods[spring.rodB];
    
    if (rodA && rodB) {
      // Connect the first segments of each rod
      const segA = rodA.segments[0];
      const segB = rodB.segments[0];
      
      // Calculate spring force
      const dx = segB.x - segA.x;
      const dy = segB.y - segA.y;
      const distance = sqrt(dx * dx + dy * dy);
      const targetDistance = 120;
      
      if (distance > 0) {
        const force = (distance - targetDistance) * 0.01;
        const fx = (dx / distance) * force;
        const fy = (dy / distance) * force;
        
        segA.x -= fx;
        segA.y -= fy;
        segB.x += fx;
        segB.y += fy;
      }
    }
  }

  // Draw the rods
  for (let rod of rods) {
    push();
    translate(rod.x, rod.y);
    
    // Draw each segment with a slight offset based on its angle
    for (let i = 0; i < rod.segments.length - 1; i++) {
      const segA = rod.segments[i];
      const segB = rod.segments[i + 1];
      
      const angle = (segA.angle + segB.angle) / 2;
      
      // Create a slight variation in color
      const hue = rod.hue + sin(time * 0.5 + i * 0.3) * 5;
      const brightness = 50 + sin(time + i * 0.2) * 20;
      
      fill(hue, 80, brightness);
      
      // Draw a thin rod segment
      const len = rod.size / (rod.segments.length - 1);
      const x1 = segA.x;
      const y1 = segA.y;
      const x2 = segB.x;
      const y2 = segB.y;
      
      // Create a slight curve based on angle
      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2;
      
      const curveOffset = sin(angle) * 5;
      
      beginShape();
      vertex(x1, y1);
      bezierVertex(
        midX - curveOffset,
        midY - curveOffset,
        midX + curveOffset,
        midY + curveOffset,
        x2, y2
      );
      endShape();
    }
    
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
