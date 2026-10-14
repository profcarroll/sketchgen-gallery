let particles = [];
const particleCount = 1500;
let flowField = [];
const fieldSize = 20;
let noiseScale = 0.02;
let noiseStrength = 0.3;
let mouseInfluence = 0;
let mouseRadius = 100;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize particles
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      z: random(-50, 50),
      size: random(0.5, 2),
      hue: random(360),
      speed: random(0.2, 1),
      age: 0,
      maxAge: random(100, 300)
    });
  }
  
  // Initialize flow field
  let cols = ceil(width / fieldSize);
  let rows = ceil(height / fieldSize);
  flowField = new Array(cols * rows).fill(0).map(() => {
    return {
      x: random(-1, 1),
      y: random(-1, 1)
    };
  });
  
  noLoop();
}

function draw() {
  background(0, 0, 5);
  
  // Update flow field
  updateFlowField();
  
  // Draw particles
  beginShape(POINTS);
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    // Apply flow field force
    let ix = floor(p.x / fieldSize);
    let iy = floor(p.y / fieldSize);
    if (ix >= 0 && ix < width / fieldSize && iy >= 0 && iy < height / fieldSize) {
      let index = iy * (width / fieldSize) + ix;
      if (index < flowField.length) {
        let force = flowField[index];
        p.x += force.x * noiseStrength * p.speed;
        p.y += force.y * noiseStrength * p.speed;
      }
    }
    
    // Mouse influence
    if (mouseInfluence > 0) {
      let dx = p.x - mouseX;
      let dy = p.y - mouseY;
      let d = sqrt(dx * dx + dy * dy);
      if (d < mouseRadius) {
        let force = map(d, 0, mouseRadius, 1, 0);
        p.x += dx * force * 0.05 * mouseInfluence;
        p.y += dy * force * 0.05 * mouseInfluence;
      }
    }
    
    // Wrap around edges
    if (p.x < 0) p.x = width;
    if (p.x > width) p.x = 0;
    if (p.y < 0) p.y = height;
    if (p.y > height) p.y = 0;
    
    // Age particle
    p.age++;
    
    // Reset old particles
    if (p.age > p.maxAge) {
      p.x = random(width);
      p.y = random(height);
      p.z = random(-50, 50);
      p.age = 0;
      p.hue = random(360);
    }
    
    // Set particle color and vertex
    fill(p.hue, 80, 90, 0.7);
    vertex(p.x - width/2, p.y - height/2, p.z);
  }
  endShape();
  
  // Add subtle glow effect
  blendMode(ADD);
  noStroke();
  fill(200, 50, 100, 0.05);
  for (let i = 0; i < 5; i++) {
    let x = sin(frameCount * 0.005 + i) * width/3;
    let y = cos(frameCount * 0.005 + i) * height/3;
    ellipse(x, y, 300 + sin(frameCount * 0.01 + i) * 100);
  }
  blendMode(BLEND);
}

function updateFlowField() {
  let time = frameCount * 0.002;
  let cols = ceil(width / fieldSize);
  let rows = ceil(height / fieldSize);
  
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let index = y * cols + x;
      let angle = noise(x * noiseScale, y * noiseScale, time) * TWO_PI * 2;
      flowField[index].x = cos(angle);
      flowField[index].y = sin(angle);
    }
  }
}

function mouseDragged() {
  mouseInfluence = 1;
  redraw();
}

function mouseReleased() {
  mouseInfluence = 0;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setup();
}
