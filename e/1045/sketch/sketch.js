let phase = 0;
let speed = 0.01;
let paused = false;
let eraseMode = false;
let eraseStart = null;
let eraseEnd = null;
let waveformBuffer;

function setup() {
  createCanvas(windowWidth, windowHeight);
  waveformBuffer = createGraphics(windowWidth, windowHeight);
  waveformBuffer.stroke(255, 0, 0);
  waveformBuffer.strokeWeight(2);
}

function draw() {
  background(0);
  
  if (!paused) {
    phase += speed;
  }
  
  let maxSpeed = 0.1;
  let minSpeed = 0.002;
  let cycleDuration = 300;
  let speedFactor = (sin(frameCount * 0.002) + 1) / 2;
  speed = minSpeed + (maxSpeed - minSpeed) * speedFactor;
  
  let hueVal = map(sin(frameCount * 0.002), -1, 1, 0, 60);
  let r = 255;
  let g = map(hueVal, 0, 60, 0, 255);
  let b = 0;
  
  // Draw waveform from buffer
  image(waveformBuffer, 0, 0);
  
  // Draw current waveform
  stroke(r, g, b);
  strokeWeight(2);
  beginShape();
  for (let x = 0; x <= width; x += 5) {
    let t = (x / width + phase) * 4;
    let wave1 = sin(t) * 30;
    let wave2 = sin(t * 2) * 20;
    let wave3 = sin(t * 3) * 10;
    let y = height / 2 + wave1 + wave2 + wave3;
    vertex(x, y);
  }
  endShape();
  
  // Draw current point
  let t = (width / width + phase) * 4;
  let wave1 = sin(t) * 30;
  let wave2 = sin(t * 2) * 20;
  let wave3 = sin(t * 3) * 10;
  let y = height / 2 + wave1 + wave2 + wave3;
  fill(r, g, b);
  noStroke();
  ellipse(width, y, 10, 10);
}

function mousePressed() {
  paused = !paused;
}

function mouseDragged() {
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    if (!eraseMode) {
      waveformBuffer.clear();
      eraseStart = createVector(mouseX, mouseY);
      eraseMode = true;
      phase = 0;
    } else {
      eraseEnd = createVector(mouseX, mouseY);
    }
  }
}

function mouseReleased() {
  if (eraseMode) {
    waveformBuffer.clear();
    eraseMode = false;
    phase = 0;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  waveformBuffer = createGraphics(windowWidth, windowHeight);
}
