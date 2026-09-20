let logs = [];
let planks = [];
let sawmill;
let gravity = 0.2;
let plankCount = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize sawmill
  sawmill = {
    x: 0,
    y: -height/4,
    z: 0,
    width: width * 0.8,
    height: 20,
    depth: 300,
    bladePos: -width/2,
    bladeSpeed: 3
  };
  
  // Create initial logs
  for (let i = 0; i < 5; i++) {
    logs.push({
      x: random(-width/3, width/3),
      y: -height/2 - 100 - i * 150,
      z: random(-100, 100),
      radius: random(20, 40),
      height: random(80, 120),
      rotation: random(TWO_PI),
      speed: random(0.5, 1.5),
      sliced: false,
      cutPlanks: []
    });
  }
}

function draw() {
  background(220, 20, 95);
  
  // Ambient lighting
  ambientLight(60);
  pointLight(255, 255, 255, 0, -height/2, 0);
  
  // Camera movement for dynamic view
  let time = millis() * 0.0002;
  camera(0, -height/4, height, 0, 0, 0, 0, 1, 0);
  
  // Draw sawmill structure
  push();
  translate(sawmill.x, sawmill.y, sawmill.z);
  fill(80, 30, 40);
  box(sawmill.width, sawmill.height, sawmill.depth);
  pop();
  
  // Update and draw logs
  for (let i = logs.length - 1; i >= 0; i--) {
    let log = logs[i];
    
    // Move log forward
    log.y += log.speed;
    
    // Check if log enters sawmill
    if (log.y > sawmill.y - log.height/2 && !log.sliced) {
      sliceLog(log);
      log.sliced = true;
    }
    
    // Draw log
    push();
    translate(log.x, log.y, log.z);
    rotateY(log.rotation);
    fill(30, 40, 60);
    cylinder(log.radius, log.height);
    pop();
    
    // Remove logs that have passed the sawmill
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
    
    // Draw plank
    push();
    translate(plank.x, plank.y, plank.z);
    rotateX(plank.rotationX);
    rotateY(plank.rotationY);
    fill(plank.color);
    rectMode(CENTER);
    rect(0, 0, plank.width, plank.height);
    pop();
    
    // Remove planks that have settled
    if (plank.y > height/2 - 100) {
      planks.splice(i, 1);
    }
  }
  
  // Add new logs periodically
  if (frameCount % 150 === 0 && logs.length < 8) {
    logs.push({
      x: random(-width/3, width/3),
      y: -height/2 - 100,
      z: random(-100, 100),
      radius: random(20, 40),
      height: random(80, 120),
      rotation: random(TWO_PI),
      speed: random(0.5, 1.5),
      sliced: false,
      cutPlanks: []
    });
  }
  
  // Update sawmill blade
  sawmill.bladePos += sawmill.bladeSpeed;
  if (sawmill.bladePos > width/2) {
    sawmill.bladePos = -width/2;
  }
}

function sliceLog(log) {
  let numPlanks = floor(log.height / 8);
  let plankWidth = log.radius * 2;
  
  for (let i = 0; i < numPlanks; i++) {
    planks.push({
      x: log.x + random(-10, 10),
      y: log.y,
      z: log.z + random(-10, 10),
      width: plankWidth,
      height: 8,
      rotationX: random(-0.1, 0.1),
      rotationY: random(-0.1, 0.1),
      vy: random(0.5, 2),
      color: color(random(20, 40), 30, 60)
    });
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
