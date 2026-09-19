let grid;
let particles = [];
const particleCount = 200;
const gridSpacing = 150;
const transitionDuration = 300;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create hexagonal grid
  grid = createGrid();
  
  // Initialize particles with random positions and states
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      pos: createVector(random(width), random(height)),
      targetPos: createVector(random(width), random(height)),
      size: random(30, 80),
      color: color(random(360), 100, 100, 0.7),
      transitionProgress: 0,
      isTransitioning: false,
      lastTransitionTime: 0
    });
  }
}

function draw() {
  background(0);
  
  // Draw the grid
  drawGrid();
  
  // Update and draw particles
  for (let p of particles) {
    updateParticle(p);
    drawParticle(p);
  }
}

function updateParticle(p) {
  const now = millis();
  
  // Occasionally trigger a transition to grid position
  if (!p.isTransitioning && random() < 0.001) {
    p.isTransitioning = true;
    p.lastTransitionTime = now;
    p.targetPos = getClosestGridPoint(p.pos);
  }
  
  // Handle transition
  if (p.isTransitioning) {
    p.transitionProgress = (now - p.lastTransitionTime) / transitionDuration;
    
    if (p.transitionProgress >= 1) {
      p.isTransitioning = false;
      p.transitionProgress = 0;
      p.pos = p.targetPos.copy();
    } else {
      // Smooth transition using easeInOut
      const eased = easeInOut(p.transitionProgress);
      p.pos.lerp(p.targetPos, eased);
    }
  } else {
    // Random movement when not transitioning
    p.pos.add(createVector(random(-1, 1), random(-1, 1)));
    
    // Keep particles within bounds
    if (p.pos.x < 0) p.pos.x = width;
    if (p.pos.x > width) p.pos.x = 0;
    if (p.pos.y < 0) p.pos.y = height;
    if (p.pos.y > height) p.pos.y = 0;
  }
}

function drawParticle(p) {
  push();
  
  // Position
  translate(p.pos.x - width/2, p.pos.y - height/2);
  
  // Glow effect using multiple transparent layers
  noStroke();
  fill(p.color);
  
  if (p.isTransitioning) {
    // During transition, morph into a hexagon shape
    const progress = p.transitionProgress;
    
    // Start with circle and morph to hexagon
    const sides = lerp(3, 6, progress);
    const radius = p.size * (1 - progress * 0.5);
    
    beginShape();
    for (let i = 0; i < sides; i++) {
      const angle = TWO_PI * i / sides;
      const x = cos(angle) * radius;
      const y = sin(angle) * radius;
      vertex(x, y);
    }
    endShape(CLOSE);
    
    // Add a glowing trail
    fill(p.color);
    for (let i = 0; i < 5; i++) {
      const alpha = map(i, 0, 4, 0.3, 0);
      fill(hue(p.color), saturation(p.color), brightness(p.color), alpha);
      beginShape();
      for (let j = 0; j < sides; j++) {
        const angle = TWO_PI * j / sides;
        const x = cos(angle) * (radius + i * 5);
        const y = sin(angle) * (radius + i * 5);
        vertex(x, y);
      }
      endShape(CLOSE);
    }
  } else {
    // Normal glowing circle
    ellipse(0, 0, p.size, p.size);
    
    // Add glow
    for (let i = 0; i < 3; i++) {
      const alpha = map(i, 0, 2, 0.5, 0);
      fill(hue(p.color), saturation(p.color), brightness(p.color), alpha);
      ellipse(0, 0, p.size + i * 10, p.size + i * 10);
    }
  }
  
  pop();
}

function drawGrid() {
  stroke(255, 0.2);
  noFill();
  
  for (let y = -height/2; y < height/2; y += gridSpacing) {
    for (let x = -width/2; x < width/2; x += gridSpacing) {
      // Draw hexagon at each grid point
      push();
      translate(x, y);
      
      // Rotate to make the hexagons align with screen orientation
      rotate(PI / 6);
      
      beginShape();
      for (let i = 0; i < 6; i++) {
        const angle = TWO_PI * i / 6;
        const x = cos(angle) * gridSpacing/2;
        const y = sin(angle) * gridSpacing/2;
        vertex(x, y);
      }
      endShape(CLOSE);
      
      pop();
    }
  }
}

function createGrid() {
  // Precompute hexagonal grid points for efficiency
  let points = [];
  for (let y = -height/2; y < height/2; y += gridSpacing) {
    for (let x = -width/2; x < width/2; x += gridSpacing) {
      points.push(createVector(x, y));
    }
  }
  return points;
}

function getClosestGridPoint(pos) {
  let closest = null;
  let minDistSq = Infinity;
  
  for (let p of grid) {
    const dx = pos.x - p.x;
    const dy = pos.y - p.y;
    const distSq = dx * dx + dy * dy;
    
    if (distSq < minDistSq) {
      minDistSq = distSq;
      closest = p.copy();
    }
  }
  
  return closest;
}

function easeInOut(t) {
  // Smooth step function for transition
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
