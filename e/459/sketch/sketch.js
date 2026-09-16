let pyramids = [];
let particles = [];
let flowField;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create pyramids
  for (let i = 0; i < 15; i++) {
    pyramids.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-300, -100),
      size: random(20, 40),
      hue: random(180, 240)
    });
  }
  
  // Create initial particles
  for (let i = 0; i < 500; i++) {
    particles.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-400, 0),
      life: random(100, 300),
      hue: random(180, 240)
    });
  }
  
  // Create flow field
  flowField = new Array(50 * 50);
  for (let i = 0; i < flowField.length; i++) {
    flowField[i] = p5.Vector.random3D().mult(random(0.5, 2));
  }
}

function draw() {
  background(0);
  time += 0.01;
  
  // Camera movement
  let cx = sin(time * 0.1) * 100;
  let cy = cos(time * 0.1) * 100;
  let cz = sin(time * 0.05) * 200;
  camera(0, 0, cz, cx, cy, 0, 0, 1, 0);
  
  // Draw pyramids
  for (let pyramid of pyramids) {
    push();
    translate(pyramid.x, pyramid.y, pyramid.z);
    rotateX(time * 0.2);
    rotateY(time * 0.3);
    
    // Pyramid shape
    noStroke();
    fill(pyramid.hue, 80, 90, 0.8);
    beginShape(TRIANGLES);
    vertex(0, -pyramid.size, 0);
    vertex(-pyramid.size, pyramid.size, -pyramid.size);
    vertex(pyramid.size, pyramid.size, -pyramid.size);
    
    vertex(0, -pyramid.size, 0);
    vertex(pyramid.size, pyramid.size, -pyramid.size);
    vertex(pyramid.size, pyramid.size, pyramid.size);
    
    vertex(0, -pyramid.size, 0);
    vertex(pyramid.size, pyramid.size, pyramid.size);
    vertex(-pyramid.size, pyramid.size, pyramid.size);
    
    vertex(0, -pyramid.size, 0);
    vertex(-pyramid.size, pyramid.size, pyramid.size);
    vertex(-pyramid.size, pyramid.size, -pyramid.size);
    endShape();
    
    // Pulsating glow
    fill(pyramid.hue, 100, 100, 0.2);
    sphere(pyramid.size * 0.8);
    pop();
  }
  
  // Draw particles
  beginShape(POINTS);
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    
    // Update particle
    let pos = createVector(p.x, p.y, p.z);
    let index = floor(pos.x / 20 + width/40) + floor(pos.y / 20 + height/40) * 50;
    if (index >= 0 && index < flowField.length) {
      let force = flowField[index].copy();
      pos.add(force);
    }
    
    p.x = pos.x;
    p.y = pos.y;
    p.z = pos.z;
    
    // Fade out
    p.life--;
    if (p.life <= 0) {
      particles.splice(i, 1);
      continue;
    }
    
    // Add new particle occasionally
    if (random() < 0.02 && particles.length < 600) {
      particles.push({
        x: random(-width/2, width/2),
        y: random(-height/2, height/2),
        z: random(-400, -100),
        life: random(100, 300),
        hue: random(180, 240)
      });
    }
    
    // Particle color and size
    let alpha = map(p.life, 0, 300, 0, 1);
    fill(p.hue, 100, 100, alpha);
    vertex(p.x, p.y, p.z);
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
