let particles = [];
let centerX, centerY;
let isExploding = false;
let explosionTime = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  centerX = width / 2;
  centerY = height / 2;
  
  // Initialize particles in a circular formation
  for (let i = 0; i < 1500; i++) {
    let angle = random(TWO_PI);
    let r = random(50, 300);
    
    let pos = createVector(
      centerX + r * cos(angle),
      centerY + r * sin(angle),
      random(-50, 50)
    );
    
    particles.push({
      pos: pos.copy(),
      originalPos: pos.copy(),
      vel: createVector(0, 0, 0),
      size: random(0.5, 2),
      color: color(random(360), 100, 100, 0.8),
      isMoving: false
    });
  }
}

function draw() {
  background(0);
  
  // Draw all particles as points for performance
  noStroke();
  beginShape(POINTS);
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    if (!p.isMoving) {
      // Pull towards center with some randomness
      let target = createVector(centerX, centerY, 0);
      let force = target.copy().sub(p.pos);
      let distance = force.mag();
      
      if (distance > 1) {
        force.normalize();
        force.mult(0.02);
        p.vel.add(force);
        p.isMoving = true;
      }
    } else {
      // Apply velocity and some randomness
      p.pos.add(p.vel);
      p.vel.mult(0.95); // Slow down over time
      
      // Add a little turbulence
      p.vel.x += random(-0.1, 0.1);
      p.vel.y += random(-0.1, 0.1);
      p.vel.z += random(-0.1, 0.1);
    }
    
    fill(p.color);
    vertex(p.pos.x, p.pos.y, p.pos.z);
  }
  endShape();
  
  // Trigger explosion after a delay
  if (frameCount > 60 && !isExploding) {
    isExploding = true;
    explosionTime = frameCount;
    
    for (let i = 0; i < particles.length; i++) {
      let p = particles[i];
      
      // Add explosive force away from center
      let force = p.pos.copy().sub(createVector(centerX, centerY, 0));
      force.normalize();
      force.mult(random(3, 7));
      
      p.vel.add(force);
      p.isMoving = true;
    }
  }
  
  // Continue explosion effect for a while
  if (isExploding && frameCount < explosionTime + 120) {
    noStroke();
    beginShape(POINTS);
    for (let i = 0; i < particles.length; i++) {
      let p = particles[i];
      
      if (p.isMoving) {
        // Apply more force during explosion
        let force = p.pos.copy().sub(createVector(centerX, centerY, 0));
        force.normalize();
        force.mult(0.2);
        p.vel.add(force);
        
        // Update position
        p.pos.add(p.vel);
        p.vel.mult(0.98); // Slow down over time
        
        fill(p.color);
        vertex(p.pos.x, p.pos.y, p.pos.z);
      }
    }
    endShape();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  centerX = width / 2;
  centerY = height / 2;
}

function mousePressed() {
  // Trigger explosion on click
  if (!isExploding) {
    isExploding = true;
    explosionTime = frameCount;
    
    for (let i = 0; i < particles.length; i++) {
      let p = particles[i];
      
      // Add explosive force away from center
      let force = p.pos.copy().sub(createVector(centerX, centerY, 0));
      force.normalize();
      force.mult(random(3, 7));
      
      p.vel.add(force);
      p.isMoving = true;
    }
  }
}
