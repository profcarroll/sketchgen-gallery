let particles = [];
let connections = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize particles in a spherical pattern
  for (let i = 0; i < 300; i++) {
    const theta = random(TWO_PI);
    const phi = random(PI);
    const r = random(100, 300);
    
    particles.push({
      x: r * sin(phi) * cos(theta),
      y: r * sin(phi) * sin(theta),
      z: r * cos(phi),
      size: random(2, 6),
      speed: random(0.01, 0.03),
      hue: random(360),
      phase: random(TWO_PI)
    });
  }
}

function draw() {
  background(0);
  time += 0.01;
  
  // Camera movement
  rotateY(time * 0.05);
  rotateX(sin(time * 0.1) * 0.05);
  
  // Create central vortex effect
  push();
  noFill();
  stroke(200, 100, 80, 0.5);
  strokeWeight(1);
  for (let i = 0; i < 5; i++) {
    beginShape();
    for (let a = 0; a < TWO_PI; a += 0.1) {
      const r = 30 + 10 * sin(time * 3 + a * 5);
      const x = r * cos(a + time * 0.5);
      const y = r * sin(a + time * 0.5);
      const z = 30 * sin(time * 2 + a);
      vertex(x, y, z);
    }
    endShape(CLOSE);
  }
  pop();
  
  // Draw all particles as points
  noStroke();
  beginShape(POINTS);
  for (let p of particles) {
    const brightness = 50 + 50 * sin(time * 2 + p.phase);
    const saturation = 80 + 20 * cos(time * 1.5 + p.phase);
    fill(p.hue, saturation, brightness, 0.7);
    
    // Update particle position based on interference
    const px = p.x + sin(time * p.speed + p.phase) * 3;
    const py = p.y + cos(time * p.speed + p.phase) * 3;
    const pz = p.z + sin(time * p.speed * 0.7 + p.phase) * 2;
    
    vertex(px, py, pz);
  }
  endShape();
  
  // Draw connections between nearby particles
  noFill();
  strokeWeight(0.5);
  beginShape(LINES);
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const p1 = particles[i];
      const p2 = particles[j];
      
      const dx = p1.x - p2.x;
      const dy = p1.y - p2.y;
      const dz = p1.z - p2.z;
      const distance = sqrt(dx * dx + dy * dy + dz * dz);
      
      if (distance < 100) {
        const brightness = 50 + 50 * sin(time * 2 + p1.phase);
        const saturation = 80 + 20 * cos(time * 1.5 + p1.phase);
        stroke(p1.hue, saturation, brightness, 0.3);
        
        vertex(p1.x, p1.y, p1.z);
        vertex(p2.x, p2.y, p2.z);
      }
    }
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
