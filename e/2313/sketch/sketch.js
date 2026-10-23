function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  
  // Initialize noise for terrain generation
  noiseSeed(42);
}

function draw() {
  background(0, 0, 0, 1);
  
  const cx = width / 2;
  const cy = height / 2;
  const time = millis() * 0.0001;
  
  // Draw textured newsprint background
  drawNewsprint();
  
  // Draw sedimentary layers with petrified forest impressions
  drawSedimentaryLayers(cx, cy, time);
}

function drawNewsprint() {
  // Create a subtle newsprint texture
  const textureSize = 20;
  for (let x = 0; x < width; x += textureSize) {
    for (let y = 0; y < height; y += textureSize) {
      if ((x + y) % (textureSize * 2) === 0) {
        const noiseVal = noise(x * 0.01, y * 0.01) * 0.3;
        fill(0, 0, 95 - noiseVal * 10);
        rect(x, y, textureSize, textureSize);
      }
    }
  }
}

function drawSedimentaryLayers(cx, cy, time) {
  const layers = 12;
  const maxRadius = min(width, height) * 0.4;
  
  for (let layer = 0; layer < layers; layer++) {
    const layerRadius = maxRadius * (layer / layers);
    const layerOffset = time * (1 - layer / layers) * 0.5;
    
    push();
    translate(cx, cy);
    
    // Create horizontal striations
    for (let i = 0; i < 20; i++) {
      const angle = TWO_PI / 20;
      const y = (i - 10) * 30 + sin(time * 0.5 + layer * 0.2) * 5;
      
      // Layer color based on depth
      let hue, saturation, brightness;
      if (layer < 3) {
        // Deep ochre layers
        hue = 20;
        saturation = 60 + 40 * sin(time * 0.3 + layer);
        brightness = 20 + 30 * cos(time * 0.5 + layer);
      } else if (layer < 8) {
        // Slate gray layers
        hue = 240;
        saturation = 10 + 30 * sin(time * 0.2 + layer);
        brightness = 30 + 40 * cos(time * 0.4 + layer);
      } else {
        // Surface sediment with petrified forest impressions
        hue = 250;
        saturation = 15 + 20 * sin(time * 0.3 + layer);
        brightness = 40 + 30 * cos(time * 0.5 + layer);
      }
      
      fill(hue, saturation, brightness, 0.7);
      
      // Draw horizontal striation
      beginShape();
      for (let j = 0; j < 20; j++) {
        const x = (j - 10) * 30;
        const noiseY = noise(x * 0.01, y * 0.01 + time * 0.1) * 5;
        vertex(x, y + noiseY);
      }
      endShape(CLOSE);
    }
    
    // Add petrified forest impressions
    if (layer > 8) {
      for (let i = 0; i < 20; i++) {
        const x = (i - 10) * 40;
        const y = sin(time * 0.3 + i * 0.5) * 20;
        
        // Create forest impression pattern
        push();
        translate(x, y);
        rotate(time * 0.1 + i);
        
        const treeHue = 250;
        const treeSat = 20 + 10 * sin(time * 0.2 + i);
        const treeBright = 30 + 20 * cos(time * 0.4 + i);
        fill(treeHue, treeSat, treeBright, 0.6);
        
        // Draw tree-like structure
        beginShape();
        for (let j = 0; j < 10; j++) {
          const angle = map(j, 0, 9, 0, TWO_PI);
          const r = 10 + 5 * sin(time * 0.2 + j);
          vertex(cos(angle) * r, sin(angle) * r);
        }
        endShape(CLOSE);
        
        pop();
      }
    }
    
    pop();
  }
  
  // Add wet ink effect
  push();
  translate(cx, cy);
  for (let i = 0; i < 20; i++) {
    const angle = time * 0.5 + i * TWO_PI / 20;
    const r = maxRadius * (1 - i/20);
    const size = 30 + 60 * sin(time * 2 + i);
    
    noFill();
    stroke((time * 15 + i * 18) % 360, 80, 90, 0.3);
    ellipse(0, 0, size, size);
  }
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
