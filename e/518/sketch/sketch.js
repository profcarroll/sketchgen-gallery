let cables = [];
let streams = [];
const cableCount = 150;
const streamCount = 300;
const maxStreamLength = 20;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create cables
  for (let i = 0; i < cableCount; i++) {
    cables.push({
      start: createVector(random(width), random(height)),
      end: createVector(random(width), random(height)),
      width: random(2, 6)
    });
  }
  
  // Initialize streams
  for (let i = 0; i < streamCount; i++) {
    resetStream(i);
  }
}

function resetStream(id) {
  const cable = cables[floor(random(cables.length))];
  const t = random();
  const pos = p5.Vector.lerp(cable.start, cable.end, t);
  
  streams[id] = {
    id: id,
    pos: pos.copy(),
    dir: p5.Vector.sub(cable.end, cable.start).normalize(),
    speed: random(0.5, 2),
    age: 0,
    maxAge: random(100, 300),
    hue: random(180, 300),
    size: random(2, 6),
    trail: []
  };
}

function draw() {
  background(0);
  
  // Draw cables
  stroke(20, 10, 10);
  strokeWeight(1);
  noFill();
  for (let cable of cables) {
    line(cable.start.x, cable.start.y, cable.end.x, cable.end.y);
  }
  
  // Update and draw streams
  for (let i = 0; i < streams.length; i++) {
    const stream = streams[i];
    
    // Move stream
    stream.pos.add(stream.dir.copy().mult(stream.speed));
    stream.age++;
    
    // Add to trail
    stream.trail.push(stream.pos.copy());
    if (stream.trail.length > maxStreamLength) {
      stream.trail.shift();
    }
    
    // Reset if too old or out of bounds
    if (stream.age > stream.maxAge || 
        stream.pos.x < 0 || stream.pos.x > width ||
        stream.pos.y < 0 || stream.pos.y > height) {
      resetStream(i);
    }
    
    // Draw trail
    noFill();
    stroke(stream.hue, 80, 100, 0.7);
    strokeWeight(stream.size * 0.5);
    beginShape();
    for (let pos of stream.trail) {
      vertex(pos.x, pos.y);
    }
    endShape();
    
    // Draw head
    fill(stream.hue, 80, 100);
    noStroke();
    ellipse(stream.pos.x, stream.pos.y, stream.size);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
