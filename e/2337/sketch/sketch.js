let lines = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 100);

  // Generate a complex branching structure with cyclical motion
  for (let i = 0; i < 200; i++) {
    let layer = [];
    let baseAngle = random(TWO_PI);
    let baseRadius = random(150, 300);
    
    // Create a branching pattern with multiple segments
    for (let j = 0; j < 6; j++) {
      let angle = baseAngle + j * 0.8;
      let radius = baseRadius + sin(time * 0.002 + i * 0.05) * 40;
      
      // Add segments that branch out
      for (let k = 0; k < 8; k++) {
        let segAngle = angle + sin(k * 0.5 + time * 0.001) * 0.6;
        let segRadius = radius + k * 10;
        
        layer.push({
          x: cos(segAngle) * segRadius,
          y: sin(segAngle) * segRadius,
          z: sin(time * 0.001 + i * 0.02 + j) * 40
        });
      }
    }
    lines.push(layer);
  }
}

function draw() {
  background(0);
  noFill();
  
  // Center the scene
  translate(0, 0, -300);
  
  // Rotate slowly for dynamic view
  rotateY(time * 0.0002);
  rotateX(sin(time * 0.0001) * 0.1);
  
  strokeWeight(1);
  
  // Batch all lines into one shape for performance
  beginShape(LINES);
  
  // Draw all lines with glowing effect
  for (let i = 0; i < lines.length; i++) {
    let layer = lines[i];
    
    // Create a dynamic color that pulses
    let hue = (time * 0.2 + i * 1.5) % 100;
    stroke(hue, 80, 90);
    
    for (let j = 0; j < layer.length; j++) {
      let p = layer[j];
      
      // Add subtle movement to each point
      let offsetX = sin(time * 0.002 + i * 0.01 + j * 0.1) * 3;
      let offsetY = cos(time * 0.002 + i * 0.01 + j * 0.1) * 3;
      
      vertex(p.x + offsetX, p.y + offsetY, p.z);
    }
  }
  
  endShape();
  
  time++;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
