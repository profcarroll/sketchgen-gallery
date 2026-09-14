let particles = [];
let molecules = [];
let time = 0;

function setup() {
  createCanvas(800, 600);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create initial particles
  for (let i = 0; i < 200; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      z: random(1000),
      size: random(2, 8),
      speed: random(0.5, 2),
      hue: random(360)
    });
  }
  
  // Create initial molecules
  for (let i = 0; i < 30; i++) {
    molecules.push({
      x: random(width),
      y: random(height),
      z: random(1000),
      size: random(20, 60),
      speed: random(0.1, 0.5),
      hue: random(360),
      distortion: 0,
      isShattering: false
    });
  }
}

function draw() {
  background(0, 0, 0, 0.1);
  
  time += 0.01;
  
  // Update and display particles
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    // Accelerate forward
    p.z -= p.speed * (1 + time * 0.5);
    
    // Reset particle if it goes too far
    if (p.z < 0) {
      p.z = 1000;
      p.x = random(width);
      p.y = random(height);
    }
    
    // Project 3D to 2D
    let perspective = 500 / (500 - p.z);
    let x = p.x * perspective;
    let y = p.y * perspective;
    let size = p.size * perspective;
    
    // Draw particle with glow effect
    noStroke();
    fill(p.hue, 80, 90, 0.8);
    ellipse(x, y, size, size);
    
    // Add light trail
    fill(p.hue, 100, 100, 0.2);
    ellipse(x, y, size * 3, size * 3);
  }
  
  // Update and display molecules
  for (let i = 0; i < molecules.length; i++) {
    let m = molecules[i];
    
    // Accelerate forward
    m.z -= m.speed * (1 + time * 0.8);
    
    // Reset molecule if it goes too far
    if (m.z < 0) {
      m.z = 1000;
      m.x = random(width);
      m.y = random(height);
      m.distortion = 0;
      m.isShattering = false;
    }
    
    // Project 3D to 2D
    let perspective = 500 / (500 - m.z);
    let x = m.x * perspective;
    let y = m.y * perspective;
    let size = m.size * perspective;
    
    // Distortion effect
    if (random() < 0.02) {
      m.isShattering = true;
      m.distortion = random(5, 15);
    }
    
    if (m.isShattering) {
      m.distortion -= 0.3;
      if (m.distortion <= 0) {
        m.isShattering = false;
      }
    }
    
    // Draw molecule with distortion
    noStroke();
    fill(m.hue, 90, 95, 0.7);
    
    if (m.isShattering) {
      // Create shattering effect
      for (let j = 0; j < 8; j++) {
        let angle = TWO_PI * j / 8;
        let dist = m.distortion + random(2);
        let px = x + cos(angle) * dist;
        let py = y + sin(angle) * dist;
        fill(m.hue, 100, 100, 0.8);
        ellipse(px, py, size * 0.3, size * 0.3);
      }
    } else {
      // Normal molecule
      ellipse(x, y, size, size);
      
      // Draw internal structure
      fill(m.hue, 70, 60, 0.5);
      for (let j = 0; j < 6; j++) {
        let angle = TWO_PI * j / 6;
        let px = x + cos(angle) * size * 0.4;
        let py = y + sin(angle) * size * 0.4;
        ellipse(px, py, size * 0.2, size * 0.2);
      }
    }
    
    // Add glow effect
    fill(m.hue, 100, 100, 0.1);
    ellipse(x, y, size * 3, size * 3);
  }
  
  // Add central tunnel effect
  noStroke();
  fill(0, 0, 0, 0.05);
  rect(0, 0, width, height);
}
