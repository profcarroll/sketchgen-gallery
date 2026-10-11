let shredder, debris = [];
let steamParticles = [];
let sparks = [];
let vortexParticles = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  
  // Initialize shredder with gears and plates
  shredder = {
    x: 0,
    y: 0,
    z: 0,
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
      z: random(-50, 50),
      size: random(2, 8),
      speedX: random(-3, 3),
      speedY: random(-5, -1),
      speedZ: random(-2, 2),
      life: 255
    });
  }

  // Initialize steam particles
  for (let i = 0; i < 200; i++) {
    steamParticles.push({
      x: shredder.x,
      y: shredder.y - 100,
      z: random(-50, 50),
      size: random(1, 4),
      speedX: random(-1, 1),
      speedY: random(-3, -0.5),
      speedZ: random(-1, 1),
      life: random(100, 200)
    });
  }

  // Initialize sparks
  for (let i = 0; i < 300; i++) {
    sparks.push({
      x: shredder.x,
      y: shredder.y - 100,
      z: random(-50, 50),
      size: random(1, 3),
      speedX: random(-5, 5),
      speedY: random(-5, -1),
      speedZ: random(-2, 2),
      life: random(20, 60)
    });
  }

  // Initialize vortex particles (rust colored)
  for (let i = 0; i < 1000; i++) {
    vortexParticles.push({
      x: 0,
      y: 0,
      z: 0,
      size: random(0.5, 3),
      speedX: random(-0.5, 0.5),
      speedY: random(-0.2, 0.2),
      speedZ: random(-0.5, 0.5),
      life: random(100, 300),
      angle: random(TWO_PI),
      radius: random(50, 200)
    });
  }
}

function draw() {
  background(20);
  // Set up camera
  perspective(PI/3, width/height, 0.1, 1000);

  // Camera position
  let time = millis() * 0.0005;
  let camX = sin(time) * 400;
  let camY = cos(time * 0.7) * 200;
  let camZ = cos(time) * 300;
  camera(camX, camY, camZ, 0, 0, 0, 0, 1, 0);

  // Draw book stack
  push();
  translate(0, -150, 0);
  fill(139, 69, 19);
  box(240, 30, 20);
  pop();

  // Draw shredder body
  push();
  translate(shredder.x, shredder.y, shredder.z);
  fill(80);
  box(shredder.width, shredder.height, 20);
  pop();

  // Draw gears
  for (let gear of shredder.gears) {
    gear.rotation += gear.speed;
    push();
    translate(gear.x, gear.y, gear.z);
    rotateY(gear.rotation);
    fill(100);
    sphere(gear.radius, 6, 4);

    // Gear teeth
    for (let i = 0; i < 12; i++) {
      let angle = TWO_PI / 12 * i;
      let x = cos(angle) * gear.radius;
      let y = sin(angle) * gear.radius;
      fill(150);
      push();
      translate(x, y, 0);
      sphere(3, 4, 3);
      pop();
    }
    pop();
  }

  // Draw plates
  for (let plate of shredder.plates) {
    push();
    translate(plate.x, plate.y, plate.z);
    fill(120);
    box(plate.width, plate.height, 20);
    pop();
  }

  // Update and draw debris
  beginShape(POINTS);
  for (let i = debris.length - 1; i >= 0; i--) {
    let d = debris[i];
    d.x += d.speedX;
    d.y += d.speedY;
    d.z += d.speedZ;
    d.life -= 2;

    if (d.life <= 0) {
      debris.splice(i, 1);
      continue;
    }

    fill(150, 120, 80, d.life);
    vertex(d.x, d.y, d.z);
  }
  endShape();

  // Update and draw steam
  beginShape(POINTS);
  for (let i = steamParticles.length - 1; i >= 0; i--) {
    let s = steamParticles[i];
    s.x += s.speedX;
    s.y += s.speedY;
    s.z += s.speedZ;
    s.life -= 1;

    if (s.life <= 0) {
      steamParticles.splice(i, 1);
      continue;
    }

    fill(200, 200, 200, s.life);
    vertex(s.x, s.y, s.z);
  }
  endShape();

  // Update and draw sparks
  beginShape(POINTS);
  for (let i = sparks.length - 1; i >= 0; i--) {
    let sp = sparks[i];
    sp.x += sp.speedX;
    sp.y += sp.speedY;
    sp.z += sp.speedZ;
    sp.life -= 3;

    if (sp.life <= 0) {
      sparks.splice(i, 1);
      continue;
    }

    fill(255, 150, 0, sp.life);
    vertex(sp.x, sp.y, sp.z);
  }
  endShape();

  // Update and draw vortex particles (rust color)
  beginShape(POINTS);
  for (let i = vortexParticles.length - 1; i >= 0; i--) {
    let v = vortexParticles[i];
    v.x += v.speedX;
    v.y += v.speedY;
    v.z += v.speedZ;
    v.life -= 0.5;

    if (v.life <= 0) {
      // Reset particle to center with new random values
      v.x = 0;
      v.y = 0;
      v.z = 0;
      v.life = random(100, 300);
      v.angle = random(TWO_PI);
      v.radius = random(50, 200);
    } else {
      // Move in spiral pattern towards center
      v.angle += 0.02;
      v.x = cos(v.angle) * v.radius;
      v.y = sin(v.angle) * v.radius;
      v.z -= 0.1;
      v.radius *= 0.995;
    }

    // Rust color: reddish-brown
    fill(130, 40, 20, v.life);
    vertex(v.x, v.y, v.z);
  }
  endShape();

  // Generate new debris from book
  if (frameCount % 3 === 0) {
    debris.push({
      x: shredder.x,
      y: shredder.y - 100,
      z: random(-50, 50),
      size: random(2, 8),
      speedX: random(-3, 3),
      speedY: random(-5, -1),
      speedZ: random(-2, 2),
      life: 255
    });
  }

  // Generate new steam particles
  if (frameCount % 2 === 0) {
    steamParticles.push({
      x: shredder.x,
      y: shredder.y - 100,
      z: random(-50, 50),
      size: random(1, 4),
      speedX: random(-1, 1),
      speedY: random(-3, -0.5),
      speedZ: random(-1, 1),
      life: random(100, 200)
    });
  }

  // Generate new sparks
  if (frameCount % 4 === 0) {
    sparks.push({
      x: shredder.x,
      y: shredder.y - 100,
      z: random(-50, 50),
      size: random(1, 3),
      speedX: random(-5, 5),
      speedY: random(-5, -1),
      speedZ: random(-2, 2),
      life: random(20, 60)
    });
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
