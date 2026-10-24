let fibers = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(RADIANS);
  
  // Create organic fiber patterns with varying complexity
  for (let i = 0; i < 200; i++) {
    fibers.push({
      center: { x: random(width), y: random(height) },
      radius: random(50, 200),
      speed: random(0.001, 0.005),
      phase: random(TWO_PI),
      segments: floor(random(3, 8)),
      color: color(
        random(100, 180), 
        random(60, 120), 
        random(20, 80), 
        random(150, 200)
      ),
      highlight: color(
        random(220, 255), 
        random(200, 255), 
        random(150, 200), 
        random(100, 150)
      )
    });
  }
}

function draw() {
  background(15, 25, 45);
  
  // Draw interwoven fiber patterns
  for (let i = 0; i < fibers.length; i++) {
    const fiber = fibers[i];
    const time = frameCount * fiber.speed;
    
    // Main fiber structure
    push();
    translate(fiber.center.x, fiber.center.y);
    rotate(time + fiber.phase);
    
    fill(fiber.color);
    noStroke();
    beginShape();
    for (let j = 0; j < fiber.segments; j++) {
      const angle = TWO_PI / fiber.segments * j;
      const x = cos(angle) * fiber.radius;
      const y = sin(angle) * fiber.radius;
      vertex(x, y);
    }
    endShape(CLOSE);
    
    // Highlight edges for organic feel
    fill(fiber.highlight);
    beginShape();
    for (let j = 0; j < fiber.segments; j++) {
      const angle = TWO_PI / fiber.segments * j;
      const x = cos(angle) * fiber.radius * 0.7;
      const y = sin(angle) * fiber.radius * 0.7;
      vertex(x, y);
    }
    endShape(CLOSE);
    
    pop();
    
    // Add pulsating effect
    const pulse = sin(time * 2) * 0.1 + 0.95;
    push();
    translate(fiber.center.x, fiber.center.y);
    rotate(time + fiber.phase);
    
    fill(255, 30);
    noStroke();
    beginShape();
    for (let j = 0; j < fiber.segments; j++) {
      const angle = TWO_PI / fiber.segments * j;
      const x = cos(angle) * fiber.radius * pulse;
      const y = sin(angle) * fiber.radius * pulse;
      vertex(x, y);
    }
    endShape(CLOSE);
    
    pop();
  }
  
  // Add subtle background texture
  for (let i = 0; i < 50; i++) {
    const x = (frameCount * 0.1 + i * 23) % width;
    const y = (frameCount * 0.05 + i * 47) % height;
    const size = sin(frameCount * 0.01 + i) * 2 + 3;
    
    fill(255, 20);
    noStroke();
    ellipse(x, y, size, size);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
