let cornStalks = [];
let lightPosition;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Create corn stalks
  for (let i = 0; i < 150; i++) {
    cornStalks.push({
      x: random(width),
      y: random(height * 0.3, height * 0.9),
      height: random(20, 60),
      angle: random(TWO_PI)
    });
  }
  lightPosition = { x: width / 2, y: -50 };
}

function draw() {
  background(0);
  
  time += 0.01;
  
  // Move light in a wave pattern
  lightPosition.y = height * 0.1 + sin(time) * 30;
  lightPosition.x = width / 2 + cos(time * 0.5) * 100;
  
  // Draw ground
  fill(30, 60, 30);
  rect(0, height * 0.8, width, height * 0.2);
  
  // Draw corn stalks
  for (let stalk of cornStalks) {
    push();
    translate(stalk.x, stalk.y);
    rotate(stalk.angle);
    
    // Draw stalk
    stroke(100, 150, 50);
    strokeWeight(2);
    line(0, 0, 0, -stalk.height);
    
    // Draw leaves
    stroke(80, 130, 40);
    for (let i = 0; i < 3; i++) {
      let leafLength = stalk.height * 0.2;
      line(0, -stalk.height + i * 15, leafLength * cos(i), leafLength * sin(i));
    }
    
    pop();
  }
  
  // Draw glowing light
  noStroke();
  fill(0, 255, 255, 100);
  
  // Create wave pattern under light
  let waveRadius = 100 + sin(time * 2) * 20;
  let segments = 30;
  
  beginShape();
  for (let i = 0; i <= segments; i++) {
    let angle = map(i, 0, segments, 0, PI);
    let x = lightPosition.x + cos(angle) * waveRadius;
    let y = lightPosition.y + sin(angle) * waveRadius;
    vertex(x, y);
  }
  endShape(CLOSE);
  
  // Draw central glow
  fill(0, 255, 255, 150);
  ellipse(lightPosition.x, lightPosition.y, 40, 40);
  
  // Draw light rays
  stroke(0, 255, 255, 80);
  strokeWeight(1);
  for (let i = 0; i < 30; i++) {
    let angle = map(i, 0, 30, 0, TWO_PI) + time;
    let x1 = lightPosition.x;
    let y1 = lightPosition.y;
    let x2 = lightPosition.x + cos(angle) * 150;
    let y2 = lightPosition.y + sin(angle) * 150;
    line(x1, y1, x2, y2);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
