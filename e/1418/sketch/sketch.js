let hexagons = [];
const numHexagons = 100;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Initialize hexagons with random positions and properties
  for (let i = 0; i < numHexagons; i++) {
    hexagons.push({
      x: random(-width, width),
      y: random(-height, height),
      z: random(-100, 100),
      size: random(30, 80),
      rotation: random(TWO_PI),
      speed: random(0.002, 0.005),
      hue: random(360),
      saturation: random(50, 100),
      brightness: random(70, 100),
      alpha: random(0.5, 1)
    });
  }
}

function draw() {
  background(0);
  time += 0.01;

  // Camera movement for dynamic view
  let cx = sin(time * 0.2) * 200;
  let cy = cos(time * 0.3) * 200;
  let cz = sin(time * 0.1) * 300;
  camera(cx, cy, cz, 0, 0, 0, 0, 1, 0);

  // Draw each hexagon
  for (let i = 0; i < hexagons.length; i++) {
    let h = hexagons[i];

    push();

    // Position and rotate each hexagon
    translate(h.x, h.y, h.z);
    rotateZ(h.rotation + time * h.speed);
    rotateX(sin(time * 0.5 + i) * 0.2);

    // Color shifting over time
    let hue = (h.hue + time * 10) % 360;
    fill(hue, h.saturation, h.brightness, h.alpha);

    // Draw hexagon
    beginShape();
    for (let j = 0; j < 6; j++) {
      let angle = TWO_PI / 6 * j;
      let x = h.size * cos(angle);
      let y = h.size * sin(angle);
      vertex(x, y);
    }
    endShape(CLOSE);

    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
