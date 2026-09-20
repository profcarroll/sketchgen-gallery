const pads = [];
let audioReady = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Create five pads
  const padWidth = width / 5;
  const padHeight = height / 3;
  const padY = height / 2 - padHeight / 2;
  
  for (let i = 0; i < 5; i++) {
    pads.push({
      x: i * padWidth,
      y: padY,
      width: padWidth,
      height: padHeight,
      color: color(100 + i * 30, 150 + i * 20, 200 + i * 10),
      highlightColor: color(255, 255, 255),
      isHighlighted: false,
      note: new p5.Oscillator(),
      noteFreq: 261.63 + i * 440 // C4 to C6
    });
  }
}

function draw() {
  background(20);
  
  // Draw pads
  for (let pad of pads) {
    drawPad(pad);
  }
}

function drawPad(pad) {
  push();
  translate(pad.x, pad.y);
  
  // Draw the pad with gradient
  noStroke();
  const gradient = drawingContext.createLinearGradient(0, 0, 0, pad.height);
  gradient.addColorStop(0, color(red(pad.color), green(pad.color), blue(pad.color), 200));
  gradient.addColorStop(1, color(red(pad.color) * 0.5, green(pad.color) * 0.5, blue(pad.color) * 0.5, 200));
  drawingContext.fillStyle = gradient;
  
  // Rounded rectangle
  rect(0, 0, pad.width, pad.height, 20);
  
  // Highlight if clicked
  if (pad.isHighlighted) {
    fill(pad.highlightColor);
    noStroke();
    rect(0, 0, pad.width, pad.height, 20);
  }
  
  pop();
}

function mousePressed() {
  if (!audioReady) {
    userStartAudio();
    audioReady = true;
  }
  
  for (let i = 0; i < pads.length; i++) {
    const pad = pads[i];
    // Check if click is within this pad
    if (mouseX > pad.x && mouseX < pad.x + pad.width &&
        mouseY > pad.y && mouseY < pad.y + pad.height) {
      
      // Highlight the pad
      pad.isHighlighted = true;
      
      // Play note
      pad.note.freq(pad.noteFreq);
      pad.note.amp(0.5);
      pad.note.start();
      
      // Stop after a short time
      setTimeout(() => {
        pad.note.stop();
        pad.isHighlighted = false;
      }, 300);
      
      break; // Only one pad at a time
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
