let walls = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Create a grid of origami wall segments
  for (let x = 0; x < width; x += 80) {
    for (let y = 0; y < height; y += 80) {
      walls.push({
        x: x,
        y: y,
        size: 60,
        angle: random(TWO_PI),
        color: color(random(150, 255), random(30, 80), random(30, 80)), // Red, ochre, teal
        foldPhase: random(TWO_PI)
      });
    }
  }
}

function draw() {
  background(240, 230, 220); // Cream background
  
  time += 0.005;
  
  // Draw each wall segment with dynamic folding
  for (let wall of walls) {
    push();
    
    translate(wall.x, wall.y);
    rotate(wall.angle + sin(time + wall.foldPhase) * 0.2);
    
    // Draw a tessellated origami wall pattern
    fill(wall.color);
    noStroke();
    
    // Create a folded structure with stripes
    let stripeWidth = wall.size / 8;
    for (let i = 0; i < 8; i++) {
      let x1 = -wall.size/2 + i * stripeWidth;
      let x2 = x1 + stripeWidth;
      
      // Alternate between colors for stripes
      if (i % 2 === 0) {
        fill(200, 30, 30); // Vivid red
      } else {
        fill(180, 120, 30); // Warm ochre
      }
      
      rect(x1, -wall.size/2, x2 - x1, wall.size);
    }
    
    // Add a subtle teal stripe on top for contrast
    fill(0, 150, 130);
    rect(-wall.size/2, -wall.size/2 + wall.size * 0.8, wall.size, wall.size * 0.1);
    
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
