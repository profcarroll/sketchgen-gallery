let gears = [];
let ropes = [];
let weights = [];
let fluid = [];
let wateringCan;
let flower;
let waterRivulets = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Create gears
  for (let i = 0; i < 3; i++) {
    gears.push({
      x: width / 2 + i * 150,
      y: height / 2,
      radius: 40,
      rotation: 0,
      speed: (i % 2 === 0 ? 1 : -1) * 0.02
    });
  }

  // Create ropes and weights
  for (let i = 0; i < 4; i++) {
    ropes.push({
      x1: width / 2,
      y1: height / 2 - 100,
      x2: width / 2 + i * 80,
      y2: height / 2 - 50
    });
    weights.push({
      x: width / 2 + i * 80,
      y: height / 2 - 50,
      radius: 15,
      speed: 0.5
    });
  }

  // Create fluid splash
  for (let i = 0; i < 20; i++) {
    fluid.push({
      x: width / 2 + random(-20, 20),
      y: height / 2 - 50,
      size: random(2, 6),
      speed: random(1, 3)
    });
  }

  // Watering can
  wateringCan = {
    x: width / 2 - 100,
    y: height / 2 + 100,
    tipX: width / 2 - 100,
    tipY: height / 2 + 150,
    angle: 0,
    tipping: false
  };

  // Flower
  flower = {
    x: width / 2,
    y: height / 2 + 200,
    size: 30,
    watered: false
  };
}

function draw() {
  background(150, 200, 255);

  // Update and draw gears
  for (let gear of gears) {
    gear.rotation += gear.speed;
    push();
    translate(gear.x, gear.y);
    rotate(gear.rotation);
    stroke(100);
    strokeWeight(3);
    noFill();
    circle(0, 0, gear.radius * 2);

    // Draw teeth
    for (let i = 0; i < 12; i++) {
      let angle = (TWO_PI / 12) * i;
      let x1 = cos(angle) * (gear.radius - 5);
      let y1 = sin(angle) * (gear.radius - 5);
      let x2 = cos(angle) * (gear.radius + 5);
      let y2 = sin(angle) * (gear.radius + 5);
      line(x1, y1, x2, y2);
    }
    pop();
  }

  // Update and draw ropes and weights
  for (let i = 0; i < ropes.length; i++) {
    let rope = ropes[i];
    let weight = weights[i];

    // Animate the drop
    if (weight.y < height / 2 + 50) {
      weight.y += weight.speed;
    }

    stroke(100);
    strokeWeight(2);
    line(rope.x1, rope.y1, rope.x2, rope.y2);

    fill(200);
    noStroke();
    circle(weight.x, weight.y, weight.radius * 2);
  }

  // Draw fluid splash
  for (let i = 0; i < fluid.length; i++) {
    let f = fluid[i];
    f.y -= f.speed;
    if (f.y < height / 2 - 50) {
      f.y = height / 2 - 50;
    }
    fill(100, 150, 255);
    noStroke();
    ellipse(f.x, f.y, f.size);
  }

  // Draw watering can
  push();
  translate(wateringCan.x, wateringCan.y);
  rotate(wateringCan.angle);
  stroke(100);
  strokeWeight(3);
  fill(200);
  rect(-20, -10, 40, 20); // Can body
  rect(-10, -10, 20, 5);  // Spout
  pop();

  // Tip the watering can if needed
  if (wateringCan.tipping) {
    wateringCan.angle += 0.03;
    if (wateringCan.angle > PI / 4) {
      wateringCan.angle = PI / 4;
    }
  }

  // Draw flower
  fill(255);
  stroke(0);
  strokeWeight(1);
  circle(flower.x, flower.y, flower.size);

  // Draw watered indicator
  if (flower.watered) {
    fill(0, 200, 255);
    noStroke();
    ellipse(flower.x - 10, flower.y + 10, 5);
    ellipse(flower.x + 10, flower.y - 10, 5);
  }

  // Draw rivulets of water
  for (let i = 0; i < waterRivulets.length; i++) {
    let r = waterRivulets[i];
    stroke(0, 100, 255);
    strokeWeight(1);
    line(r.x1, r.y1, r.x2, r.y2);
  }

  // Trigger mechanism after initial delay
  if (frameCount > 120) {
    wateringCan.tipping = true;
    flower.watered = true;

    // Create water rivulets
    for (let i = 0; i < 5; i++) {
      waterRivulets.push({
        x1: width / 2,
        y1: height / 2 + 200,
        x2: width / 2 - 20 + random(40),
        y2: height / 2 + 250 + random(50)
      });
    }
  }

  // Animate gears
  if (frameCount > 100) {
    for (let gear of gears) {
      gear.rotation += gear.speed;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
