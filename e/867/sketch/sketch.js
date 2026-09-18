let switches = [];
let buttons = [];
let windscreen;
let sequence = [0, 2, 1, 3];
let inputSequence = [];
let sequenceIndex = 0;
let windscreenActive = false;
let windscreenColor = 0;
let particles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);

  // Create switches
  for (let i = 0; i < 4; i++) {
    switches.push({
      x: width * 0.2 + i * width * 0.2,
      y: height * 0.3,
      on: false,
      glow: 0
    });
  }

  // Create buttons
  for (let i = 0; i < 4; i++) {
    buttons.push({
      x: width * 0.2 + i * width * 0.2,
      y: height * 0.6,
      w: 50,
      h: 50,
      clicked: false
    });
  }

  // Create windscreen
  windscreen = {
    x: width / 2,
    y: height / 2,
    w: width * 0.6,
    h: height * 0.4
  };

  // Initialize particles for hyperspace effect
  for (let i = 0; i < 500; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      z: random(100),
      speed: random(2, 8)
    });
  }
}

function draw() {
  background(10);
  
  // Draw switches with ambient glow
  for (let i = 0; i < switches.length; i++) {
    let s = switches[i];
    
    // Glow effect
    if (!s.on) {
      s.glow = sin(frameCount * 2) * 30 + 50;
    }
    
    noStroke();
    fill(180, 0, 0, s.glow);
    ellipse(s.x, s.y, 40, 40);
    
    // Switch base
    fill(50);
    rect(s.x - 20, s.y + 20, 40, 20, 5);
    
    // Switch head
    if (s.on) {
      fill(255, 200, 0);
    } else {
      fill(100);
    }
    rect(s.x - 15, s.y - 10, 30, 15, 3);
  }

  // Draw buttons
  for (let i = 0; i < buttons.length; i++) {
    let b = buttons[i];
    
    noStroke();
    if (b.clicked) {
      fill(255, 200, 0);
    } else {
      fill(100);
    }
    rect(b.x - b.w/2, b.y - b.h/2, b.w, b.h, 8);
    
    // Button label
    fill(255);
    textSize(16);
    textAlign(CENTER, CENTER);
    text(i+1, b.x, b.y);
  }

  // Draw windscreen
  if (windscreenActive) {
    drawHyperspace();
  } else {
    // Draw static panel
    fill(30, 30, 40);
    rect(windscreen.x - windscreen.w/2, windscreen.y - windscreen.h/2, windscreen.w, windscreen.h, 15);
    
    fill(100);
    textSize(24);
    textAlign(CENTER, CENTER);
    text("HYPERDRIVE SYSTEM", windscreen.x, windscreen.y - 30);
    text("STANDBY", windscreen.x, windscreen.y + 30);
  }

  // Draw sequence status
  fill(200);
  textSize(16);
  textAlign(LEFT, TOP);
  text("Sequence: " + inputSequence.join(' ') + " / " + sequence.join(' '), 20, 20);
}

function drawHyperspace() {
  // Draw hyperspace tunnel
  background(windscreenColor);
  
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    // Move particles toward viewer
    p.z -= p.speed;
    
    // Reset particle if it passes the viewer
    if (p.z <= 0) {
      p.x = random(width);
      p.y = random(height);
      p.z = random(100);
    }
    
    // Calculate screen position
    let perspective = 500 / (500 - p.z);
    let x2d = p.x * perspective;
    let y2d = p.y * perspective;
    
    // Draw particle trail
    noStroke();
    fill(255, 255, 255, map(p.z, 0, 100, 0, 255));
    ellipse(x2d, y2d, 3 * perspective);
    
    // Draw connecting lines (crystalline structure)
    if (p.z > 50 && p.z < 90) {
      stroke(255, 255, 255, 50);
      strokeWeight(0.5);
      line(x2d, y2d, x2d - 100 * perspective, y2d - 100 * perspective);
    }
  }
  
  // Animate windscreen color
  windscreenColor = (windscreenColor + 1) % 255;
}

function mousePressed() {
  if (windscreenActive) return; // Prevent interaction during hyperspace
  
  // Check button presses
  for (let i = 0; i < buttons.length; i++) {
    let b = buttons[i];
    if (mouseX > b.x - b.w/2 && mouseX < b.x + b.w/2 &&
        mouseY > b.y - b.h/2 && mouseY < b.y + b.h/2) {
      
      // Button clicked
      b.clicked = true;
      inputSequence.push(i);
      
      // Check if sequence is correct
      if (inputSequence.length <= sequence.length) {
        let correct = true;
        for (let j = 0; j < inputSequence.length; j++) {
          if (inputSequence[j] !== sequence[j]) {
            correct = false;
            break;
          }
        }
        
        if (correct && inputSequence.length === sequence.length) {
          // Sequence complete, activate windscreen
          windscreenActive = true;
          inputSequence = [];
          sequenceIndex = 0;
          
          // Turn on switches in order
          for (let j = 0; j < switches.length; j++) {
            switches[j].on = true;
          }
        } else if (!correct) {
          // Reset input on wrong sequence
          inputSequence = [];
          sequenceIndex = 0;
        }
      }
      
      break;
    }
  }
  
  // Check switch presses (only when not active)
  for (let i = 0; i < switches.length; i++) {
    let s = switches[i];
    let d = dist(mouseX, mouseY, s.x, s.y);
    if (d < 20 && !windscreenActive) {
      s.on = !s.on;
      break;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
