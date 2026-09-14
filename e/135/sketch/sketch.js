let pyramids = [];
let waterRipples = [];

function setup() {
  createCanvas(800, 600);
  colorMode(HSB, 360, 100, 100, 1);

  // Create pyramids
  for (let i = 0; i < 5; i++) {
    pyramids.push({
      x: random(100, width - 100),
      y: height - 50,
      size: random(40, 80),
      hue: random(20, 40), // Earth tones
      saturation: random(30, 50),
      brightness: random(40, 60)
    });
  }

  // Initialize water ripples
  for (let i = 0; i < 100; i++) {
    waterRipples.push({
      x: random(width),
      y: height - 20,
      radius: random(5, 30),
      speed: random(0.5, 2),
      alpha: random(30, 60)
    });
  }
}

function draw() {
  background(210, 20, 90); // Deep blue sky

  // Draw sea
  fill(200, 40, 20);
  noStroke();
  rect(0, height - 20, width, 20);

  // Update and draw ripples
  for (let i = waterRipples.length - 1; i >= 0; i--) {
    let ripple = waterRipples[i];
    ripple.radius += ripple.speed;
    ripple.alpha -= 0.5;

    if (ripple.alpha <= 0) {
      waterRipples.splice(i, 1);
      continue;
    }

    stroke(200, 30, 80, ripple.alpha / 100);
    noFill();
    ellipse(ripple.x, ripple.y, ripple.radius * 2);
  }

  // Add new ripples occasionally
  if (frameCount % 5 === 0) {
    waterRipples.push({
      x: random(width),
      y: height - 20,
      radius: 0,
      speed: random(0.5, 2),
      alpha: random(30, 60)
    });
  }

  // Draw pyramids
  for (let p of pyramids) {
    fill(p.hue, p.saturation, p.brightness);
    noStroke();

    // Pyramid body
    triangle(
      p.x - p.size / 2, p.y,
      p.x + p.size / 2, p.y,
      p.x, p.y - p.size
    );

    // Highlight
    fill(p.hue, p.saturation, p.brightness * 0.8);
    triangle(
      p.x - p.size / 2, p.y,
      p.x, p.y - p.size,
      p.x + p.size / 4, p.y - p.size / 3
    );
  }

  // Simulate water interaction with pyramids
  for (let p of pyramids) {
    let distance = abs(p.x - width / 2);
    if (distance < 100) {
      let intensity = map(distance, 0, 100, 5, 0.5);
      for (let i = 0; i < intensity; i++) {
        waterRipples.push({
          x: p.x,
          y: height - 20,
          radius: random(5, 15),
          speed: random(0.5, 2),
          alpha: random(30, 60)
        });
      }
    }
  }

  // Draw water surface
  noFill();
  stroke(200, 30, 80, 20);
  for (let i = 0; i < width; i += 10) {
    let offset = sin(frameCount * 0.02 + i * 0.05) * 3;
    line(i, height - 20 + offset, i + 5, height - 20 + offset);
  }
}
