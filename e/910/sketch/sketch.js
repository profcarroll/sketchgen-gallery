let pads = [];
let sounds = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Create 5 pads
  const padWidth = width / 5;
  for (let i = 0; i < 5; i++) {
    pads.push({
      x: i * padWidth,
      y: height / 2 - 50,
      w: padWidth,
      h: 100,
      color: color(100 + i * 30, 150, 200),
      active: false,
      note: 261.63 + i * 440 // C4, D4, E4, F4, G4
    });
  }
  
  // Create sounds (will be initialized on first click)
  for (let i = 0; i < 5; i++) {
    sounds.push(new p5.Oscillator());
    sounds[i].setType('sine');
    sounds[i].amp(0);
    sounds[i].stop();
  }
}

function draw() {
  background(20);
  
  // Draw pads
  for (let pad of pads) {
    fill(pad.active ? color(255, 255, 0) : pad.color);
    noStroke();
    rect(pad.x, pad.y, pad.w, pad.h, 10);
    
    // Draw label
    fill(255);
    textSize(16);
    textAlign(CENTER, CENTER);
    text(pad.note.toFixed(0) + 'Hz', pad.x + pad.w/2, pad.y + pad.h/2);
  }
}

function mousePressed() {
  // Start audio on first click
  if (getAudioContext().state !== 'running') {
    userStartAudio();
  }
  
  // Check if any pad was clicked
  for (let i = 0; i < pads.length; i++) {
    let pad = pads[i];
    if (mouseX > pad.x && mouseX < pad.x + pad.w &&
        mouseY > pad.y && mouseY < pad.y + pad.h) {
      
      // Activate pad visually
      pad.active = true;
      
      // Play sound
      sounds[i].freq(pad.note);
      sounds[i].amp(0.5, 0.1);
      sounds[i].start();
      
      // Deactivate after a short time
      setTimeout(() => {
        pad.active = false;
        sounds[i].amp(0, 0.1);
      }, 300);
      
      break;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
