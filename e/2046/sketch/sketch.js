let particles = [];
let particleCount = 1500;
let windForce = 0.3;
let turbulence = 0.02;
let textureStrength = 0.8;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create particles
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      z: random(-100, 100),
      size: random(2, 8),
      speed: random(0.5, 2),
      angle: random(TWO_PI),
      color: color(random(180, 240), random(20, 40), random(80, 95)),
      life: random(100, 300)
    });
  }
}

function draw() {
  background(220, 10, 95);
  
  // Batch all particles into one shape for performance
  beginShape(POINTS);
  noStroke();
  
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    // Apply wind force with turbulence
    p.x += cos(p.angle) * p.speed + random(-turbulence, turbulence);
    p.y += sin(p.angle) * p.speed + random(-turbulence, turbulence);
    p.z += random(-0.5, 0.5);
    
    // Update angle for more chaotic movement
    p.angle += random(-0.1, 0.1);
    
    // Apply some rotation
    p.angle += sin(frameCount * 0.01) * 0.02;
    
    // Reset if particle goes off screen
    if (p.x < -50 || p.x > width + 50 || p.y < -50 || p.y > height + 50) {
      p.x = random(width);
      p.y = random(height);
      p.z = random(-100, 100);
      p.life = random(100, 300);
    }
    
    // Update life
    p.life--;
    if (p.life <= 0) {
      p.x = random(width);
      p.y = random(height);
      p.z = random(-100, 100);
      p.life = random(100, 300);
    }
    
    // Set color and vertex
    fill(p.color);
    vertex(p.x - width/2, p.y - height/2, p.z);
  }
  
  endShape();
  
  // Add texture particles
  if (frameCount % 2 === 0) {
    beginShape(POINTS);
    for (let i = 0; i < 5; i++) {
      let x = random(width);
      let y = random(height);
      let z = random(-100, 100);
      let c = color(random(180, 240), random(20, 40), random(80, 95));
      
      fill(c);
      vertex(x - width/2, y - height/2, z);
    }
    endShape();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
