let hexGrid = [];
let pulseTime = 0;
let crystallizationProgress = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Create hexagonal grid
  let hexSize = 40;
  let cols = ceil(width / (hexSize * 1.5)) + 2;
  let rows = ceil(height / (hexSize * sqrt(3))) + 2;
  
  for (let j = 0; j < rows; j++) {
    hexGrid[j] = [];
    for (let i = 0; i < cols; i++) {
      let x = i * hexSize * 1.5;
      let y = j * hexSize * sqrt(3);
      if (j % 2 === 1) x += hexSize * 0.75;
      
      hexGrid[j][i] = {
        x: x,
        y: y,
        size: hexSize,
        baseColor: color(80, 120, 180, 150),
        pulseOffset: random(TWO_PI)
      };
    }
  }
}

function draw() {
  background(10, 15, 30);
  
  pulseTime += 0.03;
  crystallizationProgress = sin(pulseTime * 0.5) * 0.5 + 0.5;
  
  // Draw hexagonal lattice
  for (let j = 0; j < hexGrid.length; j++) {
    for (let i = 0; i < hexGrid[j].length; i++) {
      let hex = hexGrid[j][i];
      
      // Base hexagon with pulse effect
      let pulse = sin(pulseTime + hex.pulseOffset) * 0.3 + 0.7;
      let glowIntensity = map(pulse, 0.7, 1, 0, 255);
      
      fill(red(hex.baseColor), green(hex.baseColor), blue(hex.baseColor), 180);
      drawHexagon(hex.x, hex.y, hex.size * pulse);
      
      // Crystallization effect
      if (crystallizationProgress > 0.3) {
        let crystalIntensity = map(crystallizationProgress, 0.3, 1, 0, 1);
        let crystalSize = hex.size * 0.3 * crystalIntensity;
        
        fill(255, 255, 255, 100 * crystalIntensity);
        drawCrystal(hex.x, hex.y, crystalSize);
      }
    }
  }
  
  // Electrical pulses
  if (pulseTime > 0) {
    drawElectricalPulses();
  }
}

function drawHexagon(x, y, size) {
  beginShape();
  for (let i = 0; i < 6; i++) {
    let angle = TWO_PI * i / 6;
    let px = x + cos(angle) * size;
    let py = y + sin(angle) * size;
    vertex(px, py);
  }
  endShape(CLOSE);
}

function drawCrystal(x, y, size) {
  // Draw a simple crystal structure
  push();
  translate(x, y);
  
  for (let i = 0; i < 6; i++) {
    let angle = TWO_PI * i / 6;
    let endX = cos(angle) * size;
    let endY = sin(angle) * size;
    
    stroke(255, 255, 255, 180);
    strokeWeight(1);
    line(0, 0, endX, endY);
  }
  
  pop();
}

function drawElectricalPulses() {
  let pulseCount = 10;
  for (let i = 0; i < pulseCount; i++) {
    let timeOffset = i * 0.3;
    let progress = (pulseTime + timeOffset) % TWO_PI;
    
    if (progress > PI && progress < TWO_PI) {
      let pulseSize = map(progress, PI, TWO_PI, 0, 150);
      let alpha = map(progress, PI, TWO_PI, 200, 0);
      
      stroke(255, 255, 255, alpha);
      strokeWeight(2);
      noFill();
      
      beginShape();
      for (let j = 0; j < 100; j++) {
        let angle = TWO_PI * j / 100;
        let radius = pulseSize + sin(j * 0.3 + pulseTime) * 10;
        let px = cos(angle) * radius;
        let py = sin(angle) * radius;
        vertex(px, py);
      }
      endShape(CLOSE);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
