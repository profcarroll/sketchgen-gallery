let heatWaveOffset = 0;
let treeSwingPhase = 0;
let dragStartX = 0;
let dragOffsetX = 0;
let isDragging = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
}

function draw() {
  background(210, 20, 85); // Muted cerulean sky

  // Draw distant horizon
  fill(30, 30, 70);
  noStroke();
  rect(0, height * 0.7, width, height * 0.3);

  // Draw ground with earth tones
  drawGround();

  // Draw acacia trees
  drawTrees();

  // Draw silhouettes of fauna
  drawFauna();

  // Apply heat wave effect
  drawHeatWaves();

  // Update animation states
  heatWaveOffset += 0.5;
  treeSwingPhase += 0.02;
}

function drawGround() {
  // Base earth tone for ground
  fill(20, 40, 60);
  noStroke();
  rect(0, height * 0.7, width, height * 0.3);

  // Add some texture with darker patches
  for (let i = 0; i < 100; i++) {
    let x = random(width);
    let y = height * 0.7 + random(height * 0.2);
    let sz = random(5, 30);
    fill(10, 50, 45);
    ellipse(x, y, sz, sz);
  }
}

function drawTrees() {
  noStroke();
  for (let i = 0; i < 8; i++) {
    let x = map(i, 0, 7, 0, width);
    // Tree trunk
    fill(25, 60, 30);
    rect(x - 10, height * 0.7 - 80, 20, 80);

    // Tree canopy
    let sway = sin(treeSwingPhase + i) * 5;
    fill(35, 70, 40);
    ellipse(x + sway, height * 0.7 - 100, 60, 60);
  }
}

function drawFauna() {
  // Distant giraffe silhouettes
  for (let i = 0; i < 3; i++) {
    let x = map(i, 0, 2, width * 0.1, width * 0.9);
    fill(0, 0, 10);
    rect(x - 15, height * 0.7 - 80, 30, 80); // Body
    rect(x - 5, height * 0.7 - 120, 10, 40); // Neck
    rect(x - 10, height * 0.7 - 140, 20, 20); // Head
  }

  // Elephant silhouettes
  for (let i = 0; i < 2; i++) {
    let x = map(i, 0, 1, width * 0.2, width * 0.8);
    fill(0, 0, 10);
    rect(x - 20, height * 0.7 - 60, 40, 60); // Body
    rect(x - 10, height * 0.7 - 90, 20, 30); // Head
  }
}

function drawHeatWaves() {
  noStroke();
  for (let i = 0; i < 50; i++) {
    let y = height * 0.7 + random(height * 0.2);
    let w = random(100, 300);
    let h = random(2, 8);
    let alpha = map(i, 0, 50, 0.05, 0.15);
    fill(0, 0, 100, alpha);
    let offset = (i * 0.1 + heatWaveOffset) % 20;
    rect(-100 + offset, y, w, h);
  }
}

function mousePressed() {
  isDragging = true;
  dragStartX = mouseX;
}

function mouseDragged() {
  if (!isDragging) return;
  dragOffsetX = mouseX - dragStartX;
  // Apply distortion to background elements
  let distortionFactor = map(dragOffsetX, -width, width, -10, 10);
  background(210, 20, 85 + distortionFactor * 0.5);
}

function mouseReleased() {
  isDragging = false;
  dragOffsetX = 0;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
