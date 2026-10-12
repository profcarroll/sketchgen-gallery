let fissure;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create the fissure geometry once
  fissure = createGraphics(500, 500);
  fissure.colorMode(HSB, 360, 100, 100, 1);
  fissure.noStroke();
  
  // Draw the calcified resin texture
  for (let y = 0; y < 500; y += 2) {
    const alpha = map(y, 0, 500, 0.8, 0);
    fissure.fill(60, 100, 100, alpha);
    fissure.rect(0, y, 500, 2);
  }
  
  // Draw some translucent layers for depth
  for (let i = 0; i < 30; i++) {
    const x = random(500);
    const w = random(10, 50);
    const a = random(0.05, 0.2);
    fissure.fill(60, 80, 90, a);
    fissure.rect(x, 0, w, 500);
  }
}

function draw() {
  background(0);
  
  // Update time for animation
  time += 0.01;
  
  // Camera movement to simulate deep space
  const camX = sin(time * 0.2) * 100;
  const camY = cos(time * 0.15) * 50;
  camera(0, -200, 800 + camY, 0, 0, 0, 0, 1, 0);
  
  // Draw the deep void
  drawVoid();
  
  // Draw the spreading fissure
  drawFissure();
}

function drawVoid() {
  // Draw a dark base for the void
  noStroke();
  fill(240, 80, 5, 1);
  beginShape(QUADS);
  vertex(-width, -height, -500);
  vertex(width, -height, -500);
  vertex(width, height, -500);
  vertex(-width, height, -500);
  endShape();
  
  // Add some subtle particle effects in the void
  fill(240, 5, 10, 0.3);
  for (let i = 0; i < 500; i++) {
    const x = random(-width, width);
    const y = random(-height, height);
    const z = -random(100, 500);
    ellipse(x, y, 2, 2);
  }
}

function drawFissure() {
  // Draw the fissure with dynamic expansion
  push();
  
  // Animate the spreading
  const spread = sin(time) * 200 + 200;
  
  // Position the fissure in the center of the void
  translate(0, 0, -300);
  
  // Rotate for dynamic effect
  rotateY(time * 0.1);
  
  // Texture the fissure with calcified resin
  texture(fissure);
  
  // Draw the main fissure plane that spreads outward
  noStroke();
  beginShape(QUADS);
  vertex(-spread, -spread, 0);
  vertex(spread, -spread, 0);
  vertex(spread, spread, 0);
  vertex(-spread, spread, 0);
  endShape();
  
  // Add some translucent edges for depth
  fill(60, 100, 100, 0.3);
  beginShape(QUADS);
  vertex(-spread - 20, -spread - 20, 0);
  vertex(spread + 20, -spread - 20, 0);
  vertex(spread + 20, spread + 20, 0);
  vertex(-spread - 20, spread + 20, 0);
  endShape();
  
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
