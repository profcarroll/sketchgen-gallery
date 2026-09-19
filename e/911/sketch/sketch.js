let oscillator;
let isPlaying = false;
let circleY = 0;
let circleRadius = 50;

function setup() {
  createCanvas(windowWidth, windowHeight);
  circleY = height / 2;
  
  // Initialize audio context on first user interaction
  userStartAudio();
}

function draw() {
  background(240);
  
  // Draw the draggable circle
  fill(100, 150, 255);
  noStroke();
  ellipse(width / 2, circleY, circleRadius * 2, circleRadius * 2);
  
  // Draw a visual indicator for pitch range
  stroke(200);
  strokeWeight(1);
  line(width/2 - 100, 0, width/2 - 100, height);
  line(width/2 + 100, 0, width/2 + 100, height);
  
  if (isPlaying && oscillator) {
    // Update oscillator frequency based on circle position
    const pitch = map(circleY, 0, height, 440, 880); // Map from top to bottom
    oscillator.freq(pitch);
  }
}

function mousePressed() {
  // Start audio on first click
  if (!isPlaying) {
    oscillator = new p5.Oscillator('sine');
    oscillator.amp(0.3);
    oscillator.start();
    isPlaying = true;
  }
  
  // Check if click is on the circle
  const d = dist(mouseX, mouseY, width / 2, circleY);
  if (d < circleRadius) {
    return true; // Allow dragging
  }
  return false;
}

function mouseDragged() {
  if (isPlaying && abs(mouseX - width/2) < circleRadius * 2) {
    circleY = mouseY;
    circleY = constrain(circleY, 0, height);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  circleY = height / 2;
}
