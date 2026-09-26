let suns = [];
let hourMarkers = [];
let shadowPoints = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);

  // Create three suns positioned across the sky
  suns.push({
    x: width * 0.3,
    y: height * 0.2,
    radius: 30,
    speed: 0.5,
    angle: 0,
    color: color(255, 200, 100)
  });

  suns.push({
    x: width * 0.7,
    y: height * 0.3,
    radius: 25,
    speed: 0.3,
    angle: 120,
    color: color(255, 150, 80)
  });

  suns.push({
    x: width * 0.5,
    y: height * 0.7,
    radius: 35,
    speed: 0.4,
    angle: 240,
    color: color(255, 100, 60)
  });

  // Create hour markers on the sundial
  for (let i = 0; i < 12; i++) {
    const angle = map(i, 0, 12, 0, 360);
    const x = width / 2 + cos(angle) * 150;
    const y = height / 2 + sin(angle) * 150;
    hourMarkers.push({ x, y, angle });
  }

  // Initialize shadow points
  for (let i = 0; i < 100; i++) {
    shadowPoints.push({
      x: random(width),
      y: random(height),
      size: random(2, 6)
    });
  }
}

function draw() {
  background(50, 60, 70);

  // Update sun positions in circular orbits
  for (let sun of suns) {
    sun.angle += sun.speed;
    sun.x = width / 2 + cos(sun.angle) * 180;
    sun.y = height / 2 + sin(sun.angle) * 180;
  }

  // Draw the sundial base
  fill(120, 100, 90);
  noStroke();
  ellipse(width / 2, height / 2, 300, 300);

  // Draw hour markers
  stroke(255);
  strokeWeight(2);
  for (let marker of hourMarkers) {
    line(
      width / 2,
      height / 2,
      marker.x,
      marker.y
    );
  }

  // Draw shadow projections from each sun
  noFill();
  strokeWeight(1);
  for (let sun of suns) {
    const dx = sun.x - width / 2;
    const dy = sun.y - height / 2;

    beginShape();
    for (let i = 0; i < shadowPoints.length; i++) {
      let p = shadowPoints[i];
      // Project point away from sun
      const angle = atan2(dy, dx);
      const distance = dist(p.x, p.y, width / 2, height / 2);
      const newX = p.x + cos(angle) * distance * 0.5;
      const newY = p.y + sin(angle) * distance * 0.5;

      vertex(newX, newY);
    }
    endShape(CLOSE);
  }

  // Draw the suns
  for (let sun of suns) {
    fill(sun.color);
    noStroke();
    ellipse(sun.x, sun.y, sun.radius * 2, sun.radius * 2);
  }

  // Draw intersecting shadows
  stroke(0, 0, 0, 150);
  strokeWeight(3);
  for (let i = 0; i < shadowPoints.length; i++) {
    let p = shadowPoints[i];
    const angle1 = atan2(suns[0].y - height / 2, suns[0].x - width / 2);
    const angle2 = atan2(suns[1].y - height / 2, suns[1].x - width / 2);
    const angle3 = atan2(suns[2].y - height / 2, suns[2].x - width / 2);

    // Project shadow based on multiple sun positions
    const dx1 = cos(angle1) * 50;
    const dy1 = sin(angle1) * 50;

    const dx2 = cos(angle2) * 50;
    const dy2 = sin(angle2) * 50;

    const dx3 = cos(angle3) * 50;
    const dy3 = sin(angle3) * 50;

    // Draw shadow lines from point to suns
    line(p.x, p.y, p.x + dx1, p.y + dy1);
    line(p.x, p.y, p.x + dx2, p.y + dy2);
    line(p.x, p.y, p.x + dx3, p.y + dy3);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
