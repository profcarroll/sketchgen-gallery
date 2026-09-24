let pistons = [];
let rods = [];
let gears = [];
let sparkParticles = [];
let time = 0;
let gearAngle = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create pistons
  for (let i = 0; i < 4; i++) {
    pistons.push({
      x: -200 + i * 100,
      y: 0,
      z: 0,
      height: 80,
      speed: 0.02 + i * 0.005,
      offset: i * PI / 2
    });
  }

  // Create connecting rods
  for (let i = 0; i < 4; i++) {
    rods.push({
      x: pistons[i].x,
      y: pistons[i].y,
      z: pistons[i].z,
      length: 60,
      angle: 0
    });
  }

  // Create gears
  for (let i = 0; i < 3; i++) {
    gears.push({
      x: -150 + i * 100,
      y: 0,
      z: 0,
      radius: 30,
      rotation: 0,
      speed: 0.01 + i * 0.005
    });
  }
}

function draw() {
  background(220, 20, 90);

  // Update time
  time += 0.02;
  gearAngle += 0.01;

  // Draw engine block
  push();
  translate(0, 0, -100);
  rotateX(PI/2);
  fill(50, 30, 80);
  noStroke();
  cylinder(200, 8);
  pop();

  // Update and draw pistons
  for (let i = 0; i < pistons.length; i++) {
    let piston = pistons[i];
    
    // Piston movement with spark effect
    let pos = sin(time * piston.speed + piston.offset) * 20;
    piston.y = pos;
    
    // Spark ignition effect
    if (frameCount % 30 === 0 && i === 0) {
      for (let j = 0; j < 10; j++) {
        sparkParticles.push({
          x: piston.x + random(-5, 5),
          y: piston.y - 40,
          z: piston.z,
          life: 255,
          speedX: random(-2, 2),
          speedY: random(-2, 2)
        });
      }
    }

    // Draw piston
    push();
    translate(piston.x, piston.y, piston.z);
    fill(100, 70, 90);
    noStroke();
    box(20, piston.height, 20);
    
    // Piston head
    translate(0, -piston.height/2, 0);
    fill(80, 60, 80);
    sphere(15);
    pop();

    // Draw connecting rod
    let rod = rods[i];
    push();
    translate(rod.x, rod.y, rod.z);
    rotateX(PI/2);
    fill(30, 40, 70);
    noStroke();
    cylinder(10, 8);
    pop();
  }

  // Draw gears
  for (let i = 0; i < gears.length; i++) {
    let gear = gears[i];
    gear.rotation += gear.speed;
    
    push();
    translate(gear.x, gear.y, gear.z);
    rotateZ(gear.rotation);
    
    // Gear teeth
    fill(20, 50, 80);
    noStroke();
    cylinder(gear.radius, 16);
    
    // Gear inner circle
    fill(40, 30, 70);
    cylinder(gear.radius * 0.5, 16);
    pop();
  }

  // Draw spark particles
  for (let i = sparkParticles.length - 1; i >= 0; i--) {
    let p = sparkParticles[i];
    push();
    translate(p.x, p.y, p.z);
    
    fill(60, 100, 100, p.life / 255);
    noStroke();
    sphere(3);
    
    p.x += p.speedX;
    p.y += p.speedY;
    p.life -= 5;
    
    if (p.life <= 0) {
      sparkParticles.splice(i, 1);
    }
    pop();
  }

  // Draw crankshaft
  push();
  translate(0, 0, -20);
  rotateX(PI/2);
  fill(30, 40, 80);
  noStroke();
  cylinder(5, 8);
  pop();

  // Draw transaxle housing
  push();
  translate(-100, 0, -80);
  fill(60, 40, 70);
  noStroke();
  box(200, 20, 40);
  pop();

  // Draw mechanical linkage
  for (let i = 0; i < 4; i++) {
    let piston = pistons[i];
    let rod = rods[i];
    
    push();
    stroke(50, 30, 70);
    strokeWeight(2);
    line(piston.x, piston.y - 40, piston.z, rod.x, rod.y, rod.z);
    pop();
  }
}
