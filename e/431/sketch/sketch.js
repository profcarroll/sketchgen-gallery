// sketch.js
let pistons = [];
let cylinders = [];
let gears = [];
let spark;
let transaxle;

function setup() {
  createCanvas(800, 600, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create cylinders
  for (let i = 0; i < 4; i++) {
    cylinders.push({
      x: -250 + i * 150,
      y: 0,
      z: 0,
      width: 60,
      height: 200
    });
  }

  // Create pistons
  for (let i = 0; i < 4; i++) {
    pistons.push({
      x: -250 + i * 150,
      y: -100,
      z: 0,
      width: 50,
      height: 80,
      speed: random(0.01, 0.03),
      direction: 1
    });
  }

  // Create gears
  for (let i = 0; i < 3; i++) {
    gears.push({
      x: -200 + i * 150,
      y: 150,
      z: 0,
      radius: 30,
      rotation: 0,
      speed: random(0.02, 0.05)
    });
  }

  // Create transaxle
  transaxle = {
    x: 0,
    y: 150,
    z: 0,
    width: 200,
    height: 40
  };

  // Spark effect
  spark = {
    x: 0,
    y: -100,
    z: 0,
    size: 0,
    maxSize: 30,
    active: false
  };
}

function draw() {
  background(20, 10, 10);

  // Update spark
  if (spark.active) {
    spark.size += 2;
    if (spark.size >= spark.maxSize) {
      spark.active = false;
      spark.size = 0;
    }
  }

  // Update pistons
  for (let i = 0; i < pistons.length; i++) {
    let piston = pistons[i];
    piston.y += piston.direction * piston.speed * 100;

    if (piston.y > 50) {
      piston.direction = -1;
      spark.active = true;
      spark.x = piston.x;
      spark.y = piston.y;
    } else if (piston.y < -100) {
      piston.direction = 1;
    }
  }

  // Update gears
  for (let i = 0; i < gears.length; i++) {
    gears[i].rotation += gears[i].speed;
  }

  // Draw cylinders
  for (let i = 0; i < cylinders.length; i++) {
    push();
    translate(cylinders[i].x, cylinders[i].y, cylinders[i].z);
    noStroke();
    fill(30, 20, 30);
    cylinder(cylinders[i].width, cylinders[i].height);
    pop();
  }

  // Draw pistons
  for (let i = 0; i < pistons.length; i++) {
    let piston = pistons[i];
    push();
    translate(piston.x, piston.y, piston.z);
    noStroke();
    fill(50, 30, 40);
    box(piston.width, piston.height, 20);
    pop();
  }

  // Draw transaxle
  push();
  translate(transaxle.x, transaxle.y, transaxle.z);
  noStroke();
  fill(20, 50, 60);
  box(transaxle.width, transaxle.height, 30);
  pop();

  // Draw gears
  for (let i = 0; i < gears.length; i++) {
    let gear = gears[i];
    push();
    translate(gear.x, gear.y, gear.z);
    rotateZ(gear.rotation);
    noStroke();
    fill(25, 40, 50);
    sphere(gear.radius);

    // Gear teeth
    for (let j = 0; j < 12; j++) {
      let angle = TWO_PI * j / 12;
      let x = cos(angle) * gear.radius;
      let y = sin(angle) * gear.radius;
      push();
      translate(x, y, 0);
      rotateZ(angle);
      fill(30, 50, 60);
      box(5, 10, 5);
      pop();
    }
    pop();
  }

  // Draw spark
  if (spark.active) {
    push();
    translate(spark.x, spark.y, spark.z);
    noStroke();
    fill(60, 100, 100, 0.7);
    sphere(spark.size);
    pop();
  }
}
