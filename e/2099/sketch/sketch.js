let particles = [];
let time = 0;
let cameraAngle = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  
  // Create particles in a ring structure
  for (let i = 0; i < 2000; i++) {
    let angle = random(TWO_PI);
    let radius = 150 + random(100);
    let height = random(-30, 30);
    let size = random(0.5, 2);
    
    particles.push({
      angle: angle,
      radius: radius,
      height: height,
      size: size,
      baseRadius: radius,
      phase: random(TWO_PI),
      speed: random(0.001, 0.005),
      color: [
        map(radius, 100, 300, 200, 255),
        map(radius, 100, 300, 150, 200),
        map(radius, 100, 300, 100, 150),
        200
      ]
    });
  }
}

function draw() {
  background(0);
  
  // Dynamic camera movement
  cameraAngle += 0.002;
  let camX = sin(cameraAngle) * 500;
  let camY = cos(cameraAngle * 0.7) * 300;
  let camZ = sin(cameraAngle * 0.3) * 400;
  
  camera(camX, camY, camZ, 0, 0, 0, 0, 1, 0);
  
  // Lighting
  pointLight(255, 255, 255, 0, -300, 0);
  ambientLight(50);
  
  time += 1;
  
  // Batch all particles into one shape for performance
  beginShape(POINTS);
  for (let p of particles) {
    // Update particle position
    p.angle += p.speed + sin(time * 0.001 + p.phase) * 0.002;
    p.radius = p.baseRadius + sin(time * 0.002 + p.phase) * 20;
    
    let x = cos(p.angle) * p.radius;
    let y = sin(p.angle) * p.radius;
    let z = p.height + sin(p.angle * 0.5 + time * 0.001) * 10;
    
    // Set color and vertex
    fill(p.color[0], p.color[1], p.color[2], p.color[3]);
    vertex(x, y, z);
  }
  endShape();
  
  // Add resonance effects periodically
  if (frameCount % 60 === 0) {
    let burstRadius = map(sin(time * 0.01), -1, 1, 50, 200);
    push();
    noFill();
    stroke(255, 100, 100, 100);
    sphere(burstRadius);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
