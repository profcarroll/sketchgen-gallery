let anemones = [];
let waterParticles = [];
let rocks = [];
let ripples = [];
let currentFlow;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Initialize current flow
  currentFlow = new FlowField(width, height);
  
  // Create rocks
  for (let i = 0; i < 20; i++) {
    rocks.push({
      x: random(width),
      y: random(height * 0.6, height),
      size: random(30, 80),
      color: color(random(80, 120), random(70, 100), random(60, 90)),
      rotation: random(TWO_PI)
    });
  }
  
  // Create anemones
  for (let i = 0; i < 15; i++) {
    anemones.push({
      x: random(width),
      y: random(height * 0.6, height * 0.9),
      size: random(40, 80),
      color: color(random(200, 255), random(100, 200), random(150, 255)),
      openness: random(0.7, 1),
      speed: random(0.01, 0.03),
      time: random(TWO_PI)
    });
  }
  
  // Create water particles with trails
  for (let i = 0; i < 300; i++) {
    waterParticles.push({
      x: random(width),
      y: random(height * 0.6, height),
      size: random(1, 3),
      speed: random(0.2, 0.8),
      angle: random(TWO_PI),
      originalAngle: random(TWO_PI),
      trail: [],
      maxTrailLength: 15,
      color: color(random(100, 180), random(150, 255), random(200, 255))
    });
  }
  
  // Initialize ripples array
  for (let i = 0; i < 50; i++) {
    ripples.push({
      x: 0,
      y: 0,
      radius: 0,
      maxRadius: random(100, 200),
      alpha: 0,
      speed: random(0.5, 1.5)
    });
  }
}

function draw() {
  background(10, 30, 60);
  
  // Draw seabed
  drawSeabed();
  
  // Draw water background
  drawWater();
  
  // Update and draw anemones
  for (let i = 0; i < anemones.length; i++) {
    updateAnemone(anemones[i]);
    drawAnemone(anemones[i]);
    
    // Add ripples when fully open
    if (anemones[i].openness > 0.95) {
      addRipple(anemones[i].x, anemones[i].y);
    }
  }
  
  // Update and draw ripples
  updateRipples();
}

function drawSeabed() {
  // Draw rocks
  for (let r of rocks) {
    push();
    translate(r.x, r.y);
    rotate(r.rotation);
    fill(r.color);
    ellipse(0, 0, r.size, r.size * 0.6);
    pop();
  }
  
  // Draw sand base
  fill(80, 100, 120);
  rect(0, height * 0.9, width, height * 0.1);
}

function drawWater() {
  // Update and draw water particles with trails
  for (let p of waterParticles) {
    // Get flow field value at particle position
    let force = currentFlow.getForce(p.x, p.y);
    
    // Apply the current force to particle angle
    p.angle += force.x * 0.1;
    
    // Update position based on angle and speed
    p.x += cos(p.angle) * p.speed;
    p.y += sin(p.angle) * p.speed;
    
    // Add current position to trail
    p.trail.push({x: p.x, y: p.y});
    if (p.trail.length > p.maxTrailLength) {
      p.trail.shift();
    }
    
    // Draw trail
    noFill();
    stroke(p.color);
    strokeWeight(1);
    beginShape();
    for (let point of p.trail) {
      vertex(point.x, point.y);
    }
    endShape();
    
    // Draw particle
    fill(p.color);
    ellipse(p.x, p.y, p.size);
    
    // Boundary conditions
    if (p.x < 0 || p.x > width) p.angle = PI - p.angle;
    if (p.y < height * 0.6 || p.y > height) p.angle = -p.angle;
  }
}

function updateAnemone(a) {
  a.time += a.speed;
  a.openness = map(sin(a.time), -1, 1, 0.6, 1);
  
  // Mouse interaction
  let d = dist(mouseX, mouseY, a.x, a.y);
  if (d < 300) {
    let ratio = map(d, 0, 300, 1, 0.2);
    a.openness *= ratio;
  }
}

function drawAnemone(a) {
  // Draw base
  fill(80, 120, 160, 150);
  ellipse(a.x, a.y + a.size * 0.4, a.size * 0.6, a.size * 0.3);
  
  // Draw tentacles
  noFill();
  stroke(a.color);
  strokeWeight(2);
  
  beginShape();
  for (let i = 0; i < 12; i++) {
    let angle = map(i, 0, 11, 0, TWO_PI);
    let radius = a.size * a.openness;
    let x = a.x + cos(angle + a.time) * radius;
    let y = a.y + sin(angle + a.time) * radius;
    vertex(x, y);
  }
  endShape(CLOSE);
  
  // Draw central body
  fill(a.color);
  noStroke();
  ellipse(a.x, a.y, a.size * a.openness * 0.3);
}

function addRipple(x, y) {
  // Find inactive ripple
  for (let i = 0; i < ripples.length; i++) {
    if (ripples[i].alpha <= 0) {
      ripples[i].x = x;
      ripples[i].y = y;
      ripples[i].radius = 0;
      ripples[i].alpha = 255;
      break;
    }
  }
}

function updateRipples() {
  for (let ripple of ripples) {
    if (ripple.alpha > 0) {
      ripple.radius += ripple.speed;
      ripple.alpha -= 1;
      
      // Draw ripple
      stroke(180, 220, 255, ripple.alpha * 0.4);
      noFill();
      ellipse(ripple.x, ripple.y, ripple.radius * 2);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Flow field class for current
class FlowField {
  constructor(w, h) {
    this.width = w;
    this.height = h;
    this.cols = 40;
    this.rows = 30;
    this.grid = [];
    this.time = 0;
    
    // Initialize grid with noise values
    for (let i = 0; i < this.cols; i++) {
      this.grid[i] = [];
      for (let j = 0; j < this.rows; j++) {
        let x = map(i, 0, this.cols - 1, 0, TWO_PI);
        let y = map(j, 0, this.rows - 1, 0, TWO_PI);
        let noiseVal = noise(x, y, this.time);
        let angle = map(noiseVal, 0, 1, 0, TWO_PI);
        this.grid[i][j] = {x: cos(angle), y: sin(angle)};
      }
    }
  }
  
  getForce(x, y) {
    // Map x,y to grid coordinates
    let col = floor(map(x, 0, this.width, 0, this.cols - 1));
    let row = floor(map(y, 0, this.height, 0, this.rows - 1));
    
    // Clamp to bounds
    col = constrain(col, 0, this.cols - 1);
    row = constrain(row, 0, this.rows - 1);
    
    return this.grid[col][row];
  }
  
  update() {
    this.time += 0.01;
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        let x = map(i, 0, this.cols - 1, 0, TWO_PI);
        let y = map(j, 0, this.rows - 1, 0, TWO_PI);
        let noiseVal = noise(x, y, this.time);
        let angle = map(noiseVal, 0, 1, 0, TWO_PI);
        this.grid[i][j] = {x: cos(angle), y: sin(angle)};
      }
    }
  }
}

// Update flow field each frame
function draw() {
  background(10, 30, 60);
  
  // Update current flow
  currentFlow.update();
  
  // Draw seabed
  drawSeabed();
  
  // Draw water background
  drawWater();
  
  // Update and draw anemones
  for (let i = 0; i < anemones.length; i++) {
    updateAnemone(anemones[i]);
    drawAnemone(anemones[i]);
    
    // Add ripples when fully open
    if (anemones[i].openness > 0.95) {
      addRipple(anemones[i].x, anemones[i].y);
    }
  }
  
  // Update and draw ripples
  updateRipples();
}
