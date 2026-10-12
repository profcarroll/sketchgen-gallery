let strata = [];
let fissures = [];
let displacement = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(RGB);
  
  // Create massive geological strata
  for (let i = 0; i < 20; i++) {
    let layer = {
      y: map(i, 0, 20, 0, height),
      thickness: random(30, 80),
      color: color(random(40, 90), random(30, 60), random(20, 50)),
      segments: []
    };
    
    // Create segmented strata with irregular edges
    let segmentCount = floor(random(10, 25));
    for (let j = 0; j < segmentCount; j++) {
      let x1 = random(width);
      let x2 = x1 + random(100, 300);
      layer.segments.push({
        x1: x1,
        x2: x2,
        y: layer.y + random(-5, 5)
      });
    }
    
    strata.push(layer);
  }
  
  // Create major fissures
  for (let i = 0; i < 8; i++) {
    let f = {
      start: createVector(random(width), random(height)),
      end: createVector(random(width), random(height)),
      width: random(20, 60),
      depth: random(50, 150)
    };
    fissures.push(f);
  }
  
  // Create displacement segments
  for (let i = 0; i < 15; i++) {
    let d = {
      x: random(width),
      y: random(height),
      size: random(20, 60),
      angle: random(TWO_PI)
    };
    displacement.push(d);
  }
}

function draw() {
  background(30, 30, 30);
  
  // Draw the massive geological layers
  for (let layer of strata) {
    fill(layer.color);
    noStroke();
    
    beginShape();
    vertex(0, layer.y);
    for (let segment of layer.segments) {
      vertex(segment.x2, segment.y);
      vertex(segment.x1, segment.y);
    }
    vertex(width, layer.y);
    endShape(CLOSE);
  }
  
  // Draw fissures as deep fractures
  for (let f of fissures) {
    stroke(0, 0, 0);
    strokeWeight(f.width);
    line(f.start.x, f.start.y, f.end.x, f.end.y);
    
    // Add depth effect
    noStroke();
    fill(15, 15, 15);
    let midX = (f.start.x + f.end.x) / 2;
    let midY = (f.start.y + f.end.y) / 2;
    ellipse(midX, midY, f.width * 3, f.depth);
  }
  
  // Draw displaced segments
  for (let d of displacement) {
    noStroke();
    fill(50, 50, 50);
    
    push();
    translate(d.x, d.y);
    rotate(d.angle);
    rectMode(CENTER);
    rect(0, 0, d.size, d.size * 1.5);
    pop();
  }
  
  // Add some concrete texture details
  stroke(40, 40, 40);
  strokeWeight(1);
  for (let i = 0; i < 200; i++) {
    let x = random(width);
    let y = random(height);
    point(x, y);
  }
  
  noLoop(); // Static geological view
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
