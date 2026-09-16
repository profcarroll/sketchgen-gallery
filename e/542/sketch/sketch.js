let staticParticles = [];
let isProcessing = false;
let processingTimer = 0;
let flashActive = false;
let focusBoxVisible = false;
let focusBoxTimer = 0;

function setup() {
  createCanvas(360, 640);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize static particles
  for (let i = 0; i < 500; i++) {
    staticParticles.push({
      x: random(width),
      y: random(height),
      size: random(1, 3),
      brightness: random(20, 80)
    });
  }
}

function draw() {
  background(0);
  
  // Draw static background
  drawStatic();
  
  // Draw viewfinder overlay
  drawViewfinder();
  
  // Handle processing state
  if (isProcessing) {
    processImage();
  } else {
    // Draw live viewfinder content
    drawLiveView();
  }
  
  // Flash effect
  if (flashActive) {
    drawFlash();
  }
  
  // Focus box
  if (focusBoxVisible) {
    drawFocusBox();
  }
  
  // Update timers
  if (processingTimer > 0) {
    processingTimer--;
  } else if (isProcessing) {
    isProcessing = false;
  }
  
  if (focusBoxTimer > 0) {
    focusBoxTimer--;
  } else if (focusBoxVisible) {
    focusBoxVisible = false;
  }
}

function drawStatic() {
  noStroke();
  for (let p of staticParticles) {
    fill(0, 0, p.brightness, 0.1);
    ellipse(p.x, p.y, p.size);
  }
}

function drawLiveView() {
  // Simulate camera view with some flickering
  let time = millis() * 0.001;
  
  // Draw scene elements
  fill(120, 50, 70);
  rect(0, 0, width, height * 0.3);
  
  fill(240, 60, 80);
  rect(0, height * 0.3, width, height * 0.4);
  
  fill(60, 70, 90);
  rect(0, height * 0.7, width, height * 0.3);
  
  // Add some random elements to simulate a scene
  for (let i = 0; i < 20; i++) {
    let x = map(noise(time + i), 0, 1, 0, width);
    let y = map(noise(time + i * 0.5), 0, 1, height * 0.3, height);
    let size = map(noise(time + i * 2), 0, 1, 5, 20);
    
    fill(0, 0, 90);
    ellipse(x, y, size);
  }
  
  // Simulate subtle flickering
  if (random() < 0.05) {
    fill(255, 30);
    rect(0, 0, width, height);
  }
}

function drawViewfinder() {
  noFill();
  stroke(0, 0, 100);
  strokeWeight(2);
  
  // Main frame
  rect(0, 0, width, height);
  
  // Inner border
  rect(10, 10, width - 20, height - 20);
  
  // Viewfinder area
  let viewWidth = width * 0.8;
  let viewHeight = height * 0.7;
  let viewX = (width - viewWidth) / 2;
  let viewY = (height - viewHeight) / 2;
  
  rect(viewX, viewY, viewWidth, viewHeight);
  
  // Center crosshair
  strokeWeight(1);
  line(width/2 - 10, height/2, width/2 + 10, height/2);
  line(width/2, height/2 - 10, width/2, height/2 + 10);
  
  // Info overlay
  fill(0, 0, 100);
  noStroke();
  textSize(12);
  text("NOKIA N900", 10, 20);
  text("Flash", 10, height - 20);
}

function drawFlash() {
  if (frameCount % 5 === 0) {
    fill(255, 0.7);
    rect(0, 0, width, height);
  }
}

function drawFocusBox() {
  let size = 60;
  let x = width/2 - size/2;
  let y = height/2 - size/2;
  
  stroke(0, 0, 100);
  strokeWeight(2);
  noFill();
  rect(x, y, size, size);
}

function processImage() {
  // Simulate processing by drawing an AI-enhanced effect
  if (processingTimer > 15) {
    // Draw enhanced scene
    fill(0, 0, 100, 0.2);
    rect(0, 0, width, height);
    
    // Draw some abstract shapes to simulate enhancement
    noStroke();
    for (let i = 0; i < 50; i++) {
      let x = random(width);
      let y = random(height);
      let size = random(10, 50);
      fill(random(360), 80, 80, 0.3);
      ellipse(x, y, size);
    }
  } else if (processingTimer > 5) {
    // Draw processing effect
    for (let i = 0; i < 100; i++) {
      let x = random(width);
      let y = random(height);
      let size = random(2, 8);
      fill(255, 0.5);
      ellipse(x, y, size);
    }
  } else {
    // Draw raw viewfinder
    drawLiveView();
  }
}

function mousePressed() {
  if (!isProcessing) {
    isProcessing = true;
    processingTimer = 30;
    flashActive = true;
    focusBoxVisible = true;
    focusBoxTimer = 15;
    
    setTimeout(() => {
      flashActive = false;
    }, 200);
  }
}
