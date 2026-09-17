let switches = [];
let buttons = [];
let windscreen;
let hyperspaceTransition = false;
let transitionProgress = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  windscreen = createGraphics(width * 0.7, height * 0.6);
  windscreen.background(0);

  // Create switches
  for (let i = 0; i < 8; i++) {
    switches.push({
      x: width * 0.1,
      y: height * 0.2 + i * 50,
      on: false,
      glow: 0
    });
  }

  // Create buttons
  for (let i = 0; i < 4; i++) {
    buttons.push({
      x: width * 0.8,
      y: height * 0.3 + i * 60,
      pressed: false
    });
  }
}

function draw() {
  background(20);
  
  // Draw console
  fill(30);
  noStroke();
  rect(0, 0, width, height);
  
  // Draw console panel
  fill(40);
  rect(width * 0.05, height * 0.1, width * 0.9, height * 0.8);
  
  // Draw switches
  for (let s of switches) {
    drawSwitch(s);
  }
  
  // Draw buttons
  for (let b of buttons) {
    drawButton(b);
  }
  
  // Draw windscreen
  image(windscreen, width * 0.15, height * 0.15);
  
  // Update windscreen view
  updateWindscreen();
}

function drawSwitch(switchObj) {
  // Draw switch base
  fill(60);
  noStroke();
  rect(switchObj.x - 10, switchObj.y - 10, 20, 20, 5);
  
  // Draw switch glow when on
  if (switchObj.on) {
    let glow = map(switchObj.glow, 0, 255, 0, 1);
    fill(255, 0, 0, glow * 100);
    noStroke();
    ellipse(switchObj.x, switchObj.y, 15, 15);
    switchObj.glow = min(switchObj.glow + 2, 255);
  } else {
    fill(100, 0, 0);
    noStroke();
    ellipse(switchObj.x, switchObj.y, 15, 15);
  }
  
  // Draw label
  fill(200);
  textSize(12);
  textAlign(LEFT, CENTER);
  text("SWITCH", switchObj.x + 20, switchObj.y);
}

function drawButton(button) {
  // Draw button base
  fill(60);
  noStroke();
  rect(button.x - 15, button.y - 15, 30, 30, 5);
  
  // Draw button press state
  if (button.pressed) {
    fill(200, 200, 0);
    rect(button.x - 15, button.y - 15, 30, 30, 5);
  } else {
    fill(150);
    rect(button.x - 15, button.y - 15, 30, 30, 5);
  }
  
  // Draw label
  fill(200);
  textSize(12);
  textAlign(CENTER, CENTER);
  text("BUTTON", button.x, button.y);
}

function updateWindscreen() {
  windscreen.background(0);
  
  if (hyperspaceTransition) {
    transitionProgress += 0.01;
    
    // Draw stars with increasing speed
    for (let i = 0; i < 500; i++) {
      let x = (i * 137.5 + frameCount * 20) % windscreen.width;
      let y = (i * 73.1 + frameCount * 15) % windscreen.height;
      
      // Fade in the transition
      let alpha = map(transitionProgress, 0, 1, 0, 255);
      
      if (transitionProgress > 0.5) {
        // After halfway, draw a grid of lines for hyperspace effect
        windscreen.stroke(255, alpha * 0.8);
        windscreen.line(x, y, x + 10, y + 10);
      } else {
        // Before halfway, just draw stars
        windscreen.stroke(255, alpha);
        windscreen.point(x, y);
      }
    }
    
    if (transitionProgress > 1) {
      transitionProgress = 1;
    }
  } else {
    // Normal starfield
    for (let i = 0; i < 300; i++) {
      let x = (i * 137.5 + frameCount * 2) % windscreen.width;
      let y = (i * 73.1 + frameCount * 1) % windscreen.height;
      
      windscreen.stroke(255);
      windscreen.point(x, y);
    }
  }
}

function mousePressed() {
  // Check if any switch was pressed
  for (let s of switches) {
    let d = dist(mouseX, mouseY, s.x, s.y);
    if (d < 15) {
      s.on = !s.on;
      s.glow = 0;
      return;
    }
  }
  
  // Check if any button was pressed
  for (let b of buttons) {
    let d = dist(mouseX, mouseY, b.x, b.y);
    if (d < 15) {
      b.pressed = true;
      
      // Check if this is the correct sequence to activate hyperspace
      if (b === buttons[0] && switches[0].on && switches[2].on) {
        hyperspaceTransition = true;
      }
      
      setTimeout(() => {
        b.pressed = false;
      }, 100);
      
      return;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
