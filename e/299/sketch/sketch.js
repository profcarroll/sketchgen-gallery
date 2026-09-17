let clouds = [];
let hills = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noLoop();

  // Create hills
  for (let i = 0; i < 20; i++) {
    hills.push({
      x: random(width),
      y: height / 2 + random(-50, 50),
      w: random(300, 800),
      h: random(100, 300)
    });
  }

  // Create clouds
  for (let i = 0; i < 15; i++) {
    clouds.push({
      x: random(width),
      y: random(height / 4),
      w: random(80, 150),
      h: random(30, 60),
      speed: random(0.2, 0.8)
    });
  }
}

function draw() {
  // Sky gradient
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(color(255, 255, 255), color(135, 206, 235), inter);
    stroke(c);
    line(0, y, width, y);
  }

  // Distant mountains
  fill(100, 100, 100);
  noStroke();
  beginShape();
  vertex(0, height);
  for (let i = 0; i < width; i += 20) {
    let h = map(noise(i * 0.005, 10), 0, 1, 300, 500);
    vertex(i, height - h);
  }
  vertex(width, height);
  endShape(CLOSE);

  // Midground hills
  fill(40, 120, 40);
  noStroke();
  for (let hill of hills) {
    beginShape();
    vertex(hill.x - hill.w / 2, hill.y + hill.h / 2);
    for (let i = 0; i < hill.w; i += 10) {
      let yoff = map(noise((hill.x + i) * 0.01), 0, 1, -20, 20);
      vertex(hill.x - hill.w / 2 + i, hill.y + hill.h / 2 + yoff);
    }
    vertex(hill.x + hill.w / 2, hill.y + hill.h / 2);
    endShape(CLOSE);
  }

  // Foreground grass
  fill(30, 100, 30);
  noStroke();
  beginShape();
  vertex(0, height);
  for (let i = 0; i < width; i += 20) {
    let h = map(noise(i * 0.01 + 50), 0, 1, 50, 100);
    vertex(i, height - h);
  }
  vertex(width, height);
  endShape(CLOSE);

  // Clouds
  fill(255, 255, 255, 200);
  noStroke();
  for (let cloud of clouds) {
    ellipse(cloud.x, cloud.y, cloud.w, cloud.h);
    ellipse(cloud.x + cloud.w * 0.3, cloud.y - cloud.h * 0.2, cloud.w * 0.7, cloud.h * 0.6);
    ellipse(cloud.x - cloud.w * 0.3, cloud.y - cloud.h * 0.2, cloud.w * 0.7, cloud.h * 0.6);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
