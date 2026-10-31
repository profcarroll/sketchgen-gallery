let strips = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize the vertical strip
  strips.push({
    y: height,
    segments: [],
    hue: random(20, 40), // Warm brass tones
    saturation: random(80, 100),
    brightness: random(70, 90)
  });
}

function draw() {
  background(0);
  time += 0.02;
  
  // Draw all strips
  for (let i = strips.length - 1; i >= 0; i--) {
    let strip = strips[i];
    drawStrip(strip);
    
    // Update strip position
    strip.y -= 0.5;
    
    // Remove strips that are off-screen
    if (strip.y < -200) {
      strips.splice(i, 1);
    }
  }
  
  // Add a new strip periodically
  if (frameCount % 30 === 0 && strips.length < 100) {
    strips.push({
      y: height,
      segments: [],
      hue: random(20, 40),
      saturation: random(80, 100),
      brightness: random(70, 90)
    });
  }
}

function drawStrip(strip) {
  push();
  
  // Draw the strip's segments
  beginShape();
  noFill();
  stroke(strip.hue, strip.saturation, strip.brightness, 0.8);
  strokeWeight(2);
  
  let segmentCount = 50;
  for (let i = 0; i < segmentCount; i++) {
    let x = (i / (segmentCount - 1)) * width;
    let y = strip.y + sin(i * 0.2 + time) * 20;
    
    // Add some randomness to create organic texture
    let noiseVal = noise(i * 0.1, time * 0.5);
    y += (noiseVal - 0.5) * 30;
    
    vertex(x, y);
  }
  
  endShape();
  
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
