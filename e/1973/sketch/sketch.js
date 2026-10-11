let currents = [];
const numCurrents = 8;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Initialize oceanic currents with varying properties
  for (let i = 0; i < numCurrents; i++) {
    currents.push({
      y: map(i, 0, numCurrents - 1, 0, height),
      amplitude: random(20, 60),
      frequency: random(0.002, 0.01),
      speed: random(0.001, 0.005),
      color: color(random(30, 80), random(100, 180), random(200, 255), 120),
      phase: random(TWO_PI)
    });
  }
}

function draw() {
  background(10, 20, 40);
  
  time += 0.01;
  
  // Draw sweeping oceanic currents
  for (let i = 0; i < currents.length; i++) {
    const current = currents[i];
    
    // Create flowing pattern with sine waves
    fill(current.color);
    beginShape();
    for (let x = 0; x <= width; x += 10) {
      // Base wave motion
      let y = current.y + 
              sin(x * current.frequency + time * current.speed + current.phase) * current.amplitude +
              sin(x * current.frequency * 0.5 + time * current.speed * 1.2 + current.phase * 0.7) * (current.amplitude * 0.5);
      
      // Add slow pulsing to simulate energy differentials
      y += sin(time * 0.003 + i * 0.5) * 10;
      
      vertex(x, y);
    }
    vertex(width, height);
    vertex(0, height);
    endShape(CLOSE);
  }
  
  // Add subtle atmospheric pressure zones that pulse
  if (frameCount % 60 === 0) {
    const pressureY = height * 0.4;
    fill(255, 30);
    rect(0, pressureY - 10, width, 20);
    
    const pressureY2 = height * 0.7;
    fill(255, 20);
    rect(0, pressureY2 - 15, width, 30);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
