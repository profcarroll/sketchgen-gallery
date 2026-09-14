let particles = [];
let noiseScale = 0.02;
let noiseStrength = 5;
let mouseInfluence = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  
  // Initialize particles
  for (let i = 0; i < 500; i++) {
    particles.push({
      pos: createVector(random(width), random(height)),
      vel: createVector(0, 0),
      size: random(5, 20),
      hue: random(360),
      life: random(100, 200)
    });
  }
}

function draw() {
  background(0, 0, 0, 0.05);
  
  // Update mouse influence
  if (mouseX > 0 && mouseY > 0) {
    mouseInfluence = 1;
  } else {
    mouseInfluence = 0;
  }
  
  // Update and display particles
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    
    // Apply noise-based movement
    let nx = noise(p.pos.x * noiseScale, p.pos.y * noiseScale) * noiseStrength;
    let ny = noise(p.pos.x * noiseScale + 1000, p.pos.y * noiseScale + 1000) * noiseStrength;
    
    // Apply mouse influence
    if (mouseInfluence > 0) {
      let mouseVec = createVector(mouseX - p.pos.x, mouseY - p.pos.y);
      mouseVec.normalize();
      mouseVec.mult(0.5);
      nx += mouseVec.x * 2;
      ny += mouseVec.y * 2;
    }
    
    p.vel.add(nx, ny);
    p.vel.limit(3);
    p.pos.add(p.vel);
    
    // Boundary check
    if (p.pos.x < 0 || p.pos.x > width || p.pos.y < 0 || p.pos.y > height) {
      p.pos.x = random(width);
      p.pos.y = random(height);
      p.vel.mult(0);
    }
    
    // Update life and size
    p.life--;
    if (p.life <= 0) {
      p.pos.x = random(width);
      p.pos.y = random(height);
      p.vel.mult(0);
      p.life = random(100, 200);
    }
    
    // Draw particle
    fill(p.hue, 80, 90, 0.7);
    push();
    translate(p.pos.x - width/2, p.pos.y - height/2);
    sphere(p.size);
    pop();
  }
  
  // Slowly shift noise field over time
  noiseScale += 0.0001;
  if (noiseScale > 0.03) noiseScale = 0.02;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
