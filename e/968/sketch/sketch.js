let pads = [];
let gridWidth = 8;
let gridHeight = 4;
let padSize = 60;
let spacing = 15;
let beatPhase = 0;
let audioContextStarted = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create grid of pads
  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      pads.push({
        x: x * (padSize + spacing) + padSize/2 + 50,
        y: y * (padSize + spacing) + padSize/2 + 50,
        on: false,
        hue: (x * 30 + y * 20) % 360,
        pulse: 0,
        flash: 0
      });
    }
  }
}

function draw() {
  background(0);
  
  // Update beat phase
  beatPhase += 0.1;
  
  // Draw pads with pulsing effect
  for (let pad of pads) {
    // Pulsing animation
    pad.pulse = sin(beatPhase) * 0.3 + 0.7;
    
    // Flash effect
    if (pad.flash > 0) {
      pad.flash -= 0.1;
    }
    
    // Draw pad
    fill(pad.hue, 80, pad.flash > 0 ? 100 : 50 * pad.pulse + 20);
    noStroke();
    rect(pad.x - padSize/2, pad.y - padSize/2, padSize, padSize, 8);
    
    // Flash effect
    if (pad.flash > 0) {
      fill(pad.hue, 100, 100, pad.flash);
      rect(pad.x - padSize/2, pad.y - padSize/2, padSize, padSize, 8);
    }
  }
}

function mousePressed() {
  // Start audio context on first click
  if (!audioContextStarted) {
    userStartAudio();
    audioContextStarted = true;
  }
  
  // Check if any pad was clicked
  for (let i = 0; i < pads.length; i++) {
    let pad = pads[i];
    let d = dist(mouseX, mouseY, pad.x, pad.y);
    
    if (d < padSize/2) {
      // Trigger pad and neighbors
      triggerPad(i);
      break;
    }
  }
}

function triggerPad(index) {
  let pad = pads[index];
  
  // Set flash effect
  pad.flash = 1.0;
  
  // Flash neighbors
  let neighbors = getNeighbors(index);
  for (let n of neighbors) {
    pads[n].flash = 1.0;
  }
  
  // Play tone
  playTone(pad.hue);
}

function getNeighbors(index) {
  let x = index % gridWidth;
  let y = Math.floor(index / gridWidth);
  let neighbors = [];
  
  // Check all adjacent pads (including diagonals)
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue;
      
      let nx = x + dx;
      let ny = y + dy;
      
      if (nx >= 0 && nx < gridWidth && ny >= 0 && ny < gridHeight) {
        neighbors.push(ny * gridWidth + nx);
      }
    }
  }
  
  return neighbors;
}

function playTone(hue) {
  // Create oscillator with frequency based on hue
  let osc = new p5.Oscillator();
  osc.setType('sine');
  osc.freq(220 + hue * 2); // Convert hue to frequency
  osc.amp(0.3);
  
  // Play for a short time
  osc.start();
  osc.stop(frameCount + 30);
}
