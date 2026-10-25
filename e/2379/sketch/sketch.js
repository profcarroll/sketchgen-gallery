let hexagonPoints = [];
let rootSystems = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  frameRate(30);
  
  // Create hexagon vertices
  let radius = min(width, height) * 0.4;
  for (let i = 0; i < 6; i++) {
    let angle = TWO_PI * i / 6 - PI/2;
    hexagonPoints.push({
      x: width/2 + cos(angle) * radius,
      y: height/2 + sin(angle) * radius
    });
  }
  
  // Initialize root systems
  for (let i = 0; i < 8; i++) {
    rootSystems.push({
      x: width/2,
      y: height/2,
      branches: [],
      hue: random(120, 180),
      age: 0,
      maxAge: random(200, 400)
    });
  }
}

function draw() {
  background(0, 0, 5, 0.05);
  
  time += 0.02;
  
  // Draw hexagon boundary
  noFill();
  stroke(180, 30, 90, 0.3);
  strokeWeight(2);
  beginShape();
  for (let p of hexagonPoints) {
    vertex(p.x, p.y);
  }
  endShape(CLOSE);
  
  // Update and draw root systems
  for (let root of rootSystems) {
    root.age++;
    
    // Create new branches
    if (root.branches.length < 100 && random() < 0.1) {
      root.branches.push({
        x: root.x,
        y: root.y,
        vx: random(-1, 1),
        vy: random(-1, 1),
        length: 0,
        maxLen: random(30, 80),
        hue: root.hue + random(-10, 10),
        age: 0
      });
    }
    
    // Update branches
    for (let i = root.branches.length - 1; i >= 0; i--) {
      let b = root.branches[i];
      
      // Apply noise-based movement
      let nx = noise(b.x * 0.02, time + b.age * 0.1);
      let ny = noise(b.y * 0.02, time + b.age * 0.1 + 100);
      
      b.vx += (nx - 0.5) * 0.3;
      b.vy += (ny - 0.5) * 0.3;
      
      // Apply damping
      b.vx *= 0.97;
      b.vy *= 0.97;
      
      // Update position
      b.x += b.vx;
      b.y += b.vy;
      
      // Increase branch length
      b.length = min(b.length + 0.5, b.maxLen);
      
      // Age branch
      b.age++;
      
      // Remove old branches
      if (b.age > 100 || b.length >= b.maxLen) {
        root.branches.splice(i, 1);
        continue;
      }
      
      // Draw branch
      stroke(b.hue, 80, 90, 0.7);
      strokeWeight(1 + b.length / b.maxLen * 2);
      line(b.x, b.y, b.x - b.vx * 5, b.y - b.vy * 5);
      
      // Draw branch tip
      noStroke();
      fill(b.hue, 80, 90, 0.8);
      ellipse(b.x, b.y, 2 + b.length / b.maxLen * 4);
    }
    
    // Update root position with noise
    let nx = noise(root.x * 0.01, time);
    let ny = noise(root.y * 0.01, time + 100);
    
    root.x += (nx - 0.5) * 0.5;
    root.y += (ny - 0.5) * 0.5;
    
    // Keep root within hexagon
    if (!isPointInHexagon(root.x, root.y)) {
      root.x = width/2;
      root.y = height/2;
      root.age = 0;
    }
    
    // Draw root center
    noStroke();
    fill(root.hue, 80, 90, 0.6);
    ellipse(root.x, root.y, 10);
    
    // Occasionally create new roots
    if (root.age > root.maxAge && random() < 0.01) {
      rootSystems.push({
        x: root.x,
        y: root.y,
        branches: [],
        hue: root.hue + random(-20, 20),
        age: 0,
        maxAge: random(200, 400)
      });
      
      // Cap root systems
      if (rootSystems.length > 15) {
        rootSystems.shift();
      }
    }
  }
  
  // Draw central energy core
  let coreRadius = 20 + sin(time * 3) * 5;
  noStroke();
  fill(180, 90, 100, 0.5);
  ellipse(width/2, height/2, coreRadius);
  
  // Draw crystalline lattice
  stroke(200, 50, 90, 0.2);
  strokeWeight(0.5);
  for (let i = 0; i < 30; i++) {
    let angle = time * 0.1 + i * TWO_PI / 30;
    let radius = min(width, height) * 0.3;
    let x1 = width/2 + cos(angle) * radius;
    let y1 = height/2 + sin(angle) * radius;
    let x2 = width/2 + cos(angle + PI) * radius;
    let y2 = height/2 + sin(angle + PI) * radius;
    line(x1, y1, x2, y2);
  }
}

function isPointInHexagon(x, y) {
  // Simple point-in-polygon test for hexagon
  let inside = false;
  for (let i = 0, j = hexagonPoints.length - 1; i < hexagonPoints.length; j = i++) {
    if (((hexagonPoints[i].y > y) !== (hexagonPoints[j].y > y)) &&
        (x < (hexagonPoints[j].x - hexagonPoints[i].x) * (y - hexagonPoints[i].y) / (hexagonPoints[j].y - hexagonPoints[i].y) + hexagonPoints[i].x)) {
      inside = !inside;
    }
  }
  return inside;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
