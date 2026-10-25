let paper;
let inkParticles = [];
let isScrolling = true;
let crystalPatterns = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create the newsprint texture
  paper = createGraphics(width, height);
  paper.colorMode(HSB, 360, 100, 100, 1);
  paper.background(20, 5, 95); // Light beige background
  
  // Add some aged paper texture
  for (let i = 0; i < 1000; i++) {
    let x = random(width);
    let y = random(height);
    let size = random(1, 3);
    paper.noStroke();
    paper.fill(20, 5, 85, 0.1);
    paper.ellipse(x, y, size, size);
  }
  
  // Initialize ink particles
  for (let i = 0; i < 500; i++) {
    inkParticles.push({
      x: random(width),
      y: random(height),
      size: random(2, 8),
      speedX: random(-1, 1),
      speedY: random(-1, 1),
      hue: random(20, 40), // Yellow-orange range
      alpha: random(0.3, 0.8),
      life: random(50, 200)
    });
  }
}

function draw() {
  background(0);
  
  // Draw the paper texture
  image(paper, 0, 0);
  
  // Handle scrolling
  if (isScrolling) {
    // Scroll the paper from edges
    translate(-frameCount * 0.5, 0);
    
    // Redraw paper to create continuous flow
    image(paper, width, 0);
    image(paper, -width, 0);
  }
  
  // Draw ink particles
  for (let i = inkParticles.length - 1; i >= 0; i--) {
    let p = inkParticles[i];
    
    if (isScrolling) {
      // Move particles with the paper flow
      p.x += p.speedX;
      p.y += p.speedY;
      
      // Apply some noise to create erratic movement
      p.x += noise(p.x * 0.01, p.y * 0.01, frameCount * 0.01) * 2 - 1;
      p.y += noise(p.x * 0.01, p.y * 0.01, frameCount * 0.01 + 1000) * 2 - 1;
    } else {
      // Stabilize particles when scrolling stops
      p.x += sin(frameCount * 0.03 + p.life) * 0.5;
      p.y += cos(frameCount * 0.02 + p.life) * 0.5;
    }
    
    // Fade out particles over time
    p.life--;
    
    if (p.life <= 0) {
      // Reset particle
      p.x = random(width);
      p.y = random(height);
      p.life = random(50, 200);
    }
    
    // Draw particle
    noStroke();
    fill(p.hue, 80, 100, p.alpha);
    ellipse(p.x, p.y, p.size);
  }
  
  // Draw crystal patterns if they exist
  for (let i = crystalPatterns.length - 1; i >= 0; i--) {
    let pattern = crystalPatterns[i];
    
    push();
    translate(pattern.x, pattern.y);
    
    // Rotate pattern
    rotate(frameCount * 0.01 + pattern.time);
    
    // Draw geometric pattern
    noFill();
    stroke(pattern.hue, 100, 100, 0.8);
    strokeWeight(2);
    
    beginShape();
    for (let j = 0; j < pattern.sides; j++) {
      let angle = TWO_PI * j / pattern.sides;
      let x = cos(angle) * pattern.size;
      let y = sin(angle) * pattern.size;
      vertex(x, y);
    }
    endShape(CLOSE);
    
    // Draw inner crystal structure
    stroke(pattern.hue, 100, 80, 0.6);
    for (let j = 0; j < pattern.sides; j++) {
      let angle = TWO_PI * j / pattern.sides;
      let x1 = cos(angle) * pattern.size * 0.5;
      let y1 = sin(angle) * pattern.size * 0.5;
      let x2 = cos(angle) * pattern.size * 0.8;
      let y2 = sin(angle) * pattern.size * 0.8;
      
      line(x1, y1, x2, y2);
    }
    
    pop();
    
    // Fade out pattern
    pattern.life--;
    if (pattern.life <= 0) {
      crystalPatterns.splice(i, 1);
    }
  }
}

function mousePressed() {
  if (isScrolling) {
    // Stop scrolling and create crystal patterns
    isScrolling = false;
    
    // Create crystal patterns at particle positions
    for (let i = 0; i < 15; i++) {
      let p = inkParticles[i];
      crystalPatterns.push({
        x: p.x,
        y: p.y,
        size: random(20, 60),
        sides: floor(random(4, 9)),
        hue: random(180, 240), // Blue range
        life: 150,
        time: random(TWO_PI)
      });
    }
  } else {
    // Resume scrolling
    isScrolling = true;
    
    // Clear crystal patterns
    crystalPatterns = [];
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
