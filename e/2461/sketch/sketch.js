let waves = [];
let particles = [];
let mouseRadius = 0;
let isDragging = false;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize water surface waves
  for (let i = 0; i < 50; i++) {
    waves.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      radius: random(50, 200),
      speed: random(0.005, 0.02),
      hue: random(180, 300)
    });
  }
  
  // Create smoke particles
  for (let i = 0; i < 2000; i++) {
    particles.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-100, 100),
      size: random(1, 5),
      hue: random(360),
      speed: random(0.001, 0.005),
      life: random(100, 300)
    });
  }
}

function draw() {
  background(0, 0, 0, 0.1);
  
  // Camera movement
  rotateY(frameCount * 0.002);
  rotateX(0.2);
  
  // Mouse interaction
  if (isDragging) {
    mouseRadius = min(mouseRadius + 5, 100);
  } else {
    mouseRadius *= 0.95;
  }
  
  // Update and draw waves
  for (let wave of waves) {
    wave.radius += wave.speed * 20;
    
    // Create ripple effect with interference
    let alpha = map(wave.radius, 0, 300, 0.8, 0);
    alpha = constrain(alpha, 0, 0.8);
    
    noFill();
    stroke(wave.hue, 80, 90, alpha);
    strokeWeight(1);
    
    push();
    translate(wave.x, wave.y, 0);
    ellipse(0, 0, wave.radius * 2);
    pop();
    
    // Reset wave if it's too big
    if (wave.radius > 300) {
      wave.radius = 0;
      wave.x = random(-width/2, width/2);
      wave.y = random(-height/2, height/2);
    }
  }
  
  // Update and draw particles
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    
    // Apply movement with interference pattern
    let dx = p.x - mouseX;
    let dy = p.y - mouseY;
    let distToMouse = sqrt(dx * dx + dy * dy);
    
    if (distToMouse < mouseRadius) {
      // Distort particle when near mouse
      let force = map(distToMouse, 0, mouseRadius, 1, 0);
      p.x += (dx / distToMouse) * force * 2;
      p.y += (dy / distToMouse) * force * 2;
    }
    
    // Particle movement with wave interference
    let waveEffect = sin(p.x * 0.01 + frameCount * 0.01) * 
                     cos(p.y * 0.01 + frameCount * 0.01);
    p.z += waveEffect * 0.5;
    
    // Update particle position
    p.x += sin(frameCount * p.speed) * 0.5;
    p.y += cos(frameCount * p.speed) * 0.5;
    
    // Particle life cycle
    p.life--;
    if (p.life <= 0) {
      particles.splice(i, 1);
      particles.push({
        x: random(-width/2, width/2),
        y: random(-height/2, height/2),
        z: random(-100, 100),
        size: random(1, 5),
        hue: random(360),
        speed: random(0.001, 0.005),
        life: random(100, 300)
      });
    }
    
    // Draw particle
    push();
    translate(p.x, p.y, p.z);
    fill(p.hue, 80, 90, 0.7);
    noStroke();
    sphere(p.size, 4, 3);
    pop();
  }
}

function mousePressed() {
  isDragging = true;
  mouseRadius = 50;
}

function mouseReleased() {
  isDragging = false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
