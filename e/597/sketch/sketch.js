let flows = [];
let lattices = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  
  // Initialize flows
  for (let i = 0; i < 200; i++) {
    flows.push({
      x: random(width),
      y: random(height),
      vx: random(-0.5, 0.5),
      vy: random(-0.5, 0.5),
      hue: random(120, 300), // emerald to amethyst
      size: random(20, 80),
      path: []
    });
  }
  
  // Initialize lattices
  for (let i = 0; i < 100; i++) {
    lattices.push({
      x: random(width),
      y: random(height),
      size: random(50, 200),
      angle: random(TWO_PI)
    });
  }
}

function draw() {
  background(0, 0, 10);
  
  time += 0.01;
  
  // Draw flows
  for (let flow of flows) {
    // Update position
    flow.x += flow.vx;
    flow.y += flow.vy;
    
    // Bounce off edges
    if (flow.x < 0 || flow.x > width) flow.vx *= -1;
    if (flow.y < 0 || flow.y > height) flow.vy *= -1;
    
    // Add to path
    flow.path.push({x: flow.x, y: flow.y});
    if (flow.path.length > 50) {
      flow.path.shift();
    }
    
    // Draw the flow with gradient
    let alpha = map(flow.path.length, 0, 50, 0.1, 0.8);
    fill(flow.hue, 80, 90, alpha);
    
    beginShape();
    for (let p of flow.path) {
      curveVertex(p.x, p.y);
    }
    endShape(CLOSE);
  }
  
  // Draw lattices
  for (let lattice of lattices) {
    let progress = map(time, 0, 10, 0, 1);
    if (progress > 1) progress = 1;
    
    // Adjust lattice size and angle over time
    let size = lattice.size * (0.5 + 0.5 * sin(time * 0.5));
    let angle = lattice.angle + time * 0.1;
    
    push();
    translate(lattice.x, lattice.y);
    rotate(angle);
    
    // Draw hexagon
    stroke(200, 50, 90, 0.7);
    strokeWeight(1);
    noFill();
    
    beginShape();
    for (let i = 0; i < 6; i++) {
      let angle = TWO_PI * i / 6;
      let x = size * cos(angle);
      let y = size * sin(angle);
      vertex(x, y);
    }
    endShape(CLOSE);
    
    // Draw inner lines
    stroke(250, 80, 90, 0.3);
    for (let i = 0; i < 6; i++) {
      let angle1 = TWO_PI * i / 6;
      let angle2 = TWO_PI * (i + 1) / 6;
      line(
        size * cos(angle1),
        size * sin(angle1),
        size * cos(angle2),
        size * sin(angle2)
      );
    }
    
    pop();
  }
  
  // Phase transition: at some point, flows start breaking apart
  if (time > 5) {
    for (let flow of flows) {
      let d = dist(flow.x, flow.y, width/2, height/2);
      if (d < 300 && time > 5 + map(d, 0, 300, 0, 1)) {
        // Break up the flow
        let breakAmount = map(time, 5, 8, 0, 1);
        flow.vx += random(-0.2, 0.2) * breakAmount;
        flow.vy += random(-0.2, 0.2) * breakAmount;
        
        // Draw breaking shards
        stroke(300, 80, 90, 0.5);
        strokeWeight(1);
        noFill();
        beginShape();
        for (let p of flow.path.slice(-10)) {
          vertex(p.x, p.y);
        }
        endShape();
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
