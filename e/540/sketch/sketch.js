let particles = [];
let crystalStructures = [];
let speed = 0;
let maxSpeed = 15;
let acceleration = 0.05;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  
  // Initialize particles
  for (let i = 0; i < 200; i++) {
    particles.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-1000, -100),
      size: random(1, 5),
      color: color(random(100, 255), random(100, 255), random(200, 255), 200)
    });
  }
  
  // Initialize crystal structures
  for (let i = 0; i < 30; i++) {
    crystalStructures.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-1000, -100),
      size: random(20, 60),
      rotationX: random(TWO_PI),
      rotationY: random(TWO_PI),
      color: color(random(150, 255), random(100, 200), random(200, 255), 150)
    });
  }
}

function draw() {
  background(0);
  
  // Accelerate the view
  speed = min(speed + acceleration, maxSpeed);
  
  // Move camera along z-axis (tunnel effect)
  translate(0, 0, -speed);
  
  // Draw crystal structures
  for (let i = 0; i < crystalStructures.length; i++) {
    push();
    translate(crystalStructures[i].x, crystalStructures[i].y, crystalStructures[i].z);
    rotateX(crystalStructures[i].rotationX);
    rotateY(crystalStructures[i].rotationY);
    
    // Draw a simple crystalline structure using box
    fill(crystalStructures[i].color);
    box(crystalStructures[i].size);
    
    pop();
  }
  
  // Draw particles (molecular shards)
  for (let i = 0; i < particles.length; i++) {
    push();
    translate(particles[i].x, particles[i].y, particles[i].z);
    fill(particles[i].color);
    sphere(particles[i].size);  // Each particle is a sphere
    pop();
  }
  
  // Occasionally fracture crystals and scatter shards
  if (frameCount % 100 === 0) {
    for (let i = 0; i < crystalStructures.length; i++) {
      if (random() > 0.7) {
        // Create some scattered particles when a crystal fractures
        for (let j = 0; j < 5; j++) {
          particles.push({
            x: crystalStructures[i].x + random(-30, 30),
            y: crystalStructures[i].y + random(-30, 30),
            z: crystalStructures[i].z,
            size: random(1, 3),
            color: color(random(200, 255), random(100, 200), random(200, 255), 200)
          });
        }
      }
    }
  }
  
  // Update particles' z position to simulate movement
  for (let i = 0; i < particles.length; i++) {
    particles[i].z += speed;
    
    // Reset particles that have passed the view
    if (particles[i].z > 0) {
      particles[i].z = random(-1000, -100);
      particles[i].x = random(-width/2, width/2);
      particles[i].y = random(-height/2, height/2);
    }
  }
  
  // Update crystal structures' z position
  for (let i = 0; i < crystalStructures.length; i++) {
    crystalStructures[i].z += speed;
    
    // Reset crystals that have passed the view
    if (crystalStructures[i].z > 0) {
      crystalStructures[i].z = random(-1000, -100);
      crystalStructures[i].x = random(-width/2, width/2);
      crystalStructures[i].y = random(-height/2, height/2);
    }
    
    // Occasionally rotate crystals
    if (frameCount % 30 === 0) {
      crystalStructures[i].rotationX += random(-0.1, 0.1);
      crystalStructures[i].rotationY += random(-0.1, 0.1);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
