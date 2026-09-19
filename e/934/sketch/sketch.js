let dustDevils = [];
let cracks = [];
let groundTexture;

function setup() {
  createCanvas(windowWidth, windowHeight);
  groundTexture = createGraphics(width, height);
  generateCracks();
  generateDustDevils();
}

function draw() {
  background(150, 80, 40); // terracotta earth tone
  drawSky();
  drawGround();
  updateAndDrawDustDevils();
}

function drawSky() {
  noStroke();
  fill(230, 220, 200); // beige sky
  rect(0, 0, width, height/3);
}

function drawGround() {
  // Draw textured ground with cracks
  image(groundTexture, 0, height/3, width, 2*height/3);
  
  // Draw cracks on top
  stroke(50, 30, 10); // dark crack color
  strokeWeight(2);
  for (let c of cracks) {
    line(c.x1, c.y1, c.x2, c.y2);
  }
}

function generateCracks() {
  groundTexture.noStroke();
  groundTexture.fill(100, 60, 30); // dark ground color
  groundTexture.rect(0, 0, width, height);

  // Draw texture with cracks
  for (let i = 0; i < 500; i++) {
    let x = random(width);
    let y = height/3 + random(height/3);
    let w = random(20, 100);
    let h = random(2, 10);
    let angle = random(TWO_PI);
    
    groundTexture.push();
    groundTexture.translate(x, y);
    groundTexture.rotate(angle);
    groundTexture.fill(50, 30, 10); // crack color
    groundTexture.rect(-w/2, -h/2, w, h);
    groundTexture.pop();
    
    // Store crack positions for drawing lines
    cracks.push({
      x1: x + cos(angle) * w/2,
      y1: y + sin(angle) * w/2,
      x2: x - cos(angle) * w/2,
      y2: y - sin(angle) * w/2
    });
  }
}

function generateDustDevils() {
  for (let i = 0; i < 15; i++) {
    dustDevils.push({
      x: random(width),
      y: height/3 + random(height/3),
      size: random(5, 20),
      speedX: random(-0.5, 0.5),
      speedY: random(-0.5, 0.5),
      trail: [],
      maxTrailLength: 20
    });
  }
}

function updateAndDrawDustDevils() {
  for (let devil of dustDevils) {
    // Update position
    devil.x += devil.speedX;
    devil.y += devil.speedY;
    
    // Add to trail
    devil.trail.push({x: devil.x, y: devil.y});
    if (devil.trail.length > devil.maxTrailLength) {
      devil.trail.shift();
    }
    
    // Bounce off edges
    if (devil.x < 0 || devil.x > width) devil.speedX *= -1;
    if (devil.y < height/3 || devil.y > height) devil.speedY *= -1;
    
    // Draw trail
    noFill();
    stroke(200, 180, 160);
    strokeWeight(1);
    beginShape();
    for (let p of devil.trail) {
      vertex(p.x, p.y);
    }
    endShape();
    
    // Draw dust devil
    noStroke();
    fill(200, 180, 160, 150);
    ellipse(devil.x, devil.y, devil.size);
    
    // Add some randomness to movement
    devil.speedX += random(-0.05, 0.05);
    devil.speedY += random(-0.05, 0.05);
    devil.speedX = constrain(devil.speedX, -2, 2);
    devil.speedY = constrain(devil.speedY, -2, 2);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  groundTexture = createGraphics(width, height);
  generateCracks();
}
