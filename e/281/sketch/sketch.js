let flowers = [];
let leaves = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Create initial flowers
  for (let i = 0; i < 15; i++) {
    flowers.push({
      x: random(width),
      y: random(height * 0.6, height * 0.8),
      size: random(30, 60),
      petals: [],
      seedPods: [],
      age: 0,
      maxAge: random(200, 400)
    });
  }
  // Create leaves
  for (let i = 0; i < 50; i++) {
    leaves.push({
      x: random(width),
      y: random(height * 0.3, height * 0.9),
      size: random(10, 30),
      speed: random(0.2, 0.8),
      sway: random(TWO_PI),
      swaySpeed: random(0.01, 0.03)
    });
  }
}

function draw() {
  background(135, 206, 235); // Sky blue

  // Draw ground
  fill(34, 139, 34);
  noStroke();
  rect(0, height * 0.8, width, height * 0.2);

  // Update and draw flowers
  for (let flower of flowers) {
    updateFlower(flower);
    drawFlower(flower);
  }

  // Update and draw leaves
  for (let leaf of leaves) {
    updateLeaf(leaf);
    drawLeaf(leaf);
  }
}

function updateFlower(flower) {
  flower.age++;
  if (flower.age > flower.maxAge) {
    flower.age = 0;
    flower.size = random(30, 60);
    flower.petals = [];
    flower.seedPods = [];
  }

  // Grow petals
  if (flower.petals.length < 8 && flower.age < flower.maxAge * 0.4) {
    flower.petals.push({
      angle: flower.petals.length * TWO_PI / 8,
      size: random(5, 15),
      life: 0
    });
  }

  // Petal shedding
  if (flower.age > flower.maxAge * 0.3 && flower.petals.length > 0) {
    let shed = flower.petals.splice(0, 1);
    if (shed.length > 0) {
      flower.seedPods.push({
        x: flower.x,
        y: flower.y,
        size: random(5, 10),
        life: 0
      });
    }
  }

  // Update seed pods
  for (let pod of flower.seedPods) {
    pod.life++;
    if (pod.life > 200) {
      flower.seedPods = flower.seedPods.filter(p => p !== pod);
    }
  }
}

function drawFlower(flower) {
  push();
  translate(flower.x, flower.y);

  // Draw stem
  stroke(34, 139, 34);
  strokeWeight(2);
  line(0, 0, 0, -flower.size * 0.8);

  // Draw petals
  noStroke();
  fill(255, 105, 180); // Pink
  for (let petal of flower.petals) {
    let a = petal.angle + sin(frameCount * 0.02 + flower.age * 0.01);
    let x = cos(a) * petal.size;
    let y = sin(a) * petal.size;
    ellipse(x, y, petal.size, petal.size * 0.6);
  }

  // Draw seed pods
  fill(255, 215, 0); // Gold
  for (let pod of flower.seedPods) {
    ellipse(pod.x - flower.x, pod.y - flower.y, pod.size, pod.size * 0.7);
  }

  pop();
}

function updateLeaf(leaf) {
  leaf.sway += leaf.swaySpeed;
  leaf.x += sin(leaf.sway) * leaf.speed;
  if (leaf.x < -50) leaf.x = width + 50;
  if (leaf.x > width + 50) leaf.x = -50;
}

function drawLeaf(leaf) {
  push();
  translate(leaf.x, leaf.y);
  rotate(sin(frameCount * 0.01 + leaf.sway) * 0.1);

  noStroke();
  fill(34, 139, 34); // Green
  ellipse(0, 0, leaf.size, leaf.size * 0.6);

  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
