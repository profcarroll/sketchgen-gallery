function setup() {
  createCanvas(600, 600, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
}

function draw() {
  background(0);
  noStroke();
  
  // Define the main geometric structure using planar facets
  push();
  translate(0, 0, -200);
  rotateX(PI/6);
  rotateY(PI/4);
  
  // Create a series of interlocking planes to form an abstract self-portrait
  const planes = [];
  for (let i = 0; i < 8; i++) {
    planes.push({
      x: sin(i * PI/4) * 100,
      y: cos(i * PI/4) * 100,
      z: 0,
      size: 150 + i * 20
    });
  }
  
  for (let i = 0; i < planes.length; i++) {
    const p = planes[i];
    push();
    translate(p.x, p.y, p.z);
    rotateZ(i * PI/8);
    
    // Draw each facet with subtle color variations and depth
    fill((i * 45) % 360, 20, 70, 0.9);
    box(p.size, p.size, 20);
    pop();
  }
  
  pop();
  
  // Add dramatic shadow lines that carve into the form
  stroke(0, 0, 0, 0.3);
  noFill();
  for (let i = 0; i < 10; i++) {
    push();
    translate(0, 0, -150 + i * 20);
    rotateX(PI/6);
    rotateY(PI/4);
    beginShape();
    for (let j = 0; j <= 360; j += 10) {
      const x = cos(j * PI/180) * 150;
      const y = sin(j * PI/180) * 150;
      vertex(x, y, 0);
    }
    endShape(CLOSE);
    pop();
  }
}
