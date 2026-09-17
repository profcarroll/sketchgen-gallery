let roadSpeed = 0;
let carX = 0;
let roadY = 0;
let laneMarkers = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Initialize lane markers
  for (let i = 0; i < 20; i++) {
    laneMarkers.push({
      y: i * 100,
      length: 40,
      gap: 60
    });
  }
}

function draw() {
  background(0);
  
  // Update road position based on speed
  roadY += roadSpeed;
  
  // Draw road
  stroke(255);
  strokeWeight(2);
  noFill();
  rect(width/2 - 150, 0, 300, height);
  
  // Draw lane markers
  for (let i = 0; i < laneMarkers.length; i++) {
    let marker = laneMarkers[i];
    let y = (marker.y + roadY) % (height + 100);
    
    if (y > -marker.length && y < height) {
      stroke(255);
      strokeWeight(4);
      line(width/2, y, width/2, y + marker.length);
    }
  }
  
  // Draw car
  fill(255, 0, 0);
  noStroke();
  rect(width/2 - 20, height - 60, 40, 20);
  rect(width/2 - 15, height - 80, 30, 20);
  
  // Update speed based on input
  if (keyIsPressed) {
    if (keyCode === LEFT_ARROW) {
      carX = max(-100, carX - 2);
    } else if (keyCode === RIGHT_ARROW) {
      carX = min(100, carX + 2);
    } else if (keyCode === 32) { // Space bar
      roadSpeed = max(0, roadSpeed - 0.5);
    }
  } else {
    roadSpeed = min(15, roadSpeed + 0.1);
  }
  
  // Adjust car position
  let targetX = width/2 + carX;
  let currentX = (width/2 + carX) * 0.9;
  carX += (targetX - currentX) * 0.1;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
