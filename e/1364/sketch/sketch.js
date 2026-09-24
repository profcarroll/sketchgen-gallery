let bears = [];
const bearCount = 30;
const colors = [
  [255, 100, 100], // red
  [100, 255, 100], // green
  [100, 100, 255], // blue
  [255, 255, 100], // yellow
  [255, 100, 255], // magenta
  [100, 255, 255]  // cyan
];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  for (let i = 0; i < bearCount; i++) {
    bears.push({
      x: random(width),
      y: random(height),
      size: random(40, 80),
      vx: random(-2, 2),
      vy: random(-2, 2),
      color: random(colors),
      rotation: random(TWO_PI),
      rotationSpeed: random(-0.05, 0.05),
      sway: random(TWO_PI),
      swaySpeed: random(0.01, 0.03)
    });
  }
}

function draw() {
  background(20);
  
  for (let bear of bears) {
    // Update position
    bear.x += bear.vx;
    bear.y += bear.vy;
    
    // Update rotation
    bear.rotation += bear.rotationSpeed;
    
    // Update sway
    bear.sway += bear.swaySpeed;
    
    // Bounce off edges
    if (bear.x < 0 || bear.x > width) {
      bear.vx *= -1;
    }
    if (bear.y < 0 || bear.y > height) {
      bear.vy *= -1;
    }
    
    // Keep on screen
    bear.x = constrain(bear.x, 0, width);
    bear.y = constrain(bear.y, 0, height);
    
    // Draw bear body
    push();
    translate(bear.x, bear.y);
    rotate(bear.rotation);
    
    // Body
    fill(bear.color[0], bear.color[1], bear.color[2]);
    ellipse(0, 0, bear.size, bear.size * 0.8);
    
    // Head
    ellipse(-bear.size * 0.3, -bear.size * 0.3, bear.size * 0.6, bear.size * 0.6);
    
    // Ears
    fill(255);
    ellipse(-bear.size * 0.4, -bear.size * 0.6, bear.size * 0.2, bear.size * 0.3);
    ellipse(bear.size * 0.1, -bear.size * 0.6, bear.size * 0.2, bear.size * 0.3);
    
    // Eyes
    fill(0);
    ellipse(-bear.size * 0.4, -bear.size * 0.4, bear.size * 0.1, bear.size * 0.1);
    ellipse(bear.size * 0.05, -bear.size * 0.4, bear.size * 0.1, bear.size * 0.1);
    
    // Nose
    fill(0);
    ellipse(-bear.size * 0.15, -bear.size * 0.2, bear.size * 0.15, bear.size * 0.1);
    
    pop();
    
    // Draw arms and legs with swaying motion
    push();
    translate(bear.x, bear.y);
    rotate(bear.rotation);
    
    const swayOffset = sin(bear.sway) * 0.5;
    
    // Arms
    fill(bear.color[0], bear.color[1], bear.color[2]);
    ellipse(-bear.size * 0.6, -bear.size * 0.1, bear.size * 0.2, bear.size * 0.4);
    ellipse(bear.size * 0.4, -bear.size * 0.1, bear.size * 0.2, bear.size * 0.4);
    
    // Legs
    ellipse(-bear.size * 0.3, bear.size * 0.3, bear.size * 0.25, bear.size * 0.4);
    ellipse(bear.size * 0.2, bear.size * 0.3, bear.size * 0.25, bear.size * 0.4);
    
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
