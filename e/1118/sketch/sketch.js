let crystals = [];
let paletteIndex = 0;
let palettes = [
  ['#8B5FBF', '#1E90FF', '#FFD700'], // violet, teal, gold
  ['#FF69B4', '#00CED1', '#FFA500'], // pink, dark teal, orange
  ['#4B0082', '#20B2AA', '#FFD700'], // indigo, sea green, gold
  ['#9932CC', '#00BFFF', '#FFA500']  // purple, deep sky blue, orange
];

function setup() {
  createCanvas(800, 600);
  noStroke();
  
  // Create crystals
  for (let i = 0; i < 150; i++) {
    crystals.push({
      x: random(width),
      y: random(height),
      size: random(5, 25),
      speed: random(0.001, 0.005),
      phase: random(TWO_PI)
    });
  }
}

function draw() {
  // Dark cave background
  background(10, 10, 30);
  
  // Draw crystal glow effect
  for (let crystal of crystals) {
    crystal.phase += crystal.speed;
    
    let pulse = sin(crystal.phase) * 0.5 + 0.5;
    let glowSize = crystal.size * (1 + pulse * 0.5);
    
    let palette = palettes[paletteIndex];
    let color1 = lerpColor(color(palette[0]), color(palette[1]), pulse * 0.5);
    let color2 = lerpColor(color(palette[1]), color(palette[2]), pulse * 0.3);
    
    // Draw glow
    drawingContext.shadowBlur = glowSize * 2;
    drawingContext.shadowColor = color1;
    ellipse(crystal.x, crystal.y, glowSize);
    
    // Draw core
    drawingContext.shadowBlur = 0;
    fill(color2);
    ellipse(crystal.x, crystal.y, crystal.size);
  }
  
  // Draw cave walls with dynamic shadows
  drawCaveShadows();
}

function drawCaveShadows() {
  // Draw some rough cave wall lines
  stroke(30, 30, 60);
  strokeWeight(1);
  
  for (let i = 0; i < 200; i++) {
    let x1 = random(width);
    let y1 = random(height);
    let x2 = x1 + random(-50, 50);
    let y2 = y1 + random(-50, 50);
    
    // Draw line with some shadow effect
    let alpha = map(dist(x1, y1, mouseX, mouseY), 0, width/2, 200, 50);
    stroke(30, 30, 60, alpha);
    line(x1, y1, x2, y2);
  }
}

function mousePressed() {
  // Shift color palette on click
  paletteIndex = (paletteIndex + 1) % palettes.length;
}
