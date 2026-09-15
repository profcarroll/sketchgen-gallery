let streams = [];
let cables = [];
let numCables = 300;
let numStreams = 50;
let centerX, centerY;
let pulseRadius = 0;
let pulseSpeed = 2;

function setup() {
  createCanvas(windowWidth, windowHeight);
  centerX = width / 2;
  centerY = height / 2;
  
  // Create cables (network)
  for (let i = 0; i < numCables; i++) {
    let start = {
      x: random(width),
      y: random(height)
    };
    let end = {
      x: random(width),
      y: random(height)
    };
    cables.push({
      start,
      end
    });
  }
  
  // Create initial streams
  for (let i = 0; i < numStreams; i++) {
    streams.push({
      x: centerX,
      y: centerY,
      radius: 0,
      maxRadius: random(100, 300),
      speed: random(2, 5),
      hue: random(180, 240), // Blue to cyan
      alpha: 255,
      branchCount: 0,
      branches: []
    });
  }
}

function draw() {
  background(10);
  
  // Update pulse
  pulseRadius += pulseSpeed;
  if (pulseRadius > 300) {
    pulseRadius = 0;
  }
  
  // Draw cables
  stroke(40);
  strokeWeight(1);
  for (let cable of cables) {
    line(cable.start.x, cable.start.y, cable.end.x, cable.end.y);
  }
  
  // Draw pulse
  noFill();
  stroke(255, 100);
  strokeWeight(2);
  ellipse(centerX, centerY, pulseRadius * 2);
  
  // Update and draw streams
  for (let i = streams.length - 1; i >= 0; i--) {
    let s = streams[i];
    
    // Move stream outward
    s.radius += s.speed;
    
    // Calculate position along the path from center
    let angle = map(s.radius, 0, s.maxRadius, 0, TWO_PI);
    let x = centerX + cos(angle) * s.radius;
    let y = centerY + sin(angle) * s.radius;
    
    // Draw stream
    noStroke();
    fill(s.hue, 100, 100, s.alpha);
    ellipse(x, y, 8, 8);
    
    // Branching at major junctions (cables)
    let branch = false;
    for (let cable of cables) {
      let d = dist(x, y, (cable.start.x + cable.end.x) / 2, (cable.start.y + cable.end.y) / 2);
      if (d < 30 && s.radius > 100) { // Junction detected
        branch = true;
        break;
      }
    }
    
    if (branch && s.branchCount < 2) {
      // Brighten and split
      fill(s.hue, 100, 100, 255);
      ellipse(x, y, 12, 12);
      
      // Create branches
      for (let j = 0; j < 3; j++) {
        s.branches.push({
          x: x,
          y: y,
          radius: 0,
          maxRadius: random(50, 150),
          speed: random(1, 3),
          hue: s.hue + random(-20, 20),
          alpha: 255,
          branchCount: s.branchCount + 1
        });
      }
      
      s.branchCount = 2;
    }
    
    // Draw branches
    for (let j = s.branches.length - 1; j >= 0; j--) {
      let b = s.branches[j];
      b.radius += b.speed;
      
      let angle = map(b.radius, 0, b.maxRadius, 0, TWO_PI);
      let bx = x + cos(angle) * b.radius;
      let by = y + sin(angle) * b.radius;
      
      noStroke();
      fill(b.hue, 100, 100, b.alpha);
      ellipse(bx, by, 6, 6);
      
      if (b.radius > b.maxRadius) {
        s.branches.splice(j, 1);
      }
    }
    
    // Remove finished streams
    if (s.radius > s.maxRadius) {
      streams.splice(i, 1);
    }
  }
  
  // Add new streams periodically
  if (frameCount % 30 === 0 && streams.length < numStreams * 2) {
    streams.push({
      x: centerX,
      y: centerY,
      radius: 0,
      maxRadius: random(100, 300),
      speed: random(2, 5),
      hue: random(180, 240),
      alpha: 255,
      branchCount: 0,
      branches: []
    });
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  centerX = width / 2;
  centerY = height / 2;
}
