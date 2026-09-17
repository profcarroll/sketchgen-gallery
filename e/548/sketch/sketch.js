let horse;
let segments = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Initialize horse body segments with organic curves
  for (let i = 0; i < 20; i++) {
    segments.push({
      x: 0,
      y: 0,
      z: 0,
      angle: 0,
      length: 15 + random(-5, 5),
      width: 8 + random(-3, 3)
    });
  }
  horse = {
    x: width / 2,
    y: height / 2,
    speed: 2,
    direction: 0
  };
}

function draw() {
  background(240, 245, 250);
  
  time += 0.03;
  horse.direction += random(-0.01, 0.01);
  horse.x += cos(horse.direction) * horse.speed;
  horse.y += sin(horse.direction) * horse.speed;

  // Keep horse on screen
  if (horse.x < 0 || horse.x > width) horse.direction *= -1;
  if (horse.y < 0 || horse.y > height) horse.direction *= -1;

  // Update segments with wave motion
  for (let i = 0; i < segments.length; i++) {
    let segment = segments[i];
    let offset = sin(time + i * 0.3) * 5;
    segment.x = horse.x + cos(horse.direction + offset) * i * 10;
    segment.y = horse.y + sin(horse.direction + offset) * i * 10;
    segment.angle = horse.direction + sin(time + i * 0.2) * 0.5;
  }

  // Draw horse body with smooth curves
  noFill();
  stroke(139, 69, 19);
  strokeWeight(4);
  beginShape();
  for (let i = 0; i < segments.length; i++) {
    let segment = segments[i];
    let x = segment.x + cos(segment.angle) * segment.length;
    let y = segment.y + sin(segment.angle) * segment.length;
    curveVertex(x, y);
  }
  endShape(CLOSE);

  // Draw legs with fluid motion
  stroke(101, 67, 33);
  strokeWeight(2);
  for (let i = 0; i < 4; i++) {
    let legOffset = sin(time + i * 0.5) * 10;
    let x1 = segments[0].x + cos(segments[0].angle + legOffset) * 15;
    let y1 = segments[0].y + sin(segments[0].angle + legOffset) * 15;
    let x2 = x1 + cos(segments[0].angle) * 20;
    let y2 = y1 + sin(segments[0].angle) * 20;
    line(x1, y1, x2, y2);
  }

  // Draw head
  fill(139, 69, 19);
  noStroke();
  ellipse(segments[segments.length - 1].x, segments[segments.length - 1].y, 20, 15);

  // Draw mane
  stroke(139, 69, 19);
  strokeWeight(1);
  beginShape();
  for (let i = 0; i < 10; i++) {
    let x = segments[segments.length - 1].x + cos(time + i * 0.5) * 10;
    let y = segments[segments.length - 1].y + sin(time + i * 0.5) * 10;
    curveVertex(x, y);
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
