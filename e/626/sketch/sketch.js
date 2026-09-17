let switches = [];
let buttons = [];
let windscreen;
let hyperspaceMode = false;
let hyperspaceTime = 0;

function setup() {
  createCanvas(800, 600);
  
  // Create switches
  for (let i = 0; i < 12; i++) {
    switches.push({
      x: 50 + (i % 4) * 150,
      y: 50 + floor(i / 4) * 100,
      on: false,
      glow: color(180, 0, 0)
    });
  }
  
  // Create buttons
  for (let i = 0; i < 6; i++) {
    buttons.push({
      x: 650,
      y: 100 + i * 80,
      width: 100,
      height: 40,
      pressed: false,
      glow: color(0, 150, 255)
    });
  }
  
  windscreen = createGraphics(600, 400);
  windscreen.background(0);
}

function draw() {
  background(30);
  
  // Draw control panel
  fill(40);
  stroke(80);
  rect(20, 20, 760, 560, 10);
  
  // Draw switches
  for (let s of switches) {
    if (s.on) {
      fill(s.glow);
      stroke(s.glow);
    } else {
      fill(20);
      stroke(80);
    }
    rect(s.x - 15, s.y - 15, 30, 30, 5);
    
    // Draw switch indicator
    if (s.on) {
      fill(255);
      noStroke();
      ellipse(s.x, s.y, 10, 10);
    }
  }
  
  // Draw buttons
  for (let b of buttons) {
    if (b.pressed) {
      fill(b.glow);
      stroke(b.glow);
    } else {
      fill(20);
      stroke(80);
    }
    rect(b.x, b.y, b.width, b.height, 5);
    
    // Draw button label
    fill(200);
    noStroke();
    textSize(14);
    textAlign(CENTER, CENTER);
    text("BUTTON", b.x + b.width/2, b.y + b.height/2);
  }
  
  // Draw windscreen area
  image(windscreen, 100, 100);
  
  // Draw center display
  fill(0);
  stroke(50);
  rect(300, 250, 200, 100, 10);
  fill(100, 255, 100);
  noStroke();
  textSize(20);
  textAlign(CENTER);
  text("HYPERDRIVE", 400, 280);
  text("READY", 400, 310);
  
  // Draw hyperspace effect if active
  if (hyperspaceMode) {
    drawHyperspace();
  }
}

function mousePressed() {
  let cx = width / 2;
  let cy = height / 2;
  
  // Check if clicked in center area for hyperspace
  if (dist(mouseX, mouseY, cx, cy) < 50) {
    hyperspaceMode = true;
    hyperspaceTime = millis();
    return;
  }
  
  // Check switches
  for (let s of switches) {
    if (dist(mouseX, mouseY, s.x, s.y) < 20) {
      s.on = !s.on;
      return;
    }
  }
  
  // Check buttons
  for (let b of buttons) {
    if (mouseX > b.x && mouseX < b.x + b.width && mouseY > b.y && mouseY < b.y + b.height) {
      b.pressed = true;
      setTimeout(() => b.pressed = false, 200);
      return;
    }
  }
}

function drawHyperspace() {
  // Draw the hyperspace effect
  let t = (millis() - hyperspaceTime) / 1000;
  
  if (t > 5) {
    hyperspaceMode = false;
    return;
  }
  
  background(0);
  
  // Draw streaks
  for (let i = 0; i < 200; i++) {
    let x = random(width);
    let y = random(height);
    let size = random(1, 5);
    
    let angle = map(i, 0, 200, 0, TWO_PI) + t * 2;
    let speed = map(i, 0, 200, 1, 10);
    let dx = cos(angle) * speed;
    let dy = sin(angle) * speed;
    
    stroke(255, 100);
    noFill();
    line(x, y, x + dx, y + dy);
  }
  
  // Draw central bright area
  fill(255, 200);
  ellipse(width/2, height/2, 100 + sin(t * 3) * 50, 100 + cos(t * 3) * 50);
}
