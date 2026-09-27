let shapes = [];
let time = 0;
let audioInput;
let fft;
let isAudioStarted = false;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create initial shapes with rectilinear and helical motion
  for (let i = 0; i < 100; i++) {
    shapes.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-1000, 1000),
      size: random(10, 60),
      hue: random(360),
      speed: random(0.005, 0.02),
      rotationX: random(TWO_PI),
      rotationY: random(TWO_PI),
      rotationZ: random(TWO_PI),
      sides: floor(random(2)) === 0 ? 8 : 6, // octahedron or hexagon
      pulse: random(0.5, 2),
      axis: floor(random(3)), // 0=x, 1=y, 2=z axis
      direction: random() > 0.5 ? 1 : -1,
      phase: random(TWO_PI),
      helixRadius: random(50, 200),
      helixSpeed: random(0.01, 0.03),
      helixPhase: random(TWO_PI)
    });
  }
}

function draw() {
  background(0, 0, 0, 0.1);
  
  time += 0.01;
  
  // Draw and update shapes with rectilinear and helical motion
  for (let s of shapes) {
    push();
    
    // Combine rectilinear axis movement with helical spiral
    let speed = s.speed * 20;
    let movement = (time * speed + s.phase) * s.direction;
    
    // Helix motion in xz plane
    let helixOffsetX = sin(time * s.helixSpeed + s.helixPhase) * s.helixRadius;
    let helixOffsetZ = cos(time * s.helixSpeed + s.helixPhase) * s.helixRadius;
    
    if (s.axis === 0) { // x-axis
      translate(movement + helixOffsetX, s.y, s.z + helixOffsetZ);
    } else if (s.axis === 1) { // y-axis
      translate(s.x + helixOffsetX, movement, s.z + helixOffsetZ);
    } else { // z-axis
      translate(s.x + helixOffsetX, s.y, movement + helixOffsetZ);
    }
    
    // Add some rotation for visual interest
    s.rotationX += s.speed * 0.5;
    s.rotationY += s.speed * 0.3;
    s.rotationZ += s.speed * 0.7;
    
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
    
    // Update hue for pulsing effect
    s.hue += 0.5;
    if (s.hue > 360) s.hue -= 360;
  }
  
  // Respond to audio input if available
  if (fft && isAudioStarted) {
    let spectrum = fft.analyze();
    let bass = fft.getEnergy('bass');
    let treble = fft.getEnergy('treble');
    
    // Modify motion based on audio
    for (let s of shapes) {
      s.speed += map(bass, 0, 255, -0.002, 0.002);
      s.speed = constrain(s.speed, 0.005, 0.03);
      s.size += map(treble, 0, 255, -0.2, 0.2);
      s.size = constrain(s.size, 10, 80);
    }
  }
}

function drawOctahedron(size) {
  // Simplified octahedron using 8 triangular faces
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

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
  // Start audio on first user gesture
  if (!isAudioStarted) {
    isAudioStarted = true;
    userStartAudio();
    audioInput = new p5.AudioIn();
    audioInput.start();
    fft = new p5.FFT();
    fft.setInput(audioInput);
  }
}
