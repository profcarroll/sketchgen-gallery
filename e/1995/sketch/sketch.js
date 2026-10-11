let roots = [];
let newsprint;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Create textured background resembling aged newsprint
  newsprint = createGraphics(width, height);
  newsprint.background(240);
  newsprint.noiseDetail(2, 0.5);
  for (let i = 0; i < 10000; i++) {
    let x = random(width);
    let y = random(height);
    let n = noise(x * 0.01, y * 0.01) * 20;
    newsprint.stroke(200 - n);
    newsprint.point(x, y);
  }
  
  // Generate branching root segments
  for (let i = 0; i < 500; i++) {
    let startX = random(width);
    let startY = random(height * 0.3, height * 0.7);
    
    let segments = [];
    let currentX = startX;
    let currentY = startY;
    
    // Create a branching path with irregular segments
    for (let j = 0; j < 15; j++) {
      let segment = {
        x: currentX,
        y: currentY,
        size: random(2, 8)
      };
      segments.push(segment);
      
      // Random movement with some direction bias
      let angle = random(-0.5, 0.5) + (j > 5 ? -0.3 : 0.1);
      let length = random(5, 20);
      currentX += cos(angle) * length;
      currentY += sin(angle) * length;
      
      // Keep within canvas bounds
      currentX = constrain(currentX, 0, width);
      currentY = constrain(currentY, 0, height);
    }
    
    roots.push(segments);
  }
}

function draw() {
  // Draw the textured background once
  image(newsprint, 0, 0);
  
  // Draw root segments
  noFill();
  stroke(0);
  strokeWeight(1);
  
  for (let root of roots) {
    beginShape();
    for (let segment of root) {
      vertex(segment.x, segment.y);
    }
    endShape();
  }
  
  // Add some wet ink effect by drawing overlapping lines
  stroke(0, 30);
  strokeWeight(2);
  for (let i = 0; i < 100; i++) {
    let x1 = random(width);
    let y1 = random(height);
    let x2 = x1 + random(-50, 50);
    let y2 = y1 + random(-50, 50);
    line(x1, y1, x2, y2);
  }
  
  noLoop(); // Static image as required by the gate
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
