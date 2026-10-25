let mycelium = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create a network of interconnected fungal threads
  for (let i = 0; i < 500; i++) {
    mycelium.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-300, 300),
      size: random(2, 8),
      angleX: random(TWO_PI),
      angleY: random(TWO_PI),
      angleZ: random(TWO_PI),
      speedX: random(-0.001, 0.001),
      speedY: random(-0.001, 0.001),
      speedZ: random(-0.0005, 0.0005),
      hue: random(180, 240), // Blue-green hues for mycelium
      segment: floor(random(3, 6)),
      phase: random(TWO_PI)
    });
  }
}

function draw() {
  background(0, 0, 0, 0.1); // Semi-transparent background for trail effect
  
  time += 0.01;
  
  // Draw mycelial network
  beginShape(LINES);
  strokeWeight(0.5);
  
  for (let i = 0; i < mycelium.length; i++) {
    let m = mycelium[i];
    
    // Update structure parameters
    m.angleX += m.speedX;
    m.angleY += m.speedY;
    m.angleZ += m.speedZ;
    m.phase += 0.01;
    
    push();
    translate(m.x, m.y, m.z);
    rotateX(m.angleX);
    rotateY(m.angleY);
    rotateZ(m.angleZ);
    
    // Draw thread segments
    for (let j = 0; j < m.segment; j++) {
      let segmentAngle = m.angleX + j * 0.3;
      let segmentSize = m.size * (1 - j * 0.05);
      
      // Create a pulsing, fibrous thread
      stroke(m.hue, 80, 90, 0.7 + sin(time + j) * 0.2);
      let points = floor(random(4, 8));
      
      for (let k = 0; k < points; k++) {
        let a = map(k, 0, points - 1, 0, TWO_PI);
        let r = segmentSize;
        let deform = sin(time + a * 2 + m.phase) * 2;
        let x = cos(a + deform * 0.1) * (r + deform);
        let y = sin(a + deform * 0.1) * (r + deform);
        let z = sin(a * 3 + time) * 5; // Depth variation
        
        if (k === 0) {
          vertex(x, y, z);
        } else {
          vertex(x, y, z);
        }
      }
    }
    
    pop();
  }
  
  endShape();
  
  // Add subtle organic movement to the mycelial network
  for (let i = 0; i < mycelium.length; i++) {
    let m = mycelium[i];
    m.x += sin(time * 0.1 + i) * 0.1;
    m.y += cos(time * 0.08 + i) * 0.1;
    m.z += sin(time * 0.05 + i) * 0.05;
    
    // Keep structures within canvas bounds
    if (m.x > width/2 + 200) m.x = -width/2 - 200;
    if (m.x < -width/2 - 200) m.x = width/2 + 200;
    if (m.y > height/2 + 200) m.y = -height/2 - 200;
    if (m.y < -height/2 - 200) m.y = height/2 + 200;
    if (m.z > 400) m.z = -400;
    if (m.z < -400) m.z = 400;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
