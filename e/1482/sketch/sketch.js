let rings = [];
let time = 0;
let pulse = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  // Initialize rings
  for (let i = 0; i < 100; i++) {
    rings.push({
      radius: random(50, 200),
      width: random(2, 8),
      hue: random(180, 300),
      saturation: random(40, 80),
      alpha: random(0.1, 0.6),
      speed: random(0.001, 0.005),
      density: random(0.5, 2)
    });
  }
}

function draw() {
  background(0, 0, 0, 0.05); // Semi-transparent background for trail effect

  time += 0.01;
  pulse = sin(time * 0.3) * 0.5 + 0.5;

  const centerX = width / 2;
  const centerY = height / 2;

  // Draw rings
  for (let i = 0; i < rings.length; i++) {
    let r = rings[i];
    let radius = r.radius + sin(time * r.speed) * 30 * pulse;
    let angleStep = TWO_PI / (50 * r.density);

    push();
    translate(centerX, centerY);
    rotate(time * 0.001);

    fill(r.hue, r.saturation, 70, r.alpha);
    
    beginShape();
    for (let a = 0; a < TWO_PI; a += angleStep) {
      let x = cos(a) * radius;
      let y = sin(a) * radius;
      vertex(x, y);
    }
    endShape(CLOSE);

    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
