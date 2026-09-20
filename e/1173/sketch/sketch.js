let pads = [];
let sounds = [];
let padWidth = 100;
let padHeight = 50;
let spacing = 20;
let totalWidth;

function setup() {
  createCanvas(600, 200);
  totalWidth = (padWidth * 5) + (spacing * 4);
  let startX = (width - totalWidth) / 2;

  // Create pads
  for (let i = 0; i < 5; i++) {
    pads.push({
      x: startX + i * (padWidth + spacing),
      y: height / 2 - padHeight / 2,
      width: padWidth,
      height: padHeight,
      color: color(100 + i * 30, 150, 200),
      isLit: false,
      sound: null
    });
  }

  // Create sounds
  for (let i = 0; i < 5; i++) {
    let osc = new p5.Oscillator();
    osc.setType('sine');
    osc.freq(220 + i * 110);
    osc.amp(0);
    osc.start();
    sounds.push(osc);
  }

  // Start audio context on first interaction
  userStartAudio();
}

function draw() {
  background(30);

  // Draw pads
  for (let i = 0; i < pads.length; i++) {
    let pad = pads[i];
    fill(pad.isLit ? color(red(pad.color), green(pad.color), blue(pad.color), 255) : pad.color);
    stroke(255);
    strokeWeight(1);
    rect(pad.x, pad.y, pad.width, pad.height, 15); // rounded corners
  }
}

function mousePressed() {
  let mouseX = pmouseX;
  let mouseY = pmouseY;

  for (let i = 0; i < pads.length; i++) {
    let pad = pads[i];
    if (
      mouseX > pad.x &&
      mouseX < pad.x + pad.width &&
      mouseY > pad.y &&
      mouseY < pad.y + pad.height
    ) {
      // Trigger sound
      sounds[i].amp(0.5, 0.05);
      sounds[i].freq(220 + i * 110, 0.05);

      // Visual feedback
      pad.isLit = true;
      setTimeout(() => {
        pad.isLit = false;
      }, 200);

      break;
    }
  }
}
