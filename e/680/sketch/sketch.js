let segments = [];
let segmentId = 0;
let time = 0;

function setup() {
  createCanvas(600, 600, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  segments.push({
    id: segmentId++,
    x: 0,
    y: 0,
    z: 0,
    width: random(20, 50),
    depth: random(20, 50),
    height: random(40, 80),
    hue: random(10, 30),
    saturation: random(20, 40),
    brightness: random(20, 60),
    rotation: random(TWO_PI)
  });
}

function draw() {
  background(0, 0, 10);
  time += 0.01;

  // Camera movement
  let camX = sin(time * 0.2) * 300;
  let camY = sin(time * 0.15) * 100;
  let camZ = cos(time * 0.1) * 400 + 400;
  camera(camX, camY, camZ, 0, 0, 0, 0, 1, 0);

  // Lighting
  ambientLight(60);
  pointLight(255, 255, 255, 0, -300, 0);
  pointLight(255, 255, 255, 0, 300, 0);

  // Draw existing segments
  for (let i = 0; i < segments.length; i++) {
    let s = segments[i];
    push();
    translate(s.x, s.y, s.z);
    rotateY(s.rotation);
    fill(s.hue, s.saturation, s.brightness, 0.9);
    box(s.width, s.height, s.depth);
    pop();
  }

  // Add new segment occasionally
  if (frameCount % 60 === 0 && segments.length < 200) {
    let last = segments[segments.length - 1];
    let newSegment = {
      id: segmentId++,
      x: random(-50, 50),
      y: last.y + last.height,
      z: random(-50, 50),
      width: random(20, 60),
      depth: random(20, 60),
      height: random(30, 90),
      hue: last.hue + random(-10, 10),
      saturation: last.saturation + random(-5, 5),
      brightness: last.brightness + random(-5, 5),
      rotation: random(TWO_PI)
    };
    segments.push(newSegment);
  }
}

function mousePressed() {
  if (segments.length < 200) {
    let last = segments[segments.length - 1];
    let newSegment = {
      id: segmentId++,
      x: random(-50, 50),
      y: last.y + last.height,
      z: random(-50, 50),
      width: random(20, 60),
      depth: random(20, 60),
      height: random(30, 90),
      hue: last.hue + random(-10, 10),
      saturation: last.saturation + random(-5, 5),
      brightness: last.brightness + random(-5, 5),
      rotation: random(TWO_PI)
    };
    segments.push(newSegment);
  }
}
