let particles = [];
const PARTICLE_COUNT = 1000;
let time = 0;
let dominoes = [];
let dominoFallTime = -1;
let isFalling = false;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  
  // Initialize particles
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-1000, 1000),
      size: random(2, 6),
      speedX: random(-0.5, 0.5),
      speedY: random(-0.5, 0.5),
      speedZ: random(-0.5, 0.5),
      hue: random(180, 240),
      saturation: random(60, 90),
      brightness: random(70, 100),
      opacity: random(0.3, 0.7),
      angleX: random(TWO_PI),
      angleY: random(TWO_PI),
      rotationX: random(-0.02, 0.02),
      rotationY: random(-0.02, 0.02)
    });
  }
  
  // Initialize dominoes in a row
  for (let i = 0; i < 10; i++) {
    dominoes.push({
      x: -width/3 + i * 40,
      y: height/4,
      z: 0,
      width: 10,
      height: 30,
      angle: 0,
      fallen: false
    });
  }
}

function draw() {
  background(210, 50, 10);
  
  time += 0.01;
  
  // Apply domino effect if triggered
  if (isFalling && dominoFallTime > 0) {
    for (let i = 0; i < dominoes.length; i++) {
      if (i > 0 && dominoes[i-1].fallen) {
        dominoes[i].angle += 0.1;
        if (dominoes[i].angle > PI/2) {
          dominoes[i].angle = PI/2;
        }
      }
    }
    
    // Trigger fall after some delay
    if (frameCount % 30 === 0) {
      dominoFallTime--;
      if (dominoFallTime <= 0) {
        for (let i = 0; i < dominoes.length; i++) {
          dominoes[i].fallen = true;
        }
      }
    }
  }
  
  // Update and draw particles
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    // Apply current effect - subtle circular motion
    let currentX = cos(time + p.x * 0.001) * 0.2;
    let currentY = sin(time + p.y * 0.001) * 0.2;
    let currentZ = sin(time * 0.5 + p.z * 0.001) * 0.1;
    
    // Update position with current and slight random drift
    p.x += currentX + random(-0.1, 0.1);
    p.y += currentY + random(-0.1, 0.1);
    p.z += currentZ + random(-0.1, 0.1);
    
    // Apply rotation
    p.angleX += p.rotationX;
    p.angleY += p.rotationY;
    
    // Boundary wrapping - particles wrap around edges
    if (p.x < -width/2 - 50) p.x = width/2 + 50;
    if (p.x > width/2 + 50) p.x = -width/2 - 50;
    if (p.y < -height/2 - 50) p.y = height/2 + 50;
    if (p.y > height/2 + 50) p.y = -height/2 - 50;
    if (p.z < -1000) p.z = 1000;
    if (p.z > 1000) p.z = -1000;
    
    // Draw particle as crystalline shape
    push();
    translate(p.x, p.y, p.z);
    rotateX(p.angleX);
    rotateY(p.angleY);
    
    fill(p.hue, p.saturation, p.brightness, p.opacity);
    
    // Draw as a small cube (crystalline structure)
    box(p.size);
    
    pop();
  }
  
  // Draw dominoes
  for (let i = 0; i < dominoes.length; i++) {
    let d = dominoes[i];
    
    push();
    translate(d.x, d.y, d.z);
    rotateY(d.angle);
    
    fill(200, 30, 90, 0.8);
    box(d.width, d.height, 10);
    
    pop();
  }
  
  // Check if dominoes are falling
  if (frameCount % 60 === 0 && !isFalling) {
    isFalling = true;
    dominoFallTime = 20;
  }
}

function mousePressed() {
  // Start the domino effect on click
  if (!isFalling) {
    isFalling = true;
    dominoFallTime = 20;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
