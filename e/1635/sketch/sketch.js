let gears = [];
let ropes = [];
let weights = [];
let waterRivulets = [];
let wateringCan;
let flower;
let waterDrops = [];
let canTipAngle = 0;
let canTipping = false;
let waterFlowing = false;
let flowerWatered = false;

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
  if (canTipping) {
    canTipAngle += 0.03;
    if (canTipAngle > PI / 4) {
      canTipAngle = PI / 4;
    }
    wateringCan.angle = canTipAngle;
    
    // Start water flow after tipping
    if (!waterFlowing && canTipAngle > PI / 12) {
      waterFlowing = true;
      
      // Create initial rivulets
      for (let i = 0; i < 5; i++) {
        waterRivulets.push({
          x1: width / 2,
          y1: height / 2 + 150,
          x2: width / 2 - 20 + random(40),
          y2: height / 2 + 200 + random(50)
        });
      }
    }
    
    // Add more drops as can tips
    if (canTipAngle > PI / 8) {
      waterDrops.push({
        x: width / 2 - 100,
        y: height / 2 + 150,
        size: random(2, 6),
        speed: random(1, 3),
        angle: random(-0.5, 0.5)
      });
    }
  }

  // Draw water drops
  for (let i = waterDrops.length - 1; i >= 0; i--) {
    let drop = waterDrops[i];
    drop.y += drop.speed;
    drop.x += drop.angle * 2;
    
    fill(100, 150, 255);
    noStroke();
    ellipse(drop.x, drop.y, drop.size);
    
    // Remove drops that go off screen
    if (drop.y > height) {
      waterDrops.splice(i, 1);
    }
  }

  // Draw rivulets of water
  for (let i = waterRivulets.length - 1; i >= 0; i--) {
    let r = waterRivulets[i];
    stroke(0, 100, 255);
    strokeWeight(1);
    line(r.x1, r.y1, r.x2, r.y2);
    
    // Animate the rivulets
    r.x1 += random(-0.5, 0.5);
    r.x2 += random(-0.5, 0.5);
    r.y1 += 0.5;
    r.y2 += 0.5;
    
    // Remove rivulets that go off screen
    if (r.y1 > height || r.y2 > height) {
      waterRivulets.splice(i, 1);
    }
  }

  // Draw flower
  fill(255);
  stroke(0);
  strokeWeight(1);
  circle(flower.x, flower.y, flower.size);

  // Draw watered indicator
  if (flowerWatered) {
    fill(0, 200, 255);
    noStroke();
    ellipse(flower.x - 10, flower.y + 10, 5);
    ellipse(flower.x + 10, flower.y - 10, 5);
  }

  // Trigger mechanism after initial delay
  if (frameCount > 120 && !canTipping) {
    canTipping = true;
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
