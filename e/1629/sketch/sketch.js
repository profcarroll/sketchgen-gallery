let dunes = [];
let time = 0;
const numDunes = 100;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize dunes with varying properties
  for (let i = 0; i < numDunes; i++) {
    dunes.push({
      x: random(width),
      y: random(height),
      size: random(100, 500),
      speed: random(0.0005, 0.002),
      angle: random(TWO_PI),
      color: color(random(10, 30), random(40, 60), random(20, 60)),
      offset: random(TWO_PI)
    });
  }
}

function draw() {
  background(0, 0, 95);
  
  time += 0.005;
  
  // Draw each dune as an organic, flowing shape
  for (let i = 0; i < dunes.length; i++) {
    let dune = dunes[i];
    
    // Update position based on time and angle
    dune.x += cos(dune.angle) * dune.speed * 10;
    dune.y += sin(dune.angle) * dune.speed * 10;
    
    // Wrap around edges
    if (dune.x > width + 300) dune.x = -300;
    if (dune.x < -300) dune.x = width + 300;
    if (dune.y > height + 300) dune.y = -300;
    if (dune.y < -300) dune.y = height + 300;
    
    // Apply subtle noise to angle for organic movement
    dune.angle += noise(dune.x * 0.005, dune.y * 0.005, time) * 0.03 - 0.015;
    
    // Draw the dune shape using a series of overlapping ellipses
    push();
    translate(dune.x, dune.y);
    noStroke();
    fill(dune.color);
    
    // Create organic, flowing form with multiple layers
    for (let j = 0; j < 7; j++) {
      let layerSize = dune.size * (1 - j * 0.12);
      let offset = sin(time + dune.offset + j) * 30;
      ellipse(0, offset, layerSize, layerSize * 0.5);
    }
    
    // Add subtle striations
    stroke(dune.color);
    strokeWeight(1);
    for (let j = 0; j < 12; j++) {
      let angle = map(j, 0, 12, 0, TWO_PI);
      let layerSize = dune.size * (0.8 - j * 0.05);
      let x1 = cos(angle) * layerSize * 0.5;
      let y1 = sin(angle) * layerSize * 0.3;
      let x2 = cos(angle + PI) * layerSize * 0.5;
      let y2 = sin(angle + PI) * layerSize * 0.3;
      line(x1, y1, x2, y2);
    }
    
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
