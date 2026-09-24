let structures = [];
let plankton = [];
let plants = [];
let time = 0;
let colorPalette = [];

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
      rot: random(TWO_PI)
    });
  }

  // Create plankton clusters
  for (let i = 0; i < 20; i++) {
    plankton.push({
      x: random(-width/2, width/2),
      y: 0,
      z: random(-height/2, height/2),
      size: random(5, 20),
      speed: random(0.01, 0.03),
      color: color(random(200, 240), 0.8, 0.9)
    });
  }

  // Create bioluminescent plants
  for (let i = 0; i < 100; i++) {
    plants.push({
      x: random(-width/2, width/2),
      y: 0,
      z: random(-height/2, height/2),
      size: random(2, 8),
      pulseSpeed: random(0.02, 0.05),
      color: color(random(100, 140), 0.9, 0.8)
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
    
    // Reflective material
    let c = lerpColor(colorPalette[0], colorPalette[50], sin(time + s.x * 0.01) * 0.5 + 0.5);
    fill(c);
    box(s.w, s.h, s.d);
    pop();
  }

  // Draw plankton
  for (let p of plankton) {
    p.x += sin(time * p.speed) * 0.5;
    p.z += cos(time * p.speed) * 0.5;
    
    push();
    translate(p.x, p.y, p.z);
    fill(p.color);
    sphere(p.size);
    pop();
  }

  // Draw plants
  for (let plant of plants) {
    let pulse = sin(time * plant.pulseSpeed) * 0.5 + 0.5;
    let size = plant.size * pulse;
    
    push();
    translate(plant.x, plant.y, plant.z);
    fill(plant.color);
    sphere(size);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
