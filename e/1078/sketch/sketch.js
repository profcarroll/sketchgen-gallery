let planes = [];
let grid;
let transitionProgress = 0;
let isTransitioning = false;
let gridSize = 80;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize grid
  grid = [];
  for (let y = 0; y < height; y += gridSize) {
    for (let x = 0; x < width; x += gridSize) {
      grid.push({x: x + gridSize/2, y: y + gridSize/2});
    }
  }
  
  // Initialize planes
  for (let i = 0; i < 15; i++) {
    planes.push({
      x: random(width),
      y: random(height),
      size: random(80, 200),
      speed: random(0.3, 0.7),
      hue: random(360),
      transitionTarget: null,
      transitionStart: 0
    });
  }
}

function draw() {
  background(0, 0, 0, 0.05);
  
  // Draw hexagonal grid
  stroke(200, 20, 10);
  strokeWeight(0.5);
  noFill();
  
  for (let i = 0; i < grid.length; i++) {
    let x = grid[i].x;
    let y = grid[i].y;
    
    push();
    translate(x, y);
    
    // Draw hexagon
    beginShape();
    for (let j = 0; j < 6; j++) {
      let angle = TWO_PI * j / 6;
      let px = cos(angle) * gridSize/2;
      let py = sin(angle) * gridSize/2;
      vertex(px, py);
    }
    endShape(CLOSE);
    
    pop();
  }
  
  // Update and draw planes
  for (let i = 0; i < planes.length; i++) {
    let p = planes[i];
    
    // Move plane
    p.x += cos(p.hue * 0.01) * p.speed;
    p.y += sin(p.hue * 0.01) * p.speed;
    
    // Wrap around screen
    if (p.x < -p.size) p.x = width + p.size;
    if (p.x > width + p.size) p.x = -p.size;
    if (p.y < -p.size) p.y = height + p.size;
    if (p.y > height + p.size) p.y = -p.size;
    
    // Occasionally start a transition
    if (!isTransitioning && random() < 0.001) {
      isTransitioning = true;
      transitionProgress = 0;
      
      // Choose a new target grid point
      let targetIndex = floor(random(grid.length));
      p.transitionTarget = grid[targetIndex];
      p.transitionStart = millis();
    }
    
    // Update transition
    if (isTransitioning) {
      transitionProgress += 0.01;
      
      if (transitionProgress >= 1) {
        isTransitioning = false;
        transitionProgress = 0;
        p.transitionTarget = null;
      }
    }
    
    // Draw the plane
    fill(p.hue, 70, 90, 0.4);
    noStroke();
    
    if (p.transitionTarget && isTransitioning) {
      // Smoothly transition to grid shape
      let t = transitionProgress;
      
      // Interpolate position
      let targetX = lerp(p.x, p.transitionTarget.x, t);
      let targetY = lerp(p.y, p.transitionTarget.y, t);
      
      // Create a more grid-like shape during transition
      push();
      translate(targetX, targetY);
      
      beginShape();
      for (let j = 0; j < 6; j++) {
        let angle = TWO_PI * j / 6;
        let px = cos(angle) * (p.size * (0.8 + 0.2 * t));
        let py = sin(angle) * (p.size * (0.8 + 0.2 * t));
        vertex(px, py);
      }
      endShape(CLOSE);
      
      pop();
    } else {
      // Draw regular organic shape
      push();
      translate(p.x, p.y);
      
      beginShape();
      for (let j = 0; j < 12; j++) {
        let angle = TWO_PI * j / 12;
        let r = p.size * (0.8 + 0.4 * sin(angle * 3 + millis() * 0.001));
        let px = cos(angle) * r;
        let py = sin(angle) * r;
        vertex(px, py);
      }
      endShape(CLOSE);
      
      pop();
    }
    
    // Update hue for color cycling
    p.hue = (p.hue + 0.2) % 360;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
