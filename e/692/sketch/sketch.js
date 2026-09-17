let buildings = [];
let drones = [];
let water;
let hoverArea;
let patternActive = false;
let patternPoints = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create buildings
  for (let i = 0; i < 50; i++) {
    buildings.push({
      x: random(-width/2, width/2),
      y: 0,
      z: random(-300, -100),
      w: random(20, 60),
      h: random(80, 200),
      depth: random(20, 50),
      color: color(random(20, 40), 80, random(70, 90))
    });
  }
  
  // Create drones
  for (let i = 0; i < 100; i++) {
    drones.push({
      x: random(-width/2, width/2),
      y: random(-100, 100),
      z: random(-300, -50),
      targetX: random(-width/2, width/2),
      targetY: random(-100, 100),
      targetZ: random(-300, -50),
      speed: random(0.005, 0.02),
      size: random(1, 4)
    });
  }
  
  // Define hover area
  hoverArea = {
    x: -width/4,
    y: height/4,
    w: width/2,
    h: height/4
  };
}

function draw() {
  background(0);
  
  // Camera movement
  let time = millis() * 0.0005;
  camera(0, 0, (height/2) / tan(PI/6), 0, 0, 0, 0, 1, 0);
  
  // Draw water
  drawWater();
  
  // Draw buildings
  drawBuildings();
  
  // Update and draw drones
  updateDrones();
  drawDrones();
  
  // Check hover area
  checkHoverArea();
}

function drawWater() {
  noStroke();
  fill(10, 20, 30);
  beginShape();
  vertex(-width/2, height/4, -300);
  vertex(width/2, height/4, -300);
  vertex(width/2, height/4, 300);
  vertex(-width/2, height/4, 300);
  endShape(CLOSE);
  
  // Add reflective effect
  stroke(180, 50, 80, 0.3);
  noFill();
  beginShape();
  for (let i = 0; i < 20; i++) {
    let angle = map(i, 0, 19, 0, TWO_PI);
    let x = cos(angle) * width/4;
    let z = sin(angle) * width/4;
    vertex(x, height/4, z);
  }
  endShape(CLOSE);
}

function drawBuildings() {
  for (let building of buildings) {
    push();
    translate(building.x, building.y, building.z);
    
    // Building body
    fill(building.color);
    noStroke();
    box(building.w, building.h, building.depth);
    
    // Windows
    fill(40, 80, 100);
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 5; j++) {
        if (random() > 0.3) {
          let windowX = -building.w/2 + i * building.w/10;
          let windowY = -building.h/2 + j * building.h/6;
          rect(windowX, windowY, building.w/15, building.h/10);
        }
      }
    }
    
    pop();
  }
}

function updateDrones() {
  for (let drone of drones) {
    // Move towards target
    drone.x += (drone.targetX - drone.x) * drone.speed;
    drone.y += (drone.targetY - drone.y) * drone.speed;
    drone.z += (drone.targetZ - drone.z) * drone.speed;
    
    // Random movement when not in pattern
    if (!patternActive) {
      drone.targetX += random(-0.5, 0.5);
      drone.targetY += random(-0.5, 0.5);
      drone.targetZ += random(-0.5, 0.5);
    }
    
    // Keep within bounds
    drone.x = constrain(drone.x, -width/2 + 10, width/2 - 10);
    drone.y = constrain(drone.y, -height/2 + 10, height/2 - 10);
    drone.z = constrain(drone.z, -300, -50);
  }
}

function drawDrones() {
  noStroke();
  
  if (patternActive && patternPoints.length > 0) {
    // Draw pattern
    fill(200, 100, 100);
    for (let i = 0; i < patternPoints.length; i++) {
      let p = patternPoints[i];
      push();
      translate(p.x, p.y, p.z);
      sphere(p.size * 2);
      pop();
    }
    
    // Draw connections
    stroke(200, 100, 100, 0.5);
    noFill();
    beginShape(LINES);
    for (let i = 0; i < patternPoints.length; i++) {
      let p1 = patternPoints[i];
      let p2 = patternPoints[(i + 1) % patternPoints.length];
      vertex(p1.x, p1.y, p1.z);
      vertex(p2.x, p2.y, p2.z);
    }
    endShape();
  } else {
    // Draw regular drones
    for (let drone of drones) {
      fill(200, 100, 100);
      push();
      translate(drone.x, drone.y, drone.z);
      sphere(drone.size);
      pop();
    }
  }
}

function checkHoverArea() {
  if (mouseX > hoverArea.x && mouseX < hoverArea.x + hoverArea.w &&
      mouseY > hoverArea.y && mouseY < hoverArea.y + hoverArea.h) {
    
    if (!patternActive) {
      patternActive = true;
      generatePattern();
    }
  } else {
    if (patternActive) {
      patternActive = false;
      patternPoints = [];
    }
  }
}

function generatePattern() {
  patternPoints = [];
  
  // Create a hexagonal pattern
  let centerX = 0;
  let centerY = height/8;
  let radius = width/6;
  let numPoints = 12;
  
  for (let i = 0; i < numPoints; i++) {
    let angle = map(i, 0, numPoints, 0, TWO_PI);
    let x = centerX + cos(angle) * radius;
    let y = centerY + sin(angle) * radius;
    let z = -200;
    
    patternPoints.push({
      x: x,
      y: y,
      z: z,
      size: random(3, 6)
    });
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
