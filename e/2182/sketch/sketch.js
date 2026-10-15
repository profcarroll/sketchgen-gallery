let pipes = [];
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
  
  // Generate steam pipe segments
  for (let i = 0; i < 300; i++) {
    let startX = random(width);
    let startY = random(height * 0.2, height * 0.8);
    
    let segments = [];
    let currentX = startX;
    let currentY = startY;
    
    // Create a pipe path with varying stroke weights and organic curves
    for (let j = 0; j < 30; j++) {
      let segment = {
        x: currentX,
        y: currentY,
        size: random(2, 15)
      };
      segments.push(segment);
      
      // Random movement with some direction bias to create organic curves
      let angle = random(-0.3, 0.3) + (j > 10 ? -0.1 : 0.1);
      let length = random(8, 25);
      currentX += cos(angle) * length;
      currentY += sin(angle) * length;
      
      // Keep within canvas bounds
      currentX = constrain(currentX, 0, width);
      currentY = constrain(currentY, 0, height);
    }
    
    pipes.push(segments);
  }
}

function draw() {
  // Draw the textured background once
  image(newsprint, 0, 0);
  
  // Draw pipe segments with thick, wet ink style
  noFill();
  stroke(0);
  strokeWeight(1);
  
  for (let pipe of pipes) {
    beginShape();
    for (let segment of pipe) {
      vertex(segment.x, segment.y);
    }
    endShape();
  }
  
  // Add overlapping lines to simulate wet ink bleeding
  stroke(0, 25);
  strokeWeight(1.5);
  for (let i = 0; i < 200; i++) {
    let x1 = random(width);
    let y1 = random(height);
    let x2 = x1 + random(-30, 30);
    let y2 = y1 + random(-30, 30);
    line(x1, y1, x2, y2);
  }
  
  // Add some thicker lines to represent main steam pipes
  stroke(0, 40);
  strokeWeight(3);
  for (let i = 0; i < 50; i++) {
    let x1 = random(width);
    let y1 = random(height);
    let x2 = x1 + random(-60, 60);
    let y2 = y1 + random(-60, 60);
    line(x1, y1, x2, y2);
  }
  
  noLoop(); // Static image as required by the gate
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
