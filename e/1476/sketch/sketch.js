let fireflies = [];
let morseCode = [
  [1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1], // S
  [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0], // O
  [1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1]  // S
];
let patternIndex = 0;
let message = "SOS";
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Create fireflies
  for (let i = 0; i < 200; i++) {
    fireflies.push({
      x: random(width),
      y: random(height),
      vx: random(-0.5, 0.5),
      vy: random(-0.5, 0.5),
      size: random(2, 6),
      brightness: random(100, 255),
      flicker: random(TWO_PI),
      phase: random(TWO_PI),
      syncPhase: random(TWO_PI)
    });
  }
}

function draw() {
  background(0);
  
  time += 0.02;
  let syncTime = time * 0.5;
  
  // Update and display fireflies
  for (let fly of fireflies) {
    // Drift
    fly.x += fly.vx;
    fly.y += fly.vy;
    
    // Boundary check
    if (fly.x < 0 || fly.x > width) fly.vx *= -1;
    if (fly.y < 0 || fly.y > height) fly.vy *= -1;
    
    // Flicker
    let flicker = sin(fly.flicker + time * 2) * 0.5 + 0.5;
    let brightness = fly.brightness * flicker;
    
    // Synchronization effect
    let syncEffect = sin(syncTime + fly.syncPhase);
    if (syncEffect > 0.8) {
      brightness = map(syncEffect, 0.8, 1, brightness, 255);
    }
    
    fill(255, 255, 200, brightness);
    ellipse(fly.x, fly.y, fly.size);
  }
  
  // Morse code display
  if (frameCount % 60 === 0) {
    patternIndex = (patternIndex + 1) % morseCode.length;
  }
  
  let pattern = morseCode[patternIndex];
  let spacing = 30;
  let startX = width / 2 - (pattern.length * spacing) / 2;
  let startY = height / 4;
  
  for (let i = 0; i < pattern.length; i++) {
    if (pattern[i] === 1) {
      fill(255);
      ellipse(startX + i * spacing, startY, 10, 10);
    } else {
      fill(0);
      ellipse(startX + i * spacing, startY, 10, 10);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
