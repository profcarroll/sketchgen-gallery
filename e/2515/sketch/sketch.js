let cracks = [];
let isCracking = false;
let geodes = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create initial geodes on obsidian surface
  for (let i = 0; i < 20; i++) {
    geodes.push({
      x: random(width),
      y: random(height),
      size: random(30, 80),
      hue: random(180, 300), // Cool blues and purples
      saturation: random(70, 100),
      brightness: random(60, 100)
    });
  }
}

function draw() {
  background(0);
  
  // Draw obsidian surface
  noStroke();
  fill(10, 10, 5); // Dark black base
  rect(0, 0, width, height);
  
  // Draw geodes
  for (let i = 0; i < geodes.length; i++) {
    let g = geodes[i];
    
    // Draw crystal structure
    fill(g.hue, g.saturation, g.brightness);
    stroke(30, 30, 100);
    strokeWeight(2);
    
    push();
    translate(g.x, g.y);
    
    // Draw crystal shape with sharp facets
    beginShape();
    for (let j = 0; j < 8; j++) {
      let angle = map(j, 0, 8, 0, TWO_PI);
      let radius = g.size * (0.7 + noise(j * 0.5) * 0.3);
      let xoff = cos(angle) * radius;
      let yoff = sin(angle) * radius;
      vertex(xoff, yoff);
    }
    endShape(CLOSE);
    
    // Add inner crystal details
    noStroke();
    fill(g.hue + 180, g.saturation, g.brightness - 20);
    beginShape();
    for (let j = 0; j < 6; j++) {
      let angle = map(j, 0, 6, 0, TWO_PI);
      let radius = g.size * 0.3;
      let xoff = cos(angle) * radius;
      let yoff = sin(angle) * radius;
      vertex(xoff, yoff);
    }
    endShape(CLOSE);
    
    pop();
  }
  
  // Draw cracks if active
  if (isCracking) {
    for (let i = 0; i < cracks.length; i++) {
      let c = cracks[i];
      
      // Draw crack with intense color burst
      strokeWeight(2);
      stroke(c.hue, 100, 100, 0.8);
      
      // Draw crack segments
      beginShape();
      for (let j = 0; j < c.points.length; j++) {
        let p = c.points[j];
        vertex(p.x, p.y);
      }
      endShape();
      
      // Add color burst at crack tip
      if (c.points.length > 0) {
        let tip = c.points[c.points.length - 1];
        fill(c.hue, 100, 100, 0.7);
        noStroke();
        ellipse(tip.x, tip.y, 8, 8);
      }
    }
  }
}

function mousePressed() {
  if (!isCracking) {
    isCracking = true;
    
    // Start crack from mouse position
    cracks.push({
      points: [{x: mouseX, y: mouseY}],
      hue: random(0, 360),
      speed: random(2, 5)
    });
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Update cracks each frame
function updateCracks() {
  for (let i = cracks.length - 1; i >= 0; i--) {
    let c = cracks[i];
    
    // Add new point to crack
    let lastPoint = c.points[c.points.length - 1];
    let angle = random(PI/4, PI/2);
    let distance = c.speed;
    
    // Add some randomness to crack direction
    let dir = random(TWO_PI);
    let x = lastPoint.x + cos(dir) * distance;
    let y = lastPoint.y + sin(dir) * distance;
    
    // Boundary checks
    if (x < 0 || x > width || y < 0 || y > height) {
      cracks.splice(i, 1);
      continue;
    }
    
    c.points.push({x: x, y: y});
    
    // Limit crack length for performance
    if (c.points.length > 200) {
      c.points.shift();
    }
  }
}

// Override draw to include crack updates
function draw() {
  background(0);
  
  // Draw obsidian surface
  noStroke();
  fill(10, 10, 5);
  rect(0, 0, width, height);
  
  // Draw geodes
  for (let i = 0; i < geodes.length; i++) {
    let g = geodes[i];
    
    fill(g.hue, g.saturation, g.brightness);
    stroke(30, 30, 100);
    strokeWeight(2);
    
    push();
    translate(g.x, g.y);
    
    // Draw crystal shape
    beginShape();
    for (let j = 0; j < 8; j++) {
      let angle = map(j, 0, 8, 0, TWO_PI);
      let radius = g.size * (0.7 + noise(j * 0.5) * 0.3);
      let xoff = cos(angle) * radius;
      let yoff = sin(angle) * radius;
      vertex(xoff, yoff);
    }
    endShape(CLOSE);
    
    // Add inner crystal details
    noStroke();
    fill(g.hue + 180, g.saturation, g.brightness - 20);
    beginShape();
    for (let j = 0; j < 6; j++) {
      let angle = map(j, 0, 6, 0, TWO_PI);
      let radius = g.size * 0.3;
      let xoff = cos(angle) * radius;
      let yoff = sin(angle) * radius;
      vertex(xoff, yoff);
    }
    endShape(CLOSE);
    
    pop();
  }
  
  // Update and draw cracks
  if (isCracking) {
    updateCracks();
    
    for (let i = 0; i < cracks.length; i++) {
      let c = cracks[i];
      
      strokeWeight(2);
      stroke(c.hue, 100, 100, 0.8);
      
      // Draw crack segments
      beginShape();
      for (let j = 0; j < c.points.length; j++) {
        let p = c.points[j];
        vertex(p.x, p.y);
      }
      endShape();
      
      // Add color burst at crack tip
      if (c.points.length > 0) {
        let tip = c.points[c.points.length - 1];
        fill(c.hue, 100, 100, 0.7);
        noStroke();
        ellipse(tip.x, tip.y, 8, 8);
      }
    }
  }
}
