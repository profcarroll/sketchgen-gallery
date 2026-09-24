let dunes = [];
let time = 0;
const numDunes = 150;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize dunes with varying properties
  for (let i = 0; i < numDunes; i++) {
    dunes.push({
      x: random(width),
      y: random(height),
      size: random(50, 300),
      speed: random(0.001, 0.005),
      angle: random(TWO_PI),
      color: color(random(10, 30), random(40, 60), random(30, 70)),
    });
  }
}

function draw() {
  background(0, 0, 95);
  
  time += 0.01;
  
  // Draw each dune as an organic, flowing shape
  for (let i = 0; i < dunes.length; i++) {
    let dune = dunes[i];
    
    // Update position based on time and angle
    dune.x += cos(dune.angle) * dune.speed * 10;
    dune.y += sin(dune.angle) * dune.speed * 10;
    
    // Wrap around edges
    if (dune.x > width + 200) dune.x = -200;
    if (dune.x < -200) dune.x = width + 200;
    if (dune.y > height + 200) dune.y = -200;
    if (dune.y < -200) dune.y = height + 200;
    
    // Apply subtle noise to angle for organic movement
    dune.angle += noise(dune.x * 0.01, dune.y * 0.01, time) * 0.05 - 0.025;
    
    // Draw the dune shape using a series of overlapping ellipses
    push();
    translate(dune.x, dune.y);
    noStroke();
    fill(dune.color);
    
    // Create organic, flowing form with multiple layers
    for (let j = 0; j < 5; j++) {
      let layerSize = dune.size * (1 - j * 0.15);
      let offset = sin(time + j) * 20;
      ellipse(0, offset, layerSize, layerSize * 0.6);
    }
    
    // Add a subtle highlight
    fill(255, 10, 30, 0.2);
    ellipse(-dune.size * 0.3, -dune.size * 0.2, dune.size * 0.3, dune.size * 0.15);
    
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
