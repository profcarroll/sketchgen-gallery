let particles = [];
let conduits = [];
let pulse = 0;
let shardCount = 1000;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create crystalline conduits
  for (let i = 0; i < 8; i++) {
    conduits.push({
      angle: TWO_PI * i / 8,
      radius: random(150, 300),
      speed: random(0.002, 0.005)
    });
  }
  
  // Create initial particles
  for (let i = 0; i < shardCount; i++) {
    particles.push({
      pos: createVector(
        random(-width/2, width/2),
        random(-height/2, height/2),
        random(-500, 500)
      ),
      vel: p5.Vector.random3D().mult(random(0.5, 2)),
      size: random(2, 8),
      hue: random(180, 300),
      alpha: random(0.5, 1),
      life: 1,
      conduitIndex: floor(random(conduits.length))
    });
  }
}

function draw() {
  background(0);
  
  // Update pulse
  pulse += 0.02;
  
  // Camera movement
  let time = millis() * 0.0005;
  camera(
    sin(time) * 300,
    sin(time * 0.7) * 100,
    cos(time) * 300 + 500,
    0, 0, 0,
    0, 1, 0
  );
  
  // Draw bioluminescent pulses
  drawPulses();
  
  // Draw conduits
  drawConduits();
  
  // Update and draw particles
  updateAndDrawParticles();
}

function drawPulses() {
  noStroke();
  for (let i = 0; i < 5; i++) {
    let radius = 100 + sin(pulse + i * 0.5) * 50;
    let alpha = 20 + sin(pulse + i * 0.3) * 10;
    fill(180, 80, 100, alpha/255);
    sphere(radius);
  }
}

function drawConduits() {
  stroke(200, 80, 100, 0.3);
  noFill();
  
  for (let i = 0; i < conduits.length; i++) {
    let c = conduits[i];
    let x = cos(c.angle + pulse * c.speed) * c.radius;
    let z = sin(c.angle + pulse * c.speed) * c.radius;
    
    push();
    translate(x, 0, z);
    sphere(20);
    pop();
    
    // Draw connecting lines
    if (i > 0) {
      let prev = conduits[i - 1];
      let px = cos(prev.angle + pulse * prev.speed) * prev.radius;
      let pz = sin(prev.angle + pulse * prev.speed) * prev.radius;
      
      line(x, 0, z, px, 0, pz);
    }
  }
}

function updateAndDrawParticles() {
  beginShape(POINTS);
  
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    
    // Move particle
    p.pos.add(p.vel);
    
    // Apply conduit attraction
    let conduit = conduits[p.conduitIndex];
    let target = createVector(
      cos(conduit.angle + pulse * conduit.speed) * conduit.radius,
      0,
      sin(conduit.angle + pulse * conduit.speed) * conduit.radius
    );
    
    let dir = p5.Vector.sub(target, p.pos);
    dir.normalize();
    dir.mult(0.01);
    p.vel.add(dir);
    
    // Slow down particle
    p.vel.mult(0.98);
    
    // Fade out
    p.life -= 0.002;
    
    // Remove dead particles
    if (p.life <= 0) {
      particles.splice(i, 1);
      // Add new particle at center
      particles.push({
        pos: createVector(0, 0, 0),
        vel: p5.Vector.random3D().mult(random(0.5, 2)),
        size: random(2, 8),
        hue: random(180, 300),
        alpha: random(0.5, 1),
        life: 1,
        conduitIndex: floor(random(conduits.length))
      });
    } else {
      // Draw particle
      let size = p.size * p.life;
      let brightness = map(p.life, 0, 1, 30, 100);
      
      fill(p.hue, 80, brightness, p.alpha * p.life);
      noStroke();
      
      vertex(p.pos.x, p.pos.y, p.pos.z);
    }
  }
  
  endShape();
}
