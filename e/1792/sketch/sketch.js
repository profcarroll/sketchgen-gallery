let structures = [];
let time = 0;
let runePatterns = [];

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

  // Precompute rune patterns for etching effect
  for (let i = 0; i < 50; i++) {
    runePatterns.push({
      x: random(-width/2, width/2),
      z: random(-height/2, height/2),
      size: random(100, 300),
      pattern: createRunePattern(),
      progress: random(1),
      speed: random(0.001, 0.005)
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

  // Create dynamic ambient lighting that shifts through day/night cycle
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

  // Draw etching runes on wet surfaces
  for (let rune of runePatterns) {
    push();
    translate(rune.x, 0, rune.z);
    
    // Update rune etching progress
    rune.progress += rune.speed;
    if (rune.progress > 1) rune.progress = 0;
    
    // Draw rune pattern with phosphorescent glow
    let pulse = sin(time * 2 + rune.progress * 10) * 0.5 + 0.5;
    let glowIntensity = 0.7 + 0.3 * pulse;
    
    stroke(0.5, 0.8, glowIntensity);
    strokeWeight(2);
    
    // Draw the rune pattern
    beginShape();
    for (let i = 0; i < rune.pattern.length; i++) {
      let point = rune.pattern[i];
      vertex(point.x * rune.size, 0, point.z * rune.size);
    }
    endShape(CLOSE);
    
    pop();
  }

  // Draw dynamic reflections on ground
  for (let i = 0; i < 200; i++) {
    let x = random(-width/2, width/2);
    let z = random(-height/2, height/2);
    let size = random(50, 200);
    let pulse = sin(time * 0.2 + i) * 0.5 + 0.5;
    
    push();
    translate(x, 0, z);
    noFill();
    stroke(255, 0.1 + 0.05 * sin(time * 0.3));
    strokeWeight(1);
    
    beginShape();
    for (let j = 0; j < 16; j++) {
      let angle = TWO_PI * j / 16;
      let x = cos(angle) * size * pulse;
      let z = sin(angle) * size * pulse;
      vertex(x, 0, z);
    }
    endShape(CLOSE);
    
    pop();
  }
}

function createRunePattern() {
  // Create a simple geometric rune pattern
  let pattern = [];
  let segments = floor(random(3, 8));
  
  for (let i = 0; i < segments; i++) {
    let angle = TWO_PI * i / segments;
    let radius = random(0.3, 0.8);
    pattern.push({
      x: cos(angle) * radius,
      z: sin(angle) * radius
    });
  }
  
  return pattern;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
