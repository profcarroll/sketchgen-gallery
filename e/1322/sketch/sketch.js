let glintX, glintY;
let glowIntensity = 0;
let panelWidth, panelHeight, panelX, panelY;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Initialize console dimensions
  panelWidth = width * 0.8;
  panelHeight = height * 0.6;
  panelX = (width - panelWidth) / 2;
  panelY = (height - panelHeight) / 2;
  
  // Initialize glint position
  glintX = random(width);
  glintY = random(height);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  
  // Re-calculate panel dimensions after resize
  panelWidth = width * 0.8;
  panelHeight = height * 0.6;
  panelX = (width - panelWidth) / 2;
  panelY = (height - panelHeight) / 2;
}

function draw() {
  // Deep space background with subtle gradient
  background(10, 10, 15);
  
  // Draw console housing
  drawConsoleHousing();
  
  // Draw reflective panel
  drawPanel();
  
  // Animate glint
  animateGlint();
  
  // Subtle pulsing glow effect
  glowIntensity = 0.5 + 0.2 * sin(frameCount * 0.03);
}

function drawConsoleHousing() {
  // Outer black housing
  fill(15, 15, 20);
  rect(0, 0, width, height);
  
  // Inner geometric structure
  fill(30, 30, 40);
  rect(panelX, panelY, panelWidth, panelHeight, 15);
  
  // Bevel highlight
  fill(60, 60, 70, 100);
  rect(panelX + 5, panelY + 5, panelWidth - 10, 5);
  rect(panelX + 5, panelY + 5, 5, panelHeight - 10);
  
  // Control panel grid
  fill(20, 20, 25);
  for (let x = panelX; x < panelX + panelWidth; x += panelWidth / 12) {
    rect(x, panelY + 10, 2, panelHeight - 20);
  }
  for (let y = panelY; y < panelY + panelHeight; y += panelHeight / 8) {
    rect(panelX + 10, y, panelWidth - 20, 2);
  }
}

function drawPanel() {
  // Main reflective surface with gradient
  const baseColor = color(15, 15, 25);
  const highlightColor = color(40, 40, 60);
  
  noStroke();
  for (let y = 0; y < panelHeight; y += 2) {
    const t = map(y, 0, panelHeight, 0, 1);
    const inter = lerpColor(baseColor, highlightColor, t * 0.3);
    fill(inter);
    rect(panelX, panelY + y, panelWidth, 2);
  }
  
  // Add subtle grid lines
  stroke(40, 40, 50, 150);
  strokeWeight(1);
  for (let x = 0; x < panelWidth; x += panelWidth / 20) {
    line(panelX + x, panelY, panelX + x, panelY + panelHeight);
  }
  for (let y = 0; y < panelHeight; y += panelHeight / 15) {
    line(panelX, panelY + y, panelX + panelWidth, panelY + y);
  }
  
  // Inner glow effect
  const innerGlow = color(20, 40, 80, 30 * glowIntensity);
  fill(innerGlow);
  rect(panelX + 15, panelY + 15, panelWidth - 30, panelHeight - 30, 8);
}

function animateGlint() {
  // Move glint slowly across the screen
  const speed = 0.2;
  glintX += speed;
  glintY += speed * 0.3;
  
  // Reset position when it goes off screen
  if (glintX > width + 50 || glintY > height + 50) {
    glintX = -50;
    glintY = random(height);
  }
  
  // Draw the glint as a soft white highlight
  const glow = 100 * glowIntensity;
  fill(255, 255, 255, glow);
  noStroke();
  ellipse(glintX, glintY, 8, 4);
  
  // Add a subtle trail effect
  fill(255, 255, 255, glow * 0.3);
  ellipse(glintX - 10, glintY - 5, 6, 3);
}
