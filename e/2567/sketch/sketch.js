let gratings = [];
let particles = [];
let time = 0;

function setup() {
  createCanvas(800, 600, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create diffraction grating rods
  for (let i = 0; i < 150; i++) {
    const angle = random(TWO_PI);
    const radius = random(100, 300);
    const x = cos(angle) * radius;
    const y = sin(angle) * radius;
    const z = random(-200, 200);
    
    gratings.push({
      x: x,
      y: y,
      z: z,
      angle: angle,
      length: random(30, 80),
      thickness: random(1, 3),
      color: color(random(360), 80, 90)
    });
  }
  
  // Create light particles
  for (let i = 0; i < 300; i++) {
    const angle = random(TWO_PI);
    const radius = random(100, 300);
    const x = cos(angle) * radius;
    const y = sin(angle) * radius;
    const z = random(-200, 200);
    
    particles.push({
      x: x,
      y: y,
      z: z,
      vx: random(-1, 1),
      vy: random(-1, 1),
      vz: random(-1, 1),
      size: random(1, 3),
      hue: random(360),
      life: random(100, 200)
    });
  }
}

function draw() {
  background(0);
  time += 0.01;
  
  // Camera movement
  rotateX(time * 0.05);
  rotateY(time * 0.03);
  
  // Draw gratings
  for (let grating of gratings) {
    push();
    translate(grating.x, grating.y, grating.z);
    rotateZ(grating.angle);
    
    noStroke();
    fill(grating.color);
    rectMode(CENTER);
    rect(0, 0, grating.length, grating.thickness);
    
    pop();
  }
  
  // Draw particles as points (batched)
  beginShape(POINTS);
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    
    // Update position
    p.x += p.vx;
    p.y += p.vy;
    p.z += p.vz;
    
    // Bounce off boundaries
    if (abs(p.x) > 400 || abs(p.y) > 300 || abs(p.z) > 300) {
      p.vx *= -1;
      p.vy *= -1;
      p.vz *= -1;
    }
    
    // Update life
    p.life--;
    
    if (p.life <= 0) {
      // Respawn particle
      const angle = random(TWO_PI);
      const radius = random(100, 300);
      p.x = cos(angle) * radius;
      p.y = sin(angle) * radius;
      p.z = random(-200, 200);
      p.vx = random(-1, 1);
      p.vy = random(-1, 1);
      p.vz = random(-1, 1);
      p.life = random(100, 200);
    }
    
    // Set point color and position
    fill(p.hue, 80, 90, 0.7);
    vertex(p.x, p.y, p.z);
  }
  endShape();
  
  // Create interference patterns using a spatial hash approach (capped connections)
  const maxConnections = 200;
  let connectionCount = 0;
  
  beginShape(LINES);
  for (let i = 0; i < gratings.length && connectionCount < maxConnections; i++) {
    for (let j = i + 1; j < gratings.length && connectionCount < maxConnections; j++) {
      const g1 = gratings[i];
      const g2 = gratings[j];
      
      const dx = g1.x - g2.x;
      const dy = g1.y - g2.y;
      const dz = g1.z - g2.z;
      const distance = sqrt(dx * dx + dy * dy + dz * dz);
      
      // Only connect if close enough
      if (distance < 100) {
        const opacity = map(distance, 0, 100, 0.5, 0);
        
        stroke(255, 100, 100, opacity);
        vertex(g1.x, g1.y, g1.z);
        vertex(g2.x, g2.y, g2.z);
        connectionCount += 1;
      }
    }
  }
  endShape();
}
