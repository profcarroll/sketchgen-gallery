let dustDevils = [];
let cracks = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);

  // Create some dust devils
  for (let i = 0; i < 15; i++) {
    dustDevils.push({
      x: random(width),
      y: random(height * 0.7, height),
      size: random(20, 60),
      speed: random(0.5, 2),
      angle: random(TWO_PI),
      color: color(200, 100, 50, 180)
    });
  }

  // Generate cracks in the ground
  for (let i = 0; i < 300; i++) {
    cracks.push({
      x: random(width),
      y: random(height * 0.7, height),
      length: random(20, 100),
      angle: random(TWO_PI),
      width: random(1, 4)
    });
  }
}

function draw() {
  // Draw the sky
  background(240, 230, 220);

  // Draw the ground with texture
  drawGround();

  // Update and draw dust devils
  for (let devil of dustDevils) {
    updateDustDevil(devil);
    drawDustDevil(devil);
  }

  // Draw cracks
  drawCracks();
}

function drawGround() {
  noStroke();
  fill(150, 60, 30); // Deep terracotta color
  rect(0, height * 0.7, width, height * 0.3);

  // Add some texture to the ground
  stroke(120, 50, 20);
  strokeWeight(1);
  for (let i = 0; i < 1000; i++) {
    let x = random(width);
    let y = random(height * 0.7, height);
    let size = random(1, 3);
    point(x, y);
  }
}

function updateDustDevil(devil) {
  devil.x += cos(devil.angle) * devil.speed;
  devil.y += sin(devil.angle) * devil.speed;
  devil.angle += random(-0.05, 0.05);

  // Bounce off edges
  if (devil.x < 0 || devil.x > width) {
    devil.angle = PI - devil.angle;
  }
  if (devil.y < height * 0.7 || devil.y > height) {
    devil.angle = -devil.angle;
  }
}

function drawDustDevil(devil) {
  noStroke();
  fill(devil.color);
  ellipse(devil.x, devil.y, devil.size);

  // Add a subtle glow effect
  noFill();
  stroke(200, 150, 100, 100);
  strokeWeight(3);
  ellipse(devil.x, devil.y, devil.size * 1.5);
}

function drawCracks() {
  stroke(100, 40, 10);
  strokeWeight(2);
  for (let crack of cracks) {
    push();
    translate(crack.x, crack.y);
    rotate(crack.angle);
    line(0, 0, crack.length, 0);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
