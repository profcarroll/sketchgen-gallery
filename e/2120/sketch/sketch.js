let veins = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  
  // Create a grid of crystalline veins
  let cols = 30;
  let rows = 25;
  let spacingX = width / cols;
  let spacingY = height / rows;
  
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      // Offset every other row for a more organic look
      let offsetX = (y % 2) * spacingX / 2;
      
      veins.push({
        x: x * spacingX + offsetX - width/2,
        y: y * spacingY - height/2,
        z: 0,
        baseSize: random(5, 15),
        color: color(random(40, 120), random(70, 160), random(100, 200)),
        phase: (x + y) * 0.1,
        pulseSpeed: random(0.005, 0.02),
        angle: random(TWO_PI)
      });
    }
  }
}

function draw() {
  background(10);
  
  // Slowly rotate the entire scene
  rotateY(time * 0.0003);
  rotateX(sin(time * 0.0001) * 0.05);
  
  time++;
  
  // Draw all veins as a single point cloud for performance
  beginShape(POINTS);
  for (let i = 0; i < veins.length; i++) {
    let v = veins[i];
    
    // Apply rhythmic pulse to each vein
    let pulse = sin(time * v.pulseSpeed + v.phase) * 0.5 + 0.5;
    let size = v.baseSize * pulse;
    
    // Set color with some variation
    fill(v.color);
    
    // Draw the point at position scaled by pulse
    vertex(v.x, v.y, v.z);
  }
  endShape();
  
  // Add a few branching structures using lines for performance
  beginShape(LINES);
  for (let i = 0; i < veins.length; i += 5) { // Only draw every 5th vein's branches
    let v = veins[i];
    
    let pulse = sin(time * v.pulseSpeed + v.phase) * 0.5 + 0.5;
    let size = v.baseSize * pulse;
    
    // Draw simple branching lines
    stroke(v.color);
    strokeWeight(1);
    
    for (let j = 0; j < 3; j++) {
      let angle = TWO_PI * j / 3;
      let branchLength = size * 1.5;
      
      let x1 = v.x;
      let y1 = v.y;
      let z1 = v.z;
      
      let x2 = x1 + cos(angle) * branchLength;
      let y2 = y1 + sin(angle) * branchLength;
      let z2 = z1;
      
      vertex(x1, y1, z1);
      vertex(x2, y2, z2);
    }
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
