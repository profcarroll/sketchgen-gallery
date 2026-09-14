let clouds = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Initialize cloud positions
  for (let i = 0; i < 20; i++) {
    clouds.push({
      x: random(width),
      y: random(height * 0.3, height * 0.6),
      size: random(50, 150),
      speed: random(0.1, 0.5)
    });
  }
}

function draw() {
  // Sky gradient from light blue at bottom to deep blue at top
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(color(255, 255, 255), color(0, 0, 150), inter);
    stroke(c);
    line(0, y, width, y);
  }

  // Ground - grassy field
  fill(34, 139, 34);
  noStroke();
  rect(0, height * 0.6, width, height * 0.4);

  // Hill in the center
  fill(25, 100, 25);
  beginShape();
  for (let x = 0; x < width; x += 5) {
    let y = height * 0.6 + sin(x / 100) * 30;
    vertex(x, y);
  }
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);

  // Draw and animate clouds
  for (let cloud of clouds) {
    fill(255, 255, 255, 200);
    noStroke();
    ellipse(cloud.x, cloud.y, cloud.size, cloud.size * 0.6);
    ellipse(cloud.x + cloud.size * 0.4, cloud.y - cloud.size * 0.2, cloud.size * 0.7, cloud.size * 0.5);
    ellipse(cloud.x - cloud.size * 0.4, cloud.y - cloud.size * 0.1, cloud.size * 0.6, cloud.size * 0.4);

    // Animate cloud
    cloud.x += cloud.speed;
    if (cloud.x > width + cloud.size) {
      cloud.x = -cloud.size;
    }
  }

  // Ensure the canvas changes over time
  frameCount++;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
