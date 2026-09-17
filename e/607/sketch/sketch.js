function setup() {
  createCanvas(800, 600);
  noLoop();
}

function draw() {
  // Background
  background(10, 10, 20);
  
  // Draw HAL-2000's face structure
  fill(30, 30, 40);
  noStroke();
  rectMode(CENTER);
  rect(width/2, height/2, 400, 300);
  
  // Central optical sensors with glow effect
  drawGlowingSensor(width/2, height/2 - 10, 60);
  drawGlowingSensor(width/2, height/2 + 10, 60);
  
  // Side panels
  fill(40, 40, 50);
  rectMode(CORNER);
  rect(width/2 - 210, height/2 - 140, 40, 280);
  rect(width/2 + 170, height/2 - 140, 40, 280);
  
  // Top and bottom panels
  rectMode(CENTER);
  rect(width/2, height/2 - 160, 320, 40);
  rect(width/2, height/2 + 160, 320, 40);
  
  // Inner panel details
  fill(25, 25, 35);
  rect(width/2, height/2, 280, 220);
  
  // Facial features
  drawFacialFeatures();
}

function drawGlowingSensor(x, y, size) {
  // Outer glow
  noStroke();
  for (let i = 0; i < 5; i++) {
    fill(255, 0, 0, 30 - i * 5);
    ellipse(x, y, size + i * 15);
  }
  
  // Inner core
  fill(255, 50, 50);
  ellipse(x, y, size);
  
  // Highlight
  fill(255, 200, 200);
  ellipse(x - size/4, y - size/4, size/3);
}

function drawFacialFeatures() {
  // Eyes (in the optical sensors)
  fill(0);
  ellipse(width/2, height/2 - 10, 30);
  ellipse(width/2, height/2 + 10, 30);
  
  // Mouth area
  stroke(50, 50, 60);
  strokeWeight(2);
  noFill();
  arc(width/2, height/2 + 80, 80, 40, 0, PI);
  
  // Vertical lines for a sense of structure
  stroke(60, 60, 70);
  strokeWeight(1);
  line(width/2 - 150, height/2 - 140, width/2 - 150, height/2 + 140);
  line(width/2 + 150, height/2 - 140, width/2 + 150, height/2 + 140);
  
  // Horizontal lines
  line(width/2 - 160, height/2 - 130, width/2 + 160, height/2 - 130);
  line(width/2 - 160, height/2 + 130, width/2 + 160, height/2 + 130);
  
  // Central vertical line
  line(width/2, height/2 - 140, width/2, height/2 + 140);
}
