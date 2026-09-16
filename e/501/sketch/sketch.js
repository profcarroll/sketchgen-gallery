let drones = [];
let boats = [];
let contrails = [];
let searchlightBeams = [];

function setup() {
  createCanvas(800, 600, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create boats
  for (let i = 0; i < 20; i++) {
    boats.push({
      x: random(-width/2 + 50, width/2 - 50),
      y: random(-height/2 + 50, height/2 - 50),
      size: random(10, 30)
    });
  }

  // Create drones
  for (let i = 0; i < 8; i++) {
    drones.push({
      x: random(-width/2 + 50, width/2 - 50),
      y: random(-height/2 + 50, height/2 - 50),
      z: random(100, 300),
      vx: random(-1, 1),
      vy: random(-1, 1),
      vz: random(-1, 1),
      searchlightAngle: random(TWO_PI),
      searchlightSpeed: random(0.005, 0.02),
      targetX: random(-width/2 + 50, width/2 - 50),
      targetY: random(-height/2 + 50, height/2 - 50),
      targetZ: random(100, 300)
    });
  }
}

function draw() {
  background(0);
  noStroke();

  // Camera
  let time = millis() / 1000;
  camera(0, 0, height * 0.8, 0, 0, 0, 0, 1, 0);

  // Move drones
  for (let i = 0; i < drones.length; i++) {
    let d = drones[i];

    // Mouse interaction
    let dx = mouseX - width/2;
    let dy = mouseY - height/2;
    let mouseForce = 0.005;
    d.vx += dx * mouseForce;
    d.vy += dy * mouseForce;

    // Update position with some randomness
    d.x += d.vx;
    d.y += d.vy;
    d.z += d.vz;

    // Apply damping
    d.vx *= 0.95;
    d.vy *= 0.95;
    d.vz *= 0.95;

    // Boundary checks and random target changes
    if (abs(d.x) > width/2 - 100 || abs(d.y) > height/2 - 100 || abs(d.z) > 400) {
      d.targetX = random(-width/2 + 50, width/2 - 50);
      d.targetY = random(-height/2 + 50, height/2 - 50);
      d.targetZ = random(100, 300);
    }

    // Move towards target
    let speed = 0.02;
    d.x += (d.targetX - d.x) * speed;
    d.y += (d.targetY - d.y) * speed;
    d.z += (d.targetZ - d.z) * speed;

    // Update searchlight angle
    d.searchlightAngle += d.searchlightSpeed;

    // Draw drone body
    push();
    translate(d.x, d.y, d.z);
    fill(200, 100, 100);
    sphere(10);

    // Draw searchlight
    let lightX = sin(d.searchlightAngle) * 50;
    let lightY = cos(d.searchlightAngle) * 50;
    fill(255, 255, 255, 0.3);
    ellipse(lightX, lightY, 100, 20);

    // Draw contrail
    if (frameCount % 3 === 0) {
      contrails.push({
        x: d.x,
        y: d.y,
        z: d.z,
        life: 1.0
      });
    }

    pop();
  }

  // Update and draw contrails
  for (let i = contrails.length - 1; i >= 0; i--) {
    let c = contrails[i];
    c.life -= 0.02;
    if (c.life <= 0) {
      contrails.splice(i, 1);
      continue;
    }

    push();
    translate(c.x, c.y, c.z);
    fill(255, 255, 255, c.life * 100);
    sphere(3);
    pop();
  }

  // Draw boats
  for (let i = 0; i < boats.length; i++) {
    let b = boats[i];
    push();
    translate(b.x, b.y, -200); // Fixed depth in harbor
    fill(150, 50, 30);
    ellipse(0, 0, b.size, b.size/2);
    pop();
  }

  // Draw harbor water
  push();
  translate(0, 0, -250);
  fill(0, 20, 40);
  plane(width, height);
  pop();

  // Draw sky
  for (let i = 0; i < 200; i++) {
    let x = random(-width/2, width/2);
    let y = random(-height/2, height/2);
    let z = random(100, 500);
    push();
    translate(x, y, z);
    fill(200, 20, 80, 0.3);
    sphere(2);
    pop();
  }
}

function mousePressed() {
  // Change drone targets on click
  for (let i = 0; i < drones.length; i++) {
    let d = drones[i];
    d.targetX = random(-width/2 + 50, width/2 - 50);
    d.targetY = random(-height/2 + 50, height/2 - 50);
    d.targetZ = random(100, 300);
  }
}

function mouseDragged() {
  // Adjust drones based on drag
  for (let i = 0; i < drones.length; i++) {
    let d = drones[i];
    d.vx += (pmouseX - mouseX) * 0.01;
    d.vy += (pmouseY - mouseY) * 0.01;
  }
}
