let shapes = [];
let lines = [];
let bgHue;

function setup() {
  createCanvas(windowWidth, windowHeight);
  bgHue = 0;
  for (let i = 0; i < 20; i++) {
    shapes.push({
      x: random(width),
      y: random(height),
      size: random(50, 200),
      speed: random(0.1, 0.5),
      pulse: random(TWO_PI),
      pulseSpeed: random(0.01, 0.03)
    });
  }
  noLoop();
  loop();
}

function draw() {
  // Animate background gradient
  bgHue = (bgHue + 0.1) % 360;
  let bgStart = color('midnightblue');
  let bgEnd = color('purple');
  let interA = lerpColor(bgStart, bgEnd, (sin(bgHue * 0.01) + 1) / 2);
  background(interA);

  // Update and draw shapes
  for (let s of shapes) {
    s.x += sin(frameCount * s.speed * 0.01) * 0.5;
    s.y += cos(frameCount * s.speed * 0.01) * 0.5;
    s.pulse += s.pulseSpeed;

    let alpha = map(sin(s.pulse), -1, 1, 30, 80);
    fill(red(interA), green(interA), blue(interA), alpha);
    noStroke();
    ellipse(s.x, s.y, s.size + sin(s.pulse) * 20);
  }

  // Add glowing lines
  if (frameCount % 5 === 0 && lines.length < 300) {
    lines.push({
      x1: random(width),
      y1: random(height),
      x2: random(width),
      y2: random(height),
      life: 255,
      speed: random(0.5, 2)
    });
  }

  // Update and draw lines
  for (let i = lines.length - 1; i >= 0; i--) {
    let l = lines[i];
    l.life -= 2;
    l.x1 += sin(frameCount * l.speed * 0.01) * 0.3;
    l.y1 += cos(frameCount * l.speed * 0.01) * 0.3;
    l.x2 += cos(frameCount * l.speed * 0.01) * 0.3;
    l.y2 += sin(frameCount * l.speed * 0.01) * 0.3;

    stroke(255, 255, 255, l.life);
    strokeWeight(1);
    line(l.x1, l.y1, l.x2, l.y2);

    if (l.life <= 0) {
      lines.splice(i, 1);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
