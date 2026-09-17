function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noLoop();
}

function draw() {
  background(0);
  
  // Create a massive steel pathway with rust texture
  push();
  translate(0, 0, -500);
  rotateX(PI/4);
  rotateY(PI/6);
  
  // Draw the main pathway structure
  drawPathway();
  
  pop();
}

function drawPathway() {
  const segments = 100;
  const width = 300;
  const height = 20;
  const depth = 500;
  
  // Create a grid of steel beams that form the pathway
  for (let i = 0; i < segments; i++) {
    const x = map(i, 0, segments - 1, -width/2, width/2);
    
    // Main beam structure
    push();
    translate(x, 0, 0);
    rotateY(PI/8 * sin(frameCount * 0.005 + i * 0.2));
    
    // Draw the steel beam with rust texture effect
    drawBeam(width, height, depth);
    
    pop();
  }
  
  // Add rust patina details
  drawRustDetails(segments, width, height, depth);
}

function drawBeam(w, h, d) {
  // Main beam structure
  fill(120, 80, 60);
  stroke(80, 50, 40);
  strokeWeight(1);
  
  // Draw the main steel beam with some curvature
  beginShape();
  vertex(-w/2, -h/2, -d/2);
  vertex(w/2, -h/2, -d/2);
  vertex(w/2, h/2, -d/2);
  vertex(-w/2, h/2, -d/2);
  endShape(CLOSE);
  
  // Add rust-colored highlights
  fill(180, 70, 30);
  stroke(150, 60, 20);
  beginShape();
  vertex(-w/2 + 5, -h/2 + 5, -d/2);
  vertex(w/2 - 5, -h/2 + 5, -d/2);
  vertex(w/2 - 5, h/2 - 5, -d/2);
  vertex(-w/2 + 5, h/2 - 5, -d/2);
  endShape(CLOSE);
}

function drawRustDetails(segments, width, height, depth) {
  // Add rust-colored patches to simulate patina
  noStroke();
  
  for (let i = 0; i < segments * 3; i++) {
    const x = random(-width/2, width/2);
    const z = random(-depth/2, depth/2);
    const size = random(5, 20);
    
    // Create wet-looking rust patches
    fill(random(140, 180), random(60, 90), random(30, 50));
    ellipse(x, 0, size, size * 0.7);
  }
  
  // Add some large rust formations
  for (let i = 0; i < 20; i++) {
    const x = random(-width/2, width/2);
    const z = random(-depth/2, depth/2);
    const w = random(15, 40);
    const h = random(10, 30);
    
    fill(random(160, 200), random(70, 100), random(30, 50));
    ellipse(x, 0, w, h);
  }
  
  // Add a dramatic perpendicular interruption
  push();
  translate(0, 0, depth/2 - 100);
  rotateY(PI/2);
  
  // Draw the perpendicular steel wall
  fill(130, 90, 70);
  stroke(100, 70, 50);
  rect(-width/4, -height * 3, width/2, height * 6);
  
  // Add rust patches to the interruption
  for (let i = 0; i < 10; i++) {
    const x = random(-width/4, width/4);
    const y = random(-height * 3, height * 3);
    const size = random(5, 15);
    
    fill(random(170, 200), random(80, 110), random(40, 60));
    ellipse(x, y, size, size * 0.8);
  }
  
  pop();
}
