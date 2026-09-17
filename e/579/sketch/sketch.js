let streams = [];
let canyonGrid = [];
const GRID_SIZE = 40;
const STREAM_COUNT = 300;
const CANYON_COUNT = 150;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize data streams
  for (let i = 0; i < STREAM_COUNT; i++) {
    streams.push({
      pos: createVector(random(width), random(height), random(-500, 500)),
      vel: p5.Vector.random3D().mult(random(0.5, 2)),
      hue: random(360),
      trail: [],
      maxTrailLength: 50
    });
  }
  
  // Create canyon structures
  for (let i = 0; i < CANYON_COUNT; i++) {
    canyonGrid.push({
      x: random(width),
      y: random(height),
      z: random(-500, 500),
      size: random(20, 80)
    });
  }
}

function draw() {
  background(0);
  
  // Move and update streams
  for (let stream of streams) {
    // Update position
    stream.pos.add(stream.vel);
    
    // Add current position to trail
    stream.trail.push(stream.pos.copy());
    if (stream.trail.length > stream.maxTrailLength) {
      stream.trail.shift();
    }
    
    // Reset stream if it goes too far
    if (abs(stream.pos.x) > width * 2 || 
        abs(stream.pos.y) > height * 2 || 
        abs(stream.pos.z) > 1000) {
      stream.pos = createVector(random(width), random(height), random(-500, 500));
      stream.trail = [];
    }
  }
  
  // Draw canyon structures
  for (let canyon of canyonGrid) {
    push();
    translate(canyon.x - width/2, canyon.y - height/2, canyon.z);
    noFill();
    stroke(180, 50, 30, 0.3);
    strokeWeight(1);
    box(canyon.size);
    pop();
  }
  
  // Draw data streams
  beginShape(POINTS);
  for (let stream of streams) {
    for (let i = 0; i < stream.trail.length; i++) {
      let pos = stream.trail[i];
      let alpha = map(i, 0, stream.trail.length - 1, 0, 1);
      let hue = (stream.hue + i * 2) % 360;
      
      stroke(hue, 80, 90, alpha * 0.7);
      vertex(pos.x - width/2, pos.y - height/2, pos.z);
    }
  }
  endShape();
  
  // Draw stream heads
  for (let stream of streams) {
    let head = stream.trail[stream.trail.length - 1];
    if (head) {
      push();
      translate(head.x - width/2, head.y - height/2, head.z);
      noStroke();
      fill(stream.hue, 90, 100, 1);
      sphere(3);
      pop();
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
