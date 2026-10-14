let roots = [];
let scanlines = [];
let time = 0;
let cursorX = 0;
let cursorY = 0;
let isDragging = false;

function setup() {
  createCanvas(600, 600);
  noStroke();
  
  // Create bioluminescent root network
  for (let i = 0; i < 150; i++) {
    let x = random(width);
    let y = random(height);
    let size = random(2, 8);
    let hue = random(160, 190); // cyan to blue
    let saturation = random(80, 100);
    let brightness = random(60, 100);
    
    roots.push({
      x: x,
      y: y,
      size: size,
      hue: hue,
      sat: saturation,
      bright: brightness,
      speed: random(0.01, 0.03),
      offset: random(TWO_PI)
    });
  }
  
  // Create scanlines
  for (let i = 0; i < 200; i++) {
    scanlines.push({
      y: random(height),
      opacity: random(10, 30)
    });
  }
}

function draw() {
  time += 0.01;
  
  // Dark retro cabinet background
  background(15, 10, 20);
  
  // Draw scanlines
  fill(0, 0, 0, 20);
  for (let line of scanlines) {
    rect(0, line.y, width, 1);
  }
  
  // Draw bioluminescent roots network
  for (let root of roots) {
    let pulse = sin(time * root.speed + root.offset) * 0.5 + 0.5;
    let bright = root.bright * pulse;
    
    // Create ripple effect around cursor
    let dx = root.x - cursorX;
    let dy = root.y - cursorY;
    let distance = sqrt(dx * dx + dy * dy);
    if (distance < 150 && isDragging) {
      let ripple = map(distance, 0, 150, 1, 0.2);
      bright *= ripple;
    }
    
    // Draw root segment
    fill(root.hue, root.sat, bright);
    ellipse(root.x, root.y, root.size * pulse);
  }
  
  // Add some chromatic aberration effect
  push();
  blendMode(DIFFERENCE);
  fill(255, 0, 255, 10);
  rect(0, 0, width, height);
  pop();
}

function mousePressed() {
  isDragging = true;
}

function mouseReleased() {
  isDragging = false;
}

function mouseDragged() {
  cursorX = mouseX;
  cursorY = mouseY;
}
