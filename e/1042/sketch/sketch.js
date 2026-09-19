let particles = [];
let conduits = [];
let time = 0;
let fft;

function setup() {
  createCanvas(600, 600, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize particles
  for (let i = 0; i < 500; i++) {
    particles.push({
      pos: p5.Vector.random3D().mult(random(200, 400)),
      vel: p5.Vector.random3D().mult(random(0.1, 0.5)),
      size: random(1, 3),
      hue: random(80, 120)
    });
  }

  // Initialize conduits
  for (let i = 0; i < 20; i++) {
    let pos = p5.Vector.random3D().mult(random(100, 300));
    let dir = p5.Vector.random3D();
    let length = random(100, 300);
    conduits.push({ pos, dir, length });
  }

  // Setup audio
  fft = new p5.FFT();
}

function draw() {
  background(0);
  time += 0.01;

  // Camera movement
  let camX = sin(time * 0.2) * 300;
  let camY = cos(time * 0.3) * 100;
  let camZ = cos(time * 0.1) * 300;
  camera(camX, camY, camZ, 0, 0, 0, 0, 1, 0);

  // Draw conduits
  stroke(100, 80, 100, 0.7);
  noFill();
  beginShape(LINES);
  for (let conduit of conduits) {
    let start = conduit.pos;
    let end = p5.Vector.add(start, conduit.dir.copy().mult(conduit.length));
    vertex(start.x, start.y, start.z);
    vertex(end.x, end.y, end.z);
  }
  endShape();

  // Draw particles
  noStroke();
  beginShape(POINTS);
  for (let p of particles) {
    p.pos.add(p.vel);
    
    // Bounce off bounds
    if (abs(p.pos.x) > 500 || abs(p.pos.y) > 500 || abs(p.pos.z) > 500) {
      p.vel.mult(-1);
    }
    
    fill(p.hue, 80, 100, 0.8);
    vertex(p.pos.x, p.pos.y, p.pos.z);
  }
  endShape();

  // Pulsing energy waves
  let pulse = sin(time * 3) * 0.5 + 0.5;
  stroke(80, 100, 80, 0.3);
  noFill();
  beginShape(LINES);
  for (let i = 0; i < 200; i++) {
    let angle = time * 0.5 + i * 0.1;
    let radius = 200 + sin(time + i) * 50;
    let x = cos(angle) * radius;
    let y = sin(angle) * radius;
    let z = sin(time * 0.3 + i * 0.05) * 100;
    vertex(x, y, z);
  }
  endShape();

  // Diffraction patterns
  stroke(180, 60, 90, 0.2);
  noFill();
  beginShape(LINES);
  for (let i = 0; i < 50; i++) {
    let angle = time * 0.2 + i * 0.3;
    let x1 = cos(angle) * 300;
    let y1 = sin(angle) * 300;
    let z1 = 0;
    let x2 = cos(angle + PI) * 300;
    let y2 = sin(angle + PI) * 300;
    let z2 = 0;
    vertex(x1, y1, z1);
    vertex(x2, y2, z2);
  }
  endShape();
}

function mousePressed() {
  userStartAudio();
}
