let structures = [];
let plants = [];
let ripples = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create city structures
  for (let i = 0; i < 200; i++) {
    structures.push({
      x: random(-width/2, width/2),
      y: 0,
      z: random(-height/2, height/2),
      w: random(20, 80),
      h: random(100, 300),
      d: random(20, 80),
      crystalColor: color(random(180, 240), 80, 90, 0.8),
      glow: random(0.5, 1)
    });
  }
  
  // Create bioluminescent plants
  for (let i = 0; i < 300; i++) {
    plants.push({
      x: random(-width/2, width/2),
      y: 0,
      z: random(-height/2, height/2),
      size: random(5, 20),
      pulseSpeed: random(0.01, 0.03),
      baseHue: random(100, 140),
      pulse: 0
    });
  }
  
  // Create initial ripples
  for (let i = 0; i < 50; i++) {
    ripples.push({
      x: random(-width/2, width/2),
      y: 0,
      z: random(-height/2, height/2),
      radius: 0,
      maxRadius: random(50, 150),
      alpha: random(0.3, 0.7),
      speed: random(0.5, 2)
    });
  }
}

function draw() {
  background(220, 10, 5);
  
  time += 0.01;
  
  // Camera movement
  let cx = sin(time * 0.1) * 300;
  let cy = cos(time * 0.05) * 100;
  let cz = cos(time * 0.1) * 300;
  camera(cx, cy, cz, 0, 0, 0, 0, 1, 0);
  
  // Draw ground
  fill(220, 5, 15);
  noStroke();
  plane(width, height);
  
  // Draw structures
  for (let s of structures) {
    push();
    translate(s.x, s.y - s.h/2, s.z);
    
    // Structure body
    fill(220, 15, 25);
    stroke(220, 30, 35);
    strokeWeight(1);
    box(s.w, s.h, s.d);
    
    // Crystal markings
    fill(s.crystalColor);
    noStroke();
    for (let i = 0; i < 8; i++) {
      let angle = TWO_PI * i / 8;
      let x = cos(angle) * (s.w/2 - 5);
      let z = sin(angle) * (s.d/2 - 5);
      let y = random(-s.h/2 + 10, s.h/2 - 10);
      
      push();
      translate(x, y, z);
      sphere(3, 4, 4);
      pop();
    }
    
    // Glow effect
    fill(s.crystalColor);
    noStroke();
    for (let i = 0; i < 5; i++) {
      let angle = TWO_PI * i / 5;
      let x = cos(angle) * (s.w/2 - 10);
      let z = sin(angle) * (s.d/2 - 10);
      let y = random(-s.h/2 + 15, s.h/2 - 15);
      
      push();
      translate(x, y, z);
      sphere(8, 4, 4);
      pop();
    }
    
    pop();
  }
  
  // Draw plants
  for (let p of plants) {
    p.pulse = sin(time * p.pulseSpeed) * 0.5 + 0.5;
    
    push();
    translate(p.x, p.y, p.z);
    noStroke();
    
    // Plant base
    fill(p.baseHue, 80, 70, 0.8);
    sphere(p.size * 0.3, 4, 4);
    
    // Plant glow
    let glow = color(p.baseHue, 100, 100, p.pulse * 0.5);
    fill(glow);
    sphere(p.size * 0.6, 8, 8);
    
    pop();
  }
  
  // Draw ripples
  for (let i = ripples.length - 1; i >= 0; i--) {
    let r = ripples[i];
    r.radius += r.speed;
    
    if (r.radius > r.maxRadius) {
      ripples.splice(i, 1);
      continue;
    }
    
    push();
    translate(r.x, r.y, r.z);
    noFill();
    stroke(200, 50, 80, r.alpha * (1 - r.radius/r.maxRadius));
    strokeWeight(2);
    sphere(r.radius, 8, 8);
    pop();
  }
  
  // Add new ripples occasionally
  if (random() < 0.05) {
    ripples.push({
      x: random(-width/2, width/2),
      y: 0,
      z: random(-height/2, height/2),
      radius: 0,
      maxRadius: random(50, 150),
      alpha: random(0.3, 0.7),
      speed: random(0.5, 2)
    });
  }
  
  // Add some floating particles for atmosphere
  if (frameCount % 10 === 0) {
    let x = random(-width/2, width/2);
    let z = random(-height/2, height/2);
    let y = random(-50, 50);
    
    push();
    translate(x, y, z);
    noStroke();
    fill(180, 30, 90, 0.3);
    sphere(2, 4, 4);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
