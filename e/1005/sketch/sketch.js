let pads = [];
let padSize;
let cols, rows;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Calculate grid dimensions based on canvas size
  cols = floor(width / 60);
  rows = floor(height / 60);
  padSize = min(width / cols, height / rows) * 0.8;
  
  // Create pads
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      pads.push({
        x: i * padSize + padSize/2,
        y: j * padSize + padSize/2,
        color: color(random(100, 255), random(100, 255), random(100, 255)),
        isFlashing: false,
        flashStartTime: 0
      });
    }
  }
}

function draw() {
  background(20);
  
  // Draw pads
  for (let pad of pads) {
    if (pad.isFlashing) {
      let elapsed = millis() - pad.flashStartTime;
      if (elapsed < 200) {
        // Flash bright white
        fill(255);
        stroke(255);
      } else {
        // Return to original color
        fill(pad.color);
        stroke(red(pad.color), green(pad.color), blue(pad.color));
        pad.isFlashing = false;
      }
    } else {
      fill(pad.color);
      stroke(red(pad.color), green(pad.color), blue(pad.color));
    }
    
    rectMode(CENTER);
    rect(pad.x, pad.y, padSize * 0.9, padSize * 0.9);
  }
}

function mousePressed() {
  // Find which pad was clicked
  for (let pad of pads) {
    let d = dist(mouseX, mouseY, pad.x, pad.y);
    if (d < padSize/2) {
      pad.isFlashing = true;
      pad.flashStartTime = millis();
      break;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
