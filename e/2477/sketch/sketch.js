let threads = [];
let veins = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Create a grid of dyed wool threads (background structure)
  let cols = 60;
  let rows = 40;
  let spacingX = width / cols;
  let spacingY = height / rows;
  
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      // Offset every other row for a more organic look
      let offsetX = (y % 2) * spacingX / 2;
      
      threads.push({
        x: x * spacingX + offsetX,
        y: y * spacingY,
        baseSize: random(1, 3),
        color: color(random(40, 90), random(60, 120), random(150, 220)),
        phase: (x + y) * 0.03
      });
    }
  }
  
  // Create a network of crystalline veins
  let veinCols = 20;
  let veinRows = 15;
  let veinSpacingX = width / veinCols;
  let veinSpacingY = height / veinRows;
  
  for (let y = 0; y < veinRows; y++) {
    for (let x = 0; x < veinCols; x++) {
      let offsetX = (y % 2) * veinSpacingX / 2;
      
      veins.push({
        x: x * veinSpacingX + offsetX,
        y: y * veinSpacingY,
        baseSize: random(1, 4),
        color1: color(random(200, 255), random(80, 150), random(30, 80)),
        color2: color(random(100, 180), random(40, 90), random(180, 255)),
        phase: (x + y) * 0.05,
        pulseSpeed: random(0.005, 0.02),
        connections: []
      });
    }
  }
  
  // Create connections between veins
  for (let i = 0; i < veins.length; i++) {
    let v1 = veins[i];
    for (let j = i + 1; j < veins.length; j++) {
      let v2 = veins[j];
      let d = dist(v1.x, v1.y, v2.x, v2.y);
      if (d < 100) { // Only connect nearby veins
        v1.connections.push(j);
        v2.connections.push(i);
      }
    }
  }
}

function draw() {
  background(30, 25, 40); // Deep tapestry background
  
  time++;
  
  // Draw the dyed wool threads as a point cloud
  beginShape(POINTS);
  for (let i = 0; i < threads.length; i++) {
    let t = threads[i];
    
    // Subtle color variation over time
    let hueShift = sin(time * 0.001 + t.phase) * 10;
    fill(hueShift + t.color);
    
    vertex(t.x, t.y);
  }
  endShape();
  
  // Draw the crystalline veins with pulsing connections
  // First draw connections (lines)
  strokeWeight(0.8);
  for (let i = 0; i < veins.length; i++) {
    let v1 = veins[i];
    
    // Apply rhythmic pulse to each vein
    let pulse = sin(time * v1.pulseSpeed + v1.phase) * 0.5 + 0.5;
    let size = v1.baseSize * pulse;
    
    // Draw connections to nearby veins
    for (let j = 0; j < v1.connections.length; j++) {
      let idx = v1.connections[j];
      if (idx >= veins.length) continue;
      
      let v2 = veins[idx];
      
      // Alternate between two complementary colors for veins
      let c = lerpColor(v1.color1, v1.color2, sin(time * 0.003 + v1.phase) * 0.5 + 0.5);
      stroke(c);
      
      line(v1.x, v1.y, v2.x, v2.y);
    }
  }
  
  // Then draw veins themselves as points
  beginShape(POINTS);
  for (let i = 0; i < veins.length; i++) {
    let v = veins[i];
    
    // Apply rhythmic pulse to each vein
    let pulse = sin(time * v.pulseSpeed + v.phase) * 0.5 + 0.5;
    let size = v.baseSize * pulse;
    
    // Alternate between two complementary colors
    let c = lerpColor(v.color1, v.color2, sin(time * 0.003 + v.phase) * 0.5 + 0.5);
    fill(c);
    
    vertex(v.x, v.y);
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
