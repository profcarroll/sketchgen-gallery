let pads = [];
let tones = [];

function setup() {
  createCanvas(600, 200);
  colorMode(HSB, 360, 100, 100, 1);
  
  const padWidth = 100;
  const padHeight = 150;
  const spacing = 20;
  const startX = (width - (5 * padWidth + 4 * spacing)) / 2;
  
  for (let i = 0; i < 5; i++) {
    pads.push({
      x: startX + i * (padWidth + spacing),
      y: (height - padHeight) / 2,
      width: padWidth,
      height: padHeight,
      color: color(i * 60, 80, 90),
      isLit: false,
      freq: 220 * pow(2, i)
    });
  }
  
  // Create a silent oscillator for audio context
  tones = pads.map(() => {
    const osc = new p5.Oscillator();
    osc.setType('sine');
    osc.freq(440);
    osc.amp(0);
    osc.start();
    return osc;
  });
}

function draw() {
  background(220, 10, 95);
  
  for (let i = 0; i < pads.length; i++) {
    const pad = pads[i];
    
    if (pad.isLit) {
      fill(pad.color);
      stroke(pad.color);
      strokeWeight(3);
    } else {
      fill(pad.color);
      noStroke();
    }
    
    rect(pad.x, pad.y, pad.width, pad.height, 20);
  }
}

function mousePressed() {
  userStartAudio();
  
  const centerX = width / 2;
  const centerY = height / 2;
  
  for (let i = 0; i < pads.length; i++) {
    const pad = pads[i];
    
    if (
      mouseX > pad.x &&
      mouseX < pad.x + pad.width &&
      mouseY > pad.y &&
      mouseY < pad.y + pad.height
    ) {
      pad.isLit = !pad.isLit;
      
      if (pad.isLit) {
        tones[i].freq(pad.freq);
        tones[i].amp(0.5, 0.1);
        setTimeout(() => {
          tones[i].amp(0, 0.1);
        }, 200);
      }
      
      break;
    }
  }
}
