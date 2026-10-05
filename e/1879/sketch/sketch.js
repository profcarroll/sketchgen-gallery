let structures = [];
let time = 0;
let ripples = [];
let residueTrails = [];

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

  // Add pulsing bioluminescence effect
  if (frameCount % 10 === 0) {
    ripples.push({
      x: random(-width/2, width/2),
      z: random(-height/2, height/2),
      size: 0,
      maxRadius: random(100, 300),
      alpha: 255,
      color: color(0.5 + 0.2 * sin(time * 2), 0.8, 0.7)
    });
  }

  // Update and draw ripples
  for (let i = ripples.length - 1; i >= 0; i--) {
    let ripple = ripples[i];
    ripple.size += 2;
    ripple.alpha -= 2;
    
    if (ripple.alpha <= 0) {
      ripples.splice(i, 1);
      continue;
    }
    
    push();
    translate(ripple.x, 0, ripple.z);
    noFill();
    stroke(ripple.color, ripple.alpha);
    strokeWeight(1);
    
    beginShape();
    for (let j = 0; j < 32; j++) {
      let angle = TWO_PI * j / 32;
      let x = cos(angle) * ripple.size;
      let z = sin(angle) * ripple.size;
      vertex(x, 0, z);
    }
    endShape(CLOSE);
    
    pop();
  }

  // Add phosphorescent residue trails
  for (let i = ripples.length - 1; i >= 0; i--) {
    let ripple = ripples[i];
    if (ripple.size > 50) {
      residueTrails.push({
        x: ripple.x,
        z: ripple.z,
        size: random(2, 8),
        alpha: 100,
        color: color(hue(ripple.color), saturation(ripple.color), brightness(ripple.color) * 0.7)
      });
    }
  }

  // Update and draw residue trails
  for (let i = residueTrails.length - 1; i >= 0; i--) {
    let trail = residueTrails[i];
    trail.alpha -= 0.5;
    
    if (trail.alpha <= 0) {
      residueTrails.splice(i, 1);
      continue;
    }
    
    push();
    translate(trail.x, 0, trail.z);
    noStroke();
    fill(trail.color, trail.alpha);
    ellipse(0, 0, trail.size);
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

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
