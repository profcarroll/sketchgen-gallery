function setup() {
  createCanvas(windowWidth, windowHeight);
  noLoop();
}

function draw() {
  // Muted cool-toned palette
  background(20, 30, 50);
  
  // Draw distant mountains
  fill(40, 60, 80);
  noStroke();
  beginShape();
  vertex(0, height);
  for (let x = 0; x < width; x += 20) {
    let y = height - 150 + sin(x * 0.01) * 30;
    vertex(x, y);
  }
  vertex(width, height);
  endShape(CLOSE);
  
  // Draw closer mountain peaks
  fill(30, 50, 70);
  beginShape();
  vertex(0, height);
  for (let x = 0; x < width; x += 15) {
    let y = height - 200 + sin(x * 0.015) * 40;
    vertex(x, y);
  }
  vertex(width, height);
  endShape(CLOSE);
  
  // Rock formations in foreground
  stroke(60, 80, 100);
  strokeWeight(2);
  noFill();
  
  // Draw etched channels
  for (let i = 0; i < 30; i++) {
    let x = random(width);
    let y = height - 100 + random(-50, 50);
    let w = random(20, 80);
    let h = random(10, 40);
    
    // Channel shape
    beginShape();
    vertex(x, y);
    vertex(x + w, y);
    vertex(x + w - 10, y + h);
    vertex(x + 10, y + h);
    endShape(CLOSE);
  }
  
  // Snow in channels
  fill(220, 240, 255);
  noStroke();
  for (let i = 0; i < 50; i++) {
    let x = random(width);
    let y = height - 100 + random(-50, 50);
    let w = random(10, 40);
    let h = random(5, 20);
    
    // Snow shape in channel
    beginShape();
    vertex(x, y);
    vertex(x + w, y);
    vertex(x + w - 5, y + h);
    vertex(x + 5, y + h);
    endShape(CLOSE);
  }
  
  // Crystalline blue light effect
  blendMode(ADD);
  fill(30, 80, 200, 30);
  noStroke();
  for (let i = 0; i < 20; i++) {
    let x = random(width);
    let y = height - 150 + random(-30, 30);
    ellipse(x, y, random(20, 60), random(20, 60));
  }
  blendMode(BLEND);
}
