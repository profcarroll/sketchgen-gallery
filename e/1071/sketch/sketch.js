let logs = [];
let planks = [];
let sawdust = [];
let conveyorSpeed = 0.5;
let sawAngle = 0;
let sawRadius = 100;
let logRadius = 30;
let plankThickness = 4;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  
  // Create initial logs
  for (let i = 0; i < 5; i++) {
    logs.push({
      x: -width/2 + i * 150,
      y: 0,
      z: 0,
      rotation: i * 0.5,
      speed: conveyorSpeed
    });
  }
}

function draw() {
  background(240, 220, 180);
  
  // Update saw angle
  sawAngle += 0.03;
  
  // Draw conveyor belt
  fill(139, 69, 19);
  push();
  translate(0, height/4, 0);
  rotateX(HALF_PI);
  plane(width, 20);
  pop();
  
  // Draw saw blade
  push();
  translate(0, height/4, 0);
  rotateZ(sawAngle);
  fill(200, 200, 200);
  sphere(sawRadius);
  
  // Draw teeth
  fill(180, 180, 180);
  for (let i = 0; i < 12; i++) {
    let angle = TWO_PI * i / 12;
    push();
    rotateZ(angle);
    translate(sawRadius - 10, 0, 0);
    rotateY(HALF_PI);
    cylinder(3, 20);
    pop();
  }
  pop();
  
  // Update and draw logs
  for (let i = logs.length - 1; i >= 0; i--) {
    let log = logs[i];
    
    // Move log
    log.x += log.speed;
    log.rotation += log.speed * 0.02;
    
    // Draw log
    push();
    translate(log.x, height/4, log.z);
    rotateY(log.rotation);
    fill(139, 69, 19);
    cylinder(logRadius, logRadius * 2, 16);
    pop();
    
    // Check if log is under the saw
    if (log.x > -width/4 && log.x < width/4) {
      // Slice the log into planks
      sliceLog(log);
      logs.splice(i, 1);
    }
    
    // Reset log when it goes off screen
    if (log.x > width/2 + 100) {
      log.x = -width/2 - 100;
      log.z = random(-50, 50);
    }
  }
  
  // Update and draw planks
  for (let i = planks.length - 1; i >= 0; i--) {
    let plank = planks[i];
    
    plank.x += plank.speedX;
    plank.y += plank.speedY;
    plank.z += plank.speedZ;
    plank.rotation += plank.rotationSpeed;
    
    // Apply gravity
    plank.speedY += 0.1;
    
    push();
    translate(plank.x, plank.y, plank.z);
    rotateY(plank.rotation);
    fill(210, 180, 140);
    box(plank.width, plankThickness, plank.length);
    pop();
    
    // Remove planks that fall off screen
    if (plank.y > height/2 + 100) {
      planks.splice(i, 1);
    }
  }
  
  // Update and draw sawdust particles
  for (let i = sawdust.length - 1; i >= 0; i--) {
    let particle = sawdust[i];
    
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.z += particle.vz;
    
    // Apply gravity and air resistance
    particle.vy += 0.05;
    particle.vx *= 0.98;
    particle.vz *= 0.98;
    
    push();
    translate(particle.x, particle.y, particle.z);
    fill(200, 180, 160, 150);
    sphere(2);
    pop();
    
    // Remove old particles
    if (particle.life <= 0) {
      sawdust.splice(i, 1);
    } else {
      particle.life--;
    }
  }
  
  // Add new sawdust particles when logs are sliced
  if (frameCount % 5 === 0 && logs.length > 0) {
    for (let i = 0; i < 3; i++) {
      sawdust.push({
        x: random(-width/4, width/4),
        y: height/4 - logRadius,
        z: 0,
        vx: random(-2, 2),
        vy: random(-1, 1),
        vz: random(-1, 1),
        life: random(30, 60)
      });
    }
  }
}

function sliceLog(log) {
  // Create planks from the log
  let plankCount = 8;
  for (let i = 0; i < plankCount; i++) {
    planks.push({
      x: log.x,
      y: height/4 - logRadius,
      z: log.z,
      width: logRadius * 2,
      length: logRadius * 2,
      speedX: random(-1, 1),
      speedY: random(-3, -1),
      speedZ: random(-1, 1),
      rotation: random(TWO_PI),
      rotationSpeed: random(-0.1, 0.1)
    });
  }
}

function mousePressed() {
  // Increase conveyor speed on click
  conveyorSpeed += 0.2;
  
  // Limit maximum speed
  if (conveyorSpeed > 3) {
    conveyorSpeed = 3;
  }
}
