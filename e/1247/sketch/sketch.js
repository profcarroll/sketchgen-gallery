let fogParticles = [];
let beam;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Create fog particles
  for (let i = 0; i < 1000; i++) {
    fogParticles.push({
      x: random(width),
      y: random(height),
      z: random(100),
      speed: random(0.1, 0.3),
      size: random(2, 6)
    });
  }
  // Create lighthouse beam
  beam = createGraphics(width, height);
  beam.noStroke();
  beam.colorMode(HSB, 360, 100, 100, 1);
}

function draw() {
  background(15, 20, 30); // Deep blue background

  time += 0.005;

  // Draw fog particles
  for (let p of fogParticles) {
    p.y += p.speed;
    if (p.y > height) {
      p.y = 0;
      p.x = random(width);
    }
    let alpha = map(sin(time + p.z * 0.01), -1, 1, 30, 80);
    fill(100, 20, 80, alpha);
    noStroke();
    ellipse(p.x, p.y, p.size);
  }

  // Draw lighthouse beam
  let angle = time * 0.5;
  let beamWidth = map(sin(time * 2), -1, 1, 0.3, 0.7) * width;

  // Create the sweeping beam effect
  beam.background(0, 0, 0, 0);
  beam.push();
  beam.translate(width / 2, height / 2);
  beam.rotate(angle);
  let gradient = beam.drawingContext.createLinearGradient(
    -beamWidth / 2,
    -height,
    beamWidth / 2,
    height
  );
  gradient.addColorStop(0, color(255, 255, 255, 0));
  gradient.addColorStop(0.3, color(255, 255, 255, 100));
  gradient.addColorStop(0.7, color(255, 255, 255, 150));
  gradient.addColorStop(1, color(255, 255, 255, 0));

  beam.drawingContext.fillStyle = gradient;
  beam.rect(-beamWidth / 2, -height, beamWidth, height * 2);
  beam.pop();

  // Apply the beam to the canvas
  blendMode(DIFFERENCE);
  image(beam, 0, 0);

  // Add shimmering points (moonlight reflections)
  blendMode(BLEND);
  for (let i = 0; i < 50; i++) {
    let x = (time * 20 + i * 100) % width;
    let y = height / 2 + sin(time * 0.5 + i) * 50;
    let size = map(sin(time * 3 + i), -1, 1, 1, 4);
    fill(255, 255, 255, 200);
    noStroke();
    ellipse(x, y, size);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
