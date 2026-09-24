let gears = [];
let centerX, centerY, centerZ;
let lightPulse = 0;
let inputSpeed = 1;
let dragStartX = 0;
let isDragging = false;
let flywheelAngle = 0;

function setup() {
  createCanvas(600, 600, WEBGL);
  noStroke();
  centerX = 0;
  centerY = 0;
  centerZ = 0;

  // Create gear assembly
  for (let i = 0; i < 5; i++) {
    let radius = 100 + i * 80;
    let speed = 1 / (i + 1);
    gears.push({
      radius: radius,
      speed: speed,
      angle: random(TWO_PI),
      teeth: 20 + i * 5,
      color: color(180, 140, 80 + i * 20)
    });
  }
}

function draw() {
  background(20);
  
  // Camera movement
  let time = millis() / 1000;
  let camX = sin(time * 0.1) * 500;
  let camY = cos(time * 0.1) * 300;
  let camZ = sin(time * 0.2) * 200 + 300;
  camera(camX, camY, camZ, centerX, centerY, centerZ, 0, 1, 0);

  // Update light pulse based on average gear speed
  let totalSpeed = 0;
  for (let gear of gears) {
    totalSpeed += gear.speed;
  }
  let avgSpeed = totalSpeed / gears.length;
  lightPulse = map(avgSpeed, 0.1, 1, 0.5, 1);

  // Draw center light
  push();
  fill(255, 200, 0, 200 * lightPulse);
  sphere(30);
  pop();

  // Draw gears
  for (let i = 0; i < gears.length; i++) {
    let gear = gears[i];
    gear.angle += gear.speed * inputSpeed * 0.01;
    
    push();
    translate(0, 0, centerZ);
    rotateY(gear.angle);
    
    fill(gear.color);
    drawGear(gear.radius, gear.teeth);
    pop();
  }

  // Draw flywheel at the end
  flywheelAngle += inputSpeed * 0.02;
  push();
  translate(0, 0, centerZ);
  rotateY(flywheelAngle);
  fill(100, 100, 120);
  drawFlywheel(350);
  pop();
}

function drawGear(radius, teeth) {
  let toothAngle = TWO_PI / teeth;
  for (let i = 0; i < teeth; i++) {
    let angle = i * toothAngle;
    push();
    rotateZ(angle);
    translate(radius, 0);
    
    // Gear tooth
    let toothHeight = 10;
    let toothWidth = 8;
    beginShape();
    vertex(0, -toothHeight/2);
    vertex(toothWidth, -toothHeight/2);
    vertex(toothWidth, toothHeight/2);
    vertex(0, toothHeight/2);
    endShape(CLOSE);
    
    pop();
  }
  
  // Gear circle
  stroke(100);
  noFill();
  ellipse(0, 0, radius * 2);
}

function drawFlywheel(radius) {
  // Flywheel rim
  fill(80, 80, 100);
  stroke(50);
  sphere(radius);

  // Flywheel hub
  fill(60, 60, 80);
  stroke(40);
  sphere(radius * 0.3);

  // Spokes
  stroke(120);
  for (let i = 0; i < 12; i++) {
    let angle = i * TWO_PI / 12;
    let x1 = cos(angle) * radius * 0.3;
    let y1 = sin(angle) * radius * 0.3;
    let x2 = cos(angle) * radius;
    let y2 = sin(angle) * radius;
    line(x1, y1, 0, x2, y2, 0);
  }
}

function mousePressed() {
  dragStartX = mouseX;
  isDragging = true;
}

function mouseDragged() {
  if (isDragging) {
    let deltaX = mouseX - dragStartX;
    inputSpeed = map(deltaX, -width/2, width/2, 0.1, 3);
    dragStartX = mouseX;
  }
}

function mouseReleased() {
  isDragging = false;
}
