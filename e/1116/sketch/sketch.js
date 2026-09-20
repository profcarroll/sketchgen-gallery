let waves = [];
let seed;

function setup() {
  createCanvas(400, 400);
  seed = millis();
  noLoop();
  setTimeout(() => {
    loop();
  }, 100);
}

function draw() {
  background(10);
  randomSeed(seed);

  if (frameCount % 30 === 0) {
    waves.push({
      x: random(width),
      y: random(height),
      size: random(20, 80),
      speed: random(0.01, 0.05),
      angle: random(TWO_PI),
      segments: floor(random(3, 8)),
      color: color(random(150, 255), 0, random(100, 200), 150)
    });
  }

  for (let i = waves.length - 1; i >= 0; i--) {
    let wave = waves[i];
    wave.angle += wave.speed;
    wave.size *= 0.99;

    push();
    translate(wave.x, wave.y);
    rotate(wave.angle);

    stroke(wave.color);
    strokeWeight(3);
    noFill();

    beginShape();
    for (let j = 0; j < wave.segments; j++) {
      let angle = map(j, 0, wave.segments, 0, TWO_PI);
      let radius = wave.size * (1 + sin(frameCount * 0.02 + angle) * 0.5);
      let x = cos(angle) * radius;
      let y = sin(angle) * radius;
      vertex(x, y);
    }
    endShape(CLOSE);

    pop();

    if (wave.size < 5) {
      waves.splice(i, 1);
    }
  }

  seed++;
}
