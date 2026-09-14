let squares = [];
let audioIn;
let fft;
let waveRadius = 0;
let waveSpeed = 3;
let waveActive = false;
let waveCenterX, waveCenterY;
let lowFreqThreshold = 0.5;
let flashColor;

class Square {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = random(4, 8);
    this.baseSize = this.size;
    this.breathPhase = random(TWO_PI);
    this.breathSpeed = random(0.02, 0.05);
    this.color = color(20, 10, 15);
    this.flashIntensity = 0;
  }

  update() {
    this.breathPhase += this.breathSpeed;
    let breath = sin(this.breathPhase) * 0.5 + 0.5;
    this.size = this.baseSize + breath * 2;

    if (this.flashIntensity > 0) {
      this.flashIntensity -= 0.05;
    }
  }

  display() {
    fill(this.color);
    noStroke();
    rect(this.x, this.y, this.size, this.size, 2);

    if (this.flashIntensity > 0) {
      let flash = lerpColor(color(255, 100, 0), color(255, 255, 255), this.flashIntensity);
      fill(flash);
      rect(this.x, this.y, this.size, this.size, 2);
    }
  }

  checkWave(x, y, radius) {
    let d = dist(this.x + this.size/2, this.y + this.size/2, x, y);
    if (d < radius && d > radius - 10) {
      this.flashIntensity = 1;
      return true;
    }
    return false;
  }
}

function setup() {
  createCanvas(400, 400);
  colorMode(HSB, 255);

  // Initialize squares
  for (let x = 0; x < width; x += 20) {
    for (let y = 0; y < height; y += 20) {
      squares.push(new Square(x, y));
    }
  }

  // Audio setup
  audioIn = new p5.AudioIn();
  fft = new p5.FFT();
  audioIn.start();
  fft.setInput(audioIn);

  flashColor = color(255, 100, 0);
}

function draw() {
  background(10, 5, 10);

  // Update and display squares
  for (let square of squares) {
    square.update();
    square.display();
  }

  // Handle wave propagation
  if (waveActive) {
    waveRadius += waveSpeed;
    if (waveRadius > max(width, height)) {
      waveActive = false;
      waveRadius = 0;
    }
  }

  // Check if any square is hit by the wave
  if (waveActive) {
    for (let square of squares) {
      square.checkWave(waveCenterX, waveCenterY, waveRadius);
    }
  }

  // Analyze audio for low frequencies
  let spectrum = fft.analyze();
  let lowFreq = 0;
  for (let i = 0; i < 10; i++) {
    lowFreq += spectrum[i];
  }
  lowFreq /= 10;

  if (lowFreq > 200) {
    for (let square of squares) {
      if (random() < 0.05) {
        square.flashIntensity = 1;
      }
    }
  }
}

function mousePressed() {
  waveActive = true;
  waveCenterX = mouseX;
  waveCenterY = mouseY;
  waveRadius = 0;
}
