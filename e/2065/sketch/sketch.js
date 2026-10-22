let veins = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Create a grid of vein patterns
  const gridSize = 80;
  const cols = ceil(width / gridSize) + 2;
  const rows = ceil(height / gridSize) + 2;
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      veins.push({
        x: col * gridSize - gridSize/2,
        y: row * gridSize - gridSize/2,
        size: gridSize,
        speed: random(0.002, 0.005),
        phase: random(TWO_PI),
        hueShift: random(360)
      });
    }
  }
}

function draw() {
  background(15, 20, 35);
  
  time += 0.01;
  
  // Draw the main thermal vein pattern
  for (let vein of veins) {
    const pulse = sin(time * vein.speed + vein.phase) * 0.5 + 0.5;
    
    // Create a dynamic color based on position and time
    const hue = (time * 15 + vein.x * 0.02 + vein.y * 0.02 + vein.hueShift) % 360;
    
    // Shift toward cooler blues in diagonal pathways
    const pathX = vein.x - width/2;
    const pathY = vein.y - height/2;
    const distanceFromCenter = sqrt(pathX * pathX + pathY * pathY);
    const pathIntensity = map(distanceFromCenter, 0, width, 0.3, 0.8);
    
    // Blend towards cooler blues for thermal effect
    let finalHue = hue;
    if (pathIntensity > 0.5) {
      const blend = map(pathIntensity, 0.5, 1, 0, 1);
      finalHue = lerp(hue, 200, blend * 0.7); // Mix with blue
    }
    
    // Create gradient effect based on pulse
    const bright = 60 + pulse * 40;
    const sat = 85 + sin(time + vein.phase) * 15;
    
    fill(finalHue, sat, bright, 200);
    
    push();
    translate(vein.x, vein.y);
    
    // Draw a patterned thermal gradient using multiple layers
    for (let i = 0; i < 4; i++) {
      const layerSize = vein.size * (0.8 - i * 0.15);
      const layerAlpha = map(i, 0, 3, 255, 60);
      
      // Create a slightly offset pattern for each layer
      const offsetX = sin(time * 0.5 + i) * 10;
      const offsetY = cos(time * 0.3 + i) * 10;
      
      beginShape();
      for (let j = 0; j < 6; j++) {
        const angle = TWO_PI / 6 * j;
        const px = cos(angle) * layerSize * 0.5 + offsetX;
        const py = sin(angle) * layerSize * 0.5 + offsetY;
        vertex(px, py);
      }
      endShape(CLOSE);
    }
    
    pop();
  }
  
  // Add subtle flowing lines along diagonal pathways
  for (let i = 0; i < 15; i++) {
    const y = (time * 40 + i * 80) % (height + 200) - 100;
    
    // Draw a flowing line with thermal gradient
    for (let j = 0; j < 20; j++) {
      const progress = j / 20;
      const x = y * 0.3 + sin(progress * TWO_PI + time * 2) * 80;
      
      // Dynamic color along the flow
      const hue = (time * 15 + progress * 100 + i * 10) % 360;
      const sat = 75;
      const bri = 60 + sin(time + progress * 3) * 20;
      
      fill(hue, sat, bri, 120);
      ellipse(x, y, 8 * (1 - progress), 4);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
