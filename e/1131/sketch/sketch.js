const pads = [];
let audioReady = false;
let fft;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);

  // Create five pads
  const padWidth = width / 5;
  const padHeight = height * 0.4;
  const padY = height / 2 - padHeight / 2;

  for (let i = 0; i < 5; i++) {
    pads.push({
      x: i * padWidth,
      y: padY,
      width: padWidth,
      height: padHeight,
      color: color(i * 60, 80, 90),
      hoverColor: color(i * 60, 80, 100),
      isLit: false,
      glowIntensity: 0,
      note: 261.63 + i * 440 // C4, D4, E4, F4, G4
    });
  }

  // Setup audio
  fft = new p5.FFT();
}

function draw() {
  background(0);

  // Draw pads
  for (let pad of pads) {
    // Draw glow effect
    if (pad.glowIntensity > 0) {
      noFill();
      strokeWeight(4);
      stroke(pad.color);
      strokeJoin(ROUND);
      push();
      translate(pad.x + pad.width / 2, pad.y + pad.height / 2);
      scale(1 + pad.glowIntensity * 0.1);
      rect(-pad.width / 2, -pad.height / 2, pad.width, pad.height, 10);
      pop();
    }

    // Draw pad
    fill(pad.isLit ? pad.hoverColor : pad.color);
    noStroke();
    rect(pad.x, pad.y, pad.width, pad.height, 10);

    // Draw border
    strokeWeight(2);
    stroke(pad.color);
    noFill();
    rect(pad.x, pad.y, pad.width, pad.height, 10);
  }

  // Update glow
  for (let pad of pads) {
    if (pad.glowIntensity > 0) {
      pad.glowIntensity -= 0.02;
    }
  }
}

function mousePressed() {
  if (!audioReady) {
    userStartAudio();
    audioReady = true;
  }

  // Check for pad click
  for (let pad of pads) {
    if (
      mouseX > pad.x &&
      mouseX < pad.x + pad.width &&
      mouseY > pad.y &&
      mouseY < pad.y + pad.height
    ) {
      // Light up the pad
      pad.isLit = true;
      pad.glowIntensity = 1;

      // Play note
      const osc = new p5.Oscillator();
      osc.setType('sine');
      osc.freq(pad.note);
      osc.amp(0.3);
      osc.start();
      osc.stop(millis() + 500);

      break;
    }
  }

  return false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
