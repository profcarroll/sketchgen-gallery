let spirals = [];
let polygons = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(RADIANS);
  
  // Create spirals with varying parameters
  for (let i = 0; i < 12; i++) {
    spirals.push({
      radius: random(150, 400),
      speed: random(0.001, 0.005),
      phase: random(TWO_PI),
      color: color(random(180, 255), random(180, 255), random(220, 255), 200),
      detail: random(40, 100)
    });
  }

  // Create polygonal patterns
  for (let i = 0; i < 30; i++) {
    polygons.push({
      size: random(30, 80),
      speed: random(0.002, 0.008),
      phase: random(TWO_PI),
      color: color(random(180, 255), random(180, 255), random(220, 255), 180),
      sides: floor(random(3, 8))
    });
  }
}

function draw() {
  background(10, 15, 40);

  const centerX = width / 2;
  const centerY = height / 2;

  // Draw filled spirals
  for (let i = 0; i < spirals.length; i++) {
    const spiral = spirals[i];
    const time = frameCount * spiral.speed;

    fill(spiral.color);
    noStroke();
    beginShape();
    for (let a = 0; a < TWO_PI * 6; a += 0.02) {
      const r = spiral.radius * (1 - a / (TWO_PI * 6));
      const x = centerX + cos(a + time + spiral.phase) * r;
      const y = centerY + sin(a + time + spiral.phase) * r;
      vertex(x, y);
    }
    endShape(CLOSE);
  }

  // Draw polygonal patterns
  for (let i = 0; i < polygons.length; i++) {
    const poly = polygons[i];
    const time = frameCount * poly.speed;

    push();
    translate(centerX, centerY);
    rotate(time + poly.phase);

    fill(poly.color);
    noStroke();
    beginShape();
    for (let j = 0; j < poly.sides; j++) {
      const angle = TWO_PI / poly.sides * j;
      const x = cos(angle) * poly.size;
      const y = sin(angle) * poly.size;
      vertex(x, y);
    }
    endShape(CLOSE);

    pop();
  }

  // Add interlocking filled geometry between spirals and polygons
  for (let i = 0; i < spirals.length; i++) {
    const spiral = spirals[i];
    const time = frameCount * spiral.speed;
    const r = spiral.radius * 0.5;
    
    fill(255, 100);
    noStroke();
    beginShape();
    for (let j = 0; j < 6; j++) {
      const angle = TWO_PI / 6 * j;
      const x = centerX + cos(angle + time) * r;
      const y = centerY + sin(angle + time) * r;
      vertex(x, y);
    }
    endShape(CLOSE);
  }

  // Add more interlocking filled geometry from polygons
  for (let i = 0; i < polygons.length; i++) {
    const poly = polygons[i];
    const time = frameCount * poly.speed;

    push();
    translate(centerX, centerY);
    rotate(time + poly.phase);

    fill(255, 150);
    noStroke();
    beginShape();
    for (let j = 0; j < poly.sides; j++) {
      const angle = TWO_PI / poly.sides * j;
      const x = cos(angle) * poly.size * 0.7;
      const y = sin(angle) * poly.size * 0.7;
      vertex(x, y);
    }
    endShape(CLOSE);

    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
