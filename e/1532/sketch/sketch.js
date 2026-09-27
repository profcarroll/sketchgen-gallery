let fft;
let amplitude;
let mic;
let isPlaying = false;

// Field parameters
let fieldResolution = 40;
let time = 0;
let colorOffset = 0;

// Particle system for field effect
let particleCount = 1000;
let positions = [];
let colors = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  
  // Setup audio
  mic = new p5.AudioIn();
  fft = new p5.FFT(0.8, 128);
  amplitude = new p5.Amplitude();

  // Initialize particles
  for (let i = 0; i < particleCount; i++) {
    positions.push(createVector(random(-width, width), random(-height, height), random(-1000, 1000)));
    colors.push(color(random(100, 255), random(100, 255), random(100, 255)));
  }
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

  // Set camera position for 3D effect
  let camX = sin(time * 0.2) * 500;
  let camY = cos(time * 0.3) * 300;
  let camZ = sin(time * 0.1) * 400;
  camera(camX, camY, camZ, 0, 0, 0, 0, 1, 0);

  // Draw geometric fields
  drawFields(spectrum, vol);
  
  // Update and draw particles
  drawParticles(vol);
}

function drawFields(spectrum, vol) {
  // Base parameters for field size and density
  let baseSize = min(width, height) * 0.3;
  let baseDensity = 20;

  // Scale based on audio intensity
  let scale = 1 + vol * 3;
  let density = baseDensity + vol * 50;

  // Draw multiple layers of fields
  for (let layer = 0; layer < 5; layer++) {
    push();
    
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
  ellipse(0, 0, rippleSize);

  // Additional wave pattern
  for (let i = 0; i < 10; i++) {
    let angle = map(i, 0, 10, 0, TWO_PI);
    let r = baseSize * 0.7 + sin(time + angle) * 30;
    let x = cos(angle) * r;
    let y = sin(angle) * r;

    ellipse(x, y, 10 + vol * 50);
  }
}

function drawParticles(vol) {
  // Use batched drawing for particles
  beginShape(POINTS);
  
  for (let i = 0; i < particleCount; i++) {
    let p = positions[i];
    
    // Animate particle position based on time and audio
    let animX = sin(time * 0.01 + p.x * 0.001) * 50;
    let animY = cos(time * 0.01 + p.y * 0.001) * 50;
    let animZ = sin(time * 0.005 + p.z * 0.001) * 30;
    
    // Apply animation to position
    let x = p.x + animX;
    let y = p.y + animY;
    let z = p.z + animZ;
    
    // Color based on audio and position
    let c = colors[i];
    fill(c);
    noStroke();
    
    // Set vertex
    vertex(x, y, z);
  }
  
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
