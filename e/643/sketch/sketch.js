let pyramids = [];
let particles = [];
let streams = [];
let grid = [];

const GRID_SIZE = 20;
const PARTICLE_COUNT = 500;
const PYRAMID_COUNT = 15;
const STREAM_COUNT = 8;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Initialize pyramids
  for (let i = 0; i < PYRAMID_COUNT; i++) {
    pyramids.push({
      x: random(-width/2 + 100, width/2 - 100),
      z: random(-height/2 + 100, height/2 - 100),
      height: random(80, 150),
      baseSize: random(30, 60),
      rotation: random(TWO_PI),
      color: color(random(200, 240), 70, 90)
    });
  }

  // Initialize particles
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: random(-width/2, width/2),
      y: height/2,
      z: random(-height/2, height/2),
      size: random(1, 3),
      speed: random(0.5, 2),
      hue: random(180, 220),
      alpha: random(0.3, 0.8),
      targetX: 0,
      targetZ: 0
    });
  }

  // Initialize streams
  for (let i = 0; i < STREAM_COUNT; i++) {
    streams.push({
      x: random(-width/2, width/2),
      z: random(-height/2, height/2),
      angle: random(TWO_PI),
      speed: random(0.1, 0.3),
      nodes: [],
      hue: random(200, 240)
    });
  }

  // Initialize spatial grid
  for (let i = 0; i < GRID_SIZE; i++) {
    grid[i] = [];
    for (let j = 0; j < GRID_SIZE; j++) {
      grid[i][j] = [];
    }
  }
}

function draw() {
  background(0);
  noStroke();

  // Camera movement
  let time = millis() * 0.0002;
  camera(
    sin(time) * width/3, 
    height/4 + sin(time * 0.5) * 50,
    cos(time) * width/3,
    0, 0, 0,
    0, 1, 0
  );

  // Update and draw pyramids
  for (let pyramid of pyramids) {
    push();
    translate(pyramid.x, height/2 - pyramid.height/2, pyramid.z);
    rotateY(pyramid.rotation);
    
    // Draw pyramid with crystalline structure
    fill(pyramid.color);
    drawPyramid(pyramid.baseSize, pyramid.height);
    pop();
  }

  // Update and draw particles
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    
    // Apply current effects
    p.x += sin(time * 2 + p.x * 0.01) * 0.5;
    p.z += cos(time * 2 + p.z * 0.01) * 0.5;
    
    // Move towards target (current)
    let dx = p.targetX - p.x;
    let dz = p.targetZ - p.z;
    p.x += dx * 0.05;
    p.z += dz * 0.05;
    
    // Gravity effect
    p.y -= p.speed;
    
    // Reset if particle goes too low or too high
    if (p.y < -height/2 || p.y > height/2) {
      p.x = random(-width/2, width/2);
      p.y = height/2;
      p.z = random(-height/2, height/2);
    }
    
    // Draw particle
    push();
    translate(p.x, p.y, p.z);
    fill(p.hue, 80, 95, p.alpha);
    sphere(p.size);
    pop();
  }

  // Update and draw streams
  for (let stream of streams) {
    stream.x += cos(stream.angle) * stream.speed;
    stream.z += sin(stream.angle) * stream.speed;
    
    if (stream.x < -width/2 || stream.x > width/2 ||
        stream.z < -height/2 || stream.z > height/2) {
      stream.x = random(-width/2, width/2);
      stream.z = random(-height/2, height/2);
      stream.angle = random(TWO_PI);
    }
    
    // Add new node
    if (frameCount % 5 === 0) {
      stream.nodes.push({
        x: stream.x,
        z: stream.z,
        size: random(3, 8),
        hue: stream.hue,
        alpha: 0.7
      });
      
      // Limit nodes
      if (stream.nodes.length > 20) {
        stream.nodes.shift();
      }
    }
    
    // Draw stream nodes
    for (let node of stream.nodes) {
      push();
      translate(node.x, height/2 + 10, node.z);
      fill(node.hue, 80, 95, node.alpha);
      sphere(node.size);
      pop();
    }
  }

  // Connect particles in streams
  beginShape(LINES);
  for (let stream of streams) {
    for (let i = 0; i < stream.nodes.length - 1; i++) {
      let n1 = stream.nodes[i];
      let n2 = stream.nodes[i + 1];
      
      stroke(n1.hue, 80, 95, 0.3);
      vertex(n1.x, height/2 + 10, n1.z);
      vertex(n2.x, height/2 + 10, n2.z);
    }
  }
  endShape();
}

function drawPyramid(baseSize, height) {
  // Draw pyramid with crystalline structure
  let points = [];
  let base = baseSize;
  
  // Top point
  points.push([0, -height/2, 0]);
  
  // Base corners
  for (let i = 0; i < 4; i++) {
    let angle = TWO_PI * i / 4;
    points.push([
      cos(angle) * base/2,
      height/2,
      sin(angle) * base/2
    ]);
  }
  
  // Draw faces
  for (let i = 0; i < 4; i++) {
    beginShape();
    vertex(points[0][0], points[0][1], points[0][2]); // Top point
    
    let a = i;
    let b = (i + 1) % 4;
    
    vertex(points[a + 1][0], points[a + 1][1], points[a + 1][2]);
    vertex(points[b + 1][0], points[b + 1][1], points[b + 1][2]);
    endShape(CLOSE);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
