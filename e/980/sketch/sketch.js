let hexGrid = [];
let gridSize = 60;
let pulse = 0;
let audioContext;
let oscillator;
let analyser;
let fft;
let amplitude;
let clickEffect = { x: 0, y: 0, time: 0 };

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize hex grid
  for (let y = -gridSize; y < height + gridSize; y += gridSize * 1.732) {
    for (let x = -gridSize; x < width + gridSize; x += gridSize * 1.5) {
      let offset = (y / (gridSize * 1.732)) % 2 === 0 ? 0 : gridSize * 0.75;
      hexGrid.push({
        x: x + offset,
        y: y,
        size: gridSize,
        baseHue: random(360),
        phase: random(TWO_PI)
      });
    }
  }

  // Setup audio
  amplitude = new p5.Amplitude();
  fft = new p5.FFT();
}

function draw() {
  background(0);
  
  // Update pulse
  pulse += 0.02;
  
  // Draw hex grid with pulsing effects
  for (let hex of hexGrid) {
    let time = millis() * 0.001;
    let distance = dist(mouseX, mouseY, hex.x, hex.y);
    
    // Base glow intensity
    let baseIntensity = map(sin(pulse + hex.phase), -1, 1, 0.5, 1);
    
    // Click effect
    let clickDist = dist(clickEffect.x, clickEffect.y, hex.x, hex.y);
    if (clickDist < 200) {
      let clickIntensity = map(clickDist, 0, 200, 1, 0);
      baseIntensity += clickIntensity * 0.5;
    }
    
    // Audio influence
    let audioIntensity = amplitude.getLevel();
    baseIntensity += audioIntensity * 0.3;
    
    // Hexagon drawing with pulsing
    push();
    translate(hex.x, hex.y);
    rotate(time * 0.2 + hex.phase);
    
    // Glow effect
    noStroke();
    fill(hex.baseHue, 80, 100 * baseIntensity, 0.7);
    beginShape();
    for (let i = 0; i < 6; i++) {
      let angle = TWO_PI / 6 * i;
      let x = hex.size * cos(angle) * (1 + sin(pulse * 2 + time * 3 + i));
      let y = hex.size * sin(angle) * (1 + sin(pulse * 2 + time * 3 + i));
      vertex(x, y);
    }
    endShape(CLOSE);
    
    // Inner highlight
    fill(hex.baseHue, 80, 100, 0.4);
    beginShape();
    for (let i = 0; i < 6; i++) {
      let angle = TWO_PI / 6 * i;
      let x = hex.size * 0.5 * cos(angle);
      let y = hex.size * 0.5 * sin(angle);
      vertex(x, y);
    }
    endShape(CLOSE);
    
    pop();
  }
  
  // Draw connecting lines between adjacent hexagons
  stroke(200, 80, 90, 0.3);
  noFill();
  for (let i = 0; i < hexGrid.length; i++) {
    let h1 = hexGrid[i];
    for (let j = i + 1; j < hexGrid.length; j++) {
      let h2 = hexGrid[j];
      let d = dist(h1.x, h1.y, h2.x, h2.y);
      if (d < gridSize * 1.8) {
        line(h1.x, h1.y, h2.x, h2.y);
      }
    }
  }
  
  // Update click effect
  if (clickEffect.time > 0) {
    clickEffect.time--;
  }
}

function mousePressed() {
  // Start audio on first interaction
  if (!audioContext) {
    userStartAudio();
    audioContext = getAudioContext();
    oscillator = new p5.Oscillator('sine');
    oscillator.freq(220);
    oscillator.amp(0.1);
    oscillator.start();
    
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 32;
    fft = new p5.FFT(0.8, 32);
  }
  
  // Set click effect
  clickEffect.x = mouseX;
  clickEffect.y = mouseY;
  clickEffect.time = 30;
  
  // Add some audio feedback
  if (oscillator) {
    oscillator.freq(map(mouseX, 0, width, 110, 440));
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
