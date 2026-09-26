let stripeHeight = 20;
let fabricHeight = 0;
let stripes = [];
let colors = ['#8B4513', '#CD853F', '#D2691E', '#A0522D'];
let stitches = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  fabricHeight = 0;
  // Initialize some initial stitches
  for (let i = 0; i < 100; i++) {
    stitches.push({
      x: random(width),
      y: random(height),
      size: random(2, 6),
      angle: random(TWO_PI),
      phase: random(TWO_PI)
    });
  }
}

function draw() {
  background(240);
  
  // Grow the fabric upward
  fabricHeight += 0.5;
  
  // Draw existing stripes
  for (let i = 0; i < stripes.length; i++) {
    let stripe = stripes[i];
    fill(stripe.color);
    rect(0, stripe.y, width, stripeHeight);
  }
  
  // Add new stripe at the bottom
  if (fabricHeight > stripeHeight) {
    let newY = height - fabricHeight;
    let color = colors[Math.floor(frameCount / 10) % colors.length];
    stripes.push({y: newY, color: color});
    
    // Keep only visible stripes
    while (stripes.length > 0 && stripes[0].y > height) {
      stripes.shift();
    }
  }
  
  // Draw and animate stitches
  for (let i = 0; i < stitches.length; i++) {
    let stitch = stitches[i];
    
    // Update phase for animation
    stitch.phase += 0.05;
    
    // Calculate position based on phase and angle
    let x = stitch.x + sin(stitch.phase) * 10;
    let y = stitch.y + cos(stitch.phase) * 10;
    
    // Draw the stitch as a small geometric pattern (a loop)
    push();
    translate(x, y);
    rotate(stitch.angle);
    
    // Draw an interlocking loop
    fill(0);
    beginShape();
    for (let j = 0; j < 6; j++) {
      let angle = map(j, 0, 6, 0, TWO_PI);
      let px = cos(angle) * stitch.size;
      let py = sin(angle) * stitch.size;
      vertex(px, py);
    }
    endShape(CLOSE);
    
    // Draw a second loop that interlocks with the first
    rotate(PI/3);
    beginShape();
    for (let j = 0; j < 6; j++) {
      let angle = map(j, 0, 6, 0, TWO_PI);
      let px = cos(angle) * stitch.size * 0.7;
      let py = sin(angle) * stitch.size * 0.7;
      vertex(px, py);
    }
    endShape(CLOSE);
    
    pop();
  }
  
  // Add new stitches occasionally to simulate knitting upwards
  if (frameCount % 10 === 0 && stitches.length < 500) {
    stitches.push({
      x: random(width),
      y: height,
      size: random(2, 6),
      angle: random(TWO_PI),
      phase: random(TWO_PI)
    });
  }
  
  // Remove old stitches that are off-screen
  for (let i = stitches.length - 1; i >= 0; i--) {
    if (stitches[i].y < -20) {
      stitches.splice(i, 1);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
