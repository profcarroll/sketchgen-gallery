let particles = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create particles
  for (let i = 0; i < 150; i++) {
    particles.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-200, 200),
      size: random(10, 30),
      speed: random(0.5, 2),
      hue: random(200, 300),
      saturation: 100,
      brightness: random(80, 100),
      alpha: random(0.6, 1),
      rotation: random(TWO_PI),
      rotationSpeed: random(-0.02, 0.02)
    });
  }
}

function draw() {
  background(0, 0, 0, 0.05);
  
  time += 0.01;
  
  // Update and display particles
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    // Update position with pulsating movement
    p.x += sin(time * p.speed + i) * 0.5;
    p.y += cos(time * p.speed + i) * 0.5;
    p.z += sin(time * 0.3 + i) * 0.3;
    
    // Update rotation
    p.rotation += p.rotationSpeed;
    
    // Draw particle as a geometric form
    push();
    translate(p.x, p.y, p.z);
    rotateX(p.rotation);
    rotateY(p.rotation * 0.5);
    rotateZ(p.rotation * 0.3);
    
    // Neon glow effect
    fill(p.hue, p.saturation, p.brightness, p.alpha);
    noStroke();
    
    // Draw different geometric shapes based on index
    if (i % 3 === 0) {
      box(p.size);
    } else if (i % 3 === 1) {
      sphere(p.size * 0.5);
    } else {
      cone(p.size * 0.5, p.size);
    }
    
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
