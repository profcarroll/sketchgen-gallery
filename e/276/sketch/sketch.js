let structures = [];
let ripples = [];
let trails = [];
let plants = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create city structures
  for (let i = 0; i < 50; i++) {
    structures.push({
      x: random(-width/2, width/2),
      y: 0,
      z: random(-height/2, height/2),
      w: random(20, 80),
      h: random(100, 300),
      d: random(20, 80),
      color: color(random(200, 260), 50, 70)
    });
  }
  
  // Create bioluminescent plants
  for (let i = 0; i < 100; i++) {
    plants.push({
      x: random(-width/2, width/2),
      y: 0,
      z: random(-height/2, height/2),
      size: random(5, 20),
      color: color(random(300, 360), 80, 90),
      pulse: random(TWO_PI)
    });
  }
}

function draw() {
  time += 0.01;
  
  background(0);
  
  // Camera movement for immersive effect
  let camX = sin(time * 0.2) * 500;
  let camY = sin(time * 0.1) * 100;
  let camZ = cos(time * 0.2) * 500;
  camera(camX, camY, camZ, 0, 0, 0, 0, 1, 0);
  
  // Draw structures
  for (let s of structures) {
    push();
    translate(s.x, s.y - s.h/2, s.z);
    fill(s.color);
    noStroke();
    box(s.w, s.h, s.d);
    pop();
  }
  
  // Draw plants with pulsing effect
  for (let p of plants) {
    push();
    translate(p.x, p.y, p.z);
    let pulse = sin(p.pulse + time * 2) * 0.5 + 0.5;
    fill(p.color);
    noStroke();
    sphere(p.size * pulse);
    pop();
  }
  
  // Create ripples that spread out
  if (frameCount % 10 === 0) {
    ripples.push({
      x: random(-width/2, width/2),
      y: 0,
      z: random(-height/2, height/2),
      size: 0,
      max: random(100, 300),
      color: color(random(200, 260), 80, 90, 0.5)
    });
  }
  
  // Update and draw ripples
  for (let i = ripples.length - 1; i >= 0; i--) {
    let r = ripples[i];
    r.size += 3;
    
    push();
    translate(r.x, r.y, r.z);
    fill(r.color);
    noStroke();
    sphere(r.size);
    pop();
    
    if (r.size > r.max) {
      ripples.splice(i, 1);
    }
  }
  
  // Create fractal patterns from ripples
  if (frameCount % 20 === 0 && ripples.length > 0) {
    let r = ripples[0];
    for (let i = 0; i < 5; i++) {
      trails.push({
        x: r.x + random(-50, 50),
        y: 0,
        z: r.z + random(-50, 50),
        size: random(10, 30),
        life: 200,
        color: color(random(300, 360), 80, 90)
      });
    }
  }
  
  // Update and draw trails
  for (let i = trails.length - 1; i >= 0; i--) {
    let t = trails[i];
    t.life--;
    
    if (t.life <= 0) {
      trails.splice(i, 1);
      continue;
    }
    
    push();
    translate(t.x, t.y, t.z);
    fill(t.color);
    noStroke();
    sphere(t.size * (t.life / 200));
    pop();
  }
  
  // Create geometric fractal patterns
  if (frameCount % 30 === 0) {
    let x = random(-width/2, width/2);
    let z = random(-height/2, height/2);
    for (let i = 0; i < 8; i++) {
      let angle = map(i, 0, 8, 0, TWO_PI);
      let size = random(20, 60);
      trails.push({
        x: x + cos(angle) * size,
        y: 0,
        z: z + sin(angle) * size,
        size: size,
        life: random(50, 100),
        color: color(random(200, 360), 80, 90)
      });
    }
  }
}
