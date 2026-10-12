let lines = [];
let maxLines = 800;
let noiseScale = 0.005;
let noiseStrength = 2;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize lines with random positions and directions
  for (let i = 0; i < maxLines; i++) {
    lines.push({
      x: random(width),
      y: random(height),
      angle: random(TWO_PI),
      speed: random(0.5, 2.0),
      life: random(300, 800),
      age: 0,
      hue: random(180, 240),
      segmentLength: random(10, 30)
    });
  }
}

function draw() {
  background(0, 0, 5, 0.05);
  
  time += 0.01;
  
  // Draw and update lines
  for (let i = 0; i < lines.length; i++) {
    let l = lines[i];
    
    // Update position based on angle and speed
    l.x += cos(l.angle) * l.speed;
    l.y += sin(l.angle) * l.speed;
    
    // Add noise to direction for organic movement
    l.angle += (noise(l.x * noiseScale, l.y * noiseScale, time) - 0.5) * noiseStrength;
    
    // Age the line
    l.age++;
    
    // Reset line if it's too old or out of bounds
    if (l.age > l.life || 
        l.x < -100 || l.x > width + 100 || 
        l.y < -100 || l.y > height + 100) {
      l.x = random(width);
      l.y = random(height);
      l.angle = random(TWO_PI);
      l.age = 0;
      l.life = random(300, 800);
      l.segmentLength = random(10, 30);
    }
    
    // Draw the line segment
    stroke(l.hue, 80, 90, 0.7);
    strokeWeight(0.5);
    line(l.x, l.y, l.x + cos(l.angle) * l.segmentLength, l.y + sin(l.angle) * l.segmentLength);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
