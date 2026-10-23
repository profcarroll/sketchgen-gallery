let cracks = [];
let ceramicTexture;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  
  // Create ceramic texture pattern
  ceramicTexture = createGraphics(width, height);
  ceramicTexture.background(40, 30, 25);
  ceramicTexture.noiseDetail(2, 0.5);
  for (let i = 0; i < 1000; i++) {
    let x = random(width);
    let y = random(height);
    let n = ceramicTexture.noise(x * 0.01, y * 0.01) * 20;
    ceramicTexture.stroke(35 + n, 25 + n, 20 + n);
    ceramicTexture.point(x, y);
  }
  
  // Initialize cracks
  for (let i = 0; i < 30; i++) {
    cracks.push({
      x: random(width),
      y: random(height),
      size: random(10, 50),
      growth: random(0.05, 0.2),
      angle: random(TWO_PI),
      speed: random(-0.02, 0.02),
      segments: [],
      maxSegments: 50,
      active: true,
      color: color(180, 160, 140)
    });
  }
}

function draw() {
  // Draw ceramic base
  image(ceramicTexture, 0, 0);
  
  time += 0.01;
  
  // Update and draw cracks
  for (let i = cracks.length - 1; i >= 0; i--) {
    let c = cracks[i];
    
    if (!c.active) continue;
    
    // Update crack
    c.size += c.growth;
    c.angle += c.speed;
    
    // Create new segments
    if (frameCount % 2 === 0 && c.segments.length < c.maxSegments) {
      c.segments.push({
        x: c.x + cos(c.angle) * c.size,
        y: c.y + sin(c.angle) * c.size,
        size: random(0.5, 2),
        life: 255
      });
    }
    
    // Draw crack segments
    stroke(c.color);
    strokeWeight(1);
    noFill();
    
    beginShape();
    vertex(c.x, c.y);
    for (let j = 0; j < c.segments.length; j++) {
      let seg = c.segments[j];
      vertex(seg.x, seg.y);
    }
    endShape();
    
    // Fade out old segments
    for (let j = c.segments.length - 1; j >= 0; j--) {
      c.segments[j].life -= 2;
      if (c.segments[j].life <= 0) {
        c.segments.splice(j, 1);
      }
    }
    
    // Randomly stop cracks
    if (random() < 0.0005 && c.size > 150) {
      c.active = false;
    }
  }
  
  // Occasionally add new cracks
  if (frameCount % 40 === 0 && random() > 0.6) {
    cracks.push({
      x: random(width),
      y: random(height),
      size: random(10, 50),
      growth: random(0.05, 0.2),
      angle: random(TWO_PI),
      speed: random(-0.02, 0.02),
      segments: [],
      maxSegments: 50,
      active: true,
      color: color(180, 160, 140)
    });
  }
  
  // Keep crack count stable
  if (cracks.length > 100) {
    cracks.splice(0, cracks.length - 100);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
