let roots = [];
let sapParticles = [];
const numRoots = 100;
const numSap = 200;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create root network
  for (let i = 0; i < numRoots; i++) {
    let root = {
      x: random(width),
      y: random(height),
      segments: [],
      hue: random(20, 50),
      saturation: random(30, 60),
      brightness: random(40, 70)
    };
    
    // Create branching structure
    let currentX = root.x;
    let currentY = root.y;
    let segmentCount = int(random(8, 15));
    
    for (let j = 0; j < segmentCount; j++) {
      let angle = random(TWO_PI);
      let length = random(30, 100);
      
      currentX += cos(angle) * length;
      currentY += sin(angle) * length;
      
      // Keep within canvas
      currentX = constrain(currentX, 0, width);
      currentY = constrain(currentY, 0, height);
      
      root.segments.push({
        x1: root.x + (currentX - root.x) * (j / segmentCount),
        y1: root.y + (currentY - root.y) * (j / segmentCount),
        x2: currentX,
        y2: currentY
      });
    }
    
    roots.push(root);
  }
  
  // Initialize sap particles
  for (let i = 0; i < numSap; i++) {
    sapParticles.push({
      x: random(width),
      y: random(height),
      speed: random(0.5, 2),
      hue: random(10, 30), // Vibrant yellow/orange
      saturation: random(80, 100),
      brightness: random(70, 100),
      size: random(1, 3),
      targetRoot: int(random(roots.length)),
      segmentIndex: 0,
      progress: random(1)
    });
  }
}

function draw() {
  background(10, 20, 5);
  time += 0.01;
  
  // Draw root network
  for (let i = 0; i < roots.length; i++) {
    let root = roots[i];
    
    // Draw segments with pulsing effect
    let pulse = sin(time * 2 + i) * 0.3 + 0.7;
    
    for (let j = 0; j < root.segments.length; j++) {
      let seg = root.segments[j];
      
      stroke(root.hue, root.saturation, root.brightness, pulse);
      strokeWeight(1 + sin(time * 2 + i + j) * 0.5);
      
      line(seg.x1, seg.y1, seg.x2, seg.y2);
    }
  }
  
  // Update and draw sap particles
  for (let i = 0; i < sapParticles.length; i++) {
    let p = sapParticles[i];
    
    // Move particle along root structure
    let targetRoot = roots[p.targetRoot];
    
    if (targetRoot.segments.length > 0) {
      let segment = targetRoot.segments[p.segmentIndex];
      
      if (segment) {
        // Move toward next point in segment
        p.x += (segment.x2 - segment.x1) * p.speed * 0.01;
        p.y += (segment.y2 - segment.y1) * p.speed * 0.01;
        
        // Progress along segment
        let distance = dist(p.x, p.y, segment.x1, segment.y1);
        let segLength = dist(segment.x1, segment.y1, segment.x2, segment.y2);
        
        if (distance > segLength) {
          // Move to next segment
          p.segmentIndex++;
          if (p.segmentIndex >= targetRoot.segments.length) {
            // Start over at a new root
            p.targetRoot = int(random(roots.length));
            p.segmentIndex = 0;
          }
        }
      }
    } else {
      // If no segments, move randomly
      p.x += random(-1, 1);
      p.y += random(-1, 1);
    }
    
    // Keep particles on canvas
    p.x = constrain(p.x, 0, width);
    p.y = constrain(p.y, 0, height);
    
    // Draw sap particle with glow effect
    let pulse = sin(time * 3 + i) * 0.5 + 0.5;
    fill(p.hue, p.saturation, p.brightness, pulse);
    noStroke();
    
    ellipse(p.x, p.y, p.size * (1 + pulse * 0.5));
  }
  
  // Add subtle background glow
  blendMode(ADD);
  for (let i = 0; i < 20; i++) {
    let x = sin(time * 0.1 + i) * width * 0.3 + width * 0.5;
    let y = cos(time * 0.1 + i) * height * 0.3 + height * 0.5;
    let size = sin(time * 0.5 + i) * 50 + 100;
    fill(20, 30, 80, 0.1);
    ellipse(x, y, size);
  }
  blendMode(BLEND);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
