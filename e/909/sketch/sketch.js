let planes = [];
const numPlanes = 8;
const waveSpeed = 0.02;
const waveFrequency = 0.05;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);

  // Create planes with varying colors and properties
  for (let i = 0; i < numPlanes; i++) {
    planes.push({
      y: random(height),
      speed: random(0.005, 0.02),
      frequency: random(0.01, 0.05),
      hue: random(360),
      saturation: random(70, 100),
      brightness: random(50, 90)
    });
  }
}

function draw() {
  background(0, 0, 0);

  // Draw each animated plane
  for (let i = 0; i < planes.length; i++) {
    const plane = planes[i];
    
    // Update wave parameters
    plane.y += plane.speed;
    
    // Create a wave effect across the canvas
    const time = millis() * waveSpeed;
    const waveOffset = sin(time + plane.y * plane.frequency) * 20;
    
    // Draw the animated plane with color shifting
    fill(plane.hue, plane.saturation, plane.brightness, 0.8);
    noStroke();
    
    beginShape();
    for (let x = 0; x <= width; x += 10) {
      const y = plane.y + sin(x * waveFrequency + time) * 30 + waveOffset;
      vertex(x, y);
    }
    vertex(width, height);
    vertex(0, height);
    endShape(CLOSE);
    
    // Shift hue over time for color pulsing
    plane.hue = (plane.hue + 0.2) % 360;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
