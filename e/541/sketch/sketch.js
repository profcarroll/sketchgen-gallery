let particles = [];
let grid = [];
let glitchIntensity = 0;
let decay = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create a grid of particles
  let gridSize = 20;
  for (let i = 0; i < gridSize; i++) {
    grid[i] = [];
    for (let j = 0; j < gridSize; j++) {
      grid[i][j] = createVector(
        map(i, 0, gridSize - 1, -width / 3, width / 3),
        map(j, 0, gridSize - 1, -height / 3, height / 3),
        0
      );
    }
  }

  // Create central figure particles
  for (let i = 0; i < 500; i++) {
    let angle = random(TWO_PI);
    let radius = random(100, 200);
    let x = cos(angle) * radius;
    let y = sin(angle) * radius;
    let z = random(-50, 50);
    particles.push(createVector(x, y, z));
  }
}

function draw() {
  background(0);
  noStroke();

  // Simulate glitch effect
  glitchIntensity = map(noise(frameCount * 0.01), 0, 1, 0, 0.5);
  decay = map(noise(frameCount * 0.02 + 100), 0, 1, 0, 0.02);

  // Apply camera movement for instability
  let time = frameCount * 0.001;
  camera(
    sin(time) * 500,
    cos(time * 0.7) * 300,
    800 + sin(time * 0.5) * 200,
    0,
    0,
    0,
    0,
    1,
    0
  );

  // Draw central figure particles with distortion
  beginShape(POINTS);
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    // Apply decay effect
    p.x += random(-decay, decay) * 100;
    p.y += random(-decay, decay) * 100;
    p.z += random(-decay, decay) * 100;

    // Apply glitch distortion
    let distortion = noise(p.x * 0.01, p.y * 0.01, time) * glitchIntensity * 200;
    p.x += distortion;
    p.y += distortion;

    // Color based on position and time
    let hue = (frameCount + p.x + p.y) % 360;
    fill(hue, 80, 70, 0.8);
    
    // Draw particle with slight glow effect
    vertex(p.x, p.y, p.z);
  }
  endShape();

  // Draw grid lines with chromatic aberration
  stroke(0, 0, 100, 0.2);
  noFill();
  for (let i = 0; i < grid.length - 1; i++) {
    beginShape(LINES);
    for (let j = 0; j < grid[i].length; j++) {
      let a = grid[i][j];
      let b = grid[i + 1][j];

      // Apply chromatic aberration
      let offset = noise(a.x * 0.01, a.y * 0.01, time) * 20;
      vertex(a.x + offset, a.y, a.z);
      vertex(b.x + offset, b.y, b.z);
    }
    endShape();
  }

  // Draw unstable background
  for (let i = 0; i < 50; i++) {
    let x = random(-width / 2, width / 2);
    let y = random(-height / 2, height / 2);
    let size = random(10, 50);
    
    // Apply glitch color shifts
    let hue = (frameCount * 2 + i * 10) % 360;
    fill(hue, 80, 50, 0.1);
    ellipse(x, y, size, size);
  }
}

function mousePressed() {
  // Intensify instability on mouse press
  glitchIntensity = 1;
  decay = 0.1;
}

function mouseReleased() {
  // Reset to normal
  glitchIntensity = 0;
  decay = 0;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
