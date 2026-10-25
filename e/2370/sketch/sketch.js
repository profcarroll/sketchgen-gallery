let energyBands;
let crystals = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Create energy bands - gradient layers
  energyBands = [];
  for (let i = 0; i < 8; i++) {
    const y = map(i, 0, 8, height * 0.3, height * 0.7);
    const h = height * 0.05;
    energyBands.push({
      y: y,
      h: h,
      speed: random(0.001, 0.005),
      color: color(
        map(i, 0, 8, 100, 255),
        map(i, 0, 8, 50, 150),
        map(i, 0, 8, 200, 255),
        150
      )
    });
  }
  
  // Initialize crystals with random positions and sizes
  for (let i = 0; i < 300; i++) {
    crystals.push({
      x: random(width),
      y: random(height * 0.4, height * 0.8),
      size: random(2, 8),
      speed: random(0.01, 0.05),
      phase: random(TWO_PI)
    });
  }
}

function draw() {
  background(10, 5, 20);
  
  time += 0.01;
  
  // Draw energy bands
  for (let i = 0; i < energyBands.length; i++) {
    const band = energyBands[i];
    
    // Animate the band
    let offset = sin(time * band.speed + i) * 20;
    
    // Create gradient effect
    const gradient = drawingContext.createLinearGradient(0, band.y, width, band.y);
    gradient.addColorStop(0, 'rgba(100, 50, 200, 0.3)');
    gradient.addColorStop(0.5, 'rgba(200, 50, 100, 0.4)');
    gradient.addColorStop(1, 'rgba(50, 100, 200, 0.3)');
    
    drawingContext.fillStyle = gradient;
    rect(0, band.y, width, band.h);
    
    // Add subtle movement
    for (let j = 0; j < 20; j++) {
      const x = (time * 0.05 + j) * 100 + offset;
      const y = band.y + band.h / 2 + sin(time * 0.02 + j) * 10;
      const size = map(sin(time * 0.03 + j), -1, 1, 1, 5);
      
      drawingContext.fillStyle = color(200, 100, 255, 100);
      ellipse(x % width, y, size, size);
    }
  }
  
  // Draw crystals
  for (let i = 0; i < crystals.length; i++) {
    const crystal = crystals[i];
    
    // Animate crystal growth and rotation
    let phase = time * crystal.speed + crystal.phase;
    let size = crystal.size + sin(phase) * 2;
    let x = crystal.x + cos(phase) * 5;
    let y = crystal.y + sin(phase) * 3;
    
    // Draw geometric crystal shape
    drawingContext.fillStyle = color(200, 220, 255, 180);
    
    push();
    translate(x, y);
    rotate(phase);
    
    // Draw a simple geometric crystal structure (triangle + square)
    beginShape();
    vertex(0, -size/2);
    vertex(size/2, size/2);
    vertex(-size/2, size/2);
    endShape(CLOSE);
    
    rect(-size/3, size/3, size/1.5, size/2);
    
    pop();
  }
  
  // Add some fluid movement to the energy fields
  drawingContext.globalCompositeOperation = 'lighten';
  for (let i = 0; i < 50; i++) {
    const x = (time * 0.02 + i) * 100;
    const y = height * 0.6 + sin(time * 0.03 + i) * 30;
    const size = map(sin(time * 0.04 + i), -1, 1, 5, 20);
    
    drawingContext.fillStyle = color(150, 100, 255, 50);
    ellipse(x % width, y, size, size);
  }
  drawingContext.globalCompositeOperation = 'source-over';
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
