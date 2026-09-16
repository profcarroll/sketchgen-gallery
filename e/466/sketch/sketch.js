function setup() {
  createCanvas(windowWidth, windowHeight);
  noLoop();
}

function draw() {
  // Draw pale yellow sand mound
  background(245, 230, 180);
  
  // Create sand mound with gradient
  noStroke();
  fill(240, 220, 160);
  ellipse(width/2, height/2 + 30, 400, 300);
  
  // Add texture to sand
  stroke(230, 210, 150);
  strokeWeight(1);
  for (let i = 0; i < 200; i++) {
    let x = random(width/2 - 180, width/2 + 180);
    let y = random(height/2 + 20, height/2 + 150);
    point(x, y);
  }
  
  // Create clusters of shells
  drawShellCluster(300, 350, 40, 6);
  drawShellCluster(500, 380, 30, 8);
  drawShellCluster(200, 400, 35, 5);
  drawShellCluster(700, 420, 25, 7);
  
  // Add some scattered shells
  for (let i = 0; i < 30; i++) {
    let x = random(100, width - 100);
    let y = random(height/2 + 100, height - 100);
    drawShell(x, y, random(8, 20), color(random(240, 255), random(230, 255), random(240, 255)));
  }
}

function drawShellCluster(x, y, size, count) {
  for (let i = 0; i < count; i++) {
    let angle = random(TWO_PI);
    let dist = random(size * 0.5, size * 1.5);
    let shellX = x + cos(angle) * dist;
    let shellY = y + sin(angle) * dist;
    let shellSize = random(8, size);
    let shellColor = color(random(240, 255), random(230, 255), random(240, 255));
    drawShell(shellX, shellY, shellSize, shellColor);
  }
}

function drawShell(x, y, size, c) {
  noStroke();
  fill(c);
  
  // Draw shell with subtle gradient
  for (let i = 0; i < 3; i++) {
    let offset = map(i, 0, 2, 0, size * 0.3);
    let shellSize = size - offset;
    fill(red(c), green(c), blue(c) + i * 5);
    ellipse(x, y, shellSize, shellSize * 0.8);
  }
  
  // Add subtle highlight
  fill(255, 255, 255, 100);
  ellipse(x - size * 0.3, y - size * 0.3, size * 0.4, size * 0.2);
}
