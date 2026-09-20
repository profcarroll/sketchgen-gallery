let waves = [];
let rippleEffect = [];
let boatX = 0;
let boatY = 0;
let skyColor;

function setup() {
  createCanvas(800, 600);
  noStroke();
  
  // Initialize waves
  for (let i = 0; i < 100; i++) {
    waves.push({
      y: random(height * 0.7, height),
      speed: random(0.005, 0.02),
      size: random(50, 200),
      phase: random(TWO_PI)
    });
  }
  
  // Initialize boat position
  boatX = width + 100;
  boatY = height * 0.65;
  
  // Initial sky color (pastel pink/orange gradient)
  skyColor = color(255, 182, 193); // Soft pink
}

function draw() {
  // Update and draw sky
  drawSky();
  
  // Update and draw waves
  updateWaves();
  drawWaves();
  
  // Draw boat
  drawBoat();
  
  // Update ripple effect
  updateRipples();
  drawRipples();
  
  // Move boat slowly across the screen
  boatX -= 0.5;
  if (boatX < -100) boatX = width + 100;
}

function drawSky() {
  // Gradient sky from top to bottom
  for (let y = 0; y < height * 0.7; y++) {
    let inter = map(y, 0, height * 0.7, 0, 1);
    let c = lerpColor(skyColor, color(255, 255, 204), inter); // Blend towards light yellow
    stroke(c);
    line(0, y, width, y);
  }
}

function updateWaves() {
  for (let wave of waves) {
    wave.y += sin(frameCount * wave.speed + wave.phase) * 0.5;
  }
}

function drawWaves() {
  noStroke();
  fill(135, 206, 235, 180); // Soft teal with transparency
  for (let wave of waves) {
    beginShape();
    let x = 0;
    while (x < width + 50) {
      let y = wave.y + sin(x * 0.02 + frameCount * wave.speed + wave.phase) * 10;
      vertex(x, y);
      x += 20;
    }
    vertex(width, height);
    vertex(0, height);
    endShape(CLOSE);
  }
}

function drawBoat() {
  push();
  translate(boatX, boatY);
  
  // Boat hull
  fill(139, 69, 19); // Brown
  ellipse(0, 0, 80, 20);
  
  // Mast and sail
  stroke(100);
  line(0, -40, 0, 0);
  
  fill(255);
  triangle(-20, -40, 20, -40, 0, -80);
  
  pop();
}

function updateRipples() {
  // Remove old ripples
  for (let i = rippleEffect.length - 1; i >= 0; i--) {
    rippleEffect[i].life -= 2;
    if (rippleEffect[i].life <= 0) {
      rippleEffect.splice(i, 1);
    }
  }
}

function drawRipples() {
  noFill();
  for (let ripple of rippleEffect) {
    stroke(255, 255, 255, ripple.life);
    ellipse(ripple.x, ripple.y, ripple.size);
  }
}

function mouseDragged() {
  // Create ripples at drag position
  rippleEffect.push({
    x: mouseX,
    y: mouseY,
    size: 10,
    life: 255
  });
  
  // Shift sky color slightly on drag
  let shift = map(mouseX, 0, width, -10, 10);
  skyColor = lerpColor(color(255, 182, 193), color(255, 140, 0), map(shift, -10, 10, 0, 1));
}

function mousePressed() {
  // Start audio on click
  if (typeof userStartAudio !== 'undefined') {
    userStartAudio();
  }
}
