let planes = [];
let particles = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create initial geometric planes
  for (let i = 0; i < 8; i++) {
    planes.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-500, 500),
      size: random(100, 300),
      rotationX: random(TWO_PI),
      rotationY: random(TWO_PI),
      speedX: random(-0.005, 0.005),
      speedY: random(-0.005, 0.005),
      hue: random(180, 240),
      alpha: random(0.3, 0.6)
    });
  }
  
  // Initialize particles
  for (let i = 0; i < 1000; i++) {
    particles.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-500, 500),
      size: random(0.5, 3),
      speed: random(0.1, 0.5),
      angle: random(TWO_PI),
      hue: random(180, 240),
      alpha: random(0.1, 0.5)
    });
  }
}

function draw() {
  background(0);
  
  // Rotate the whole scene slowly
  rotateY(frameCount * 0.001);
  rotateX(frameCount * 0.0005);
  
  // Update and display planes
  for (let i = 0; i < planes.length; i++) {
    let p = planes[i];
    
    push();
    translate(p.x, p.y, p.z);
    rotateX(p.rotationX);
    rotateY(p.rotationY);
    
    // Slight pulsing effect
    let pulse = sin(frameCount * 0.01 + i) * 0.2 + 1;
    scale(pulse);
    
    strokeWeight(1);
    noFill();
    stroke(p.hue, 80, 90, p.alpha);
    
    // Draw a fractured plane structure
    beginShape(QUADS);
    vertex(-p.size/2, -p.size/2, 0);
    vertex(p.size/2, -p.size/2, 0);
    vertex(p.size/2, p.size/2, 0);
    vertex(-p.size/2, p.size/2, 0);
    endShape();
    
    // Add some internal structure
    strokeWeight(0.5);
    stroke(p.hue, 70, 80, p.alpha * 0.5);
    line(-p.size/2, -p.size/2, 0, p.size/2, p.size/2, 0);
    line(p.size/2, -p.size/2, 0, -p.size/2, p.size/2, 0);
    
    pop();
    
    // Update position for next frame
    p.rotationX += p.speedX;
    p.rotationY += p.speedY;
    
    // Occasionally shed particles
    if (random() < 0.05) {
      let newParticle = {
        x: p.x + random(-p.size/2, p.size/2),
        y: p.y + random(-p.size/2, p.size/2),
        z: p.z,
        size: random(1, 4),
        speed: random(0.5, 1.5),
        angle: random(TWO_PI),
        hue: p.hue,
        alpha: random(0.3, 0.8)
      };
      particles.push(newParticle);
    }
  }
  
  // Update and display particles
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    // Move particle
    p.x += cos(p.angle) * p.speed;
    p.y += sin(p.angle) * p.speed;
    p.z += random(-0.5, 0.5);
    
    // Gradually fade out and reduce size
    p.size *= 0.98;
    p.alpha *= 0.97;
    
    // Remove dead particles
    if (p.size < 0.1 || p.alpha < 0.05) {
      particles.splice(i, 1);
      i--;
      continue;
    }
    
    push();
    translate(p.x, p.y, p.z);
    
    noStroke();
    fill(p.hue, 80, 90, p.alpha);
    sphere(p.size);
    
    pop();
  }
  
  // Occasionally add new particles
  if (random() < 0.1 && particles.length < 1500) {
    let x = random(-width/2, width/2);
    let y = random(-height/2, height/2);
    let z = random(-500, 500);
    particles.push({
      x: x,
      y: y,
      z: z,
      size: random(1, 3),
      speed: random(0.1, 0.8),
      angle: random(TWO_PI),
      hue: random(180, 240),
      alpha: random(0.3, 0.7)
    });
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
