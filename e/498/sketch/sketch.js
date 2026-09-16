let stars = [];
let dustLanes = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create stars
  for (let i = 0; i < 500; i++) {
    stars.push({
      x: random(-width * 2, width * 2),
      y: random(-height * 2, height * 2),
      z: random(-1000, -100),
      size: random(0.5, 3),
      brightness: random(0.5, 1),
      twinkleSpeed: random(0.01, 0.03),
      twinklePhase: random(TWO_PI)
    });
  }

  // Create dust lanes
  for (let i = 0; i < 5; i++) {
    dustLanes.push({
      segments: [],
      speed: random(0.001, 0.003),
      opacity: random(0.1, 0.3),
      color: color(random(180, 240), 70, 80, 0.5)
    });
  }

  // Initialize dust lane segments
  for (let i = 0; i < dustLanes.length; i++) {
    for (let j = 0; j < 100; j++) {
      dustLanes[i].segments.push({
        x: random(-width * 2, width * 2),
        y: random(-height * 2, height * 2),
        z: random(-500, -50),
        size: random(10, 30)
      });
    }
  }
}

function draw() {
  background(230, 100, 10); // Deep indigo

  time += 0.001;

  // Draw stars
  beginShape(POINTS);
  for (let star of stars) {
    fill(star.brightness * 100, 100, 100, 1);
    noStroke();
    
    let twinkle = sin(time * star.twinkleSpeed + star.twinklePhase) * 0.3;
    let size = star.size + twinkle;

    vertex(star.x, star.y, star.z);
  }
  endShape();

  // Draw dust lanes
  for (let lane of dustLanes) {
    push();
    noStroke();
    fill(lane.color);

    beginShape(QUADS);
    for (let i = 0; i < lane.segments.length - 1; i++) {
      let seg1 = lane.segments[i];
      let seg2 = lane.segments[i + 1];

      let x1 = seg1.x + sin(time * lane.speed * 10 + i) * 50;
      let y1 = seg1.y + cos(time * lane.speed * 15 + i) * 50;
      let z1 = seg1.z;

      let x2 = seg2.x + sin(time * lane.speed * 10 + i + 1) * 50;
      let y2 = seg2.y + cos(time * lane.speed * 15 + i + 1) * 50;
      let z2 = seg2.z;

      let size1 = seg1.size * (1 - (i / lane.segments.length));
      let size2 = seg2.size * (1 - ((i + 1) / lane.segments.length));

      vertex(x1 - size1, y1 - size1, z1);
      vertex(x1 + size1, y1 - size1, z1);
      vertex(x2 + size2, y2 + size2, z2);
      vertex(x2 - size2, y2 + size2, z2);
    }
    endShape();
    pop();
  }

  // Update dust lane positions
  for (let lane of dustLanes) {
    for (let seg of lane.segments) {
      seg.x += sin(time * lane.speed * 10) * 0.5;
      seg.y += cos(time * lane.speed * 15) * 0.5;
      seg.z += 0.5;

      // Reset segments that go too far
      if (seg.z > 100) {
        seg.x = random(-width * 2, width * 2);
        seg.y = random(-height * 2, height * 2);
        seg.z = -500;
      }
    }
  }

  // Add subtle camera movement
  rotateY(time * 0.0001);
  rotateX(sin(time * 0.0002) * 0.1);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
