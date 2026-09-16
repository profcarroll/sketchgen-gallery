let ships = [];
let waterEffect;

function setup() {
  createCanvas(800, 600);
  colorMode(HSB, 360, 100, 100, 1);

  // Create water effect particles
  waterEffect = [];
  for (let i = 0; i < 200; i++) {
    waterEffect.push({
      x: random(width),
      y: random(height),
      size: random(1, 3),
      speed: random(0.5, 2),
      angle: random(TWO_PI)
    });
  }

  // Create ships
  for (let i = 0; i < 8; i++) {
    ships.push({
      x: random(width),
      y: random(height),
      size: random(40, 80),
      speed: random(0.5, 1.5),
      angle: random(TWO_PI),
      rotation: random(-0.02, 0.02),
      damage: random(0.3, 0.8),
      color: {
        h: random(360),
        s: random(70, 100),
        b: random(70, 100)
      }
    });
  }

  noStroke();
}

function draw() {
  background(200, 10, 95);

  // Draw water effect
  for (let i = 0; i < waterEffect.length; i++) {
    let p = waterEffect[i];
    fill(180, 30, 85, 0.4);
    ellipse(p.x, p.y, p.size);
    p.x += cos(p.angle) * p.speed;
    p.y += sin(p.angle) * p.speed;
    if (p.x < 0 || p.x > width || p.y < 0 || p.y > height) {
      p.x = random(width);
      p.y = random(height);
    }
  }

  // Draw ships
  for (let i = 0; i < ships.length; i++) {
    let ship = ships[i];
    
    // Update position based on mouse
    let mouseOffsetX = (mouseX - width/2) * 0.001;
    let mouseOffsetY = (mouseY - height/2) * 0.001;
    ship.x += ship.speed + mouseOffsetX;
    ship.y += mouseOffsetY;
    ship.angle += ship.rotation;

    // Wrap around screen
    if (ship.x > width + 50) ship.x = -50;
    if (ship.x < -50) ship.x = width + 50;
    if (ship.y > height + 50) ship.y = -50;
    if (ship.y < -50) ship.y = height + 50;

    push();
    translate(ship.x, ship.y);
    rotate(ship.angle);

    // Draw ship body with damage effect
    fill(ship.color.h, ship.color.s, ship.color.b, 0.9);
    
    // Base shape - paper-cut style
    beginShape();
    vertex(0, -ship.size/2);
    vertex(ship.size/3, ship.size/4);
    vertex(-ship.size/3, ship.size/4);
    endShape(CLOSE);

    // Add damage details
    fill(0, 0, 0, 0.1);
    for (let j = 0; j < 5; j++) {
      let x = random(-ship.size/2, ship.size/2);
      let y = random(-ship.size/2, ship.size/2);
      let w = random(2, 8);
      let h = random(2, 8);
      ellipse(x, y, w, h);
    }

    // Add torn edges effect
    stroke(0, 0, 0, 0.3);
    strokeWeight(1);
    beginShape();
    for (let j = 0; j < 10; j++) {
      let angle = map(j, 0, 9, 0, TWO_PI);
      let r = ship.size/2 + random(-5, 5);
      let x = r * cos(angle);
      let y = r * sin(angle);
      vertex(x, y);
    }
    endShape(CLOSE);

    pop();
  }

  // Draw subtle glow effect
  drawingContext.shadowBlur = 10;
  drawingContext.shadowColor = color(255, 255, 255, 50);
  for (let i = 0; i < ships.length; i++) {
    let ship = ships[i];
    fill(ship.color.h, ship.color.s, ship.color.b, 0.3);
    ellipse(ship.x, ship.y, ship.size * 1.2);
  }
  drawingContext.shadowBlur = 0;
}
