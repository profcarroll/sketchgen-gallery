let particles = [];
let servers = [];
let streams = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create server racks
  for (let i = 0; i < 20; i++) {
    servers.push({
      x: random(-width/2, width/2),
      y: random(-height/4, height/4),
      z: random(-300, -1000),
      w: random(80, 120),
      h: random(200, 300),
      d: random(30, 50)
    });
  }

  // Create data streams
  for (let i = 0; i < 500; i++) {
    streams.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-1000, -100),
      size: random(2, 6),
      speed: random(0.5, 2)
    });
  }

  // Create particles
  for (let i = 0; i < 3000; i++) {
    particles.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-1000, 0),
      size: random(0.5, 2),
      speed: random(0.1, 0.5)
    });
  }
}

function draw() {
  background(0);
  time += 0.01;

  // Camera movement
  let cx = sin(time * 0.2) * width/4;
  let cy = cos(time * 0.3) * height/6;
  let cz = -500 + sin(time * 0.1) * 200;
  camera(0, 0, cz, cx, cy, 0, 0, 1, 0);

  // Draw server racks
  drawServers();

  // Draw data streams
  drawStreams();

  // Draw particles
  drawParticles();
}

function drawServers() {
  stroke(200, 50, 80);
  strokeWeight(1);
  noFill();

  for (let s of servers) {
    push();
    translate(s.x, s.y, s.z);
    box(s.w, s.h, s.d);
    pop();
  }
}

function drawStreams() {
  // Batch all stream lines into one shape
  beginShape(LINES);
  stroke(180, 80, 90, 0.7);
  strokeWeight(1);

  for (let s of streams) {
    let x1 = s.x;
    let y1 = s.y;
    let z1 = s.z;
    
    let x2 = x1 + sin(time * s.speed) * 50;
    let y2 = y1 + cos(time * s.speed) * 50;
    let z2 = z1 + sin(time * s.speed * 0.5) * 30;

    vertex(x1, y1, z1);
    vertex(x2, y2, z2);
  }
  endShape();
}

function drawParticles() {
  // Batch all particles into one shape
  beginShape(POINTS);
  stroke(240, 90, 95, 0.8);
  noStroke();

  for (let p of particles) {
    let x = p.x + sin(time * p.speed) * 10;
    let y = p.y + cos(time * p.speed) * 10;
    let z = p.z + sin(time * p.speed * 0.5) * 10;

    vertex(x, y, z);
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
