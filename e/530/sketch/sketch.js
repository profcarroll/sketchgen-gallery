let switches = [];
let buttons = [];
let windscreenActive = false;
let hyperspaceEffect = [];
let sequence = [0, 2, 1, 3];
let userInput = [];
let buttonStates = [false, false, false, false];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();

  // Create switches
  for (let i = 0; i < 4; i++) {
    switches.push({
      x: width * 0.1 + i * width * 0.2,
      y: height * 0.3,
      w: 40,
      h: 80,
      on: false
    });
  }

  // Create buttons
  for (let i = 0; i < 4; i++) {
    buttons.push({
      x: width * 0.1 + i * width * 0.2,
      y: height * 0.6,
      r: 20,
      active: false
    });
  }

  // Initialize hyperspace effect particles
  for (let i = 0; i < 500; i++) {
    hyperspaceEffect.push({
      x: random(width),
      y: random(height),
      size: random(1, 3),
      speed: random(2, 8),
      color: color(random(100, 255), random(100, 255), 255, random(100, 255))
    });
  }
}

function draw() {
  background(10, 10, 30);

  // Draw dashboard
  fill(30, 30, 60);
  rect(0, 0, width, height);

  // Draw switches
  for (let i = 0; i < switches.length; i++) {
    let s = switches[i];
    if (s.on) {
      fill(0, 255, 100);
    } else {
      fill(100, 100, 150);
    }
    rect(s.x, s.y, s.w, s.h, 5);
  }

  // Draw buttons
  for (let i = 0; i < buttons.length; i++) {
    let b = buttons[i];
    if (b.active) {
      fill(255, 100, 100);
    } else {
      fill(150, 50, 50);
    }
    ellipse(b.x, b.y, b.r * 2);
  }

  // Draw windscreen if activated
  if (windscreenActive) {
    drawHyperspace();
  }

  // Draw panel details
  fill(20, 20, 40);
  rect(0, 0, width, 30); // Top bar
  rect(0, height - 30, width, 30); // Bottom bar

  fill(150);
  textAlign(CENTER);
  textSize(14);
  text("SHIP CONTROL PANEL", width / 2, 20);
}

function drawHyperspace() {
  // Draw background for hyperspace
  fill(0, 0, 20, 30);
  rect(0, 0, width, height);

  // Update and draw particles
  for (let i = 0; i < hyperspaceEffect.length; i++) {
    let p = hyperspaceEffect[i];
    
    // Move particle towards center (hyperspace effect)
    p.x += (width / 2 - p.x) * 0.01;
    p.y += (height / 2 - p.y) * 0.01;
    
    // Update position
    p.x += random(-p.speed, p.speed);
    p.y += random(-p.speed, p.speed);

    // Reset if out of bounds
    if (p.x < 0 || p.x > width || p.y < 0 || p.y > height) {
      p.x = random(width);
      p.y = random(height);
    }

    fill(p.color);
    noStroke();
    ellipse(p.x, p.y, p.size);
  }
}

function mousePressed() {
  if (windscreenActive) return; // Don't allow interaction after activation

  let centerX = width / 2;
  let centerY = height / 2;

  // Check for switch clicks
  for (let i = 0; i < switches.length; i++) {
    let s = switches[i];
    if (dist(mouseX, mouseY, s.x + s.w/2, s.y + s.h/2) < max(s.w, s.h)/2) {
      s.on = !s.on;
      userInput.push(i);
      checkSequence();
      return;
    }
  }

  // Check for button clicks
  for (let i = 0; i < buttons.length; i++) {
    let b = buttons[i];
    if (dist(mouseX, mouseY, b.x, b.y) < b.r) {
      b.active = true;
      userInput.push(i);
      checkSequence();
      setTimeout(() => {
        b.active = false;
      }, 100);
      return;
    }
  }

  // Check for center click to activate windscreen
  if (dist(mouseX, mouseY, centerX, centerY) < 50) {
    windscreenActive = true;
    noLoop(); // Stop drawing after activation
  }
}

function checkSequence() {
  if (userInput.length > sequence.length) {
    userInput = []; // Reset if incorrect
    return;
  }

  for (let i = 0; i < userInput.length; i++) {
    if (userInput[i] !== sequence[i]) {
      userInput = []; // Reset on wrong input
      return;
    }
  }

  if (userInput.length === sequence.length) {
    windscreenActive = true;
    noLoop(); // Stop drawing after correct sequence
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
