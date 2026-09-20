let cracks = [];
let tremors = [];
let bolts = [];
let isDragging = false;
let lastMouseX = 0;

function setup() {
  createCanvas(800, 600);
  colorMode(HSB, 360, 100, 100, 1);
  background(220, 20, 15);
  noStroke();
  frameRate(30);

  // Initialize some initial cracks
  for (let i = 0; i < 10; i++) {
    cracks.push({
      x: random(width),
      y: random(height),
      width: random(50, 200),
      height: random(10, 30),
      speed: random(0.5, 2),
      opacity: random(0.3, 0.7),
      angle: random(TWO_PI)
    });
  }
}

function draw() {
  // Slight background vibration
  let bgVib = sin(frameCount * 0.02) * 0.5;
  background(220, 20, 15 + bgVib);

  // Draw and update cracks
  for (let i = cracks.length - 1; i >= 0; i--) {
    let c = cracks[i];
    fill(220, 30, 5, c.opacity);
    
    push();
    translate(c.x, c.y);
    rotate(c.angle);
    rectMode(CENTER);
    rect(0, 0, c.width, c.height);
    pop();

    // Update crack position and opacity
    c.x += sin(frameCount * 0.01 + i) * c.speed;
    c.y += cos(frameCount * 0.01 + i) * c.speed;
    c.opacity = map(c.x, 0, width, 0.2, 0.8);
    
    // Remove cracks that go off screen
    if (c.x < -50 || c.x > width + 50) {
      cracks.splice(i, 1);
    }
  }

  // Randomly add new cracks occasionally
  if (frameCount % 30 === 0 && cracks.length < 20) {
    cracks.push({
      x: random(width),
      y: random(height),
      width: random(50, 200),
      height: random(10, 30),
      speed: random(0.5, 2),
      opacity: random(0.3, 0.7),
      angle: random(TWO_PI)
    });
  }

  // Draw bolts
  for (let i = bolts.length - 1; i >= 0; i--) {
    let b = bolts[i];
    stroke(255, 1);
    strokeWeight(2);
    line(b.x, b.y, b.x, b.y - b.length);
    
    b.y -= b.speed;
    b.length += b.growth;

    if (b.length > 50 || b.y < 0) {
      bolts.splice(i, 1);
    }
  }

  // Draw tremors
  for (let i = tremors.length - 1; i >= 0; i--) {
    let t = tremors[i];
    noFill();
    stroke(t.color);
    strokeWeight(t.size);
    ellipse(t.x, t.y, t.size * 2);
    
    t.size += 2;
    t.alpha -= 0.02;
    
    if (t.alpha <= 0) {
      tremors.splice(i, 1);
    }
  }

  // Add tremor on mouse release
  if (!isDragging && lastMouseX > 0) {
    let x = lastMouseX;
    tremors.push({
      x: x,
      y: height - 20,
      size: 5,
      alpha: 1,
      color: color(300, 70, 90)
    });
  }
}

function mousePressed() {
  isDragging = true;
  lastMouseX = mouseX;
  return false;
}

function mouseReleased() {
  isDragging = false;
  // Trigger a bolt on release
  if (mouseY > height - 50) {
    bolts.push({
      x: mouseX,
      y: height - 20,
      length: 10,
      speed: random(3, 6),
      growth: random(0.5, 1)
    });
  }
  lastMouseX = mouseX;
}

function mouseDragged() {
  if (isDragging) {
    // Modify crack parameters based on horizontal mouse position
    let posRatio = map(mouseX, 0, width, 0, 1);
    for (let i = 0; i < cracks.length; i++) {
      let c = cracks[i];
      c.speed = map(posRatio, 0, 1, 0.5, 3);
      c.opacity = map(posRatio, 0, 1, 0.2, 0.9);
    }
  }
}
