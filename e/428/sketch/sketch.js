let grid = [];
let cellSize;
let audioIn;
let fft;
let isRecording = false;
let beatTriggered = false;
let beatTime = 0;
let beatDuration = 30;

function setup() {
  createCanvas(windowWidth, windowHeight);
  cellSize = min(width, height) / 16;
  initializeGrid();
  
  // Initialize audio
  audioIn = new p5.AudioIn();
  fft = new p5.FFT();
  
  // Start audio on user gesture
  mousePressed = function() {
    if (!isRecording) {
      audioIn.start();
      fft.setInput(audioIn);
      isRecording = true;
    }
  };
}

function initializeGrid() {
  for (let i = 0; i < 16; i++) {
    grid[i] = [];
    for (let j = 0; j < 16; j++) {
      grid[i][j] = {
        hue: random(360),
        saturation: 100,
        brightness: 50,
        active: false
      };
    }
  }
}

function draw() {
  background(0);
  
  // Get audio data
  let spectrum = fft.analyze();
  let bass = fft.getEnergy("bass");
  let treble = fft.getEnergy("treble");
  
  // Update grid colors based on audio
  for (let i = 0; i < 16; i++) {
    for (let j = 0; j < 16; j++) {
      let cell = grid[i][j];
      
      // Base color changes with audio
      cell.hue = (cell.hue + 0.5) % 360;
      cell.brightness = map(bass, 0, 255, 30, 100);
      
      // Flash on beat
      if (beatTriggered && frameCount < beatTime + beatDuration) {
        cell.brightness = 100;
      } else {
        cell.active = false;
      }
    }
  }
  
  // Draw grid
  for (let i = 0; i < 16; i++) {
    for (let j = 0; j < 16; j++) {
      let cell = grid[i][j];
      fill(cell.hue, cell.saturation, cell.brightness);
      noStroke();
      
      // Draw pulsing effect
      let pulseSize = map(bass, 0, 255, 0, cellSize * 0.3);
      ellipse(
        i * cellSize + cellSize / 2,
        j * cellSize + cellSize / 2,
        cellSize - pulseSize,
        cellSize - pulseSize
      );
    }
  }
  
  // Trigger beat on click
  if (mouseIsPressed && !beatTriggered) {
    triggerBeat();
  }
}

function triggerBeat() {
  beatTriggered = true;
  beatTime = frameCount;
  
  // Light up a random pattern
  for (let i = 0; i < 16; i++) {
    for (let j = 0; j < 16; j++) {
      if (random() > 0.7) {
        grid[i][j].active = true;
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  cellSize = min(width, height) / 16;
}
