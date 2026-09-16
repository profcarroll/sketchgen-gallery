let stalks = [];
let UFO;
let exhaustParticles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Create corn stalks
  for (let i = 0; i < 300; i++) {
    stalks.push({
      x: random(width),
      y: random(height * 0.3, height * 0.8),
      height: random(60, 120),
      angle: random(TWO_PI),
      swaySpeed: random(0.01, 0.03),
      swayAmount: random(0.1, 0.3)
    });
  }

  // Create UFO
  UFO = {
    x: width / 2,
    y: height * 0.4,
    radius: 30,
    lightIntensity: 0.8,
    pulseSpeed: 0.02,
    glowColor: color(255, 255, 200, 150)
  };

  // Create exhaust particles
  for (let i = 0; i < 200; i++) {
    exhaustParticles.push({
      x: width / 2,
      y: height * 0.4 + 30,
      size: random(2, 8),
      speed: random(1, 3),
      angle: random(TWO_PI),
      life: random(30, 60)
    });
  }
}

function draw() {
  background(20, 30, 40); // Twilight sky

  // Draw ground
  fill(50, 70, 30);
  noStroke();
  rect(0, height * 0.8, width, height * 0.2);

  // Draw stalks with swaying motion
  for (let stalk of stalks) {
    stalk.angle += stalk.swaySpeed;
    let swayOffset = sin(stalk.angle) * stalk.swayAmount;

    stroke(100, 150, 50);
    strokeWeight(2);
    line(stalk.x, stalk.y, stalk.x + swayOffset, stalk.y - stalk.height);
  }

  // Draw exhaust plumes
  for (let i = 0; i < exhaustParticles.length; i++) {
    let p = exhaustParticles[i];
    p.x += cos(p.angle) * p.speed;
    p.y += sin(p.angle) * p.speed;
    p.life--;
    
    if (p.life <= 0) {
      p.x = width / 2;
      p.y = height * 0.4 + 30;
      p.life = random(30, 60);
      p.size = random(2, 8);
      p.angle = random(TWO_PI);
    }

    // Draw particle with glow
    fill(0, 255, 255, 150);
    noStroke();
    ellipse(p.x, p.y, p.size);
  }

  // Draw UFO with pulsating glow
  let pulse = sin(frameCount * UFO.pulseSpeed) * 0.3 + 0.7;
  fill(UFO.glowColor);
  noStroke();
  ellipse(UFO.x, UFO.y, UFO.radius * (1 + pulse * 0.2));

  // Draw UFO disc
  fill(180, 200, 220);
  stroke(150, 170, 190);
  strokeWeight(2);
  ellipse(UFO.x, UFO.y, UFO.radius * 1.5, UFO.radius * 0.8);

  // Draw light rays from UFO
  noFill();
  stroke(255, 255, 200, 100);
  strokeWeight(1);
  for (let i = 0; i < 8; i++) {
    let angle = map(i, 0, 8, 0, TWO_PI);
    let x1 = UFO.x + cos(angle) * UFO.radius * 1.5;
    let y1 = UFO.y + sin(angle) * UFO.radius * 1.5;
    let x2 = UFO.x + cos(angle) * UFO.radius * 3;
    let y2 = UFO.y + sin(angle) * UFO.radius * 3;
    line(x1, y1, x2, y2);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
