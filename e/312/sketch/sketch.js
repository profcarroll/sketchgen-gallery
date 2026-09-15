let structures = [];
let particles = [];

function setup() {
  createCanvas(600, 600, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize fractal structures
  for (let i = 0; i < 8; i++) {
    structures.push({
      pos: createVector(random(-200, 200), random(-200, 200), random(-200, 200)),
      size: random(50, 150),
      rotation: createVector(random(TWO_PI), random(TWO_PI), random(TWO_PI)),
      rotSpeed: createVector(random(-0.01, 0.01), random(-0.01, 0.01), random(-0.01, 0.01)),
      age: 0,
      maxAge: random(200, 500)
    });
  }
  
  // Initialize particles
  for (let i = 0; i < 300; i++) {
    particles.push({
      pos: createVector(random(-300, 300), random(-300, 300), random(-300, 300)),
      vel: p5.Vector.random3D().mult(random(0.5, 2)),
      size: random(1, 4),
      hue: random(160, 200),
      life: random(100, 300)
    });
  }
}

function draw() {
  background(0, 0, 0, 0.1);
  
  // Center camera
  translate(0, 0, -500);
  rotateX(frameCount * 0.002);
  rotateY(frameCount * 0.003);
  
  // Update and display structures
  for (let i = structures.length - 1; i >= 0; i--) {
    let s = structures[i];
    
    push();
    translate(s.pos.x, s.pos.y, s.pos.z);
    rotateX(s.rotation.x);
    rotateY(s.rotation.y);
    rotateZ(s.rotation.z);
    
    // Visualize structure
    stroke(180, 80, 90, 0.7);
    noFill();
    box(s.size);
    
    // Add fractal effects
    if (s.age > s.maxAge * 0.7) {
      stroke(240, 60, 80, 0.5);
      for (let j = 0; j < 3; j++) {
        push();
        translate(random(-s.size/2, s.size/2), random(-s.size/2, s.size/2), random(-s.size/2, s.size/2));
        rotateX(random(TWO_PI));
        rotateY(random(TWO_PI));
        rotateZ(random(TWO_PI));
        box(s.size * 0.3);
        pop();
      }
    }
    
    pop();
    
    // Update structure
    s.rotation.add(s.rotSpeed);
    s.age++;
    
    // Replace old structures with new ones
    if (s.age > s.maxAge) {
      structures.splice(i, 1);
      structures.push({
        pos: createVector(random(-200, 200), random(-200, 200), random(-200, 200)),
        size: random(50, 150),
        rotation: createVector(random(TWO_PI), random(TWO_PI), random(TWO_PI)),
        rotSpeed: createVector(random(-0.01, 0.01), random(-0.01, 0.01), random(-0.01, 0.01)),
        age: 0,
        maxAge: random(200, 500)
      });
    }
  }
  
  // Update and display particles
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    
    // Update particle position
    p.pos.add(p.vel);
    p.life--;
    
    // Add some gravity effect
    p.vel.y += 0.02;
    
    // Draw particle
    push();
    translate(p.pos.x, p.pos.y, p.pos.z);
    noStroke();
    fill(p.hue, 80, 90, p.life / 300);
    sphere(p.size);
    pop();
    
    // Remove dead particles and replace with new ones
    if (p.life <= 0) {
      particles.splice(i, 1);
      particles.push({
        pos: createVector(random(-300, 300), random(-300, 300), random(-300, 300)),
        vel: p5.Vector.random3D().mult(random(0.5, 2)),
        size: random(1, 4),
        hue: random(160, 200),
        life: random(100, 300)
      });
    }
  }
  
  // Add some background structure
  stroke(180, 50, 70, 0.2);
  noFill();
  for (let i = 0; i < 20; i++) {
    push();
    translate(random(-300, 300), random(-300, 300), random(-300, 300));
    rotateX(frameCount * 0.001 + i);
    rotateY(frameCount * 0.002 + i);
    box(random(20, 80));
    pop();
  }
}
