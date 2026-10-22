let crystals = [];
let numCrystals = 50;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize crystalline formations
  for (let i = 0; i < numCrystals; i++) {
    crystals.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-500, 500),
      size: random(10, 40),
      growth: 0,
      maxGrowth: random(0.5, 1.5),
      hue: random(180, 300),
      saturation: random(60, 90),
      brightness: random(70, 100)
    });
  }
}

function draw() {
  background(0);
  time += 0.01;
  
  // Camera slowly orbits the scene
  let camX = sin(time * 0.1) * 600;
  let camY = cos(time * 0.05) * 300;
  camera(camX, camY, 800, 0, 0, 0, 0, 1, 0);
  
  // Draw sediment substrate
  drawSubstrate();
  
  // Update and display crystals
  for (let i = 0; i < crystals.length; i++) {
    let c = crystals[i];
    
    // Grow crystal over time
    if (c.growth < c.maxGrowth) {
      c.growth += 0.002;
    }
    
    push();
    translate(c.x, c.y, c.z);
    
    // Pulsating glow effect
    let pulse = sin(time * 2 + i) * 0.2 + 0.8;
    fill(c.hue, c.saturation, c.brightness * pulse, 0.7);
    
    // Draw geometric crystal structure
    drawCrystal(c.size * c.growth);
    
    pop();
  }
}

function drawSubstrate() {
  // Draw a subtle sediment layer at the bottom
  noStroke();
  fill(200, 10, 10, 0.2);
  beginShape(QUAD_STRIP);
  for (let i = 0; i < 10; i++) {
    let angle = map(i, 0, 9, 0, TWO_PI);
    let x = cos(angle) * 800;
    let y = sin(angle) * 800;
    vertex(x, -400, y);
    vertex(x, -390, y);
  }
  endShape();
}

function drawCrystal(size) {
  // Draw a basic crystal structure using multiple geometric shapes
  push();
  
  // Central core
  fill(200, 100, 100, 0.8);
  sphere(size * 0.4);
  
  // Crystal arms
  for (let i = 0; i < 6; i++) {
    let angle = map(i, 0, 5, 0, TWO_PI);
    push();
    rotateY(angle);
    
    // Arm shape
    fill(180, 80, 90, 0.7);
    beginShape();
    vertex(0, 0, 0);
    vertex(size * 0.3, size * 0.2, 0);
    vertex(size * 0.6, 0, 0);
    vertex(size * 0.3, -size * 0.2, 0);
    endShape(CLOSE);
    
    pop();
  }
  
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
