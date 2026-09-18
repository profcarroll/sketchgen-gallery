let switches = [];
let buttons = [];
let windscreen;
let hyperspaceActive = false;
let hyperspaceTime = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  windscreen = createGraphics(width, height);
  
  // Create switches
  for (let i = 0; i < 20; i++) {
    switches.push({
      x: random(50, width - 50),
      y: random(50, height - 50),
      on: false,
      glow: color(139, 0, 0, 100)
    });
  }
  
  // Create buttons
  buttons.push({
    x: width/2,
    y: height/2,
    radius: 40,
    correct: true,
    activated: false
  });
  
  // Add some inactive buttons
  for (let i = 0; i < 5; i++) {
    buttons.push({
      x: random(50, width - 50),
      y: random(50, height - 50),
      radius: 20,
      correct: false,
      activated: false
    });
  }
  
  noLoop();
}

function draw() {
  background(20);
  
  // Draw windscreen area
  fill(10, 10, 30, 200);
  rectMode(CENTER);
  rect(width/2, height/2, width * 0.7, height * 0.6);
  
  if (hyperspaceActive) {
    drawHyperspace();
  } else {
    drawPanel();
  }
}

function drawPanel() {
  // Draw switches
  for (let s of switches) {
    fill(s.glow);
    noStroke();
    ellipse(s.x, s.y, 12, 12);
    
    fill(30);
    stroke(255, 100);
    strokeWeight(1);
    ellipse(s.x, s.y, 10, 10);
  }
  
  // Draw buttons
  for (let b of buttons) {
    if (b.activated) {
      fill(0, 255, 0, 150);
    } else if (b.correct) {
      fill(255, 100, 100, 150);
    } else {
      fill(100, 50, 50, 150);
    }
    
    stroke(255, 150);
    strokeWeight(2);
    ellipse(b.x, b.y, b.radius * 2);
    
    if (b.correct) {
      fill(255);
      noStroke();
      ellipse(b.x, b.y, b.radius * 0.6);
    }
  }
  
  // Draw panel border
  stroke(100, 100, 150);
  strokeWeight(3);
  noFill();
  rectMode(CENTER);
  rect(width/2, height/2, width * 0.8, height * 0.7);
}

function drawHyperspace() {
  // Draw animated hyperspace tunnel
  background(0);
  
  for (let i = 0; i < 100; i++) {
    let angle = map(i, 0, 100, 0, TWO_PI) + hyperspaceTime;
    let radius = map(i, 0, 100, 50, width/2);
    let x = width/2 + cos(angle) * radius;
    let y = height/2 + sin(angle) * radius;
    
    stroke(255, 100);
    strokeWeight(map(i, 0, 100, 1, 5));
    point(x, y);
  }
  
  // Draw streaks
  for (let i = 0; i < 20; i++) {
    let x = random(width);
    let y = random(height);
    let size = random(5, 30);
    
    fill(255, 100);
    noStroke();
    ellipse(x, y, size, size);
  }
  
  hyperspaceTime += 0.02;
}

function mousePressed() {
  // Check if any button was clicked
  for (let b of buttons) {
    let d = dist(mouseX, mouseY, b.x, b.y);
    if (d < b.radius) {
      if (b.correct) {
        hyperspaceActive = true;
        hyperspaceTime = 0;
        loop();
      }
      b.activated = true;
      return;
    }
  }
  
  // If no button clicked, check switches
  for (let s of switches) {
    let d = dist(mouseX, mouseY, s.x, s.y);
    if (d < 10) {
      s.on = !s.on;
      return;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
