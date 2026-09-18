let roadWidth = 200;
let roadLength = 1000;
let segmentLength = 50;
let segments = [];
let vehicleX = 0;
let vehicleY = 0;
let vehicleSpeed = 2;
let steering = 0;
let brake = false;
let obstacles = [];
let roadCurve = 0.005;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Initialize road segments
  for (let i = 0; i < roadLength / segmentLength; i++) {
    segments.push({
      y: i * segmentLength,
      curve: sin(i * roadCurve) * 100,
      width: roadWidth + sin(i * roadCurve) * 50
    });
  }
  vehicleY = height - 100;
  // Initialize obstacles
  for (let i = 0; i < 20; i++) {
    obstacles.push({
      x: random(-roadWidth/2, roadWidth/2),
      y: random(0, roadLength),
      size: random(10, 30)
    });
  }
}

function draw() {
  background(50);
  
  // Update vehicle
  if (keyIsPressed) {
    if (keyCode === LEFT_ARROW) steering = -0.02;
    else if (keyCode === RIGHT_ARROW) steering = 0.02;
    else if (keyCode === UP_ARROW) vehicleSpeed += 0.1;
    else if (keyCode === DOWN_ARROW) brake = true;
    else steering = 0;
  } else {
    steering = 0;
    brake = false;
    if (vehicleSpeed > 0) vehicleSpeed -= 0.05;
  }
  
  // Apply braking
  if (brake) {
    vehicleSpeed *= 0.8;
  }
  
  // Update vehicle position
  vehicleX += steering * vehicleSpeed * 10;
  
  // Keep vehicle on road
  if (vehicleX < -roadWidth/2) vehicleX = -roadWidth/2;
  if (vehicleX > roadWidth/2) vehicleX = roadWidth/2;
  
  // Draw road
  stroke(200);
  strokeWeight(2);
  noFill();
  
  let lastCurve = 0;
  let lastWidth = roadWidth;
  
  for (let i = 0; i < segments.length; i++) {
    let seg = segments[i];
    let curve = seg.curve;
    let width = seg.width;
    
    // Draw road segment
    beginShape();
    vertex(-lastWidth/2 + lastCurve, seg.y - segmentLength);
    vertex(lastWidth/2 + lastCurve, seg.y - segmentLength);
    vertex(width/2 + curve, seg.y);
    vertex(-width/2 + curve, seg.y);
    endShape(CLOSE);
    
    lastCurve = curve;
    lastWidth = width;
  }
  
  // Draw side roads
  stroke(150);
  strokeWeight(1);
  for (let i = 0; i < segments.length; i += 3) {
    let seg = segments[i];
    let curve = seg.curve;
    let width = seg.width;
    
    // Left side road
    line(-width/2 + curve, seg.y, -width/2 + curve - 30, seg.y + 10);
    // Right side road
    line(width/2 + curve, seg.y, width/2 + curve + 30, seg.y + 10);
  }
  
  // Draw obstacles
  fill(200, 50, 50);
  noStroke();
  for (let obs of obstacles) {
    ellipse(obs.x, obs.y, obs.size, obs.size);
  }
  
  // Draw vehicle
  push();
  translate(vehicleX, vehicleY);
  rotate(PI/4);
  fill(100, 150, 255);
  rect(-20, -30, 40, 60);
  fill(200);
  rect(-15, -35, 30, 10);
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
