let colors = [];
let waves = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Create a palette of rich, saturated colors
  colors = [
    color(255, 0, 0, 200),    // Red
    color(0, 255, 0, 200),    // Green
    color(0, 0, 255, 200),    // Blue
    color(255, 255, 0, 200),  // Yellow
    color(255, 0, 255, 200),  // Magenta
    color(0, 255, 255, 200),  // Cyan
    color(255, 128, 0, 200),  // Orange
    color(128, 0, 255, 200)   // Purple
  ];
  
  // Initialize wave parameters
  waves = [];
  for (let i = 0; i < 5; i++) {
    waves.push({
      amplitude: random(20, 60),
      frequency: random(0.005, 0.02),
      speed: random(0.001, 0.005),
      phase: random(TWO_PI)
    });
  }
}

function draw() {
  background(0);
  
  // Draw color planes
  for (let i = 0; i < colors.length; i++) {
    let c = colors[i];
    
    // Create a smooth, flowing effect by using sine waves
    beginShape();
    for (let x = 0; x <= width; x += 20) {
      let y = height / 2;
      
      // Apply multiple wave functions to create complex movement
      for (let j = 0; j < waves.length; j++) {
        let wave = waves[j];
        y += sin((x * wave.frequency) + (frameCount * wave.speed) + wave.phase) * wave.amplitude;
      }
      
      // Add a bit of randomness to make it less mechanical
      y += sin(x * 0.01 + frameCount * 0.01) * 5;
      
      vertex(x, y);
    }
    
    // Close the shape and add some vertical offset for layering
    vertex(width, height);
    vertex(0, height);
    endShape(CLOSE);
    
    // Set fill with a slight transparency to allow blending
    fill(red(c), green(c), blue(c), 150);
  }
  
  // Add subtle color shifts over time
  for (let i = 0; i < colors.length; i++) {
    let c = colors[i];
    let shift = sin(frameCount * 0.002 + i) * 20;
    colors[i] = color(
      constrain(red(c) + shift, 0, 255),
      constrain(green(c) + shift, 0, 255),
      constrain(blue(c) + shift, 0, 255),
      200
    );
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
