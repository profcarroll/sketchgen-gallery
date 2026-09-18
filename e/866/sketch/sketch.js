let cracks = [];
let dustDevils = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(RGB);

  // Generate cracks
  for (let i = 0; i < 1000; i++) {
    let x = random(width);
    let y = random(height * 0.3, height * 0.9); // mostly in foreground/midground
    let len = random(20, 100);
    let angle = random(TWO_PI);
    cracks.push({x, y, len, angle});
  }

  // Generate dust devils
  for (let i = 0; i < 50; i++) {
    let x = random(width);
    let y = random(height * 0.7, height); // mostly on ground
    let size = random(10, 50);
    let speed = random(0.5, 2);
    dustDevils.push({x, y, size, speed, angle: random(TWO_PI)});
  }

  noLoop();
}

function draw() {
  // Sky gradient from pale beige to darker
  for (let i = 0; i < height; i++) {
    let inter = map(i, 0, height, 0, 1);
    let c = lerpColor(color(245, 240, 230), color(220, 210, 190), inter);
    stroke(c);
    line(0, i, width, i);
  }

  // Ground - terracotta tones
  fill(180, 90, 60);
  noStroke();
  rect(0, height * 0.7, width, height * 0.3);

  // Cracks
  stroke(120, 60, 40);
  strokeWeight(2);
  for (let crack of cracks) {
    let endX = crack.x + cos(crack.angle) * crack.len;
    let endY = crack.y + sin(crack.angle) * crack.len;
    line(crack.x, crack.y, endX, endY);
  }

  // Dust devils
  for (let devil of dustDevils) {
    noFill();
    stroke(200, 180, 160, 150);
    strokeWeight(1);
    beginShape();
    for (let i = 0; i < 20; i++) {
      let angle = devil.angle + i * 0.3;
      let radius = devil.size * (1 + sin(frameCount * 0.02 + i) * 0.5);
      let x = devil.x + cos(angle) * radius;
      let y = devil.y + sin(angle) * radius;
      vertex(x, y);
    }
    endShape(CLOSE);
    devil.angle += devil.speed * 0.01;
  }

  // Horizon rocks
  fill(120, 100, 90);
  noStroke();
  for (let i = 0; i < 20; i++) {
    let x = random(width);
    let y = height * 0.7;
    let w = random(30, 80);
    let h = random(10, 40);
    rect(x, y, w, h);
  }
}
