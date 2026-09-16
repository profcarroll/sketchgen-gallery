let filaments = [];
let particles = [];
let grid = [];

function setup() {
  createCanvas(800, 600);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize filaments
  for (let i = 0; i < 20; i++) {
    filaments.push({
      points: [],
      hue: random(180, 240),
      saturation: random(60, 90),
      brightness: random(40, 80),
      speed: random(0.005, 0.02),
      angle: random(TWO_PI)
    });
  }

  // Initialize particles
  for (let i = 0; i < 3000; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      size: random(0.5, 2),
      hue: random(180, 240),
      saturation: random(60, 90),
      brightness: random(40, 80),
      speed: random(0.001, 0.01),
      angle: random(TWO_PI)
    });
  }

  // Create grid for spatial hashing
  let gridSize = 50;
  let cols = ceil(width / gridSize);
  let rows = ceil(height / gridSize);
  grid = new Array(cols * rows).fill().map(() => []);
}

function draw() {
  background(20, 10, 10);

  // Update and draw particles
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    // Slow organic movement
    p.x += cos(p.angle) * p.speed * 2;
    p.y += sin(p.angle) * p.speed * 2;
    p.angle += random(-0.05, 0.05);

    // Boundary wrap
    if (p.x < 0) p.x = width;
    if (p.x > width) p.x = 0;
    if (p.y < 0) p.y = height;
    if (p.y > height) p.y = 0;

    fill(p.hue, p.saturation, p.brightness);
    noStroke();
    ellipse(p.x, p.y, p.size);
  }

  // Update and draw filaments
  for (let i = 0; i < filaments.length; i++) {
    let f = filaments[i];
    
    // Slow movement
    f.angle += f.speed;
    
    // Reset points array
    f.points = [];
    
    // Create filament chain
    let length = random(100, 200);
    let x = width / 2 + cos(f.angle) * 50;
    let y = height / 2 + sin(f.angle) * 50;
    
    for (let j = 0; j < length; j++) {
      let point = {
        x: x,
        y: y,
        size: map(j, 0, length, 1, 4)
      };
      
      f.points.push(point);
      
      // Move next point
      let angle = f.angle + map(j, 0, length, -0.5, 0.5);
      x += cos(angle) * 2;
      y += sin(angle) * 2;
    }

    // Draw filament
    noFill();
    stroke(f.hue, f.saturation, f.brightness, 0.7);
    strokeWeight(1);
    
    beginShape();
    for (let j = 0; j < f.points.length; j++) {
      let p = f.points[j];
      curveVertex(p.x, p.y);
    }
    endShape();
  }

  // Simple motion detection
  if (frameCount % 30 === 0) {
    // Ensure canvas changes by updating something visible
    fill(20, 10, 10, 0.05);
    noStroke();
    rect(0, 0, width, height);
  }
}
