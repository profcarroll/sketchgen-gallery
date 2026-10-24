let elements = [];
let rows = 10;
let cols = 18;
let cellSize = 40;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create a grid of elements
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      elements.push({
        x: col * cellSize + cellSize / 2,
        y: row * cellSize + cellSize / 2,
        hue: (row * cols + col) * 10 % 360,
        sat: 80,
        bri: 90,
        size: cellSize * 0.8,
        phase: (row + col) * 0.5
      });
    }
  }
}

function draw() {
  background(0);
  
  // Draw ambient glow
  let glowStrength = 30;
  for (let i = 0; i < elements.length; i++) {
    let element = elements[i];
    let wave = sin(time * 0.02 + element.phase) * 0.5 + 0.5;
    let alpha = map(wave, 0, 1, 0, glowStrength);
    
    noStroke();
    fill(element.hue, element.sat, element.bri, alpha);
    rect(element.x - element.size/2, element.y - element.size/2, element.size, element.size);
  }
  
  // Draw periodic wave
  stroke(255, 100, 100, 100);
  noFill();
  beginShape();
  for (let x = 0; x < width; x += 10) {
    let y = height/2 + sin(time * 0.01 + x * 0.01) * 30;
    vertex(x, y);
  }
  endShape();
  
  // Draw elements with their colors
  for (let i = 0; i < elements.length; i++) {
    let element = elements[i];
    let wave = sin(time * 0.02 + element.phase) * 0.5 + 0.5;
    let size = element.size * (0.8 + wave * 0.2);
    
    fill(element.hue, element.sat, element.bri);
    noStroke();
    rect(element.x - size/2, element.y - size/2, size, size);
  }
  
  time++;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
