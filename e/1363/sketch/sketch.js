let fft;
let amplitude;
let mic;
let isPlaying = false;

// Field parameters
let fieldResolution = 40;
let time = 0;
let colorOffset = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Setup audio
  mic = new p5.AudioIn();
  fft = new p5.FFT(0.8, 128);
  amplitude = new p5.Amplitude();

  // Start audio on first click
  userStartAudio();
}

function draw() {
  background(0);

  if (!isPlaying) {
    // Initial setup for the first frame
    isPlaying = true;
    mic.start();
  }

  // Get audio data
  let spectrum = fft.analyze();
  let vol = amplitude.getLevel();

  // Update time and color offset for animation
  time += 0.02;
  colorOffset += 0.01;

  // Draw geometric fields
  drawFields(spectrum, vol);
}

function drawFields(spectrum, vol) {
  // Base parameters for field size and density
  let baseSize = min(width, height) * 0.4;
  let baseDensity = 20;

  // Scale based on audio intensity
  let scale = 1 + vol * 3;
  let density = baseDensity + vol * 50;

  // Draw multiple layers of fields
  for (let layer = 0; layer < 5; layer++) {
    push();
    translate(width / 2, height / 2);

    // Color based on audio spectrum and time
    let hue = (frameCount * 0.5 + colorOffset + layer * 20) % 360;
    let sat = 100;
    let bright = 80 + sin(time * 0.5 + layer) * 20;

    stroke(hue, sat, bright);
    noFill();

    // Draw a series of overlapping planes
    for (let i = 0; i < density; i++) {
      let angle = map(i, 0, density, 0, TWO_PI);
      let radius = baseSize * scale + sin(time + angle) * 50;
      let x = cos(angle) * radius;
      let y = sin(angle) * radius;

      // Create wave-like distortion based on audio
      let distortion = map(spectrum[i % spectrum.length], 0, 255, -1, 1);
      let distRadius = radius + distortion * 30;

      // Draw the field shape
      if (layer % 2 === 0) {
        ellipse(x, y, distRadius * 0.5, distRadius * 0.5);
      } else {
        rectMode(CENTER);
        rect(x, y, distRadius * 0.3, distRadius * 0.3);
      }
    }

    pop();
  }

  // Ripple effect from center
  let rippleSize = 10 + vol * 200;
  noFill();
  stroke(255, 100);
  ellipse(width / 2, height / 2, rippleSize);

  // Additional wave pattern
  for (let i = 0; i < 10; i++) {
    let angle = map(i, 0, 10, 0, TWO_PI);
    let r = baseSize * 0.7 + sin(time + angle) * 30;
    let x = width / 2 + cos(angle) * r;
    let y = height / 2 + sin(angle) * r;

    ellipse(x, y, 10 + vol * 50);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
