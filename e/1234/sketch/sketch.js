let planes = [];
let waves = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Create overlapping planes with rich colors
  for (let i = 0; i < 8; i++) {
    planes.push({
      y: random(height),
      height: random(50, 200),
      color: color(random(100, 255), random(100, 255), random(100, 255), 200),
      speed: random(0.001, 0.005)
    });
  }
  
  // Initialize wave patterns
  for (let i = 0; i < 20; i++) {
    waves.push({
      y: random(height),
      amplitude: random(10, 50),
      frequency: random(0.01, 0.03),
      speed: random(0.002, 0.008),
      phase: random(TWO_PI)
    });
  }
}

function draw() {
  background(0);
  
  // Update and draw waves
  for (let i = 0; i < waves.length; i++) {
    let wave = waves[i];
    wave.phase += wave.speed;
    
    // Draw wave as a series of horizontal bands
    fill(wave.color || 255, 100);
    noStroke();
    
    beginShape();
    for (let x = 0; x <= width; x += 10) {
      let y = wave.y + sin(frameCount * wave.speed + x * wave.frequency + wave.phase) * wave.amplitude;
      vertex(x, y);
    }
    vertex(width, height);
    vertex(0, height);
    endShape(CLOSE);
  }
  
  // Draw colored planes
  for (let i = 0; i < planes.length; i++) {
    let plane = planes[i];
    plane.y += plane.speed;
    
    // Reset plane if it goes off screen
    if (plane.y > height + plane.height) {
      plane.y = -plane.height;
    }
    
    fill(plane.color);
    rect(0, plane.y, width, plane.height);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
