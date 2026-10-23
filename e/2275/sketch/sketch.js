let panels = [];
let liquidParticles = [];
const panelCount = 12;
const particleCount = 500;
let time = 0;
let rippleEffect = null;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create wall panels
  for (let i = 0; i < panelCount; i++) {
    const x = map(i % 4, 0, 4, -width/3, width/3);
    const y = map(floor(i / 4), 0, 3, -height/3, height/3);
    panels.push({
      x: x,
      y: y,
      size: 150,
      rotation: random(TWO_PI),
      hue: random(20, 40) // Warm tones for plaster
    });
  }

  // Create liquid particles
  for (let i = 0; i < particleCount; i++) {
    liquidParticles.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-100, 100),
      size: random(2, 6),
      speed: random(0.005, 0.015),
      hue: random(10, 30), // Warm orange-red
      alpha: random(0.6, 1.0),
      offset: random(TWO_PI)
    });
  }
}

function draw() {
  background(20, 10, 10); // Deep dark base
  time += 0.01;

  // Rotate the entire scene for dynamic view
  rotateY(time * 0.05);
  rotateX(sin(time * 0.03) * 0.1);

  // Draw wall panels (orthogonal geometry)
  for (let panel of panels) {
    push();
    translate(panel.x, panel.y);
    rotateZ(panel.rotation);
    
    // Panel frame
    stroke(20, 10, 90); // Dark plaster outline
    strokeWeight(2);
    noFill();
    rectMode(CENTER);
    rect(0, 0, panel.size, panel.size);
    
    // Panel interior grid lines
    stroke(20, 10, 80);
    strokeWeight(1);
    line(-panel.size/2, 0, panel.size/2, 0);
    line(0, -panel.size/2, 0, panel.size/2);
    
    // Panel intersections (Bauhaus style)
    stroke(20, 10, 85);
    strokeWeight(1);
    const half = panel.size / 2;
    line(-half, -half, half, half);
    line(half, -half, -half, half);
    
    pop();
  }

  // Draw liquid particles as points for performance
  beginShape(POINTS);
  for (let particle of liquidParticles) {
    // Animate position with noise and time
    const nx = noise(particle.x * 0.01, particle.y * 0.01, time * 0.5) * 2 - 1;
    const ny = noise(particle.y * 0.01, particle.z * 0.01, time * 0.5) * 2 - 1;
    const nz = noise(particle.z * 0.01, particle.x * 0.01, time * 0.5) * 2 - 1;

    particle.x += nx * particle.speed;
    particle.y += ny * particle.speed;
    particle.z += nz * particle.speed;

    // Wrap around edges
    if (particle.x > width/2 + 100) particle.x = -width/2 - 100;
    if (particle.x < -width/2 - 100) particle.x = width/2 + 100;
    if (particle.y > height/2 + 100) particle.y = -height/2 - 100;
    if (particle.y < -height/2 - 100) particle.y = height/2 + 100;
    if (particle.z > 150) particle.z = -150;
    if (particle.z < -150) particle.z = 150;

    // Set color and vertex
    fill(particle.hue, 100, 100, particle.alpha);
    vertex(particle.x, particle.y, particle.z);
  }
  endShape();

  // Connect particles to panels with soft lines (batched)
  beginShape(LINES);
  let connections = 0;
  for (let particle of liquidParticles) {
    if (connections > 500) break; // Cap connections per frame
    for (let panel of panels) {
      const d = dist(particle.x, particle.y, panel.x, panel.y);
      
      if (d < 200) {
        const alpha = map(d, 0, 200, 0.3, 0);
        
        stroke(panel.hue, 60, 100, alpha);
        vertex(particle.x, particle.y, particle.z);
        vertex(panel.x, panel.y, 0);
        connections++;
      }
    }
  }
  endShape();

  // Ripple effect if active
  if (rippleEffect) {
    const r = rippleEffect.time * 10;
    stroke(200, 100, 100, 0.5);
    noFill();
    ellipse(rippleEffect.x, rippleEffect.y, r, r);
    
    rippleEffect.time += 0.05;
    if (rippleEffect.time > 10) {
      rippleEffect = null;
    }
  }
}

function mousePressed() {
  // Create ripple effect on click
  rippleEffect = {
    x: mouseX - width/2,
    y: mouseY - height/2,
    time: 0
  };
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
