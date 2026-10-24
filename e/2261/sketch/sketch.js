let crystals = [];
let stoneTexture;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  
  // Create stone texture
  stoneTexture = createGraphics(width, height);
  stoneTexture.noiseDetail(3, 0.4);
  stoneTexture.loadPixels();
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let noiseVal = stoneTexture.noise(x * 0.02, y * 0.02) * 255;
      let gray = 40 + noiseVal * 0.3;
      stoneTexture.set(x, y, color(gray));
    }
  }
  stoneTexture.updatePixels();
  
  // Initialize crystals
  for (let i = 0; i < 150; i++) {
    crystals.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-200, 200),
      size: random(2, 8),
      speed: random(0.01, 0.03),
      phase: random(TWO_PI),
      connections: [],
      formed: false,
      formationProgress: 0
    });
  }
  
  // Connect nearby crystals
  for (let i = 0; i < crystals.length; i++) {
    for (let j = i + 1; j < crystals.length; j++) {
      let d = dist(crystals[i].x, crystals[i].y, crystals[j].x, crystals[j].y);
      if (d < 120 && crystals[i].connections.length < 8) {
        crystals[i].connections.push(j);
      }
    }
  }
}

function draw() {
  background(0);
  
  // Draw textured stone surface
  push();
  translate(0, 0, -300);
  texture(stoneTexture);
  plane(width * 1.5, height * 1.5);
  pop();
  
  time += 0.02;
  
  // Draw connections as a batched shape
  beginShape(LINES);
  stroke(255, 255, 255, 60);
  strokeWeight(1);
  for (let i = 0; i < crystals.length; i++) {
    let crystal = crystals[i];
    for (let j = 0; j < crystal.connections.length; j++) {
      let otherCrystal = crystals[crystal.connections[j]];
      if (otherCrystal && otherCrystal.formed) {
        vertex(crystal.x, crystal.y, crystal.z);
        vertex(otherCrystal.x, otherCrystal.y, otherCrystal.z);
      }
    }
  }
  endShape();
  
  // Draw crystals with cascading formation effect
  for (let i = 0; i < crystals.length; i++) {
    let crystal = crystals[i];
    
    // Formation animation
    if (!crystal.formed) {
      crystal.formationProgress += 0.01;
      if (crystal.formationProgress > 1) crystal.formed = true;
    }
    
    // Pulsing glow effect
    let pulse = sin(time * crystal.speed + crystal.phase) * 0.5 + 0.5;
    let glow = 200 * pulse;
    
    // Iridescent color based on position and time
    let hue = (time * 10 + crystal.x * 0.01 + crystal.y * 0.01) % 360;
    let saturation = 80 + sin(time * 0.5 + crystal.phase) * 20;
    let brightness = 70 + sin(time * 0.3 + crystal.phase) * 30;
    
    // Draw crystal
    push();
    translate(crystal.x, crystal.y, crystal.z);
    
    // Crystal geometry with formation effect
    let scl = 1;
    if (!crystal.formed) {
      scl = crystal.formationProgress;
    } else {
      scl = 1 + pulse * 0.2;
    }
    
    rotateX(time * 0.1);
    rotateY(time * 0.15);
    rotateZ(time * 0.05);
    
    // Iridescent crystal
    fill(hue, saturation, brightness, 200);
    noStroke();
    
    // Draw geometric crystal shape
    push();
    scale(scl * crystal.size);
    drawCrystalShape();
    pop();
    
    // Glow effect
    fill(hue, saturation, brightness, glow);
    drawCrystalGlow(crystal.size);
    
    pop();
  }
}

function drawCrystalShape() {
  // Create a simple geometric crystal shape (like a pyramid with facets)
  beginShape(QUADS);
  // Front face
  vertex(-1, -1, 1);
  vertex(1, -1, 1);
  vertex(1, 1, 1);
  vertex(-1, 1, 1);
  // Back face
  vertex(-1, -1, -1);
  vertex(-1, 1, -1);
  vertex(1, 1, -1);
  vertex(1, -1, -1);
  // Top face
  vertex(-1, 1, -1);
  vertex(-1, 1, 1);
  vertex(1, 1, 1);
  vertex(1, 1, -1);
  // Bottom face
  vertex(-1, -1, -1);
  vertex(1, -1, -1);
  vertex(1, -1, 1);
  vertex(-1, -1, 1);
  endShape();
}

function drawCrystalGlow(size) {
  // Draw a subtle glow around the crystal
  noStroke();
  fill(255, 255, 255, 30);
  sphere(size * 1.8);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
