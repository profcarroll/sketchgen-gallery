let veins = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  
  // Create a grid of crystalline veins
  let cols = 40;
  let rows = 30;
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
        baseSize: random(3, 10),
        color1: color(random(30, 80), random(60, 120), random(150, 220)),
        color2: color(random(40, 90), random(80, 150), random(100, 180)),
        phase: (x + y) * 0.05,
        pulseSpeed: random(0.003, 0.012),
        angle: random(TWO_PI)
      });
    }
  }
}

function draw() {
  background(15);
  
  // Slowly rotate the entire scene
  rotateY(time * 0.0002);
  rotateX(sin(time * 0.00008) * 0.03);
  
  time++;
  
  // Draw all veins as a single point cloud for performance
  beginShape(POINTS);
  for (let i = 0; i < veins.length; i++) {
    let v = veins[i];
    
    // Apply rhythmic pulse to each vein
    let pulse = sin(time * v.pulseSpeed + v.phase) * 0.5 + 0.5;
    let size = v.baseSize * pulse;
    
    // Alternate between two complementary colors
    let c = lerpColor(v.color1, v.color2, sin(time * 0.003 + v.phase) * 0.5 + 0.5);
    fill(c);
    
    // Draw the point at position scaled by pulse
    vertex(v.x, v.y, v.z);
  }
  endShape();
  
  // Add branching structures using lines for performance
  beginShape(LINES);
  for (let i = 0; i < veins.length; i += 4) { // Only draw every 4th vein's branches
    let v = veins[i];
    
    let pulse = sin(time * v.pulseSpeed + v.phase) * 0.5 + 0.5;
    let size = v.baseSize * pulse;
    
    // Draw simple branching lines
    stroke(lerpColor(v.color1, v.color2, 0.5));
    strokeWeight(0.5);
    
    for (let j = 0; j < 4; j++) {
      let angle = TWO_PI * j / 4 + time * 0.001;
      let branchLength = size * 1.2;
      
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
