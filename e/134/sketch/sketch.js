function setup() {
  createCanvas(windowWidth, windowHeight);
  noLoop();
}

function draw() {
  // Sky background
  background(135, 206, 235);
  
  // Distant clouds
  fill(255);
  noStroke();
  ellipse(200, 100, 80, 40);
  ellipse(230, 95, 60, 30);
  ellipse(170, 95, 70, 35);
  
  ellipse(width - 200, 120, 100, 50);
  ellipse(width - 180, 110, 70, 35);
  
  // Distant hill
  fill(34, 139, 34);
  beginShape();
  vertex(0, height/2 + 50);
  bezierVertex(width/4, height/2 - 30, width/2, height/2 + 20, width*3/4, height/2 - 40);
  vertex(width, height/2 + 50);
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);
  
  // Foreground grass with hyper-sharp focus
  strokeWeight(1);
  for (let i = 0; i < 300; i++) {
    let x = random(width);
    let y = height/2 + random(20, 50);
    let len = random(8, 15);
    stroke(0, 100, 0);
    line(x, y, x, y - len);
  }
  
  // Soft focus for distant elements
  blendMode(DIFFERENCE);
  fill(255, 255, 255, 100);
  noStroke();
  ellipse(width/2, height/3, width, height/2);
  blendMode(BLEND);
  
  // Additional distant clouds with soft focus
  fill(255, 255, 255, 150);
  ellipse(width/3, height/4, 120, 60);
  ellipse(width*2/3, height/5, 100, 50);
}
