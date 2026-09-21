let shredder, debris = [];
let steamParticles = [];
let sparks = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Initialize shredder with gears and plates
  shredder = {
    x: width / 2,
    y: height / 2,
    width: 300,
    height: 200,
    gears: [],
    plates: []
  };

  // Create gears
  for (let i = 0; i < 5; i++) {
    shredder.gears.push({
      x: shredder.x - 100 + i * 50,
      y: shredder.y,
      radius: 20 + i * 5,
      rotation: i * 0.5,
      speed: 0.02 + i * 0.01
    });
  }

  // Create plates
  for (let i = 0; i < 3; i++) {
    shredder.plates.push({
      x: shredder.x - 80 + i * 60,
      y: shredder.y - 40,
      width: 20,
      height: 100
    });
  }

  // Initialize debris particles
  for (let i = 0; i < 500; i++) {
    debris.push({
      x: shredder.x,
      y: shredder.y - 100,
      size: random(2, 8),
      speedX: random(-3, 3),
      speedY: random(-5, -1),
      life: 255
    });
  }

  // Initialize steam particles
  for (let i = 0; i < 200; i++) {
    steamParticles.push({
      x: shredder.x,
      y: shredder.y - 100,
      size: random(1, 4),
      speedX: random(-1, 1),
      speedY: random(-3, -0.5),
      life: random(100, 200)
    });
  }

  // Initialize sparks
  for (let i = 0; i < 300; i++) {
    sparks.push({
      x: shredder.x,
      y: shredder.y - 100,
      size: random(1, 3),
      speedX: random(-5, 5),
      speedY: random(-5, -1),
      life: random(20, 60)
    });
  }
}

function draw() {
  background(40);

  // Draw book stack
  fill(139, 69, 19);
  rect(width / 2 - 120, height / 2 - 150, 240, 30);

  // Draw shredder body
  fill(80);
  rect(shredder.x - shredder.width / 2, shredder.y - shredder.height / 2,
       shredder.width, shredder.height);

  // Draw gears
  for (let gear of shredder.gears) {
    gear.rotation += gear.speed;
    push();
    translate(gear.x, gear.y);
    rotate(gear.rotation);
    fill(100);
    ellipse(0, 0, gear.radius * 2);
    
    // Gear teeth
    for (let i = 0; i < 12; i++) {
      let angle = TWO_PI / 12 * i;
      let x = cos(angle) * gear.radius;
      let y = sin(angle) * gear.radius;
      fill(150);
      ellipse(x, y, 3, 8);
    }
    pop();
  }

  // Draw plates
  for (let plate of shredder.plates) {
    fill(120);
    rect(plate.x - plate.width / 2, plate.y - plate.height / 2,
         plate.width, plate.height);
  }

  // Update and draw debris
  for (let i = debris.length - 1; i >= 0; i--) {
    let d = debris[i];
    d.x += d.speedX;
    d.y += d.speedY;
    d.life -= 2;

    if (d.life <= 0) {
      debris.splice(i, 1);
      continue;
    }

    fill(150, 120, 80, d.life);
    noStroke();
    ellipse(d.x, d.y, d.size);
  }

  // Update and draw steam
  for (let i = steamParticles.length - 1; i >= 0; i--) {
    let s = steamParticles[i];
    s.x += s.speedX;
    s.y += s.speedY;
    s.life -= 1;

    if (s.life <= 0) {
      steamParticles.splice(i, 1);
      continue;
    }

    fill(200, 200, 200, s.life);
    noStroke();
    ellipse(s.x, s.y, s.size);
  }

  // Update and draw sparks
  for (let i = sparks.length - 1; i >= 0; i--) {
    let sp = sparks[i];
    sp.x += sp.speedX;
    sp.y += sp.speedY;
    sp.life -= 3;

    if (sp.life <= 0) {
      sparks.splice(i, 1);
      continue;
    }

    fill(255, 150, 0, sp.life);
    noStroke();
    ellipse(sp.x, sp.y, sp.size);
  }

  // Generate new debris from book
  if (frameCount % 3 === 0) {
    debris.push({
      x: shredder.x,
      y: shredder.y - 100,
      size: random(2, 8),
      speedX: random(-3, 3),
      speedY: random(-5, -1),
      life: 255
    });
  }

  // Generate new steam particles
  if (frameCount % 2 === 0) {
    steamParticles.push({
      x: shredder.x,
      y: shredder.y - 100,
      size: random(1, 4),
      speedX: random(-1, 1),
      speedY: random(-3, -0.5),
      life: random(100, 200)
    });
  }

  // Generate new sparks
  if (frameCount % 4 === 0) {
    sparks.push({
      x: shredder.x,
      y: shredder.y - 100,
      size: random(1, 3),
      speedX: random(-5, 5),
      speedY: random(-5, -1),
      life: random(20, 60)
    });
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
