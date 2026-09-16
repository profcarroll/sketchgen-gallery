let marble;
let course;
let trail = [];
let timer = 30;
let gameOver = false;
let obstacles = [];
let goalArea;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  marble = { x: -200, y: 0, z: 0, radius: 10 };
  course = createCourse();
  goalArea = { x: 200, y: 0, z: 0, width: 50, height: 50 };
  generateObstacles();
}

function draw() {
  background(30);
  if (gameOver) return;
  
  // Update timer
  if (frameCount % 60 === 0 && timer > 0) {
    timer--;
  }
  
  // Handle mouse drag to control marble
  if (mouseIsPressed) {
    const dx = mouseX - pmouseX;
    const dy = mouseY - pmouseY;
    marble.x += dx * 0.1;
    marble.y += dy * 0.1;
    
    // Keep marble in bounds
    marble.x = constrain(marble.x, -250, 250);
    marble.y = constrain(marble.y, -150, 150);
  }
  
  // Move marble forward
  marble.z += 1;
  
  // Check if marble reached goal
  if (marble.x > goalArea.x - goalArea.width/2 && 
      marble.x < goalArea.x + goalArea.width/2 &&
      marble.y > goalArea.y - goalArea.height/2 && 
      marble.y < goalArea.y + goalArea.height/2) {
    gameOver = true;
  }
  
  // Check collisions with obstacles
  for (let obs of obstacles) {
    const dx = marble.x - obs.x;
    const dy = marble.y - obs.y;
    const dz = marble.z - obs.z;
    const distance = Math.sqrt(dx*dx + dy*dy + dz*dz);
    if (distance < marble.radius + obs.radius) {
      gameOver = true;
    }
  }
  
  // Add trail point
  trail.push({x: marble.x, y: marble.y, z: marble.z});
  if (trail.length > 100) {
    trail.shift();
  }
  
  // Draw course and obstacles
  drawCourse();
  drawObstacles();
  drawGoalArea();
  drawTrail();
  drawMarble();
  
  // Draw timer
  textSize(24);
  fill(255);
  text(`Time: ${timer}`, -width/2 + 20, -height/2 + 30);
}

function generateObstacles() {
  for (let i = 0; i < 15; i++) {
    obstacles.push({
      x: random(-200, 200),
      y: random(-100, 100),
      z: random(0, 1000),
      radius: random(15, 30)
    });
  }
}

function createCourse() {
  // Create a simple isometric path with multiple lanes
  let path = [];
  for (let i = 0; i < 20; i++) {
    path.push({
      x: map(i, 0, 19, -250, 250),
      y: 0,
      z: i * 50
    });
  }
  return path;
}

function drawCourse() {
  // Draw the race course path
  stroke(200);
  strokeWeight(3);
  noFill();
  
  beginShape();
  for (let point of course) {
    vertex(point.x, point.y, point.z);
  }
  endShape();
  
  // Draw lane dividers
  stroke(150);
  strokeWeight(1);
  for (let i = 0; i < 3; i++) {
    beginShape();
    for (let j = 0; j < course.length; j++) {
      const offset = (i - 1) * 20;
      vertex(course[j].x + offset, course[j].y, course[j].z);
    }
    endShape();
  }
}

function drawObstacles() {
  for (let obs of obstacles) {
    push();
    translate(obs.x, obs.y, obs.z);
    fill(180, 50, 50);
    noStroke();
    sphere(obs.radius);
    pop();
  }
}

function drawGoalArea() {
  push();
  translate(goalArea.x, goalArea.y, goalArea.z);
  fill(50, 200, 50, 100);
  stroke(50, 200, 50);
  strokeWeight(2);
  box(goalArea.width, goalArea.height, 10);
  pop();
}

function drawTrail() {
  if (trail.length < 2) return;
  
  stroke(255, 200);
  strokeWeight(2);
  noFill();
  
  beginShape();
  for (let i = 0; i < trail.length; i++) {
    const point = trail[i];
    vertex(point.x, point.y, point.z);
  }
  endShape();
}

function drawMarble() {
  push();
  translate(marble.x, marble.y, marble.z);
  fill(255, 100, 100);
  noStroke();
  sphere(marble.radius);
  
  // Add sparkle effect
  for (let i = 0; i < 3; i++) {
    const angle = frameCount * 0.1 + i * TWO_PI / 3;
    const x = marble.radius * cos(angle);
    const y = marble.radius * sin(angle);
    fill(255, 255, 200, 150);
    noStroke();
    ellipse(x, y, 3, 3);
  }
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
