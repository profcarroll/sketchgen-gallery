let waves = [];
let colorPalette = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Create a rich, saturated color palette
  colorPalette = [
    color(139, 0, 0),    // Dark red
    color(128, 0, 128),  // Purple
    color(0, 0, 139),    // Dark blue
    color(0, 100, 0),    // Dark green
    color(255, 140, 0),  // Dark orange
    color(75, 0, 130),   // Indigo
    color(139, 69, 19),  // Saddle brown
    color(0, 139, 139),  // Dark cyan
  ];
  
  // Initialize waves
  for (let i = 0; i < 5; i++) {
    waves.push({
      y: random(height),
      speed: random(0.002, 0.008),
      amplitude: random(10, 50),
      frequency: random(0.005, 0.02),
      color: random(colorPalette)
    });
  }
}

function draw() {
  background(0);
  
  // Draw overlapping planes with wave formations
  for (let i = 0; i < waves.length; i++) {
    let wave = waves[i];
    
    // Update wave parameters
    wave.y += wave.speed;
    if (wave.y > height + 100) wave.y = -100;
    
    // Draw the wave plane
    fill(wave.color);
    noStroke();
    
    beginShape();
    for (let x = 0; x <= width; x += 5) {
      let y = wave.y + sin(frameCount * wave.frequency + x * 0.01) * wave.amplitude;
      vertex(x, y);
    }
    vertex(width, height);
    vertex(0, height);
    endShape(CLOSE);
    
    // Add a second wave layer for more depth
    fill(red(wave.color), green(wave.color), blue(wave.color), 80);
    beginShape();
    for (let x = 0; x <= width; x += 5) {
      let y = wave.y + sin(frameCount * wave.frequency * 1.3 + x * 0.015) * wave.amplitude * 0.7;
      vertex(x, y);
    }
    vertex(width, height);
    vertex(0, height);
    endShape(CLOSE);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
