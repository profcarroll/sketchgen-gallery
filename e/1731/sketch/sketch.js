let structures = [];
let bioluminescentPools = [];
let time = 0;
let reflections = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 1);

  // Create angular cityscape with reflective surfaces
  for (let i = 0; i < 80; i++) {
    structures.push({
      x: random(-width/2, width/2),
      y: 0,
      z: random(-height/2, height/2),
      w: random(30, 120),
      h: random(150, 400),
      d: random(30, 120),
      rot: random(TWO_PI),
      color: color(random(200, 240), 0.7, 0.2 + random(0.1))
    });
  }

  // Create bioluminescent pools that cast geometric reflections
  for (let i = 0; i < 30; i++) {
    bioluminescentPools.push({
      x: random(-width/2, width/2),
      y: 0,
      z: random(-height/2, height/2),
      size: random(40, 100),
      pulseSpeed: random(0.015, 0.03),
      color: color(random(100, 140), 0.9, 0.8),
      intensity: random(0.6, 1.0)
    });
  }

  // Precompute reflection geometry
  for (let i = 0; i < 200; i++) {
    reflections.push({
      x: random(-width/2, width/2),
      z: random(-height/2, height/2),
      size: random(50, 200),
      angle: random(TWO_PI)
    });
  }
}

function draw() {
  time += 0.01;
  
  background(0);
  noStroke();
  
  // Camera movement for dynamic view
  let camX = sin(time * 0.15) * width/3;
  let camY = sin(time * 0.1) * height/6;
  let camZ = cos(time * 0.1) * height/2 + height/2;
  camera(camX, camY, camZ, 0, 0, 0, 0, 1, 0);

  // Create dynamic ambient lighting
  let ambientHue = (time * 0.05) % 1;
  let ambientSat = 0.3 + 0.2 * sin(time * 0.2);
  let ambientBri = 0.1 + 0.05 * cos(time * 0.3);

  // Draw structures with wet reflective surfaces
  for (let s of structures) {
    push();
    translate(s.x, s.y, s.z);
    rotateY(s.rot);
    
    // Dynamic color based on time and position
    let c = lerpColor(
      color(220, 0.7, 0.15), 
      color(240, 0.8, 0.25), 
      (sin(time + s.x * 0.01) + 1) * 0.5
    );
    
    // Add bioluminescent hue shift to reflective surfaces
    let shiftedHue = (hue(c) + time * 0.1) % 1;
    let shiftedColor = color(shiftedHue, saturation(c), brightness(c));
    
    fill(shiftedColor);
    box(s.w, s.h, s.d);
    
    // Wet surface highlights with dynamic lighting
    fill(255, 0.2);
    beginShape();
    for (let i = 0; i < 4; i++) {
      let angle = TWO_PI * i / 4;
      let x = cos(angle) * s.w/2;
      let z = sin(angle) * s.d/2;
      vertex(x, -s.h/2 + 5, z);
    }
    endShape(CLOSE);
    
    pop();
  }

  // Draw bioluminescent pools with dynamic reflections
  for (let pool of bioluminescentPools) {
    let pulse = sin(time * pool.pulseSpeed) * 0.5 + 0.5;
    let size = pool.size * pulse * pool.intensity;
    
    push();
    translate(pool.x, pool.y, pool.z);
    
    // Pool glow with dynamic color shift
    let poolColor = lerpColor(
      pool.color,
      color(200, 0.9, 0.9),
      sin(time * 0.5) * 0.5 + 0.5
    );
    fill(poolColor);
    sphere(size);
    
    // Dynamic geometric reflections on ground
    noFill();
    stroke(poolColor);
    strokeWeight(2);
    
    // Circular reflection that pulses and shifts
    let shiftAngle = time * 0.1;
    let r = size * 1.5;
    beginShape();
    for (let i = 0; i < 32; i++) {
      let angle = TWO_PI * i / 32 + shiftAngle;
      let x = cos(angle) * r;
      let z = sin(angle) * r * 0.8;
      vertex(x, 0, z);
    }
    endShape(CLOSE);
    
    // Hexagonal reflection that changes orientation
    beginShape();
    for (let i = 0; i < 6; i++) {
      let angle = TWO_PI * i / 6 + time * 0.2;
      let x = cos(angle) * size * 0.7;
      let z = sin(angle) * size * 0.7;
      vertex(x, 0, z);
    }
    endShape(CLOSE);
    
    pop();
  }

  // Draw dynamic reflections on ground
  for (let r of reflections) {
    push();
    translate(r.x, 0, r.z);
    
    let pulse = sin(time * 0.2 + r.angle) * 0.5 + 0.5;
    let size = r.size * pulse;
    
    noFill();
    stroke(255, 0.1 + 0.05 * sin(time * 0.3));
    strokeWeight(1);
    
    // Draw animated ripple effect
    beginShape();
    for (let i = 0; i < 16; i++) {
      let angle = TWO_PI * i / 16;
      let x = cos(angle) * size;
      let z = sin(angle) * size;
      vertex(x, 0, z);
    }
    endShape(CLOSE);
    
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
