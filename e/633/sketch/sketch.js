let time = 0;
let noiseScale = 0.02;
let flickerIntensity = 0;

function setup() {
  createCanvas(320, 240);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
}

function draw() {
  time += 0.05;
  flickerIntensity = (sin(time * 2) + 1) * 0.5;

  // Create a rapidly shifting background
  for (let y = 0; y < height; y += 4) {
    for (let x = 0; x < width; x += 4) {
      let nx = x * noiseScale;
      let ny = y * noiseScale;
      let noiseValue = noise(nx + time, ny + time);
      
      // Shift hue and saturation based on position and time
      let h = (noiseValue * 360 + time * 10) % 360;
      let s = 80 + sin(time * 3 + x * 0.01) * 20;
      let b = 50 + noiseValue * 30;

      // Add flicker effect
      let flicker = sin(time * 20 + x * 0.1 + y * 0.1) * 20 * flickerIntensity;
      
      fill(h, s, b + flicker);
      
      // Draw a small rectangle with slight randomness to simulate instability
      rect(x, y, 4, 4);
    }
  }

  // Add some glitch-like distortions
  if (frameCount % 5 === 0) {
    let glitchAmount = 10 * flickerIntensity;
    for (let i = 0; i < 10; i++) {
      let x = random(width);
      let y = random(height);
      let w = random(20, 40);
      let h = random(20, 40);
      fill(random(360), 100, 100);
      rect(x, y, w, h);
    }
  }

  // Simulate screen instability by shifting the canvas
  if (frameCount % 10 === 0) {
    translate(sin(time * 5) * 2, cos(time * 3) * 2);
  }
}
