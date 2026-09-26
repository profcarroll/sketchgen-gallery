let drops = [];
let cityscape;
let rippleEffect = false;
let rippleCenter = { x: 0, y: 0 };
let rippleRadius = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Create a tiny cityscape to be shown in each raindrop
  cityscape = createGraphics(100, 100);
  cityscape.background(200);
  cityscape.stroke(0);
  for (let i = 0; i < 50; i++) {
    let x = random(cityscape.width);
    let y = random(cityscape.height);
    let w = random(5, 15);
    let h = random(5, 20);
    cityscape.rect(x, y, w, h);
  }

  // Initialize raindrops
  for (let i = 0; i < 200; i++) {
    drops.push({
      x: random(width),
      y: random(-height, 0),
      speed: random(3, 8),
      size: random(1, 3),
      angle: random(TWO_PI),
      sway: random(-0.5, 0.5),
      swaySpeed: random(0.02, 0.05),
      distortion: 0,
      cityOffsetX: random(-10, 10),
      cityOffsetY: random(-10, 10),
      pulse: random(TWO_PI),
      pulseSpeed: random(0.01, 0.03)
    });
  }
}

function draw() {
  background(30, 40, 60);

  // Draw raindrops
  for (let drop of drops) {
    // Update position with sway effect
    drop.y += drop.speed;
    drop.angle += drop.swaySpeed;
    drop.x += sin(drop.angle) * drop.sway;

    // Reset drop if it goes off screen
    if (drop.y > height + 20) {
      drop.y = random(-20, -5);
      drop.x = random(width);
      drop.distortion = 0;
    }

    // Update pulse for cityscape glow
    drop.pulse += drop.pulseSpeed;

    // Draw the raindrop with a slight glow effect
    noStroke();
    fill(180, 220, 255, 180);
    ellipse(drop.x, drop.y, drop.size * 4, drop.size * 6);

    // Draw inner lens effect
    fill(100, 150, 200, 100);
    ellipse(drop.x, drop.y, drop.size * 2, drop.size * 3);

    // Draw the cityscape inside the raindrop
    push();
    translate(drop.x, drop.y);
    scale(0.3); // Scale down the cityscape to fit in the drop

    // Apply distortion if there's a ripple effect
    if (rippleEffect) {
      let d = dist(drop.x, drop.y, rippleCenter.x, rippleCenter.y);
      if (d < rippleRadius * 2) {
        let distortion = map(d, 0, rippleRadius * 2, 0.5, 0);
        translate(distortion * sin(frameCount * 0.03), distortion * cos(frameCount * 0.03));
      }
    }

    // Apply gentle pulsing glow to cityscape
    let pulseValue = sin(drop.pulse) * 0.2 + 0.8;
    tint(255, 150 * pulseValue);
    image(cityscape, drop.cityOffsetX, drop.cityOffsetY);
    pop();
  }

  // Update ripple effect
  if (rippleEffect) {
    rippleRadius += 5;
    if (rippleRadius > width * 1.5) {
      rippleEffect = false;
      rippleRadius = 0;
    }
  }
}

function mousePressed() {
  // Start ripple effect at click position
  rippleCenter.x = mouseX;
  rippleCenter.y = mouseY;
  rippleEffect = true;
  rippleRadius = 0;
}
