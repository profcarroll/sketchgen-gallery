let shapes = [];
let fft;
let amplitude;
let mic;
let isAudioStarted = false;
let audioLevel = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize audio
  mic = new p5.AudioIn();
  fft = new p5.FFT();
  amplitude = new p5.Amplitude();
  
  // Create initial shapes
  for (let i = 0; i < 50; i++) {
    shapes.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-1000, 1000),
      size: random(20, 100),
      hue: random(360),
      speed: random(0.01, 0.05),
      rotationX: random(TWO_PI),
      rotationY: random(TWO_PI),
      rotationZ: random(TWO_PI),
      sides: floor(random(2)) === 0 ? 8 : 6, // octahedron or hexagon
      pulse: random(0.5, 2)
    });
  }
}

function draw() {
  background(0, 0, 0, 0.1);
  
  if (isAudioStarted) {
    audioLevel = amplitude.getLevel();
    let freq = fft.analyze();
    
    // Update shapes based on audio
    for (let s of shapes) {
      s.size += sin(frameCount * s.speed) * s.pulse;
      s.size = constrain(s.size, 10, 200);
      s.hue += audioLevel * 30;
      if (s.hue > 360) s.hue -= 360;
      
      s.rotationX += audioLevel * 0.02;
      s.rotationY += audioLevel * 0.02;
      s.rotationZ += audioLevel * 0.02;
    }
  }
  
  // Draw and update shapes
  for (let s of shapes) {
    push();
    
    translate(s.x, s.y, s.z);
    rotateX(s.rotationX);
    rotateY(s.rotationY);
    rotateZ(s.rotationZ);
    
    noStroke();
    fill(s.hue, 100, 100, 0.8);
    
    if (s.sides === 8) {
      // Octahedron
      drawOctahedron(s.size);
    } else {
      // Hexagon (as a regular polygon)
      drawHexagon(s.size);
    }
    
    pop();
    
    // Move shapes
    s.x += sin(frameCount * 0.01) * 2;
    s.y += cos(frameCount * 0.01) * 2;
    s.z += random(-1, 1);
    
    if (s.x < -width/2 || s.x > width/2) s.x = random(-width/2, width/2);
    if (s.y < -height/2 || s.y > height/2) s.y = random(-height/2, height/2);
    if (s.z < -1000 || s.z > 1000) s.z = random(-1000, 1000);
  }
}

function drawOctahedron(size) {
  // Simple octahedron using 8 triangular faces
  beginShape();
  vertex(0, -size/2, 0);
  vertex(size/2, 0, 0);
  vertex(0, 0, size/2);
  endShape(CLOSE);
  
  beginShape();
  vertex(0, -size/2, 0);
  vertex(0, 0, size/2);
  vertex(-size/2, 0, 0);
  endShape(CLOSE);
  
  beginShape();
  vertex(0, -size/2, 0);
  vertex(-size/2, 0, 0);
  vertex(0, 0, -size/2);
  endShape(CLOSE);
  
  beginShape();
  vertex(0, -size/2, 0);
  vertex(0, 0, -size/2);
  vertex(size/2, 0, 0);
  endShape(CLOSE);
  
  beginShape();
  vertex(0, size/2, 0);
  vertex(size/2, 0, 0);
  vertex(0, 0, -size/2);
  endShape(CLOSE);
  
  beginShape();
  vertex(0, size/2, 0);
  vertex(0, 0, -size/2);
  vertex(-size/2, 0, 0);
  endShape(CLOSE);
  
  beginShape();
  vertex(0, size/2, 0);
  vertex(-size/2, 0, 0);
  vertex(0, 0, size/2);
  endShape(CLOSE);
  
  beginShape();
  vertex(0, size/2, 0);
  vertex(0, 0, size/2);
  vertex(size/2, 0, 0);
  endShape(CLOSE);
}

function drawHexagon(size) {
  // Draw a hexagon as a polygon
  beginShape();
  for (let i = 0; i < 6; i++) {
    let angle = map(i, 0, 6, 0, TWO_PI);
    let x = cos(angle) * size;
    let y = sin(angle) * size;
    vertex(x, y);
  }
  endShape(CLOSE);
}

function mousePressed() {
  if (!isAudioStarted) {
    userStartAudio();
    mic.start();
    fft.setInput(mic);
    amplitude.setInput(mic);
    isAudioStarted = true;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
