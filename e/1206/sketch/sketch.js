const pads = [];
let audioContext;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create five colored pads
  const padWidth = width / 5;
  const padHeight = height * 0.3;
  const padY = height * 0.5 - padHeight / 2;
  
  for (let i = 0; i < 5; i++) {
    pads.push({
      x: i * padWidth,
      y: padY,
      width: padWidth,
      height: padHeight,
      color: color(i * 60, 80, 90),
      shadowOffset: 5,
      isLit: false,
      note: 261.63 + i * 100 // C4, D4, E4, F4, G4
    });
  }
}

function draw() {
  background(220, 20, 95);
  
  // Draw pads
  for (let pad of pads) {
    // Shadow
    fill(0, 0, 0, 0.2);
    noStroke();
    rect(pad.x + pad.shadowOffset, pad.y + pad.shadowOffset, pad.width, pad.height, 10);
    
    // Pad body
    fill(pad.color);
    stroke(0, 0, 0, 0.2);
    strokeWeight(1);
    rect(pad.x, pad.y, pad.width, pad.height, 10);
    
    // Glow when lit
    if (pad.isLit) {
      noStroke();
      fill(pad.color);
      drawingContext.shadowBlur = 30;
      drawingContext.shadowColor = pad.color;
      rect(pad.x, pad.y, pad.width, pad.height, 10);
      drawingContext.shadowBlur = 0;
    }
  }
}

function mousePressed() {
  // Start audio context on first interaction
  if (!audioContext) {
    userStartAudio();
    audioContext = getAudioContext();
  }
  
  // Check which pad was clicked
  for (let pad of pads) {
    if (
      mouseX > pad.x &&
      mouseX < pad.x + pad.width &&
      mouseY > pad.y &&
      mouseY < pad.y + pad.height
    ) {
      // Light up the pad
      pad.isLit = true;
      
      // Play note
      const osc = new p5.Oscillator();
      osc.setType('sine');
      osc.freq(pad.note);
      osc.amp(0.5);
      osc.start();
      osc.stop(millis() + 300);
      
      // Reset pad after delay
      setTimeout(() => {
        pad.isLit = false;
      }, 300);
      
      break;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
