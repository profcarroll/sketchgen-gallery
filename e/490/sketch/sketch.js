let helix = [];
let basePairs = [];
let time = 0;
let radius = 150;
let height = 300;
let turns = 10;
let baseCount = 100;
let baseRadius = 8;

function setup() {
  createCanvas(600, 600, WEBGL);
  noStroke();

  for (let i = 0; i < baseCount; i++) {
    let angle = map(i, 0, baseCount, 0, TWO_PI * turns);
    let y = map(i, 0, baseCount, -height/2, height/2);
    let x = radius * cos(angle);
    let z = radius * sin(angle);

    let base = {
      x: x,
      y: y,
      z: z,
      angle: angle,
      type: random(['A', 'T', 'C', 'G']),
      color: getColorForBase(random(['A', 'T', 'C', 'G'])),
      originalX: x,
      originalY: y,
      originalZ: z
    };

    helix.push(base);
  }
}

function draw() {
  background(20);

  rotateY(time * 0.001);
  rotateX(sin(time * 0.0005) * 0.1);

  // Draw the double helix structure
  for (let i = 0; i < helix.length; i++) {
    let base = helix[i];
    let angle = base.angle + time * 0.002;
    let y = base.originalY;
    let x = (radius + sin(time * 0.001 + i * 0.1) * 30) * cos(angle);
    let z = (radius + sin(time * 0.001 + i * 0.1) * 30) * sin(angle);

    push();
    translate(x, y, z);
    fill(base.color);
    sphere(baseRadius);
    
    // Draw base label
    textAlign(CENTER, CENTER);
    fill(255);
    text(base.type, 0, 0);
    pop();
  }

  // Create temporary bonds between complementary bases
  for (let i = 0; i < helix.length - 1; i++) {
    let base1 = helix[i];
    let base2 = helix[i + 1];

    if (isComplementary(base1.type, base2.type)) {
      let d = dist(base1.x, base1.y, base1.z, base2.x, base2.y, base2.z);
      if (d < 30) {
        stroke(255, 100);
        strokeWeight(1);
        line(base1.x, base1.y, base1.z, base2.x, base2.y, base2.z);
      }
    }
  }

  time++;
}

function getColorForBase(type) {
  switch (type) {
    case 'A': return color(255, 100, 100); // Red
    case 'T': return color(100, 255, 100); // Green
    case 'C': return color(100, 100, 255); // Blue
    case 'G': return color(255, 255, 100); // Yellow
    default: return color(255);
  }
}

function isComplementary(base1, base2) {
  return (base1 === 'A' && base2 === 'T') ||
         (base1 === 'T' && base2 === 'A') ||
         (base1 === 'C' && base2 === 'G') ||
         (base1 === 'G' && base2 === 'C');
}
