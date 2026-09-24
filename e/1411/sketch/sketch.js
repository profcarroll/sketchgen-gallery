let lavaParticles = [];
let smokeParticles = [];
let crater;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create the crater
  crater = {
    x: width/2,
    y: height/3,
    radius: 50
  };
  
  // Initialize lava particles
  for (let i = 0; i < 800; i++) {
    lavaParticles.push({
      x: crater.x + random(-crater.radius, crater.radius),
      y: crater.y + random(-crater.radius, crater.radius),
      z: 0,
      size: random(2, 6),
      speed: random(0.5, 1.5),
      hue: random(10, 30), // Orange to red
      life: random(100, 200)
    });
  }
  
  // Initialize smoke particles
  for (let i = 0; i < 400; i++) {
    smokeParticles.push({
      x: crater.x + random(-crater.radius, crater.radius),
      y: crater.y + random(-crater.radius, crater.radius),
      z: 0,
      size: random(2, 8),
      speed: random(0.1, 0.8),
      life: random(50, 150)
    });
  }
}

function draw() {
  background(0, 0, 0);
  
  // Draw mountain silhouette
  push();
  translate(0, height/4, 0);
  rotateX(PI/3);
  noStroke();
  fill(0, 0, 10);
  sphere(width/2);
  pop();
  
  // Update and display lava particles using batched drawing
  beginShape(POINTS);
  for (let i = lavaParticles.length - 1; i >= 0; i--) {
    let p = lavaParticles[i];
    
    // Move particle downward with some horizontal drift
    p.y += p.speed;
    p.x += random(-0.3, 0.3);
    
    // Apply gravity and friction
    p.z *= 0.98;
    
    // Decrease life
    p.life--;
    
    if (p.life <= 0) {
      // Replace dead particle
      lavaParticles.splice(i, 1);
      lavaParticles.push({
        x: crater.x + random(-crater.radius, crater.radius),
        y: crater.y + random(-crater.radius, crater.radius),
        z: 0,
        size: random(2, 6),
        speed: random(0.5, 1.5),
        hue: random(10, 30),
        life: random(100, 200)
      });
    } else {
      // Set vertex properties
      fill(p.hue, 100, 100, 0.8);
      vertex(p.x, p.y, p.z);
    }
  }
  endShape();
  
  // Update and display smoke particles using batched drawing
  beginShape(POINTS);
  for (let i = smokeParticles.length - 1; i >= 0; i--) {
    let p = smokeParticles[i];
    
    // Move particle upward with some horizontal drift
    p.y -= p.speed;
    p.x += random(-0.2, 0.2);
    
    // Increase size over time
    p.size *= 1.02;
    
    // Decrease life
    p.life--;
    
    if (p.life <= 0) {
      // Replace dead particle
      smokeParticles.splice(i, 1);
      smokeParticles.push({
        x: crater.x + random(-crater.radius, crater.radius),
        y: crater.y + random(-crater.radius, crater.radius),
        z: 0,
        size: random(2, 8),
        speed: random(0.1, 0.8),
        life: random(50, 150)
      });
    } else {
      // Set vertex properties
      fill(0, 0, 0, 0.3);
      vertex(p.x, p.y, p.z);
    }
  }
  endShape();
  
  // Add some continuous lava flow effect
  for (let i = 0; i < 15; i++) {
    let x = crater.x + random(-crater.radius, crater.radius);
    let y = crater.y + random(-crater.radius, crater.radius);
    
    push();
    translate(x, y, 0);
    noStroke();
    fill(random(10, 30), 100, 100, 0.8);
    sphere(random(2, 5));
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
