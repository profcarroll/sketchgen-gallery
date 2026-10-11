let crystals = [];
let gridRows = 12;
let gridCols = 20;
let crystalSize = 25;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create crystalline grid
  for (let row = 0; row < gridRows; row++) {
    for (let col = 0; col < gridCols; col++) {
      crystals.push({
        x: (col - gridCols/2) * crystalSize * 1.3,
        y: (row - gridRows/2) * crystalSize * 1.3,
        z: 0,
        hue: map(row, 0, gridRows-1, 0, 360),
        sat: 65 + random(20),
        bri: 75 + random(15),
        size: crystalSize * (0.8 + random(0.4)),
        phase: random(TWO_PI)
      });
    }
  }
}

function draw() {
  background(0);
  
  // Slowly rotate the entire scene
  rotateY(time * 0.0008);
  rotateX(time * 0.0003);
  
  // Center of the scene
  translate(0, 0, -400);
  
  // Draw crystals with organic movement
  for (let i = 0; i < crystals.length; i++) {
    let c = crystals[i];
    
    // Organic tectonic movement
    let moveX = sin(time * 0.001 + c.phase) * 1.5;
    let moveY = cos(time * 0.0015 + c.phase) * 1.5;
    let moveZ = sin(time * 0.0008 + c.phase) * 2;
    
    // Crystal deformation over time
    let deformation = sin(time * 0.002 + c.phase) * 0.15;
    
    push();
    
    // Position crystal
    translate(c.x + moveX, c.y + moveY, c.z + moveZ);
    
    // Rotate crystal randomly
    rotateX(time * 0.001 + c.phase);
    rotateY(time * 0.0015 + c.phase);
    rotateZ(time * 0.0005 + c.phase);
    
    // Crystal color with variation
    let hue = (c.hue + time * 0.015) % 360;
    fill(hue, c.sat, c.bri, 0.85);
    noStroke();
    
    // Draw crystal as a geometric structure using simpler forms
    push();
    scale(c.size * (1 + deformation));
    drawCrystal();
    pop();
    
    pop();
  }
  
  time++;
}

function drawCrystal() {
  // Use simple geometric primitives instead of complex shapes to reduce draw calls
  push();
  scale(0.8);
  cone(1, 2);  // Base crystal shape
  pop();
  
  push();
  rotateX(PI/3);
  scale(0.6);
  cone(1, 2);
  pop();
  
  push();
  rotateY(PI/4);
  scale(0.7);
  cone(1, 2);
  pop();
}
