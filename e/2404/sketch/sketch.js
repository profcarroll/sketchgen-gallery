let particles = [];
let time = 0;
const particleCount = 1500;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  pixelDensity(1);
  
  // Initialize particles with precomputed positions and properties
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-200, 200),
      size: random(1, 3),
      speedX: random(-0.002, 0.002),
      speedY: random(-0.002, 0.002),
      speedZ: random(-0.001, 0.001),
      phaseX: random(TWO_PI),
      phaseY: random(TWO_PI),
      phaseZ: random(TWO_PI),
      color: [random(100, 255), random(100, 255), random(200, 255)]
    });
  }
}

function draw() {
  background(5, 10, 20);
  
  time += 0.01;
  
  // Use a single beginShape/POINTS block for all particles
  noStroke();
  beginShape(POINTS);
  
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    
    // Organic movement using sine waves
    p.x += sin(time * 0.5 + p.phaseX) * p.speedX;
    p.y += cos(time * 0.3 + p.phaseY) * p.speedY;
    p.z += sin(time * 0.2 + p.phaseZ) * p.speedZ;
    
    // Keep within bounds
    if (p.x < -width/2 || p.x > width/2) p.x = random(-width/2, width/2);
    if (p.y < -height/2 || p.y > height/2) p.y = random(-height/2, height/2);
    
    // Pulsing effect
    const pulse = sin(time * 0.8 + p.phaseX) * 0.3 + 0.7;
    const size = p.size * pulse;
    
    // Set color with dynamic hue shift
    const hue = (time * 10 + i * 2) % 360;
    fill(hue, 100, 255, 150);
    
    // Add vertex with size
    vertex(p.x, p.y, p.z);
  }
  
  endShape();
  
  // Draw liquid-like color flow effect
  for (let i = 0; i < 20; i++) {
    const x = sin(time * 0.1 + i) * width/3;
    const y = cos(time * 0.15 + i) * height/3;
    const z = sin(time * 0.08 + i) * 100;
    
    noStroke();
    fill(255, 100, 200, 20);
    push();
    translate(x, y, z);
    sphere(20);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
