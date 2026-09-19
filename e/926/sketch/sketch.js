let cracks = [];
let dustDevils = [];
let skyColor;
let groundColor;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Deep terracotta ground color
  groundColor = color(139, 69, 19); // SaddleBrown
  
  // Beige sky color
  skyColor = color(245, 245, 220); // Beige
  
  // Create cracks in the ground
  for (let i = 0; i < 300; i++) {
    cracks.push({
      x: random(width),
      y: random(height * 0.6, height),
      w: random(2, 15),
      h: random(1, 8)
    });
  }
  
  // Create dust devils
  for (let i = 0; i < 15; i++) {
    dustDevils.push({
      x: random(width),
      y: height * 0.7,
      size: random(20, 80),
      speed: random(0.5, 2),
      angle: random(TWO_PI),
      sway: random(-0.02, 0.02)
    });
  }
}

function draw() {
  // Draw sky gradient
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(skyColor, color(255), inter);
    stroke(c);
    line(0, y, width, y);
  }
  
  // Draw ground
  fill(groundColor);
  noStroke();
  rect(0, height * 0.6, width, height * 0.4);
  
  // Draw cracks
  fill(80); // Darker crack color
  for (let crack of cracks) {
    rect(crack.x, crack.y, crack.w, crack.h);
  }
  
  // Draw dust devils
  for (let devil of dustDevils) {
    // Update position and angle
    devil.x += sin(devil.angle) * devil.speed;
    devil.y -= devil.speed * 0.5;
    devil.angle += devil.sway;
    
    // Reset if off screen
    if (devil.y < -20) {
      devil.y = height * 0.7;
      devil.x = random(width);
    }
    
    // Draw dust devil as swirling particles
    noStroke();
    fill(200, 180, 140, 150); // Beige with transparency
    
    push();
    translate(devil.x, devil.y);
    rotate(devil.angle);
    
    // Draw multiple concentric circles to simulate swirl
    for (let i = 0; i < 5; i++) {
      let size = devil.size * (1 - i * 0.2);
      ellipse(0, 0, size, size);
    }
    
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
