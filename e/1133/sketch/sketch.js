let waveform = [];
let step = 0;
const waveCount = 1000;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 255);
  noStroke();
  
  // Initialize waveform with sine wave pattern
  for (let i = 0; i < waveCount; i++) {
    const x = map(i, 0, waveCount - 1, 0, width);
    const y = height / 2 + sin(i * 0.1) * 50;
    waveform.push({x, y});
  }
}

function draw() {
  background(0);
  
  // Shift the waveform to create scrolling effect
  for (let i = 0; i < waveform.length; i++) {
    waveform[i].x -= 2;
    
    // Reset position when it goes off screen
    if (waveform[i].x < -10) {
      waveform[i].x = width + 10;
    }
  }
  
  // Draw the neon line with glowing effect
  beginShape();
  for (let i = 0; i < waveform.length; i++) {
    const point = waveform[i];
    
    // Create a pulsing glow effect
    const pulse = sin(frameCount * 0.05 + i * 0.1) * 20;
    const brightness = 200 + pulse;
    
    fill(hue(point.y), 255, brightness);
    vertex(point.x, point.y);
  }
  endShape();
  
  // Add sharp spikes and shallow dips
  for (let i = 0; i < 50; i++) {
    const x = (frameCount * 2 + i * 30) % width;
    const y = height / 2 + sin(frameCount * 0.1 + i) * 80;
    
    // Draw spikes
    fill(255, 255, 255);
    ellipse(x, y, 6, 6);
    
    // Draw shallow dips
    fill(0, 0, 100);
    ellipse(x, y, 4, 4);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
