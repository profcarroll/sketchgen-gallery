let structures = [];
let plankton = [];
let plants = [];
let time = 0;
let colorPalette = [];
let waterReflections = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 1);

  // Initialize color palette for day/night cycle
  for (let i = 0; i < 100; i++) {
    let t = i / 99;
    let h = lerp(200, 240, t); // Blue to indigo
    let s = lerp(0.7, 0.9, t);
    let b = lerp(0.1, 0.3, t);
    colorPalette.push(color(h, s, b));
  }

  // Create structures (angular cityscape)
  for (let i = 0; i < 50; i++) {
    structures.push({
      x: random(-width/2, width/2),
      y: 0,
      z: random(-height/2, height/2),
      w: random(20, 100),
      h: random(100, 300),
      d: random(20, 100),
      rot: random(TWO_PI),
      color: color(random(200, 240), 0.7, 0.2 + random(0.1))
    });
  }

  // Create plankton clusters
  for (let i = 0; i < 50; i++) {
    plankton.push({
      x: random(-width/2, width/2),
      y: 0,
      z: random(-height/2, height/2),
      size: random(3, 8),
      speed: random(0.01, 0.03),
      color: color(random(180, 220), 0.9, 0.9),
      targetX: random(-width/2, width/2),
      targetZ: random(-height/2, height/2)
    });
  }

  // Create bioluminescent plants
  for (let i = 0; i < 150; i++) {
    plants.push({
      x: random(-width/2, width/2),
      y: 0,
      z: random(-height/2, height/2),
      size: random(1, 4),
      pulseSpeed: random(0.02, 0.05),
      color: color(random(100, 140), 0.9, 0.8),
      intensity: random(0.5, 1.0)
    });
  }

  // Precompute water reflections
  for (let i = 0; i < 200; i++) {
    waterReflections.push({
      x: random(-width/2, width/2),
      y: 0,
      z: random(-height/2, height/2),
      size: random(10, 50),
      speed: random(0.001, 0.003),
      phase: random(TWO_PI)
    });
  }
}

function draw() {
  time += 0.005;
  
  background(0);
  noStroke();
  
  // Camera movement
  let camX = sin(time * 0.2) * width/4;
  let camY = sin(time * 0.1) * height/8;
  let camZ = cos(time * 0.15) * height/2 + height/2;
  camera(camX, camY, camZ, 0, 0, 0, 0, 1, 0);

  // Draw structures
  for (let s of structures) {
    push();
    translate(s.x, s.y, s.z);
    rotateY(s.rot);
    
    // Reflective material with dynamic lighting
    let c = lerpColor(colorPalette[0], colorPalette[50], sin(time + s.x * 0.01) * 0.5 + 0.5);
    fill(c);
    box(s.w, s.h, s.d);
    
    // Add wet surface highlights
    fill(255, 0.3);
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

  // Draw plankton clusters
  for (let p of plankton) {
    // Move towards target location
    let dx = p.targetX - p.x;
    let dz = p.targetZ - p.z;
    if (abs(dx) > 1 || abs(dz) > 1) {
      p.x += dx * 0.02;
      p.z += dz * 0.02;
    } else {
      // Set new target
      p.targetX = random(-width/2, width/2);
      p.targetZ = random(-height/2, height/2);
    }
    
    // Add some drifting motion
    p.x += sin(time * p.speed + p.z * 0.01) * 0.3;
    p.z += cos(time * p.speed + p.x * 0.01) * 0.3;
    
    push();
    translate(p.x, p.y, p.z);
    fill(p.color);
    sphere(p.size);
    pop();
  }

  // Draw plants
  for (let plant of plants) {
    let pulse = sin(time * plant.pulseSpeed) * 0.5 + 0.5;
    let size = plant.size * pulse * plant.intensity;
    
    push();
    translate(plant.x, plant.y, plant.z);
    fill(plant.color);
    sphere(size);
    pop();
  }

  // Draw water reflections
  for (let w of waterReflections) {
    let wave = sin(time * w.speed + w.phase) * 0.5 + 0.5;
    let size = w.size * wave;
    
    push();
    translate(w.x, 0, w.z);
    fill(255, 0.1);
    sphere(size);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
