let pads = [];
let padWidth = 100;
let padHeight = 40;
let spacing = 20;
let colors = [
  [255, 50, 50],    // red
  [50, 255, 50],    // green
  [50, 50, 255],    // blue
  [255, 255, 50],   // yellow
  [255, 50, 255]    // magenta
];
let sounds = [];
let activePad = -1;

function setup() {
  createCanvas(600, 200);
  noStroke();
  
  // Create pads
  for (let i = 0; i < 5; i++) {
    let x = (width - (padWidth * 5 + spacing * 4)) / 2 + i * (padWidth + spacing);
    let y = height / 2 - padHeight / 2;
    pads.push({
      x: x,
      y: y,
      width: padWidth,
      height: padHeight,
      color: colors[i],
      active: false
    });
    
    // Create sound for each pad
    let osc = new p5.Oscillator();
    osc.setType('sine');
    osc.freq(220 * pow(2, i / 12)); // Each pad plays a different note
    osc.amp(0);
    osc.start();
    sounds.push(osc);
  }
}

function draw() {
  background(30);
  
  // Draw pads
  for (let i = 0; i < pads.length; i++) {
    let pad = pads[i];
    
    if (pad.active) {
      fill(pad.color[0], pad.color[1], pad.color[2]);
      rect(pad.x, pad.y, pad.width, pad.height, 15);
    } else {
      fill(60);
      rect(pad.x, pad.y, pad.width, pad.height, 15);
    }
  }
}

function mousePressed() {
  // Start audio on first user interaction
  userStartAudio();
  
  // Check if any pad was clicked
  for (let i = 0; i < pads.length; i++) {
    let pad = pads[i];
    if (mouseX > pad.x && mouseX < pad.x + pad.width &&
        mouseY > pad.y && mouseY < pad.y + pad.height) {
      
      // Activate the pad
      pad.active = true;
      activePad = i;
      
      // Play sound
      sounds[i].freq(220 * pow(2, i / 12));
      sounds[i].amp(0.5, 0.05);
      
      // Deactivate after a short time
      setTimeout(() => {
        pad.active = false;
        sounds[i].amp(0, 0.1);
        activePad = -1;
      }, 300);
      
      break;
    }
  }
}
