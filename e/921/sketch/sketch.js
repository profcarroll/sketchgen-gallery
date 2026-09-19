let stream1, stream2;
let particles1 = [];
let particles2 = [];
let trails1 = [];
let trails2 = [];
let trailLength = 50;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Initialize streams with different properties
  stream1 = {
    pos: createVector(width/3, height/2),
    vel: createVector(random(-1, 1), random(-1, 1)),
    color: color(255, 50, 50, 200),
    size: 8
  };
  
  stream2 = {
    pos: createVector(2 * width/3, height/2),
    vel: createVector(random(-1, 1), random(-1, 1)),
    color: color(50, 50, 255, 200),
    size: 8
  };
  
  // Create initial particles for each stream
  for (let i = 0; i < 100; i++) {
    particles1.push(createParticle(stream1));
    particles2.push(createParticle(stream2));
  }
}

function draw() {
  // Semi-transparent background for trail effect
  fill(0, 10);
  rect(0, 0, width, height);
  
  // Update and display streams
  updateStream(stream1, particles1);
  updateStream(stream2, particles2);
  
  // Draw trails
  drawTrails(trails1, stream1.color);
  drawTrails(trails2, stream2.color);
}

function createParticle(stream) {
  return {
    pos: createVector(stream.pos.x, stream.pos.y),
    vel: p5.Vector.random2D().mult(random(0.5, 2)),
    color: stream.color,
    size: stream.size
  };
}

function updateStream(stream, particles) {
  // Update stream position and velocity
  stream.pos.add(stream.vel);
  
  // Reverse direction if hitting canvas edge
  if (stream.pos.x < 0 || stream.pos.x > width) {
    stream.vel.x *= -1;
  }
  if (stream.pos.y < 0 || stream.pos.y > height) {
    stream.vel.y *= -1;
  }
  
  // Add new particles to maintain flow
  if (frameCount % 2 === 0) {
    particles.push(createParticle(stream));
    
    // Keep particle count stable
    if (particles.length > 150) {
      particles.shift();
    }
  }
  
  // Update and draw particles
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    
    // Apply stream velocity to particle
    p.vel.add(stream.vel);
    
    // Update position
    p.pos.add(p.vel);
    
    // Add to trails
    if (frameCount % 3 === 0) {
      if (stream === stream1) {
        trails1.push({pos: p.pos.copy(), color: p.color});
        if (trails1.length > trailLength) trails1.shift();
      } else {
        trails2.push({pos: p.pos.copy(), color: p.color});
        if (trails2.length > trailLength) trails2.shift();
      }
    }
    
    // Draw particle
    fill(p.color);
    ellipse(p.pos.x, p.pos.y, p.size);
    
    // Remove particles that are off-screen
    if (p.pos.x < -50 || p.pos.x > width + 50 ||
        p.pos.y < -50 || p.pos.y > height + 50) {
      particles.splice(i, 1);
    }
  }
}

function drawTrails(trailArray, baseColor) {
  for (let i = 0; i < trailArray.length; i++) {
    let t = trailArray[i];
    
    // Calculate transparency based on position in trail
    let alpha = map(i, 0, trailArray.length, 0, 150);
    fill(red(baseColor), green(baseColor), blue(baseColor), alpha);
    
    ellipse(t.pos.x, t.pos.y, 4);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
