let bands = [];
let stripes = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(RGB);

  // Initialize geometric bands
  for (let i = 0; i < 8; i++) {
    bands.push({
      angle: random(TWO_PI),
      speed: random(0.002, 0.005),
      size: random(0.3, 0.7),
      color: color(random(100, 255), random(100, 255), random(100, 255))
    });
  }

  // Initialize fine linear stripes
  for (let i = 0; i < 300; i++) {
    stripes.push({
      angle: random(TWO_PI),
      speed: random(0.001, 0.003),
      width: random(1, 3)
    });
  }
}

function draw() {
  background(0);

  // Draw bands
  for (let i = 0; i < bands.length; i++) {
    let band = bands[i];
    band.angle += band.speed;

    push();
    translate(width / 2, height / 2);
    rotate(band.angle);
    scale(band.size);

    fill(band.color);
    noStroke();

    // Draw a large polygon for each band
    beginShape();
    let sides = 6;
    for (let j = 0; j < sides; j++) {
      let angle = map(j, 0, sides, 0, TWO_PI);
      let x = cos(angle) * 300;
      let y = sin(angle) * 300;
      vertex(x, y);
    }
    endShape(CLOSE);

    pop();
  }

  // Draw stripes
  for (let i = 0; i < stripes.length; i++) {
    let stripe = stripes[i];
    stripe.angle += stripe.speed;

    push();
    translate(width / 2, height / 2);
    rotate(stripe.angle);

    stroke(255);
    strokeWeight(stripe.width);

    // Draw a long line across the canvas
    line(-width * 1.5, 0, width * 1.5, 0);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
