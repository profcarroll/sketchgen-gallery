let logs = [];
let planks = [];
let sawblade;
let gravity = 0.2;
let logRadius = 30;
let plankWidth = 60;
let plankHeight = 10;
let plankDepth = 10;
let numLogs = 5;
let frameCount = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  
  // Initialize sawblade
  sawblade = {
    x: 0,
    y: -height/4,
    z: 0,
    speed: 2,
    direction: 1,
    radius: 30
  };
  
  // Create initial logs
  for (let i = 0; i < numLogs; i++) {
    logs.push({
      x: random(-width/3, width/3),
      y: -height/2 + 50 + i * 80,
      z: random(-50, 50),
      radius: logRadius,
      rotation: random(TWO_PI),
      rotSpeed: random(-0.02, 0.02),
      color: color(random(20, 40), 70, 60)
    });
  }
}

function draw() {
  background(220, 10, 95);
  
  // Camera movement
  let time = millis() * 0.0005;
  camera(0, -height/3, height, 0, 0, 0, 0, 1, 0);
  
  // Lighting
  pointLight(255, 255, 255, 0, -height/2, 0);
  ambientLight(60);
  
  // Draw sawblade
  push();
  translate(sawblade.x, sawblade.y, sawblade.z);
  rotateY(time * 2);
  fill(180, 30, 70);
  sphere(sawblade.radius);
  pop();
  
  // Move sawblade
  sawblade.x += sawblade.speed * sawblade.direction;
  if (sawblade.x > width/4 || sawblade.x < -width/4) {
    sawblade.direction *= -1;
  }
  
  // Update and draw logs
  for (let i = logs.length - 1; i >= 0; i--) {
    let log = logs[i];
    
    // Apply gravity
    log.y += gravity * 2;
    
    // Rotate log
    log.rotation += log.rotSpeed;
    
    // Draw log
    push();
    translate(log.x, log.y, log.z);
    rotateY(log.rotation);
    fill(log.color);
    cylinder(log.radius, 100);
    pop();
    
    // Check if log has fallen below screen
    if (log.y > height/2 + 100) {
      logs.splice(i, 1);
    }
  }
  
  // Create new planks from logs that are cut
  for (let i = logs.length - 1; i >= 0; i--) {
    let log = logs[i];
    
    // Check if log is under sawblade
    if (abs(log.y - sawblade.y) < 20 && abs(log.x - sawblade.x) < 50) {
      // Cut the log into planks
      for (let j = 0; j < 3; j++) {
        planks.push({
          x: log.x + random(-10, 10),
          y: log.y,
          z: log.z + random(-10, 10),
          width: plankWidth,
          height: plankHeight,
          depth: plankDepth,
          rotation: random(TWO_PI),
          rotSpeed: random(-0.05, 0.05),
          color: color(random(20, 40), 70, 60),
          velocityY: random(-1, -0.5)
        });
      }
      
      // Remove the log
      logs.splice(i, 1);
    }
  }
  
  // Update and draw planks
  for (let i = planks.length - 1; i >= 0; i--) {
    let plank = planks[i];
    
    // Apply gravity
    plank.y += plank.velocityY;
    
    // Rotate plank
    plank.rotation += plank.rotSpeed;
    
    // Draw plank
    push();
    translate(plank.x, plank.y, plank.z);
    rotateY(plank.rotation);
    fill(plank.color);
    box(plank.width, plank.height, plank.depth);
    pop();
    
    // Check if plank has fallen below screen
    if (plank.y > height/2 + 100) {
      planks.splice(i, 1);
    }
  }
  
  // Add new logs periodically
  frameCount++;
  if (frameCount % 60 === 0 && logs.length < numLogs + 5) {
    logs.push({
      x: random(-width/3, width/3),
      y: -height/2 + 50,
      z: random(-50, 50),
      radius: logRadius,
      rotation: random(TWO_PI),
      rotSpeed: random(-0.02, 0.02),
      color: color(random(20, 40), 70, 60)
    });
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
