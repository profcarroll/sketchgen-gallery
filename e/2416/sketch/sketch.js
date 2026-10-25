function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  
  // Initialize noise for terrain generation
  noiseSeed(42);
  
  // Create a palette of sunset colors
  palette = [];
  for (let i = 0; i < 100; i++) {
    palette.push(color((i * 3.6) % 360, 80, 90));
  }
}

function draw() {
  background(0, 0, 0, 1);
  
  const cx = width / 2;
  const cy = height / 2;
  const time = millis() * 0.0005;
  
  // Draw textured wet vellum background
  drawVellum();
  
  // Draw crystalline fractal growth
  drawFractalGrowth(cx, cy, time);
}

function drawVellum() {
  // Create a subtle wet vellum texture
  const textureSize = 30;
  for (let x = 0; x < width; x += textureSize) {
    for (let y = 0; y < height; y += textureSize) {
      if ((x + y) % (textureSize * 2) === 0) {
        const noiseVal = noise(x * 0.01, y * 0.01) * 0.2;
        fill(0, 0, 95 - noiseVal * 10);
        rect(x, y, textureSize, textureSize);
      }
    }
  }
}

function drawFractalGrowth(cx, cy, time) {
  const layers = 8;
  const maxRadius = min(width, height) * 0.4;
  
  for (let layer = 0; layer < layers; layer++) {
    const layerRadius = maxRadius * (layer / layers);
    const layerOffset = time * (1 - layer / layers) * 0.3;
    
    push();
    translate(cx, cy);
    
    // Draw crystalline structures
    for (let i = 0; i < 20; i++) {
      const angle = TWO_PI / 20 + layerOffset;
      const x = cos(angle) * layerRadius;
      const y = sin(angle) * layerRadius;
      
      // Layer color based on depth and time
      let hue, saturation, brightness;
      if (layer < 3) {
        // Deep magenta layers
        hue = 300 + 60 * sin(time * 0.2 + layer);
        saturation = 70 + 20 * sin(time * 0.1 + layer);
        brightness = 30 + 40 * cos(time * 0.3 + layer);
      } else if (layer < 6) {
        // Orange layers
        hue = 20 + 40 * sin(time * 0.15 + layer);
        saturation = 80 + 10 * sin(time * 0.2 + layer);
        brightness = 40 + 30 * cos(time * 0.25 + layer);
      } else {
        // Red layers
        hue = 0 + 30 * sin(time * 0.1 + layer);
        saturation = 90 + 10 * sin(time * 0.2 + layer);
        brightness = 50 + 30 * cos(time * 0.3 + layer);
      }
      
      fill(hue, saturation, brightness, 0.7);
      
      // Draw sharp crystal formations
      push();
      translate(x, y);
      rotate(time * 0.1 + i);
      
      const size = 20 + 30 * sin(time * 0.5 + i);
      const depth = 10 + 20 * cos(time * 0.4 + i);
      
      // Draw a fractal crystal
      drawCrystal(size, depth, time * 0.1 + i);
      
      pop();
    }
    
    pop();
  }
  
  // Add growing fractures
  push();
  translate(cx, cy);
  for (let i = 0; i < 10; i++) {
    const angle = time * 0.5 + i * TWO_PI / 10;
    const r = maxRadius * (1 - i/10);
    const size = 20 + 60 * sin(time * 2 + i);
    
    noFill();
    stroke((time * 15 + i * 36) % 360, 80, 90, 0.4);
    ellipse(0, 0, size, size);
  }
  pop();
}

function drawCrystal(size, depth, time) {
  // Draw a sharp crystal formation
  const points = 6;
  beginShape();
  for (let i = 0; i < points; i++) {
    const angle = TWO_PI / points * i + time;
    const r = size + sin(time + i) * depth;
    vertex(cos(angle) * r, sin(angle) * r);
  }
  endShape(CLOSE);
  
  // Add inner crystal details
  fill(0, 0, 100, 0.3);
  beginShape();
  for (let i = 0; i < points; i++) {
    const angle = TWO_PI / points * i + time;
    const r = size * 0.5 + sin(time + i) * depth * 0.5;
    vertex(cos(angle) * r, sin(angle) * r);
  }
  endShape(CLOSE);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
