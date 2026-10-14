let threads = [];
let glintX, glintY;
let glowIntensity = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Initialize tapestry dimensions
  const tapestryWidth = width * 0.9;
  const tapestryHeight = height * 0.8;
  const tapestryX = (width - tapestryWidth) / 2;
  const tapestryY = (height - tapestryHeight) / 2;
  
  // Create textile threads
  for (let i = 0; i < 500; i++) {
    threads.push({
      x: random(tapestryX, tapestryX + tapestryWidth),
      y: random(tapestryY, tapestryY + tapestryHeight),
      length: random(20, 100),
      angle: random(TWO_PI),
      thickness: random(1, 3),
      color: color(
        random(50, 150),
        random(30, 100),
        random(20, 80),
        random(150, 200)
      ),
      glow: random(0.5, 1.0)
    });
  }
  
  // Initialize glint position
  glintX = random(width);
  glintY = random(height);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  // Deep, rich background with subtle gradient
  background(25, 15, 35);
  
  // Draw textile threads
  drawThreads();
  
  // Animate glint
  animateGlint();
  
  // Subtle pulsing glow effect
  glowIntensity = 0.5 + 0.2 * sin(frameCount * 0.03);
}

function drawThreads() {
  // Draw background tapestry texture
  fill(35, 25, 55);
  noStroke();
  rect(0, 0, width, height);
  
  // Draw complex thread pattern
  for (let i = 0; i < threads.length; i++) {
    const t = threads[i];
    
    push();
    translate(t.x, t.y);
    rotate(t.angle);
    
    // Thread with gradient and subtle glow
    const threadColor = t.color;
    const glowColor = color(
      red(threadColor),
      green(threadColor),
      blue(threadColor),
      50 * t.glow * glowIntensity
    );
    
    fill(glowColor);
    rect(-t.thickness/2, -t.length/2, t.thickness, t.length);
    
    // Draw thread with texture
    fill(threadColor);
    rect(-t.thickness/4, -t.length/2, t.thickness/2, t.length);
    
    pop();
  }
  
  // Add subtle grid overlay for medieval tapestry feel
  stroke(50, 30, 70, 80);
  strokeWeight(1);
  
  for (let x = 0; x < width; x += width / 20) {
    line(x, 0, x, height);
  }
  for (let y = 0; y < height; y += height / 15) {
    line(0, y, width, y);
  }
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
