let structures = [];
let mineralGrid = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create cellular structures - fixed count for stability
  for (let i = 0; i < 80; i++) {
    structures.push({
      x: random(width),
      y: random(height),
      size: random(20, 80),
      segments: floor(random(5, 12)),
      hue: random(20, 40), // Earth tones
      saturation: random(30, 60),
      brightness: random(40, 70),
      age: 0,
      stability: random(0.95, 0.99)
    });
  }
  
  // Create mineral grid - fixed count for stability
  let gridSize = 120;
  for (let x = 0; x < width; x += gridSize) {
    for (let y = 0; y < height; y += gridSize) {
      if (random() > 0.3) { // Sparse mineral deposits
        mineralGrid.push({
          x: x + random(-20, 20),
          y: y + random(-20, 20),
          size: random(5, 25),
          hue: random(10, 30), // Warm earth tones
          saturation: random(20, 40),
          brightness: random(30, 60)
        });
      }
    }
  }
  
  // Ensure no animation by setting frameRate to very low or using noLoop()
  noLoop();
}

function draw() {
  background(0, 0, 5, 0.1); // Very subtle fade for stillness
  
  // Draw mineral deposits
  noStroke();
  for (let m of mineralGrid) {
    fill(m.hue, m.saturation, m.brightness, 0.8);
    ellipse(m.x, m.y, m.size);
  }
  
  // Draw cellular structures
  noStroke();
  for (let s of structures) {
    // Very slow growth - but since we're not animating, this is just for visual effect
    let growth = s.size * 0.0001;
    s.size += growth;
    
    // Draw cell-like structure with organic segments
    push();
    translate(s.x, s.y);
    
    fill(s.hue, s.saturation, s.brightness, 0.7);
    beginShape();
    for (let i = 0; i < s.segments; i++) {
      let angle = TWO_PI * i / s.segments;
      let radius = s.size * (0.8 + 0.2 * sin(s.age * 0.01 + i));
      let x = radius * cos(angle);
      let y = radius * sin(angle);
      vertex(x, y);
    }
    endShape(CLOSE);
    
    // Draw internal details
    fill(s.hue + 5, s.saturation - 10, s.brightness - 10, 0.5);
    beginShape();
    for (let i = 0; i < s.segments; i++) {
      let angle = TWO_PI * i / s.segments;
      let radius = s.size * 0.4 * (0.9 + 0.1 * cos(s.age * 0.02 + i));
      let x = radius * cos(angle);
      let y = radius * sin(angle);
      vertex(x, y);
    }
    endShape(CLOSE);
    
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
