let particles = [];
let centralCore;
let time = 0;
let splinePoints = [];
let geometry;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create central core with polished electrum effect
  centralCore = {
    pos: createVector(0, 0, 0),
    radius: 40,
    hue: 45, // Gold/brass hue
    saturation: 80,
    brightness: 95,
    droplets: [],
    dripTime: 0
  };

  // Create orbiting particles with splines
  for (let i = 0; i < 60; i++) {
    let angle = random(TWO_PI);
    let radius = random(150, 300);
    let height = random(-100, 100);
    let speed = random(0.002, 0.008);
    let size = random(2, 6);
    
    particles.push({
      pos: createVector(
        cos(angle) * radius,
        height,
        sin(angle) * radius
      ),
      vel: p5.Vector.random3D().mult(random(0.5, 2)),
      angle: angle,
      radius: radius,
      speed: speed,
      size: size,
      hue: random(60, 80), // Green/oxidized brass hues
      saturation: random(40, 60),
      brightness: random(30, 50) // Tarnished effect
    });
  }

  // Build spline points once
  buildSplinePoints();
  
  // Create geometry for the splines using a static mesh approach
  geometry = [];
  for (let i = 0; i < particles.length; i++) {
    let p1 = particles[i];
    let p2 = particles[(i + 1) % particles.length];
    
    for (let j = 0; j < 8; j++) {
      let t = j / 7;
      let x = lerp(p1.pos.x, p2.pos.x, t);
      let y = lerp(p1.pos.y, p2.pos.y, t);
      let z = lerp(p1.pos.z, p2.pos.z, t);
      
      geometry.push(createVector(x, y, z));
    }
  }
}

function draw() {
  background(0);
  time += 0.005;
  centralCore.dripTime += 0.02;

  // Rotate the whole scene
  rotateY(time * 0.2);
  rotateX(sin(time * 0.3) * 0.1);

  // Draw central glowing core with polished electrum effect
  push();
  translate(centralCore.pos.x, centralCore.pos.y, centralCore.pos.z);
  
  // Add dynamic droplets (for visual texture)
  if (frameCount % 15 === 0 && centralCore.droplets.length < 30) {
    let angle = random(TWO_PI);
    let radius = random(0, 10);
    let x = cos(angle) * radius;
    let z = sin(angle) * radius;
    let y = random(-20, 20);
    
    centralCore.droplets.push({
      pos: createVector(x, y, z),
      size: random(3, 8),
      hue: 45,
      saturation: 80,
      brightness: 95,
      life: 1.0
    });
  }

  // Update and draw droplets
  for (let i = centralCore.droplets.length - 1; i >= 0; i--) {
    let d = centralCore.droplets[i];
    
    d.pos.y += 0.5;
    d.life -= 0.01;
    
    if (d.life <= 0) {
      centralCore.droplets.splice(i, 1);
      continue;
    }
    
    push();
    translate(d.pos.x, d.pos.y, d.pos.z);
    
    fill(d.hue, d.saturation, d.brightness, d.life);
    noStroke();
    sphere(d.size);
    pop();
  }

  // Draw core as polished electrum
  noStroke();
  fill(centralCore.hue, centralCore.saturation, centralCore.brightness, 1);
  sphere(centralCore.radius);
  
  // Add glow effect
  for (let i = 0; i < 5; i++) {
    let alpha = map(i, 0, 4, 0.3, 0);
    fill(centralCore.hue, centralCore.saturation, centralCore.brightness, alpha);
    sphere(centralCore.radius + i * 5);
  }
  pop();

  // Draw orbiting particles
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    // Update particle position in orbit
    p.angle += p.speed;
    p.pos.x = cos(p.angle) * p.radius;
    p.pos.z = sin(p.angle) * p.radius;
    
    // Add some vertical movement
    p.pos.y += sin(time * 2 + i) * 0.5;
    
    // Draw particle as tarnished brass sphere
    push();
    translate(p.pos.x, p.pos.y, p.pos.z);
    
    // Use muted color for oxidized appearance
    fill(p.hue, p.saturation, p.brightness, 1);
    noStroke();
    sphere(p.size);
    pop();
  }
  
  // Draw connecting splines between particles using prebuilt points
  stroke(65, 50, 40, 0.7); // Green/oxidized brass color
  noFill();
  beginShape(LINES);
  for (let i = 0; i < geometry.length; i++) {
    let point = geometry[i];
    vertex(point.x, point.y, point.z);
  }
  endShape();
}

function buildSplinePoints() {
  // Create a continuous loop of spline points connecting all particles
  splinePoints = [];
  
  for (let i = 0; i < particles.length; i++) {
    let p1 = particles[i];
    let p2 = particles[(i + 1) % particles.length];
    
    // Create intermediate points for smooth spline effect
    for (let j = 0; j < 8; j++) {
      let t = j / 7;
      let x = lerp(p1.pos.x, p2.pos.x, t);
      let y = lerp(p1.pos.y, p2.pos.y, t);
      let z = lerp(p1.pos.z, p2.pos.z, t);
      
      splinePoints.push(createVector(x, y, z));
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
