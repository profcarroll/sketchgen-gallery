let waves = [];
let numWaves = 100;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize waves with varying properties for organic feel
  for (let i = 0; i < numWaves; i++) {
    waves.push({
      x: random(width),
      y: random(height),
      radius: random(20, 80),
      speed: random(0.002, 0.01),
      hue: random(360),
      amp: random(0.5, 1.5),
      phase: random(TWO_PI)
    });
  }
}

function draw() {
  // Subtle fade for trail effect
  fill(0, 0, 0, 0.02);
  rect(0, 0, width, height);

  time += 0.01;

  // Draw interconnected flowing waves
  beginShape();
  noFill();
  stroke(180, 80, 90, 0.7);
  strokeWeight(1.5);

  for (let i = 0; i < numWaves; i++) {
    let wave = waves[i];
    
    // Base wave motion
    let y = wave.y + sin(time * wave.speed + wave.phase) * wave.radius * wave.amp;
    
    // Wave drift across screen
    let x = (wave.x + time * 0.2) % width;

    // Connect waves to form continuous flow
    if (i === 0) {
      vertex(x, y);
    } else {
      // Draw smooth curve connecting points
      let prevWave = waves[i - 1];
      let prevX = (prevWave.x + time * 0.2) % width;
      let prevY = prevWave.y + sin(time * prevWave.speed + prevWave.phase) * prevWave.radius * prevWave.amp;
      
      // Use bezier for smooth transitions
      bezierVertex(
        (prevX + x) / 2, y,
        (prevX + x) / 2, prevY,
        x, y
      );
    }
  }

  endShape();

  // Add subtle pulsing to create rhythm
  let pulse = sin(time * 0.5) * 0.1 + 0.95;
  
  // Adjust wave properties based on global pulse
  for (let wave of waves) {
    wave.radius *= pulse;
    wave.radius = constrain(wave.radius, 10, 120);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
