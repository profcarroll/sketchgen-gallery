let particles = [];
const particleCount = 2000;
let backgroundImg;

function setup() {
  createCanvas(windowWidth, windowHeight);
  backgroundImg = createGraphics(width, height);
  backgroundImg.background(255);
  
  // Initialize particles off-screen
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: -100,
      y: -100,
      vx: 0,
      vy: 0,
      life: 0,
      maxLife: random(20, 50),
      size: random(2, 6),
      color: color(random(100, 255), random(100, 255), random(100, 255), random(100, 255))
    });
  }
}

function draw() {
  // Slowly fade the background
  backgroundImg.fill(255, 10);
  backgroundImg.rect(0, 0, width, height);

  // Draw the background image to main canvas
  image(backgroundImg, 0, 0);

  // Update and display particles
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    if (p.life > 0) {
      // Move particle
      p.x += p.vx;
      p.y += p.vy;
      
      // Apply some gravity and drag
      p.vy += 0.05;
      p.vx *= 0.95;
      p.vy *= 0.95;
      
      // Reduce life
      p.life--;
      
      // Draw particle
      noStroke();
      fill(p.color);
      ellipse(p.x, p.y, p.size);
    } else {
      // Reset dead particles
      if (mouseIsPressed) {
        p.x = mouseX;
        p.y = mouseY;
        p.vx = random(-2, 2);
        p.vy = random(-2, 2);
        p.life = p.maxLife;
      }
    }
  }
}

function mousePressed() {
  // Start particles at mouse position
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    if (p.life <= 0) {
      p.x = mouseX;
      p.y = mouseY;
      p.vx = random(-2, 2);
      p.vy = random(-2, 2);
      p.life = p.maxLife;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
