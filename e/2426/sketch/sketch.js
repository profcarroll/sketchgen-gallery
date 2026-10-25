let structures = [];
let connections = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create luminous 3D structures with drifting and rotating planes
  for (let i = 0; i < 20; i++) {
    structures.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-200, 200),
      size: random(100, 250),
      angleX: random(TWO_PI),
      angleY: random(TWO_PI),
      angleZ: random(TWO_PI),
      speedX: random(-0.002, 0.002),
      speedY: random(-0.002, 0.002),
      speedZ: random(-0.001, 0.001),
      hue: random(20, 60), // Vibrant hues for glowing effect
      segments: floor(random(4, 7)),
      phase: random(TWO_PI)
    });
  }
  
  // Precompute static connections between structures
  for (let i = 0; i < structures.length; i++) {
    for (let j = i + 1; j < structures.length; j++) {
      connections.push({
        i: i,
        j: j,
        pulse: 0,
        active: false
      });
    }
  }
}

function draw() {
  background(0, 0, 0, 0.1); // Semi-transparent background for trail effect
  
  time += 0.01;
  
  // Draw structures as interconnected planes and nodes
  let allPoints = [];
  let allLines = [];
  
  for (let i = 0; i < structures.length; i++) {
    let s = structures[i];
    
    // Update structure parameters
    s.angleX += s.speedX;
    s.angleY += s.speedY;
    s.angleZ += s.speedZ;
    s.phase += 0.02;
    
    push();
    translate(s.x, s.y, s.z);
    rotateX(s.angleX);
    rotateY(s.angleY);
    rotateZ(s.angleZ);
    
    // Draw multiple interconnected planes
    for (let j = 0; j < s.segments; j++) {
      let segmentAngle = s.angleX + j * 0.5;
      let segmentSize = s.size * (1 - j * 0.1);
      
      // Create plane with pulsing effect
      beginShape();
      let points = floor(random(6, 10));
      for (let k = 0; k <= points; k++) {
        let a = map(k, 0, points, 0, TWO_PI);
        let r = segmentSize * 0.5;
        // Add subtle pulsing deformation
        let deform = sin(time + a * 3 + s.phase) * 10;
        let x = cos(a + deform * 0.1) * (r + deform);
        let y = sin(a + deform * 0.1) * (r + deform);
        let z = sin(a * 2 + time) * 20; // Depth variation
        vertex(x, y, z);
      }
      endShape(CLOSE);
      
      // Collect points for later line connections
      for (let k = 0; k < points; k++) {
        let a1 = map(k, 0, points, 0, TWO_PI);
        let r1 = segmentSize * 0.5;
        let x1 = cos(a1 + sin(time + a1 * 2) * 5 * 0.1) * (r1 + sin(time + a1 * 3) * 3);
        let y1 = sin(a1 + sin(time + a1 * 2) * 5 * 0.1) * (r1 + sin(time + a1 * 3) * 3);
        let z1 = sin(a1 * 2 + time) * 20;
        allPoints.push({x: x1, y: y1, z: z1});
      }
    }
    
    // Draw central node
    fill(s.hue, 80, 90, 0.8);
    noStroke();
    sphere(5);
    
    pop();
  }
  
  // Add subtle organic movement to the overall structure
  for (let i = 0; i < structures.length; i++) {
    let s = structures[i];
    s.x += sin(time * 0.3 + i) * 0.2;
    s.y += cos(time * 0.2 + i) * 0.2;
    s.z += sin(time * 0.1 + i) * 0.1;
    
    // Keep structures within canvas bounds
    if (s.x > width/2 + 300) s.x = -width/2 - 300;
    if (s.x < -width/2 - 300) s.x = width/2 + 300;
    if (s.y > height/2 + 300) s.y = -height/2 - 300;
    if (s.y < -height/2 - 300) s.y = height/2 + 300;
    if (s.z > 400) s.z = -400;
    if (s.z < -400) s.z = 400;
  }
  
  // Batch all lines into one shape
  beginShape(LINES);
  stroke(255, 100, 100, 0.6);
  strokeWeight(1);
  
  for (let i = 0; i < structures.length; i++) {
    let s1 = structures[i];
    for (let j = i + 1; j < structures.length; j++) {
      let s2 = structures[j];
      
      let dx = s1.x - s2.x;
      let dy = s1.y - s2.y;
      let dz = s1.z - s2.z;
      let distance = sqrt(dx * dx + dy * dy + dz * dz);
      
      // When two structures come within critical distance, pulse
      if (distance < 150) {
        stroke(255, 100, 100, 0.8); // Bright white and gold pulse
        strokeWeight(3);
        
        vertex(s1.x, s1.y, s1.z);
        vertex(s2.x, s2.y, s2.z);
      } else {
        stroke(255, 100, 100, 0.6); // Regular line
        strokeWeight(1);
        
        vertex(s1.x, s1.y, s1.z);
        vertex(s2.x, s2.y, s2.z);
      }
    }
  }
  
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
