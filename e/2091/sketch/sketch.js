let particles = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 255);
  
  // Create particles for the geometric field
  for (let i = 0; i < 300; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      size: random(5, 30),
      hue: random(255),
      saturation: random(150, 255),
      brightness: random(150, 255),
      speedX: random(-0.5, 0.5),
      speedY: random(-0.5, 0.5),
      rotation: random(TWO_PI),
      rotationSpeed: random(-0.02, 0.02),
      pulse: random(TWO_PI),
      pulseSpeed: random(0.01, 0.03),
      segmentCount: floor(random(3, 8)),
      distortion: random(1)
    });
  }
}

function draw() {
  time++;
  
  // Semi-transparent background for trail effect
  background(20, 10, 95, 30);
  
  // Draw all particles as dynamic geometric shapes
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    // Update particle properties
    p.x += p.speedX;
    p.y += p.speedY;
    p.rotation += p.rotationSpeed;
    p.pulse += p.pulseSpeed;
    
    // Bounce off edges
    if (p.x < 0 || p.x > width) p.speedX *= -1;
    if (p.y < 0 || p.y > height) p.speedY *= -1;
    
    // Apply pulse effect to size and distortion
    let pulseSize = sin(p.pulse) * 0.5 + 1;
    let finalSize = p.size * pulseSize;
    
    // Draw the shape
    push();
    translate(p.x, p.y);
    rotate(p.rotation);
    
    fill(p.hue, p.saturation, p.brightness, 200);
    noStroke();
    
    beginShape();
    for (let j = 0; j < p.segmentCount; j++) {
      let angle = map(j, 0, p.segmentCount, 0, TWO_PI) + p.distortion * sin(time * 0.01 + j);
      let x = cos(angle) * finalSize;
      let y = sin(angle) * finalSize;
      vertex(x, y);
    }
    endShape(CLOSE);
    
    // Add inner pattern
    fill(255, 50);
    beginShape();
    for (let j = 0; j < p.segmentCount; j++) {
      let angle = map(j, 0, p.segmentCount, 0, TWO_PI) + PI / p.segmentCount + p.distortion * cos(time * 0.01 + j);
      let x = cos(angle) * finalSize * 0.4;
      let y = sin(angle) * finalSize * 0.4;
      vertex(x, y);
    }
    endShape(CLOSE);
    
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
