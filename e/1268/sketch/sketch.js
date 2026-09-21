let logs = [];
let planks = [];
let sawmill;
let gravity = 0.2;
let logRadius = 30;
let plankWidth = 60;
let plankHeight = 15;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Initialize sawmill
  sawmill = {
    x: 0,
    y: -height/4,
    width: 200,
    height: 50,
    speed: 2
  };

  // Create initial logs
  for (let i = 0; i < 10; i++) {
    logs.push({
      x: random(-width/3, width/3),
      y: -height/2 + random(100, 200),
      z: random(-100, 100),
      radius: logRadius,
      rotation: random(TWO_PI),
      speed: random(0.5, 1.5),
      sliced: false
    });
  }
}

function draw() {
  background(220, 30, 90);

  // Rotate the scene for better viewing
  rotateY(frameCount * 0.005);
  rotateX(PI/6);

  // Draw ground
  push();
  translate(0, height/2 - 50, 0);
  plane(width, 100);
  pop();

  // Draw sawmill
  push();
  translate(sawmill.x, sawmill.y, 0);
  fill(100, 50, 30);
  box(sawmill.width, sawmill.height, 20);
  pop();

  // Update and draw logs
  for (let i = logs.length - 1; i >= 0; i--) {
    let log = logs[i];
    
    // Move log forward
    log.x += log.speed;
    log.rotation += log.speed * 0.02;

    // Check if log enters sawmill
    if (log.x > sawmill.x - sawmill.width/2 && 
        log.x < sawmill.x + sawmill.width/2 &&
        log.y > sawmill.y - sawmill.height/2) {
      // Slice the log into planks
      sliceLog(log);
      logs.splice(i, 1);
    }
  }

  // Draw planks that have fallen
  for (let i = planks.length - 1; i >= 0; i--) {
    let plank = planks[i];
    
    // Apply gravity
    plank.y += gravity;
    
    // Remove planks that fall off screen
    if (plank.y > height/2 + 100) {
      planks.splice(i, 1);
    } else {
      drawPlank(plank);
    }
  }

  // Add new logs occasionally
  if (frameCount % 100 === 0 && logs.length < 15) {
    logs.push({
      x: -width/2 - 50,
      y: -height/2 + random(100, 200),
      z: random(-100, 100),
      radius: logRadius,
      rotation: random(TWO_PI),
      speed: random(0.5, 1.5),
      sliced: false
    });
  }
}

function sliceLog(log) {
  // Create planks from the log
  let numPlanks = floor(random(3, 7));
  
  for (let i = 0; i < numPlanks; i++) {
    planks.push({
      x: log.x,
      y: log.y + random(-10, 10),
      z: log.z + random(-20, 20),
      width: plankWidth,
      height: plankHeight,
      depth: log.radius * 2,
      rotation: log.rotation + random(-0.5, 0.5),
      color: color(random(10, 30), 40, 60) // Earthy brown tones
    });
  }
}

function drawPlank(plank) {
  push();
  translate(plank.x, plank.y, plank.z);
  rotateY(plank.rotation);
  
  // Create a simple wooden plank shape with texture
  fill(plank.color);
  stroke(0, 10, 30);
  strokeWeight(1);
  
  // Draw the plank as a box
  box(plank.width, plank.height, plank.depth);
  
  // Add some wood grain effect
  noStroke();
  fill(0, 0, 20, 0.2);
  beginShape();
  for (let i = 0; i < 10; i++) {
    let angle = map(i, 0, 9, 0, TWO_PI);
    let x = plank.width/2 * cos(angle);
    let y = plank.height/2 * sin(angle);
    vertex(x, y, plank.depth/2);
  }
  endShape(CLOSE);
  
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
