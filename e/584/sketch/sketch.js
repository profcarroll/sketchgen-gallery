let track, goal, marble, path = [];
let isMoving = false;
let goalArea;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  // Create track boundaries and goal area
  track = {
    width: 400,
    height: 600,
    lanes: 3,
    laneWidth: 120,
    wallHeight: 30,
    wallThickness: 10
  };
  
  goalArea = {
    x: -track.width/2 + track.laneWidth,
    y: track.height/2 - 50,
    width: track.laneWidth * 2,
    height: 50
  };
  
  // Initialize marble at start position
  marble = {
    x: 0,
    y: -track.height/2 + 30,
    z: 0,
    radius: 8,
    speed: 2
  };
}

function draw() {
  background(10, 10, 30);
  
  // Lighting setup
  pointLight(255, 255, 255, 0, -200, 300);
  ambientLight(50);
  
  // Draw track
  drawTrack();
  
  // Draw goal area
  drawGoalArea();
  
  // Draw marble path if moving
  if (isMoving) {
    drawMarblePath();
    moveMarble();
  }
  
  // Draw marble
  drawMarble();
}

function drawTrack() {
  // Track boundaries
  push();
  translate(0, 0, -track.wallHeight/2);
  fill(50, 50, 100);
  box(track.width, track.height, track.wallThickness);
  
  // Lane dividers
  for (let i = 1; i < track.lanes; i++) {
    let x = -track.width/2 + i * track.laneWidth;
    push();
    translate(x, 0, 0);
    fill(200, 200, 200);
    box(track.wallThickness, track.height, track.wallThickness);
    pop();
  }
  
  // Side walls
  push();
  translate(-track.width/2 - track.wallThickness/2, 0, 0);
  fill(80, 80, 150);
  box(track.wallThickness, track.height, track.wallHeight);
  pop();
  
  push();
  translate(track.width/2 + track.wallThickness/2, 0, 0);
  fill(80, 80, 150);
  box(track.wallThickness, track.height, track.wallHeight);
  pop();
  
  pop();
}

function drawGoalArea() {
  push();
  translate(goalArea.x + goalArea.width/2, goalArea.y + goalArea.height/2, -track.wallHeight/2);
  fill(100, 255, 100);
  box(goalArea.width, goalArea.height, track.wallThickness);
  
  // Goal area highlight
  fill(255, 255, 100);
  rect(-goalArea.width/2, -goalArea.height/2, goalArea.width, goalArea.height);
  
  pop();
}

function drawMarble() {
  push();
  translate(marble.x, marble.y, marble.z);
  fill(255, 100, 100);
  noStroke();
  sphere(marble.radius);
  
  // Bioluminescent glow
  fill(255, 150, 150, 100);
  sphere(marble.radius * 1.3);
  pop();
}

function drawMarblePath() {
  if (path.length > 0) {
    beginShape(POINTS);
    noStroke();
    fill(255, 255, 255, 150);
    
    for (let i = 0; i < path.length; i++) {
      vertex(path[i].x, path[i].y, path[i].z);
    }
    
    endShape();
  }
}

function moveMarble() {
  // Move towards goal
  let targetX = goalArea.x + goalArea.width/2;
  let targetY = goalArea.y + goalArea.height/2;
  
  // Simple movement towards goal with slight randomness
  if (abs(marble.x - targetX) > 5 || abs(marble.y - targetY) > 5) {
    marble.x += (targetX - marble.x) * 0.03;
    marble.y += (targetY - marble.y) * 0.03;
    
    // Add some random movement
    marble.x += random(-0.5, 0.5);
    marble.y += random(-0.5, 0.5);
    
    // Add to path
    path.push({x: marble.x, y: marble.y, z: marble.z});
    
    // Limit path length
    if (path.length > 200) {
      path.shift();
    }
  } else {
    // Reached goal
    isMoving = false;
  }
}

function mousePressed() {
  if (!isMoving) {
    isMoving = true;
    path = [];
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
