let keys = [];
let fft;
let mic;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  angleMode(DEGREES);

  // Create piano keys
  const whiteKeyWidth = 40;
  const whiteKeyHeight = 150;
  const whiteKeyDepth = 20;
  const blackKeyWidth = 25;
  const blackKeyHeight = 100;
  const blackKeyDepth = 15;

  let x = -whiteKeyWidth * 7;
  for (let i = 0; i < 14; i++) {
    if (i % 7 !== 2 && i % 7 !== 6) { // White keys
      keys.push({
        type: 'white',
        x: x,
        y: 0,
        z: 0,
        width: whiteKeyWidth,
        height: whiteKeyHeight,
        depth: whiteKeyDepth,
        label: (i % 7 === 0) ? 'C' : 
                (i % 7 === 1) ? 'D' : 
                (i % 7 === 3) ? 'E' : 
                (i % 7 === 4) ? 'F' : 
                (i % 7 === 5) ? 'G' : 
                'A'
      });
    } else { // Black keys
      keys.push({
        type: 'black',
        x: x + whiteKeyWidth * 0.75,
        y: -whiteKeyHeight * 0.3,
        z: 0,
        width: blackKeyWidth,
        height: blackKeyHeight,
        depth: blackKeyDepth
      });
    }
    x += whiteKeyWidth;
  }

  // Setup audio
  fft = new p5.FFT();
  mic = new p5.AudioIn();
}

function draw() {
  background(200);
  ambientLight(100);
  pointLight(255, 255, 255, 0, -100, 200);

  // Camera
  translate(0, 0, -500);
  rotateX(20);
  rotateY(frameCount * 0.2);

  // Draw keys
  for (let key of keys) {
    push();
    translate(key.x, key.y, key.z);
    
    if (key.type === 'white') {
      fill(255);
      stroke(0);
      box(key.width, key.height, key.depth);
      
      // Draw label
      fill(0);
      textSize(16);
      textAlign(CENTER, CENTER);
      text(key.label, 0, key.height * 0.4, 0);
    } else {
      fill(0);
      stroke(50);
      box(key.width, key.height, key.depth);
    }
    pop();
  }

  // Audio analysis
  if (mic.enabled) {
    let spectrum = fft.analyze();
    for (let i = 0; i < spectrum.length; i++) {
      let y = map(i, 0, spectrum.length, height/2, 0);
      let h = map(spectrum[i], 0, 255, 0, height/2);
      stroke(255, 0, 255);
      line(width/2 + i, y, width/2 + i, y - h);
    }
  }
}

function mousePressed() {
  // Start audio on first click
  if (!mic.enabled) {
    userStartAudio();
    mic.start();
  }

  // Check for key press
  let mouseXNorm = map(mouseX, 0, width, -1, 1);
  let mouseYNorm = map(mouseY, 0, height, -1, 1);

  for (let key of keys) {
    let kx = key.x;
    let ky = key.y;
    let kz = key.z;
    
    // Simple bounding box check
    if (mouseXNorm > map(kx - key.width/2, -width/2, width/2, -1, 1) &&
        mouseXNorm < map(kx + key.width/2, -width/2, width/2, -1, 1) &&
        mouseYNorm > map(ky - key.height/2, -height/2, height/2, -1, 1) &&
        mouseYNorm < map(ky + key.height/2, -height/2, height/2, -1, 1)) {
      
      // Play tone
      let osc = new p5.Oscillator();
      osc.setType('sine');
      osc.freq(440);
      osc.amp(0.5);
      osc.start();
      osc.stop(0.5);
      break;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
