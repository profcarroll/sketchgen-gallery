let panel;
let windscreen;
let buttons = [];
let switches = [];
let gauges = [];
let hyperspaceActive = false;
let hyperspaceStreaks = [];
let hyperspaceTime = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);

  // Create main panel
  panel = createGraphics(width, height);
  panel.colorMode(HSB, 360, 100, 100, 1);
  panel.background(20, 10, 15);

  // Create windscreen display
  windscreen = createGraphics(width * 0.6, height * 0.4);
  windscreen.colorMode(HSB, 360, 100, 100, 1);
  windscreen.background(0, 0, 5);

  // Create buttons
  for (let i = 0; i < 8; i++) {
    buttons.push({
      x: width * 0.1 + i * (width * 0.08),
      y: height * 0.7,
      w: width * 0.06,
      h: height * 0.05,
      active: false
    });
  }

  // Create switches
  for (let i = 0; i < 6; i++) {
    switches.push({
      x: width * 0.2 + i * (width * 0.1),
      y: height * 0.3,
      w: width * 0.03,
      h: height * 0.1,
      active: false
    });
  }

  // Create gauges
  for (let i = 0; i < 4; i++) {
    gauges.push({
      x: width * 0.7 + i * (width * 0.08),
      y: height * 0.2,
      r: width * 0.06
    });
  }
}

function draw() {
  background(20, 10, 15);
  
  // Draw panel
  image(panel, 0, 0);
  
  // Draw windscreen
  image(windscreen, width * 0.2, height * 0.15);
  
  // Draw buttons
  for (let button of buttons) {
    drawButton(button);
  }
  
  // Draw switches
  for (let switchObj of switches) {
    drawSwitch(switchObj);
  }
  
  // Draw gauges
  for (let gauge of gauges) {
    drawGauge(gauge);
  }
  
  // Handle hyperspace effect
  if (hyperspaceActive) {
    drawHyperspace();
  }
}

function drawButton(button) {
  push();
  translate(button.x, button.y);
  
  // Button body
  fill(30, 15, 25);
  stroke(30, 20, 40);
  strokeWeight(2);
  rect(0, 0, button.w, button.h, 5);
  
  // Button glow
  if (button.active) {
    fill(0, 100, 100, 0.7);
    noStroke();
    rect(0, 0, button.w, button.h, 5);
  } else {
    fill(180, 100, 100, 0.6);
    noStroke();
    rect(0, 0, button.w, button.h, 5);
  }
  
  pop();
}

function drawSwitch(switchObj) {
  push();
  translate(switchObj.x, switchObj.y);
  
  // Switch body
  fill(30, 15, 25);
  stroke(30, 20, 40);
  strokeWeight(2);
  rect(0, 0, switchObj.w, switchObj.h, 3);
  
  // Switch indicator
  if (switchObj.active) {
    fill(0, 100, 100);
    noStroke();
    ellipse(switchObj.w/2, switchObj.h - 5, 8, 8);
  } else {
    fill(180, 100, 100);
    noStroke();
    ellipse(switchObj.w/2, 5, 8, 8);
  }
  
  pop();
}

function drawGauge(gauge) {
  push();
  translate(gauge.x, gauge.y);
  
  // Gauge body
  fill(30, 15, 25);
  stroke(30, 20, 40);
  strokeWeight(3);
  circle(0, 0, gauge.r * 2);
  
  // Gauge indicator
  let angle = map(frameCount % 120, 0, 120, 0, TWO_PI);
  let x = cos(angle) * (gauge.r * 0.7);
  let y = sin(angle) * (gauge.r * 0.7);
  
  stroke(0, 100, 100);
  strokeWeight(3);
  line(0, 0, x, y);
  
  // Gauge center dot
  fill(0, 100, 100);
  noStroke();
  ellipse(0, 0, 8, 8);
  
  pop();
}

function drawHyperspace() {
  hyperspaceTime += 0.05;
  
  // Clear windscreen with fade
  windscreen.fill(0, 0, 5, 0.1);
  windscreen.noStroke();
  windscreen.rect(0, 0, windscreen.width, windscreen.height);
  
  // Draw hyperspace streaks
  for (let i = 0; i < 20; i++) {
    let x = (frameCount * 3 + i * 50) % windscreen.width;
    let y = (hyperspaceTime * 10 + i * 30) % windscreen.height;
    
    // Create color gradient
    let hue = (frameCount * 2 + i * 10) % 360;
    let alpha = map(i, 0, 20, 0.7, 0);
    
    windscreen.stroke(hue, 100, 100, alpha);
    windscreen.strokeWeight(2);
    windscreen.line(x, y, x - 30, y - 30);
  }
  
  // Draw central flash
  let flashSize = sin(frameCount * 0.2) * 20 + 40;
  windscreen.fill(200, 100, 100, 0.3);
  windscreen.noStroke();
  windscreen.ellipse(windscreen.width/2, windscreen.height/2, flashSize, flashSize);
}

function mousePressed() {
  // Check if clicked on hyperspace button
  let centerX = width * 0.5;
  let centerY = height * 0.75;
  let buttonRadius = width * 0.08;
  
  let d = dist(mouseX, mouseY, centerX, centerY);
  if (d < buttonRadius) {
    hyperspaceActive = true;
    noLoop();
  }
}
