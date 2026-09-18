let planes = [];
let angle = 0;
let particles = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create floating amorphous planes
  for (let i = 0; i < 20; i++) {
    planes.push({
      x: random(-width / 2, width / 2),
      y: random(-height / 2, height / 2),
      z: random(-100, 100),
      size: random(100, 300),
      speed: random(0.001, 0.005),
      hue: random(360)
    });
  }

  // Create particles for geometric structures
  for (let i = 0; i < 500; i++) {
    particles.push({
      x: random(-width / 2, width / 2),
      y: random(-height / 2, height / 2),
      z: random(-300, 300),
      size: random(2, 8),
      speed: random(0.001, 0.003)
    });
  }
}

function draw() {
  background(0, 0, 0, 0.1);

  angle += 0.002;

  // Draw amorphous glowing planes
  for (let plane of planes) {
    push();
    translate(plane.x, plane.y, plane.z);
    rotateX(angle * plane.speed);
    rotateY(angle * plane.speed * 0.5);
    rotateZ(angle * plane.speed * 0.3);

    // Create a flowing, amorphous shape using noise
    let noiseScale = 0.02;
    let noiseStrength = 50;

    beginShape();
    for (let i = 0; i < 100; i++) {
      let t = map(i, 0, 100, 0, TWO_PI * 4);
      let x = cos(t) * plane.size;
      let y = sin(t) * plane.size;
      let z = noise(x * noiseScale, y * noiseScale, plane.z * noiseScale) * noiseStrength;
      vertex(x, y, z);
    }
    endShape(CLOSE);

    pop();
  }

  // Draw particles for geometric structures
  beginShape(POINTS);
  for (let p of particles) {
    let x = p.x + sin(angle * p.speed * 10) * 50;
    let y = p.y + cos(angle * p.speed * 10) * 50;
    let z = p.z + sin(angle * p.speed * 5) * 30;

    vertex(x, y, z);
  }
  endShape();

  // Draw sharp geometric structures
  for (let i = 0; i < 10; i++) {
    push();
    let x = sin(angle * 0.2 + i) * width / 4;
    let y = cos(angle * 0.3 + i) * height / 4;
    let z = sin(angle * 0.1 + i) * 200;

    translate(x, y, z);
    rotateX(angle * 0.5);
    rotateY(angle * 0.3);
    rotateZ(angle * 0.7);

    // Draw a cube
    box(50, 50, 50);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
