let rings = [];
let colors = [];
let centerX, centerY;
let time = 0;

function setup() {
  createCanvas(400, 400, WEBGL);
  centerX = width / 2;
  centerY = height / 2;

  // Generate color bands for spectrum
  for (let i = 0; i < 12; i++) {
    let hue = (i * 30) % 360;
    colors.push(color(hue, 100, 100));
  }

  // Create nested rings
  for (let r = 0; r < 8; r++) {
    rings.push({
      radius: 50 + r * 40,
      speed: 0.005 + r * 0.001,
      segments: 60 + r * 10,
      colorIndex: r % colors.length
    });
  }
}

function draw() {
  background(0);
  time += 0.01;

  // Center the drawing
  translate(0, 0, -200);

  for (let i = 0; i < rings.length; i++) {
    let ring = rings[i];
    let angleOffset = time * ring.speed;
    let colorIndex = (i + floor(time * 0.1)) % colors.length;

    push();
    rotateY(angleOffset);
    stroke(colors[colorIndex]);
    noFill();
    beginShape();
    for (let j = 0; j < ring.segments; j++) {
      let angle = TWO_PI / ring.segments * j;
      let x = cos(angle) * ring.radius;
      let y = sin(angle) * ring.radius;
      let z = sin(angleOffset + angle * 2) * 10;
      vertex(x, y, z);
    }
    endShape(CLOSE);
    pop();
  }

  // Add central glowing core
  push();
  noStroke();
  fill(255, 200);
  sphere(20);
  pop();
}
