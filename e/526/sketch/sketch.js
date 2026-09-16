let particles = [];
let networkLines = [];
let time = 0;

function setup() {
  createCanvas(600, 600, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create particles
  for (let i = 0; i < 200; i++) {
    particles.push({
      pos: p5.Vector.random3D().mult(random(100, 250)),
      vel: p5.Vector.random3D().mult(random(0.2, 0.8)),
      size: random(2, 6),
      hue: random(120, 180)
    });
  }

  // Create crystalline network
  for (let i = 0; i < 500; i++) {
    let a = random(TWO_PI);
    let r = random(100, 300);
    let x = cos(a) * r;
    let y = sin(a) * r;
    let z = random(-200, 200);
    networkLines.push(createVector(x, y, z));
  }
}

function draw() {
  background(0);
  time += 0.01;

  // Camera movement
  let cx = sin(time * 0.3) * 100;
  let cy = cos(time * 0.2) * 100;
  let cz = sin(time * 0.1) * 100;
  camera(cx, cy, cz + 400, cx, cy, cz, 0, 1, 0);

  // Draw crystalline network
  stroke(180, 80, 90, 0.5);
  noFill();
  beginShape(LINES);
  for (let i = 0; i < networkLines.length - 1; i++) {
    let p1 = networkLines[i];
    let p2 = networkLines[i + 1];
    vertex(p1.x, p1.y, p1.z);
    vertex(p2.x, p2.y, p2.z);
  }
  endShape();

  // Draw particles
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    // Update position
    p.pos.add(p.vel);
    
    // Wrap around
    if (p.pos.mag() > 350) {
      p.pos.normalize().mult(350);
    }
    
    // Pulsing size and hue
    let pulse = sin(time * 2 + i) * 0.5 + 0.5;
    let size = p.size * (1 + pulse * 0.5);
    let hue = (p.hue + time * 30) % 360;

    push();
    translate(p.pos.x, p.pos.y, p.pos.z);
    
    // Glow effect
    noStroke();
    fill(hue, 100, 100, 0.8);
    sphere(size);
    
    // Inner core
    fill(hue, 100, 100, 0.3);
    sphere(size * 0.4);
    
    pop();
  }
}
