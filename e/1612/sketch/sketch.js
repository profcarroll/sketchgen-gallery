let fireflies = [];
let pattern = [
  [1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1], // S
  [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0], // O
  [1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1]  // S
];
let patternIndex = 0;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Create fireflies
  for (let i = 0; i < 300; i++) {
    fireflies.push({
      x: random(width),
      y: random(height),
      size: random(1, 3),
      brightness: random(100, 255),
      phase: random(TWO_PI),
      syncPhase: random(TWO_PI)
    });
  }
}

function draw() {
  background(0);
  
  time += 0.01;
  let syncTime = time * 0.7;
  
  // Update and display fireflies
  for (let fly of fireflies) {
    // Flicker effect
    let flicker = sin(fly.phase + time * 3) * 0.5 + 0.5;
    let brightness = fly.brightness * flicker;
    
    // Synchronization effect
    let syncEffect = sin(syncTime + fly.syncPhase);
    if (syncEffect > 0.7) {
      brightness = map(syncEffect, 0.7, 1, brightness, 255);
    }
    
    fill(255, 255, 200, brightness);
    ellipse(fly.x, fly.y, fly.size);
  }
  
  // Display pattern with synchronized pulsing
  if (frameCount % 60 === 0) {
    patternIndex = (patternIndex + 1) % pattern.length;
  }
  
  let p = pattern[patternIndex];
  let spacing = 25;
  let startX = width / 2 - (p.length * spacing) / 2;
  let startY = height / 3;
  
  for (let i = 0; i < p.length; i++) {
    if (p[i] === 1) {
      let pulse = sin(syncTime * 2 + i) * 0.5 + 0.5;
      let size = 10 + pulse * 15;
      fill(255);
      ellipse(startX + i * spacing, startY, size, size);
    } else {
      fill(0);
      ellipse(startX + i * spacing, startY, 8, 8);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
