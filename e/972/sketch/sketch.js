const pads = [];
let synth;

function setup() {
  createCanvas(windowWidth, windowHeight);
  userStartAudio();
  
  // Create five pads
  const padWidth = width / 5;
  const padHeight = height / 3;
  const padSpacing = 20;
  
  for (let i = 0; i < 5; i++) {
    pads.push({
      x: i * (padWidth + padSpacing) + padSpacing,
      y: height / 2 - padHeight / 2,
      width: padWidth - padSpacing,
      height: padHeight,
      color: color(100 + i * 30, 150 + i * 20, 200 + i * 10),
      isLit: false,
      note: ['C4', 'D4', 'E4', 'F4', 'G4'][i]
    });
  }
}

function draw() {
  background(20);
  
  // Draw all pads
  for (let pad of pads) {
    fill(pad.color);
    if (pad.isLit) {
      fill(255, 255, 200);
    }
    noStroke();
    rect(pad.x, pad.y, pad.width, pad.height, 20); // rounded corners
  }
}

function mousePressed() {
  // Check if any pad was clicked
  for (let pad of pads) {
    if (
      mouseX > pad.x &&
      mouseX < pad.x + pad.width &&
      mouseY > pad.y &&
      mouseY < pad.y + pad.height
    ) {
      // Light up the pad
      pad.isLit = true;
      
      // Play corresponding note
      const oscillator = new p5.Oscillator();
      oscillator.setType('sine');
      oscillator.freq(noteToFreq(pad.note));
      oscillator.amp(0.3);
      oscillator.start();
      
      // Stop after a short duration
      setTimeout(() => {
        oscillator.stop();
        pad.isLit = false;
      }, 300);
      
      break; // Only one pad at a time
    }
  }
}

// Convert note to frequency (simplified mapping)
function noteToFreq(note) {
  const notes = {
    'C4': 261.63,
    'D4': 293.66,
    'E4': 329.63,
    'F4': 349.23,
    'G4': 392.00
  };
  return notes[note] || 440;
}
