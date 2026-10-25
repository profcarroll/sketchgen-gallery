let gridLines = [];
let planes = [];
let audioInput;
let fft;
let isListening = false;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create grid lines that pulse and fade
  for (let i = 0; i < 50; i++) {
    gridLines.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-300, 300),
      length: random(100, 300),
      angle: random(TWO_PI),
      hue: random(360),
      pulse: random(TWO_PI),
      opacity: random(0.3, 0.8)
    });
  }

  // Create pulsing planes
  for (let i = 0; i < 20; i++) {
    planes.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-300, 300),
      sizeX: random(100, 300),
      sizeY: random(100, 300),
      hue: random(360),
      pulse: random(TWO_PI),
      opacity: random(0.2, 0.6)
    });
  }
}

function draw() {
  background(20, 10, 5);

  // Camera movement
  let time = millis() * 0.0003;
  camera(
    sin(time) * width/4,
    sin(time * 0.7) * height/6,
    cos(time) * width/4 + 500,
    0, 0, 0,
    0, 1, 0
  );

  // Draw grid lines
  for (let line of gridLines) {
    push();
    translate(line.x, line.y, line.z);
    rotateZ(line.angle);

    let pulse = sin(line.pulse) * 0.3 + 1;
    let scale = pulse * 0.5 + 0.5;

    stroke(line.hue, 100, 100, line.opacity);
    noFill();
    strokeWeight(2 * scale);

    beginShape(LINES);
    vertex(-line.length/2, 0, 0);
    vertex(line.length/2, 0, 0);
    endShape();

    line.pulse += 0.01;
    pop();
  }

  // Draw pulsing planes
  for (let plane of planes) {
    push();
    translate(plane.x, plane.y, plane.z);

    let pulse = sin(plane.pulse) * 0.5 + 1;
    let scale = pulse * 0.3 + 0.7;

    fill(plane.hue, 100, 100, plane.opacity);
    noStroke();

    beginShape(QUADS);
    vertex(-plane.sizeX/2, -plane.sizeY/2, 0);
    vertex(plane.sizeX/2, -plane.sizeY/2, 0);
    vertex(plane.sizeX/2, plane.sizeY/2, 0);
    vertex(-plane.sizeX/2, plane.sizeY/2, 0);
    endShape();

    plane.pulse += 0.005;
    pop();
  }

  // Audio-reactive pulses
  if (isListening && fft) {
    let spectrum = fft.analyze();
    let bass = 0;
    for (let i = 0; i < 10; i++) {
      bass += spectrum[i];
    }
    bass /= 10;

    // Make grid lines pulse with audio
    for (let line of gridLines) {
      line.pulse += bass * 0.0001;
    }

    // Make planes pulse with audio
    for (let plane of planes) {
      plane.pulse += bass * 0.0002;
    }
  }
}

function mousePressed() {
  if (!isListening) {
    userStartAudio();
    isListening = true;
    audioInput = new p5.AudioIn();
    audioInput.start();
    fft = new p5.FFT(0.8, 64);
    fft.setInput(audioInput);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
