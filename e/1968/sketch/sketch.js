let lines = [];
let maxLines = 1500;
let noiseScale = 0.01;
let noiseStrength = 3;
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
      speed: random(0.2, 1.5),
      life: random(200, 600),
      age: 0,
      hue: random(180, 240)
    });
  }
}

function draw() {
  background(0, 0, 10);
  
  time += 0.005;
  
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
      l.life = random(200, 600);
    }
    
    // Draw the line segment
    stroke(l.hue, 70, 85, 0.6);
    strokeWeight(0.3);
    line(l.x, l.y, l.x + cos(l.angle) * 15, l.y + sin(l.angle) * 15);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
