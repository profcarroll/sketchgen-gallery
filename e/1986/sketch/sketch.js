let waves = [];
let boatX = 0;
let boatY = 0;
let boatSpeed = 0.2;
let texturePattern;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Create a petrified wood texture pattern
  texturePattern = createGraphics(width, height);
  texturePattern.noiseDetail(2, 0.5);
  texturePattern.loadPixels();
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let n = texturePattern.noise(x * 0.01, y * 0.01) * 255;
      let c = color(n * 0.8, n * 0.6, n * 0.4, 255);
      texturePattern.set(x, y, c);
    }
  }
  texturePattern.updatePixels();
  
  // Initialize waves with random positions and heights
  for (let i = 0; i < 150; i++) {
    waves.push({
      x: random(width),
      y: random(height / 2, height),
      height: random(5, 30),
      speed: random(0.005, 0.02),
      phase: random(TWO_PI),
      amplitude: random(0.01, 0.05)
    });
  }
  
  // Set initial boat position
  boatX = width + 100;
  boatY = height * 0.6;
}

function draw() {
  // Draw textured sky with sunset gradients
  drawSkyGradient();
  
  // Draw textured ocean surface with ripples
  drawTexturedOcean();
  
  // Draw boat
  drawBoat();
  
  // Update boat position
  boatX -= boatSpeed;
  if (boatX < -100) boatX = width + 100;
}

function drawSkyGradient() {
  // Create gradient from deep orange at the horizon to purple at the top
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(color(255, 100, 0), color(100, 30, 150), inter);
    stroke(c);
    line(0, y, width, y);
  }
  
  // Overlay petrified wood texture on sky
  image(texturePattern, 0, 0, width, height * 0.7);
}

function drawTexturedOcean() {
  // Draw textured ocean surface with high-contrast ripples
  for (let i = 0; i < waves.length; i++) {
    let wave = waves[i];
    
    // Update wave phase
    wave.phase += wave.speed;
    
    // Calculate wave height with sine function
    let h = sin(wave.phase) * wave.height;
    
    // Draw ripple with texture effect
    stroke(0, 50); // Very dark, semi-transparent
    noFill();
    beginShape();
    for (let x = 0; x < width; x += 3) {
      let y = wave.y + sin(x * wave.amplitude + wave.phase) * h;
      vertex(x, y);
    }
    endShape();
  }
  
  // Draw petrified wood texture on ocean
  image(texturePattern, 0, height * 0.5, width, height * 0.5);
}

function drawBoat() {
  // Draw sailboat silhouette with organic texture
  fill(0);
  noStroke();
  
  // Boat hull with texture effect
  ellipse(boatX, boatY, 60, 15);
  
  // Mast and sail
  stroke(0);
  line(boatX, boatY - 20, boatX, boatY - 50); // mast
  
  // Sail with texture
  fill(240, 240, 240, 180); // Semi-transparent white sail
  triangle(boatX, boatY - 50, boatX + 30, boatY - 30, boatX, boatY - 20);
  
  // Overlay texture on boat
  image(texturePattern, boatX - 30, boatY - 30, 60, 30);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
