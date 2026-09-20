function setup() {
  createCanvas(windowWidth, windowHeight);
  noLoop();
}

function draw() {
  background(20);
  
  // Draw flowing organic fibers
  drawFlowingFibers();
  
  // Draw geometric knots
  drawGeometricKnots();
}

function drawFlowingFibers() {
  strokeWeight(1);
  noFill();
  
  // Use a grid of noise fields to create flowing paths
  for (let i = 0; i < 30; i++) {
    beginShape();
    for (let j = 0; j < 200; j++) {
      let x = map(j, 0, 199, 0, width);
      let y = height / 2 + sin(frameCount * 0.005 + i * 0.3) * 100;
      
      // Add some noise to make it organic
      let n = noise(x * 0.002, y * 0.002, frameCount * 0.001);
      y += map(n, 0, 1, -30, 30);
      
      curveVertex(x, y);
    }
    endShape();
  }
  
  // Add more flowing lines with different colors
  stroke(255, 100);
  for (let i = 0; i < 20; i++) {
    beginShape();
    for (let j = 0; j < 150; j++) {
      let x = map(j, 0, 149, 0, width);
      let y = height / 3 + cos(frameCount * 0.003 + i * 0.2) * 80;
      
      let n = noise(x * 0.0015, y * 0.0015, frameCount * 0.0015);
      y += map(n, 0, 1, -20, 20);
      
      curveVertex(x, y);
    }
    endShape();
  }
}

function drawGeometricKnots() {
  noStroke();
  fill(255, 150);
  
  // Draw sharp geometric knots
  for (let i = 0; i < 30; i++) {
    let x = map(i, 0, 29, 0, width);
    let y = height / 2 + sin(frameCount * 0.007 + i * 0.5) * 50;
    
    // Draw a star shape
    push();
    translate(x, y);
    rotate(frameCount * 0.01 + i * 0.2);
    beginShape();
    for (let j = 0; j < 10; j++) {
      let angle = map(j, 0, 9, 0, TWO_PI);
      let radius = (j % 2 === 0) ? 15 : 8;
      let px = cos(angle) * radius;
      let py = sin(angle) * radius;
      vertex(px, py);
    }
    endShape(CLOSE);
    pop();
  }
  
  // Draw some rectangles
  stroke(255, 200);
  noFill();
  for (let i = 0; i < 20; i++) {
    let x = map(i, 0, 19, 0, width);
    let y = height / 4 + cos(frameCount * 0.005 + i * 0.3) * 60;
    
    push();
    translate(x, y);
    rotate(frameCount * 0.008 + i * 0.1);
    rectMode(CENTER);
    rect(0, 0, 20, 20);
    pop();
  }
}
