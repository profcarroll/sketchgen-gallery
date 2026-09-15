let waves = [];
let pyramids = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Initialize water ripples
  for (let i = 0; i < 100; i++) {
    waves.push({
      x: random(width),
      y: random(height),
      size: random(20, 100),
      speed: random(0.005, 0.02),
      phase: random(TWO_PI)
    });
  }
  
  // Initialize pyramids
  for (let i = 0; i < 8; i++) {
    pyramids.push({
      x: random(width),
      y: height - 100,
      size: random(30, 80),
      height: random(100, 200),
      color: color(random(100, 255), random(100, 255), random(200, 255), 200)
    });
  }
}

function draw() {
  background(0);
  
  time += 0.01;
  
  // Draw liquid landscape with dynamic ripples
  noStroke();
  for (let wave of waves) {
    wave.phase += wave.speed;
    let rippleSize = wave.size + sin(time + wave.phase) * 20;
    
    // Create a translucent ripple effect
    fill(50, 150, 255, 30);
    ellipse(wave.x, wave.y, rippleSize * 2, rippleSize);
    
    // Add bioluminescent pattern underneath
    let pattern = noise(wave.x * 0.01, wave.y * 0.01, time * 0.5) * 255;
    fill(0, 200, 255, pattern * 0.3);
    ellipse(wave.x, wave.y, rippleSize, rippleSize * 0.8);
  }
  
  // Draw pyramidal architecture
  for (let pyramid of pyramids) {
    push();
    translate(pyramid.x, pyramid.y);
    
    // Draw pyramid with gradient
    fill(pyramid.color);
    stroke(255, 200);
    strokeWeight(1);
    
    // Pyramid shape
    beginShape();
    vertex(0, -pyramid.height);
    vertex(-pyramid.size, pyramid.size);
    vertex(pyramid.size, pyramid.size);
    endShape(CLOSE);
    
    // Add some internal structure
    fill(255, 200);
    stroke(255);
    strokeWeight(1);
    line(-pyramid.size, pyramid.size, 0, -pyramid.height);
    line(pyramid.size, pyramid.size, 0, -pyramid.height);
    
    pop();
  }
  
  // Add floating particles for bioluminescence
  for (let i = 0; i < 50; i++) {
    let x = (time * 20 + i * 30) % width;
    let y = height - 100 + sin(time + i) * 30;
    let size = sin(time + i) * 2 + 3;
    
    noStroke();
    fill(0, 255, 255, 150);
    ellipse(x, y, size, size);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
