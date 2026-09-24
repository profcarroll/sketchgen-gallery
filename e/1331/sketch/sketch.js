let gridLines = [];
let waveOffset = 0;
let glintX, glintY;

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  
  // Initialize console dimensions
  const panelWidth = width * 0.8;
  const panelHeight = height * 0.6;
  const panelX = (width - panelWidth) / 2;
  const panelY = (height - panelHeight) / 2;
  
  // Create grid lines for the console surface
  for (let x = 0; x < panelWidth; x += panelWidth / 20) {
    gridLines.push({
      x: panelX + x,
      y1: panelY,
      y2: panelY + panelHeight,
      color: color(40, 40, 50, 150)
    });
  }
  for (let y = 0; y < panelHeight; y += panelHeight / 15) {
    gridLines.push({
      x1: panelX,
      x2: panelX + panelWidth,
      y: panelY + y,
      color: color(40, 40, 50, 150)
    });
  }
  
  // Initialize glint position
  glintX = -50;
  glintY = random(height);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  // Deep space background with subtle gradient
  background(10, 10, 15);
  
  // Draw console housing
  drawConsoleHousing();
  
  // Draw reflective panel
  drawPanel();
  
  // Animate wave effect
  animateWave();
  
  // Animate glint
  animateGlint();
}

function drawConsoleHousing() {
  // Outer black housing
  fill(15, 15, 20);
  rect(0, 0, width, height);
  
  // Inner geometric structure
  fill(30, 30, 40);
  const panelWidth = width * 0.8;
  const panelHeight = height * 0.6;
  const panelX = (width - panelWidth) / 2;
  const panelY = (height - panelHeight) / 2;
  rect(panelX, panelY, panelWidth, panelHeight, 15);
  
  // Bevel highlight
  fill(60, 60, 70, 100);
  rect(panelX + 5, panelY + 5, panelWidth - 10, 5);
  rect(panelX + 5, panelY + 5, 5, panelHeight - 10);
}

function drawPanel() {
  // Main reflective surface with gradient
  const baseColor = color(15, 15, 25);
  const highlightColor = color(40, 40, 60);
  
  noStroke();
  for (let y = 0; y < height * 0.6; y += 2) {
    const t = map(y, 0, height * 0.6, 0, 1);
    const inter = lerpColor(baseColor, highlightColor, t * 0.3);
    fill(inter);
    rect((width - width * 0.8) / 2, (height - height * 0.6) / 2 + y, width * 0.8, 2);
  }
  
  // Add subtle grid lines
  stroke(40, 40, 50, 150);
  strokeWeight(1);
  for (let i = 0; i < gridLines.length; i++) {
    const lineData = gridLines[i];
    if (lineData.x) {
      line(lineData.x, lineData.y1, lineData.x, lineData.y2);
    } else {
      line(lineData.x1, lineData.y, lineData.x2, lineData.y);
    }
  }
  
  // Inner glow effect
  const innerGlow = color(20, 40, 80, 30);
  fill(innerGlow);
  const panelWidth = width * 0.8;
  const panelHeight = height * 0.6;
  const panelX = (width - panelWidth) / 2;
  const panelY = (height - panelHeight) / 2;
  rect(panelX + 15, panelY + 15, panelWidth - 30, panelHeight - 30, 8);
}

function animateWave() {
  // Draw cascading waves of emerald-green lines
  const panelWidth = width * 0.8;
  const panelHeight = height * 0.6;
  const panelX = (width - panelWidth) / 2;
  const panelY = (height - panelHeight) / 2;
  
  stroke(0, 255, 100, 100);
  strokeWeight(1);
  
  // Draw horizontal waves
  for (let y = 0; y < panelHeight; y += 20) {
    const waveOffsetY = sin((frameCount * 0.03 + y * 0.05)) * 3;
    line(panelX, panelY + y + waveOffsetY, panelX + panelWidth, panelY + y + waveOffsetY);
  }
  
  // Draw vertical waves
  for (let x = 0; x < panelWidth; x += 20) {
    const waveOffsetX = sin((frameCount * 0.03 + x * 0.05)) * 3;
    line(panelX + x + waveOffsetX, panelY, panelX + x + waveOffsetX, panelY + panelHeight);
  }
  
  waveOffset += 0.02;
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
  const glow = 100 * (0.5 + 0.2 * sin(frameCount * 0.03));
  fill(255, 255, 255, glow);
  noStroke();
  ellipse(glintX, glintY, 8, 4);
  
  // Add a subtle trail effect
  fill(255, 255, 255, glow * 0.3);
  ellipse(glintX - 10, glintY - 5, 6, 3);
}
