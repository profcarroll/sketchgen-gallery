let waves = [];
let boatX = 0;
let boatY = 0;
let boatSpeed = 0.2;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Initialize waves with random positions and heights
  for (let i = 0; i < 100; i++) {
    waves.push({
      x: random(width),
      y: random(height / 2, height),
      height: random(5, 20),
      speed: random(0.005, 0.02),
      phase: random(TWO_PI)
    });
  }
  // Set initial boat position
  boatX = width + 100;
  boatY = height * 0.6;
}

function draw() {
  // Draw gradient sky
  drawSkyGradient();
  
  // Draw waves
  drawWaves();
  
  // Draw boat
  drawBoat();
  
  // Update boat position
  boatX -= boatSpeed;
  if (boatX < -100) boatX = width + 100;
}

function drawSkyGradient() {
  // Create a gradient from deep orange at the horizon to pink at the top
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(color(255, 100, 0), color(255, 180, 200), inter);
    stroke(c);
    line(0, y, width, y);
  }
}

function drawWaves() {
  // Draw dark ripples
  for (let i = 0; i < waves.length; i++) {
    let wave = waves[i];
    
    // Update wave phase
    wave.phase += wave.speed;
    
    // Calculate wave height with sine function
    let h = sin(wave.phase) * wave.height;
    
    // Draw ripple
    stroke(0, 30); // Very dark, semi-transparent
    noFill();
    beginShape();
    for (let x = 0; x < width; x += 5) {
      let y = wave.y + sin(x * 0.02 + wave.phase) * h;
      vertex(x, y);
    }
    endShape();
  }
}

function drawBoat() {
  // Draw sailboat silhouette
  fill(0);
  noStroke();
  
  // Boat hull
  ellipse(boatX, boatY, 60, 15);
  
  // Mast and sail
  stroke(0);
  line(boatX, boatY - 20, boatX, boatY - 50); // mast
  fill(240, 240, 240, 180); // Semi-transparent white sail
  triangle(boatX, boatY - 50, boatX + 30, boatY - 30, boatX, boatY - 20); // sail
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
