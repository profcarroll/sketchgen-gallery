// sketch.js
let buildings = [];
let particles = [];
let cameraX = 0;
let cameraZ = 0;
let lightX = 0;
let lightY = 0;
let lightZ = 0;

function setup() {
  createCanvas(800, 600, WEBGL);
  noStroke();

  // Generate buildings
  for (let i = 0; i < 100; i++) {
    let x = random(-500, 500);
    let z = random(-500, 500);
    let w = random(20, 60);
    let h = random(30, 100);
    let d = random(20, 60);
    buildings.push({ x, z, w, h, d });
  }

  // Generate water runoff particles
  for (let i = 0; i < 500; i++) {
    particles.push({
      x: random(-500, 500),
      z: random(-500, 500),
      y: 0,
      size: random(1, 3)
    });
  }

  // Set up light
  lightX = 0;
  lightY = -200;
  lightZ = 300;
}

function draw() {
  background(100, 150, 200);

  // Camera movement based on key presses
  if (keyIsDown(LEFT_ARROW)) cameraX -= 2;
  if (keyIsDown(RIGHT_ARROW)) cameraX += 2;
  if (keyIsDown(UP_ARROW)) cameraZ -= 2;
  if (keyIsDown(DOWN_ARROW)) cameraZ += 2;

  // Set up camera
  camera(
    cameraX, cameraZ, 300,
    cameraX, cameraZ, 0,
    0, 1, 0
  );

  // Update light position based on time
  let time = millis() / 1000;
  lightX = sin(time) * 200;
  lightY = -200 + cos(time) * 100;
  lightZ = 300 + sin(time * 0.5) * 200;

  // Draw buildings
  for (let building of buildings) {
    push();
    translate(building.x, 0, building.z);
    fill(180, 180, 180);
    box(building.w, building.h, building.d);
    
    // Add windows
    fill(255, 255, 200);
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 4; j++) {
        if (random() > 0.3) {
          push();
          translate(
            building.w/2 - 10,
            -building.h/2 + 10 + i * 15,
            building.d/2 - 2
          );
          box(6, 8, 2);
          pop();
        }
      }
    }
    pop();
  }

  // Draw ground
  fill(100, 150, 100);
  plane(1000, 1000);

  // Draw water runoff particles
  beginShape(POINTS);
  for (let p of particles) {
    fill(150, 200, 255);
    vertex(p.x, p.y, p.z);
  }
  endShape();

  // Simulate water runoff
  for (let p of particles) {
    p.y += random(-0.5, 0.5);
    if (p.y > 10) {
      p.y = 0;
      p.x = random(-500, 500);
      p.z = random(-500, 500);
    }
  }

  // Draw dynamic shadows
  for (let building of buildings) {
    push();
    translate(building.x, 0, building.z);
    fill(0, 0, 0, 100);
    plane(building.w * 1.2, building.d * 1.2);
    pop();
  }
}
