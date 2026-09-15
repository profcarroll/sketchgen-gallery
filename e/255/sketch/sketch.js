let clouds = [];
let mountains = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Seed for reproducible randomness
  randomSeed(42);

  // Create clouds
  for (let i = 0; i < 20; i++) {
    clouds.push({
      x: random(width),
      y: random(height * 0.3, height * 0.5),
      size: random(30, 80),
      speed: random(0.1, 0.3)
    });
  }

  // Create mountain range
  for (let i = 0; i < 10; i++) {
    mountains.push({
      x: i * (width / 10),
      height: random(height * 0.4, height * 0.7),
      width: width / 10,
      color: color(100, 120, 100)
    });
  }
}

function draw() {
  // Sky background
  background(135, 206, 235);

  // Draw distant mountains
  for (let mountain of mountains) {
    fill(mountain.color);
    noStroke();
    beginShape();
    vertex(mountain.x, height);
    vertex(mountain.x + mountain.width / 2, height - mountain.height);
    vertex(mountain.x + mountain.width, height);
    endShape(CLOSE);
  }

  // Draw grass field
  fill(34, 139, 34);
  noStroke();
  rect(0, height * 0.6, width, height * 0.4);

  // Draw foreground grass details
  stroke(20, 100, 20);
  strokeWeight(1);
  for (let i = 0; i < 500; i++) {
    let x = random(width);
    let y = random(height * 0.6, height);
    let h = random(5, 15);
    line(x, y, x, y - h);
  }

  // Draw clouds
  fill(255, 255, 255, 200);
  noStroke();
  for (let cloud of clouds) {
    ellipse(cloud.x, cloud.y, cloud.size, cloud.size * 0.6);
    ellipse(cloud.x + cloud.size * 0.4, cloud.y - cloud.size * 0.2, cloud.size * 0.7, cloud.size * 0.5);
    ellipse(cloud.x + cloud.size * 0.8, cloud.y, cloud.size * 0.6, cloud.size * 0.4);
    cloud.x += cloud.speed;
    if (cloud.x > width + cloud.size) {
      cloud.x = -cloud.size;
    }
  }

  // Stop animation after one frame
  noLoop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
