let circuits = [];
let flashIntensity = 0;
let pulseSpeed = 0.05;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Create circuit paths
  for (let i = 0; i < 200; i++) {
    circuits.push({
      x: random(width),
      y: random(height),
      size: random(100, 300),
      angle: random(TWO_PI),
      speed: random(0.005, 0.02),
      segments: floor(random(3, 8)),
      color: color(random(100, 255), random(100, 255), random(100, 255), 200),
      pulseOffset: random(TWO_PI)
    });
  }
}

function draw() {
  // Dark background with subtle glow
  background(10, 15, 30);
  
  // Update flash intensity for rhythmic pulsing
  flashIntensity = sin(frameCount * pulseSpeed) * 0.5 + 0.5;
  
  // Draw circuit paths
  for (let circuit of circuits) {
    // Update position with gentle movement
    circuit.x += sin(circuit.angle) * circuit.speed * 10;
    circuit.y += cos(circuit.angle) * circuit.speed * 10;
    
    // Reset if out of bounds
    if (circuit.x < -50 || circuit.x > width + 50 || 
        circuit.y < -50 || circuit.y > height + 50) {
      circuit.x = random(width);
      circuit.y = random(height);
      circuit.angle = random(TWO_PI);
    }
    
    // Create glowing circuit path
    let pulse = sin(frameCount * pulseSpeed + circuit.pulseOffset) * 0.3 + 0.7;
    let alpha = map(circuit.size, 100, 300, 100, 255);
    
    // Draw circuit segments with pulsing glow
    stroke(red(circuit.color), green(circuit.color), blue(circuit.color), alpha * pulse);
    strokeWeight(map(circuit.size, 100, 300, 2, 6) * pulse);
    noFill();
    
    beginShape();
    for (let i = 0; i < circuit.segments; i++) {
      let angle = circuit.angle + i * TWO_PI / circuit.segments;
      let radius = circuit.size * 0.5 + sin(frameCount * 0.02 + angle) * circuit.size * 0.1;
      let x = circuit.x + cos(angle) * radius;
      let y = circuit.y + sin(angle) * radius;
      vertex(x, y);
    }
    endShape(CLOSE);
    
    // Add sharp geometric flashes
    if (frameCount % 15 === 0) {
      let flashAlpha = map(circuit.size, 100, 300, 100, 255);
      fill(red(circuit.color), green(circuit.color), blue(circuit.color), flashAlpha * flashIntensity);
      noStroke();
      
      // Draw a small flash at random segment
      let flashSegment = floor(random(circuit.segments));
      let angle = circuit.angle + flashSegment * TWO_PI / circuit.segments;
      let radius = circuit.size * 0.5;
      let x = circuit.x + cos(angle) * radius;
      let y = circuit.y + sin(angle) * radius;
      
      ellipse(x, y, circuit.size * 0.1, circuit.size * 0.1);
    }
  }
  
  // Add neon grid overlay
  stroke(255, 255, 255, 20);
  strokeWeight(0.5);
  for (let i = 0; i < width; i += 40) {
    line(i, 0, i, height);
  }
  for (let j = 0; j < height; j += 40) {
    line(0, j, width, j);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
