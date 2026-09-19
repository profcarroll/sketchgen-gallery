let audioContext;
let fft;
let amplitude;

function setup() {
  createCanvas(800, 600);
  colorMode(HSB, 360, 100, 100, 1);
  noLoop();
  noMotion();

  // Initialize audio context
  audioContext = getAudioContext();
  fft = new p5.FFT();
  amplitude = new p5.Amplitude();
}

function draw() {
  background(20, 5, 10);

  // Draw mechanical structure
  drawMechanicalFrame();
  drawStructuralSeams();
  drawMicroFractures();
  drawGrimeAccretion();
}

function drawMechanicalFrame() {
  const frameWidth = width * 0.7;
  const frameHeight = height * 0.6;
  const centerX = width / 2;
  const centerY = height / 2;

  // Main frame
  stroke(180, 30, 40);
  strokeWeight(4);
  noFill();
  rectMode(CENTER);
  rect(centerX, centerY, frameWidth, frameHeight);

  // Inner structural elements
  strokeWeight(2);
  line(centerX - frameWidth/2, centerY, centerX + frameWidth/2, centerY);
  line(centerX, centerY - frameHeight/2, centerX, centerY + frameHeight/2);

  // Angular supports
  strokeWeight(1);
  for (let i = 0; i < 8; i++) {
    const angle = map(i, 0, 8, 0, TWO_PI);
    const x1 = centerX + cos(angle) * frameWidth/2;
    const y1 = centerY + sin(angle) * frameHeight/2;
    const x2 = centerX - cos(angle) * frameWidth/2;
    const y2 = centerY - sin(angle) * frameHeight/2;
    line(x1, y1, x2, y2);
  }

  // Central core
  fill(200, 20, 30);
  noStroke();
  ellipse(centerX, centerY, frameWidth * 0.4, frameHeight * 0.4);
}

function drawStructuralSeams() {
  const centerX = width / 2;
  const centerY = height / 2;
  const frameWidth = width * 0.7;
  const frameHeight = height * 0.6;

  strokeWeight(1);
  for (let i = 0; i < 20; i++) {
    const x = lerp(centerX - frameWidth/2, centerX + frameWidth/2, random());
    const y = lerp(centerY - frameHeight/2, centerY + frameHeight/2, random());
    const hue = map(i, 0, 20, 10, 30); // Oxidized browns to grays
    stroke(hue, 40, 50);
    line(x, y, x + random(-5, 5), y + random(-5, 5));
  }

  // Deep structural seams
  strokeWeight(2);
  for (let i = 0; i < 10; i++) {
    const x1 = lerp(centerX - frameWidth/2, centerX + frameWidth/2, random());
    const y1 = lerp(centerY - frameHeight/2, centerY + frameHeight/2, random());
    const x2 = lerp(centerX - frameWidth/2, centerX + frameWidth/2, random());
    const y2 = lerp(centerX - frameHeight/2, centerX + frameHeight/2, random());
    stroke(30, 10, 20);
    line(x1, y1, x2, y2);
  }
}

function drawMicroFractures() {
  const centerX = width / 2;
  const centerY = height / 2;
  const frameWidth = width * 0.7;
  const frameHeight = height * 0.6;

  strokeWeight(0.5);
  for (let i = 0; i < 100; i++) {
    const x = lerp(centerX - frameWidth/2, centerX + frameWidth/2, random());
    const y = lerp(centerY - frameHeight/2, centerY + frameHeight/2, random());
    const size = random(2, 8);
    
    stroke(20, 10, 15);
    noFill();
    ellipse(x, y, size, size);

    // Spiderweb cracks
    for (let j = 0; j < 3; j++) {
      const angle = random(TWO_PI);
      const len = random(5, 15);
      const x2 = x + cos(angle) * len;
      const y2 = y + sin(angle) * len;
      line(x, y, x2, y2);
    }
  }
}

function drawGrimeAccretion() {
  const centerX = width / 2;
  const centerY = height / 2;
  const frameWidth = width * 0.7;
  const frameHeight = height * 0.6;

  noStroke();
  for (let i = 0; i < 300; i++) {
    const x = lerp(centerX - frameWidth/2, centerX + frameWidth/2, random());
    const y = lerp(centerY - frameHeight/2, centerY + frameHeight/2, random());
    const size = random(1, 3);
    const hue = map(i % 20, 0, 20, 15, 35); // Varied grime hues
    fill(hue, 20, 20);
    ellipse(x, y, size, size);
  }
}

function mousePressed() {
  if (audioContext.state === 'suspended') {
    userStartAudio();
  }

  // Start audio processing
  fft.setInput(amplitude.input);
  loop();
}

function noMotion() {
  // This function ensures the canvas does not change unless explicitly animated by user input
}
