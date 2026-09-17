let particles = [];
let sculptures = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create ambient particles
  for (let i = 0; i < 1500; i++) {
    particles.push({
      pos: p5.Vector.random3D().mult(random(200, 400)),
      vel: p5.Vector.random3D().mult(random(0.1, 0.5)),
      size: random(0.5, 2),
      hue: random(180, 240)
    });
  }

  // Create sculptural forms
  sculptures.push({
    pos: createVector(0, 0, 0),
    scale: 100,
    shape: 'sphere'
  });

  sculptures.push({
    pos: createVector(-200, -150, 100),
    scale: 80,
    shape: 'box'
  });

  sculptures.push({
    pos: createVector(150, 100, -150),
    scale: 90,
    shape: 'torus'
  });
}

function draw() {
  background(0);
  time += 0.002;

  // Ambient lighting
  pointLight(255, 255, 255, 0, -300, 0);
  ambientLight(50);

  // Draw ambient field
  beginShape(POINTS);
  for (let p of particles) {
    let v = p.pos.copy();
    v.add(p.vel.mult(time));
    
    // Flow field effect
    let n = noise(v.x * 0.001, v.y * 0.001, v.z * 0.001, time);
    let h = map(n, 0, 1, p.hue, p.hue + 30);
    
    fill(h, 80, 90, 0.7);
    vertex(v.x, v.y, v.z);
  }
  endShape();

  // Draw sculptural forms
  for (let s of sculptures) {
    push();
    translate(s.pos.x, s.pos.y, s.pos.z);
    
    // Obsidian material
    fill(0);
    stroke(30);
    strokeWeight(0.5);
    
    if (s.shape === 'sphere') {
      sphere(s.scale);
    } else if (s.shape === 'box') {
      box(s.scale);
    } else if (s.shape === 'torus') {
      torus(s.scale, s.scale * 0.4);
    }
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
