let stripes = [];
let halftonePattern;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Create a halftone pattern texture
  halftonePattern = createGraphics(100, 100);
  halftonePattern.noStroke();
  halftonePattern.fill(0);
  for (let i = 0; i < 100; i++) {
    for (let j = 0; j < 100; j++) {
      if ((i + j) % 20 < 10) {
        halftonePattern.ellipse(i, j, 3, 3);
      }
    }
  }
  
  // Initialize stripes
  for (let i = 0; i < 8; i++) {
    stripes.push({
      angle: i * PI / 4,
      speed: random(0.002, 0.005),
      offset: random(TWO_PI)
    });
  }
}

function draw() {
  background(20);
  
  // Create a time-based warp factor
  let warp = sin(frameCount * 0.01) * 0.5 + 0.5;
  
  for (let i = 0; i < stripes.length; i++) {
    let stripe = stripes[i];
    
    // Update angle with time and warp
    let currentAngle = stripe.angle + sin(frameCount * stripe.speed + stripe.offset) * 0.3 * warp;
    
    // Calculate stripe width based on time and warp
    let width = map(sin(frameCount * 0.005 + i), -1, 1, 50, 200);
    
    // Draw the stripe with halftone texture
    push();
    translate(width / 2, height / 2);
    rotate(currentAngle);
    
    // Create a textured rectangle
    let texture = halftonePattern.get();
    texture.resize(width * 2, width * 2);
    
    tint(255, 200);
    image(texture, -width, -width/2, width*2, width);
    
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
