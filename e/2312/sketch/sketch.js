let sheets = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Create a grid of flowing sheets
  const gridSize = 120;
  const cols = ceil(width / gridSize) + 2;
  const rows = ceil(height / gridSize) + 2;
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      sheets.push({
        x: col * gridSize - gridSize/2,
        y: row * gridSize - gridSize/2,
        size: gridSize,
        speed: random(0.003, 0.007),
        phase: random(TWO_PI),
        hueShift: random(360)
      });
    }
  }
}

function draw() {
  background(10, 15, 30);
  
  time += 0.01;
  
  // Draw the flowing thermal sheets
  for (let sheet of sheets) {
    const pulse = sin(time * sheet.speed + sheet.phase) * 0.5 + 0.5;
    
    // Create a dynamic color based on position and time
    const hue = (time * 12 + sheet.x * 0.015 + sheet.y * 0.015 + sheet.hueShift) % 360;
    
    // Shift toward cooler blues in diagonal pathways
    const pathX = sheet.x - width/2;
    const pathY = sheet.y - height/2;
    const distanceFromCenter = sqrt(pathX * pathX + pathY * pathY);
    const pathIntensity = map(distanceFromCenter, 0, width, 0.3, 0.8);
    
    // Blend towards cooler blues for thermal effect
    let finalHue = hue;
    if (pathIntensity > 0.5) {
      const blend = map(pathIntensity, 0.5, 1, 0, 1);
      finalHue = lerp(hue, 200, blend * 0.6); // Mix with blue
    }
    
    // Create gradient effect based on pulse
    const bright = 50 + pulse * 50;
    const sat = 80 + sin(time + sheet.phase) * 10;
    
    fill(finalHue, sat, bright, 150);
    
    push();
    translate(sheet.x, sheet.y);
    
    // Draw a flowing thermal gradient using multiple layers
    for (let i = 0; i < 3; i++) {
      const layerSize = sheet.size * (0.9 - i * 0.25);
      const layerAlpha = map(i, 0, 2, 200, 60);
      
      // Create a slightly offset pattern for each layer
      const offsetX = sin(time * 0.7 + i) * 15;
      const offsetY = cos(time * 0.4 + i) * 15;
      
      beginShape();
      for (let j = 0; j < 8; j++) {
        const angle = TWO_PI / 8 * j;
        const px = cos(angle) * layerSize * 0.5 + offsetX;
        const py = sin(angle) * layerSize * 0.5 + offsetY;
        vertex(px, py);
      }
      endShape(CLOSE);
    }
    
    pop();
  }
  
  // Add subtle flowing lines along diagonal pathways
  for (let i = 0; i < 12; i++) {
    const y = (time * 35 + i * 90) % (height + 200) - 100;
    
    // Draw a flowing line with thermal gradient
    for (let j = 0; j < 25; j++) {
      const progress = j / 25;
      const x = y * 0.25 + sin(progress * TWO_PI + time * 1.8) * 70;
      
      // Dynamic color along the flow
      const hue = (time * 18 + progress * 90 + i * 12) % 360;
      const sat = 70;
      const bri = 55 + sin(time + progress * 2.5) * 25;
      
      fill(hue, sat, bri, 100);
      ellipse(x, y, 6 * (1 - progress), 3);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
