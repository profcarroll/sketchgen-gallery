let magmaParticles = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Create magma particles that will form the lava flow
  for (let i = 0; i < 1500; i++) {
    let x = random(width);
    let y = random(height);
    let size = random(2, 8);
    let speed = random(0.001, 0.003);
    let angle = random(TWO_PI);
    magmaParticles.push({
      x: x,
      y: y,
      size: size,
      speed: speed,
      angle: angle,
      baseSize: size
    });
  }
}

function draw() {
  // Background is dark to simulate subterranean environment
  background(20, 10, 30);
  
  time += 0.01;
  
  // Draw the pulsating lava flow
  for (let i = 0; i < magmaParticles.length; i++) {
    let p = magmaParticles[i];
    
    // Update position with a slow wave motion
    p.x += cos(p.angle) * p.speed * 20;
    p.y += sin(p.angle) * p.speed * 20;
    
    // Pulsating effect using sine wave for size and color
    let pulse = sin(time + i * 0.01) * 0.3 + 0.7;
    let size = p.baseSize * pulse;
    
    // Create glowing colors from red to orange
    let hue = map(sin(time * 0.5 + i * 0.02), -1, 1, 0, 30);
    let saturation = 100;
    let brightness = map(size, 2, 8, 80, 100) * pulse;
    
    fill(hue, saturation, brightness);
    
    // Draw the particle
    ellipse(p.x, p.y, size, size);
    
    // Reset position if out of bounds
    if (p.x < -50 || p.x > width + 50 || p.y < -50 || p.y > height + 50) {
      p.x = random(width);
      p.y = random(height);
    }
  }
  
  // Add a central glowing core to emphasize the lava flow
  let corePulse = sin(time * 2) * 0.3 + 0.7;
  fill(255, 100, 100);
  ellipse(width/2, height/2, 100 * corePulse, 100 * corePulse);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
