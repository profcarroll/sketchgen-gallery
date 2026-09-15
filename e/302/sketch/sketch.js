let clouds = [];
let lines = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);

  // Create main cloud structures
  for (let i = 0; i < 8; i++) {
    clouds.push({
      x: random(width),
      y: random(height),
      size: random(100, 300),
      opacity: random(0.2, 0.5),
      speed: random(0.001, 0.003)
    });
  }

  // Create flowing line streams
  for (let i = 0; i < 1000; i++) {
    lines.push({
      x: random(width),
      y: random(height),
      size: random(2, 8),
      speed: random(0.005, 0.02),
      angle: random(TWO_PI)
    });
  }
}

function draw() {
  // Smooth gradient background
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(color(200, 50, 20), color(260, 70, 10), inter);
    stroke(c);
    line(0, y, width, y);
  }

  time += 0.001;

  // Update and draw clouds
  for (let cloud of clouds) {
    let pulse = sin(time * cloud.speed) * 0.2 + 0.8;
    let currentOpacity = cloud.opacity * pulse;
    
    noStroke();
    fill(240, 30, 80, currentOpacity);
    
    // Draw soft, organic cloud shape
    beginShape();
    for (let i = 0; i < 10; i++) {
      let angle = map(i, 0, 9, 0, TWO_PI);
      let radius = cloud.size * (0.7 + 0.3 * sin(time + angle * 2));
      let x = cloud.x + cos(angle) * radius;
      let y = cloud.y + sin(angle) * radius;
      vertex(x, y);
    }
    endShape(CLOSE);
    
    // Add inner glow
    fill(260, 20, 90, currentOpacity * 0.3);
    beginShape();
    for (let i = 0; i < 8; i++) {
      let angle = map(i, 0, 7, 0, TWO_PI);
      let radius = cloud.size * 0.4 * (0.8 + 0.2 * cos(time * 1.5 + angle));
      let x = cloud.x + cos(angle) * radius;
      let y = cloud.y + sin(angle) * radius;
      vertex(x, y);
    }
    endShape(CLOSE);
  }

  // Draw flowing line streams
  beginShape();
  stroke(280, 50, 90, 0.3);
  strokeWeight(1);
  noFill();
  
  for (let i = 0; i < lines.length; i++) {
    let l = lines[i];
    
    // Update position
    l.x += cos(l.angle) * l.speed;
    l.y += sin(l.angle) * l.speed;
    
    // Wrap around edges
    if (l.x > width + 50) l.x = -50;
    if (l.x < -50) l.x = width + 50;
    if (l.y > height + 50) l.y = -50;
    if (l.y < -50) l.y = height + 50;
    
    // Update angle slightly
    l.angle += random(-0.02, 0.02);
    
    // Draw the point
    vertex(l.x, l.y);
  }
  endShape();
}
