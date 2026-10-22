let fragments = [];
const FRAGMENT_COUNT = 1500;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  
  // Initialize fragments with varied sizes and properties
  for (let i = 0; i < FRAGMENT_COUNT; i++) {
    fragments.push({
      x: random(width),
      y: random(height),
      size: random(2, 20),
      speedX: random(-3, 3),
      speedY: random(-3, 3),
      angle: random(TWO_PI),
      rotation: random(-0.1, 0.1),
      hue: random(190, 230),
      opacity: random(0.7, 1),
      life: random(100)
    });
  }
}

function draw() {
  // Semi-transparent background for trail effect
  background(210, 50, 10, 0.05);
  
  time += 0.02;
  
  // Draw all fragments
  for (let i = 0; i < fragments.length; i++) {
    let f = fragments[i];
    
    // Update position with velocity
    f.x += f.speedX;
    f.y += f.speedY;
    
    // Apply rotation
    f.angle += f.rotation;
    
    // Boundary collision - bounce off edges
    if (f.x < 0 || f.x > width) {
      f.speedX *= -1;
      f.x = constrain(f.x, 0, width);
    }
    if (f.y < 0 || f.y > height) {
      f.speedY *= -1;
      f.y = constrain(f.y, 0, height);
    }
    
    // Add some chaotic movement
    f.speedX += random(-0.1, 0.1);
    f.speedY += random(-0.1, 0.1);
    
    // Limit speed to prevent extreme velocities
    f.speedX = constrain(f.speedX, -5, 5);
    f.speedY = constrain(f.speedY, -5, 5);
    
    // Fade out as life decreases
    f.life -= 0.2;
    if (f.life <= 0) {
      f.x = random(width);
      f.y = random(height);
      f.life = random(100);
      f.size = random(2, 20);
      f.speedX = random(-3, 3);
      f.speedY = random(-3, 3);
    }
    
    // Draw fragment as a sharp, cut-paper shape
    push();
    translate(f.x, f.y);
    rotate(f.angle);
    
    fill(f.hue, 70, 90, f.opacity);
    
    // Random polygonal shape for cut paper effect
    beginShape();
    let sides = floor(random(3, 7));
    for (let j = 0; j < sides; j++) {
      let angle = map(j, 0, sides, 0, TWO_PI);
      let px = cos(angle) * f.size;
      let py = sin(angle) * f.size;
      vertex(px, py);
    }
    endShape(CLOSE);
    
    pop();
  }
  
  // Occasionally add new fragments for dynamic effect
  if (frameCount % 20 === 0) {
    for (let i = 0; i < 5; i++) {
      fragments.push({
        x: random(width),
        y: random(height),
        size: random(2, 20),
        speedX: random(-3, 3),
        speedY: random(-3, 3),
        angle: random(TWO_PI),
        rotation: random(-0.1, 0.1),
        hue: random(190, 230),
        opacity: random(0.7, 1),
        life: random(100)
      });
    }
    // Keep array size stable
    if (fragments.length > FRAGMENT_COUNT + 5) {
      fragments.splice(0, 5);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
