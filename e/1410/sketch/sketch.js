let towers = [];
let isDragging = false;
let lastPos = { x: 0, y: 0 };
let groundY;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  rectMode(CENTER);
  groundY = height - 50;
}

function draw() {
  background(220, 5, 95);
  
  // Draw ground plane
  fill(0, 0, 30);
  rect(width/2, groundY, width, 100);
  
  // Draw all towers
  for (let tower of towers) {
    push();
    translate(tower.x, tower.y);
    rotate(tower.angle);
    
    // Main tower section
    fill(tower.hue, 30, 70);
    rect(0, 0, tower.width, tower.height);
    
    // Reflective highlights
    fill(tower.hue, 10, 90, 0.4);
    rect(0, -tower.height/2 + 5, tower.width * 0.8, 10);
    
    // Side reflections
    fill(tower.hue, 20, 90, 0.2);
    rect(-tower.width/3, -tower.height/2 + 10, tower.width/6, tower.height * 0.3);
    rect(tower.width/3, -tower.height/2 + 10, tower.width/6, tower.height * 0.3);
    
    pop();
  }
  
  // Draw cursor guidance
  if (isDragging) {
    fill(240, 50, 90, 0.7);
    ellipse(mouseX, mouseY, 10, 10);
  }
}

function mousePressed() {
  isDragging = true;
  lastPos = { x: mouseX, y: mouseY };
}

function mouseReleased() {
  isDragging = false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  groundY = height - 50;
}

function mouseDragged() {
  if (isDragging) {
    // Add new tower section along the drag path
    let dx = mouseX - lastPos.x;
    let dy = mouseY - lastPos.y;
    let dist = sqrt(dx * dx + dy * dy);
    
    if (dist > 10) {
      let angle = atan2(dy, dx);
      let section = {
        x: lastPos.x,
        y: lastPos.y,
        width: random(8, 25),
        height: random(20, 60),
        angle: angle,
        hue: random(180, 240)
      };
      
      towers.push(section);
      lastPos = { x: mouseX, y: mouseY };
    }
  }
}
