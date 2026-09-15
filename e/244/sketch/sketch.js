let grids = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create multiple grid layers with different properties
  for (let i = 0; i < 5; i++) {
    grids.push({
      rows: 15 + i * 5,
      cols: 15 + i * 5,
      size: 80 + i * 20,
      speed: 0.002 + i * 0.001,
      hue: (i * 60) % 360,
      alpha: 0.7 - i * 0.1
    });
  }
}

function draw() {
  background(0);
  time += 0.01;
  
  // Draw each grid layer
  for (let i = 0; i < grids.length; i++) {
    let g = grids[i];
    
    // Calculate pulsing effect
    let pulse = sin(time * g.speed * 20) * 0.3 + 0.7;
    let strokeVal = map(pulse, 0, 1, 80, 100);
    
    push();
    translate(width/2, height/2);
    
    // Draw grid lines
    stroke(g.hue, 80, strokeVal, g.alpha);
    strokeWeight(1.5 * pulse);
    
    for (let row = 0; row < g.rows; row++) {
      let y = map(row, 0, g.rows - 1, -g.size/2, g.size/2);
      
      beginShape();
      for (let col = 0; col < g.cols; col++) {
        let x = map(col, 0, g.cols - 1, -g.size/2, g.size/2);
        
        // Add subtle jitter to line positions
        let jitter = sin(time * g.speed + row * 0.1 + col * 0.2) * 3;
        vertex(x + jitter, y + jitter);
      }
      endShape();
      
      beginShape();
      for (let col = 0; col < g.cols; col++) {
        let x = map(col, 0, g.cols - 1, -g.size/2, g.size/2);
        let y = map(row, 0, g.rows - 1, -g.size/2, g.size/2);
        
        // Add subtle jitter to line positions
        let jitter = sin(time * g.speed + row * 0.1 + col * 0.2) * 3;
        vertex(x + jitter, y + jitter);
      }
      endShape();
    }
    
    pop();
  }
  
  // Draw connecting lines between grids
  stroke(200, 80, 90, 0.3);
  strokeWeight(0.5);
  
  for (let i = 0; i < grids.length - 1; i++) {
    let g1 = grids[i];
    let g2 = grids[i + 1];
    
    let size1 = g1.size;
    let size2 = g2.size;
    
    beginShape(LINES);
    for (let row = 0; row < min(g1.rows, g2.rows); row++) {
      let y1 = map(row, 0, g1.rows - 1, -size1/2, size1/2);
      let y2 = map(row, 0, g2.rows - 1, -size2/2, size2/2);
      
      for (let col = 0; col < min(g1.cols, g2.cols); col++) {
        let x1 = map(col, 0, g1.cols - 1, -size1/2, size1/2);
        let x2 = map(col, 0, g2.cols - 1, -size2/2, size2/2);
        
        // Connect corresponding points
        vertex(x1, y1);
        vertex(x2, y2);
      }
    }
    endShape();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
