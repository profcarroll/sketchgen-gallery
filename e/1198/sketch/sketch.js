let x = 0;
let breathPhase = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noLoop();
}

function draw() {
  // Solid indigo background
  background(25, 25, 75);
  
  // Draw EKG waveform from left to right
  stroke(255);
  strokeWeight(2);
  
  beginShape();
  for (let i = 0; i <= width; i++) {
    // Calculate pulse amount based on position and breathing phase
    let t = map(i, 0, width, 0, TWO_PI);
    let pulse = sin(t + x * 0.05) * 0.5 + 0.5;
    let breath = sin(breathPhase) * 0.1 + 0.1;
    let grayValue = 255 * (1 - pulse * breath);
    
    let y = height / 2 + sin(t * 3) * 30 + sin(t * 10) * 10;
    vertex(i, y);
  }
  endShape();
  
  // Update phase for breathing animation
  breathPhase += 0.1;
  if (breathPhase > TWO_PI) {
    breathPhase -= TWO_PI;
  }
  
  // Restart animation loop
  loop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
