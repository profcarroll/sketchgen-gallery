let logs = [];
let planks = [];
let pile = [];
let gravity = 0.2;
let stackHeight = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create initial logs
  for (let i = 0; i < 5; i++) {
    logs.push({
      x: random(-200, 200),
      y: random(-200, -100),
      z: random(-100, 100),
      radius: random(20, 30),
      height: random(80, 120),
      angle: random(TWO_PI),
      speed: random(0.01, 0.03),
      sliced: false,
      slices: []
    });
  }
}

function draw() {
  background(220, 20, 95);
  
  // Ambient lighting
  ambientLight(60);
  pointLight(255, 255, 255, 0, -300, 300);
  
  // Draw ground
  push();
  translate(0, height/2 - 50, 0);
  rotateX(PI/2);
  fill(100, 10, 80);
  plane(width, height);
  pop();
  
  // Update and draw logs
  for (let i = logs.length - 1; i >= 0; i--) {
    let log = logs[i];
    
    // Rotate log
    log.angle += log.speed;
    
    // Slice the log
    if (!log.sliced && log.y > 50) {
      sliceLog(log);
      log.sliced = true;
    }
    
    // Move log down
    log.y += gravity * 2;
    
    // Draw log
    push();
    translate(log.x, log.y, log.z);
    rotateY(log.angle);
    fill(10, 80, 60);
    cylinder(log.radius, log.height, 8, 1, true);
    pop();
    
    // Remove logs that fall off screen
    if (log.y > height/2 + 200) {
      logs.splice(i, 1);
    }
  }
  
  // Update and draw planks
  for (let i = planks.length - 1; i >= 0; i--) {
    let plank = planks[i];
    
    // Apply gravity
    plank.vy += gravity;
    plank.y += plank.vy;
    
    // Check ground collision
    if (plank.y > height/2 - 50 - plank.height/2) {
      plank.y = height/2 - 50 - plank.height/2;
      plank.vy = 0;
      
      // Add to pile stack
      addToPile(plank);
      planks.splice(i, 1);
    }
    
    // Draw plank
    push();
    translate(plank.x, plank.y, plank.z);
    rotateY(plank.angle);
    fill(40, 30, 80);
    rectMode(CENTER);
    rect(0, 0, plank.width, plank.height);
    pop();
  }
  
  // Draw pile
  for (let i = 0; i < pile.length; i++) {
    let plank = pile[i];
    push();
    translate(plank.x, plank.y, plank.z);
    rotateY(plank.angle);
    fill(40, 30, 80);
    rectMode(CENTER);
    rect(0, 0, plank.width, plank.height);
    pop();
  }
  
  // Add new logs periodically
  if (frameCount % 120 === 0 && logs.length < 10) {
    logs.push({
      x: random(-200, 200),
      y: random(-300, -200),
      z: random(-100, 100),
      radius: random(20, 30),
      height: random(80, 120),
      angle: random(TWO_PI),
      speed: random(0.01, 0.03),
      sliced: false,
      slices: []
    });
  }
}

function sliceLog(log) {
  // Create planks from the log
  let plankCount = floor(random(3, 6));
  for (let i = 0; i < plankCount; i++) {
    let plank = {
      x: log.x + random(-20, 20),
      y: log.y + random(-10, 10),
      z: log.z + random(-20, 20),
      width: log.radius * 2,
      height: log.height / plankCount,
      angle: log.angle + random(-0.1, 0.1),
      vy: random(-1, -0.5)
    };
    planks.push(plank);
  }
}

function addToPile(plank) {
  // Simple stacking logic
  let placed = false;
  for (let i = 0; i < pile.length; i++) {
    let p = pile[i];
    if (abs(p.x - plank.x) < 30 && abs(p.z - plank.z) < 30) {
      // Stack on top of existing plank
      plank.y = p.y - plank.height/2;
      pile.push(plank);
      placed = true;
      break;
    }
  }
  
  if (!placed) {
    pile.push(plank);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
