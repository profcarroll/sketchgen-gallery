let flowers = [];
let numFlowers = 15;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);

  for (let i = 0; i < numFlowers; i++) {
    flowers.push({
      x: random(width),
      y: random(height * 0.4, height * 0.8),
      size: random(60, 100),
      petals: [],
      seedPods: [],
      stage: 0, // 0: full bloom, 1: shedding, 2: seed formation
      petalCount: floor(random(5, 10)),
      petalColors: [],
      seedColor: color(30, 80, 60),
    });
  }

  for (let flower of flowers) {
    for (let i = 0; i < flower.petalCount; i++) {
      flower.petals.push({
        angle: i * TWO_PI / flower.petalCount,
        length: flower.size * random(0.8, 1.2),
        color: color(random(150, 300), 90, 90),
        alpha: 1,
      });
    }
  }
}

function draw() {
  background(220, 10, 95);
  time += 0.005;

  for (let flower of flowers) {
    // Update flower stage
    if (time > 0.3 && flower.stage === 0) {
      flower.stage = 1;
    }
    if (time > 0.7 && flower.stage === 1) {
      flower.stage = 2;
    }

    // Draw stem
    stroke(100, 80, 40);
    strokeWeight(3);
    line(flower.x, flower.y, flower.x, flower.y + 80);

    // Draw flower head
    noStroke();
    drawFlowerHead(flower);
  }
}

function drawFlowerHead(flower) {
  push();
  translate(flower.x, flower.y);

  if (flower.stage === 0) {
    // Full bloom: vibrant petals
    for (let petal of flower.petals) {
      fill(petal.color);
      drawPetal(petal.angle, petal.length, 0.8);
    }
  } else if (flower.stage === 1) {
    // Shedding: fade outer petals
    let alpha = map(time, 0.3, 0.7, 1, 0);
    for (let i = 0; i < flower.petals.length; i++) {
      let petal = flower.petals[i];
      if (i % 2 === 0) {
        fill(red(petal.color), green(petal.color), blue(petal.color), alpha);
        drawPetal(petal.angle, petal.length, 0.8);
      } else {
        fill(100, 50, 30);
        drawPetal(petal.angle, petal.length, 0.8);
      }
    }
  } else if (flower.stage === 2) {
    // Seed formation: petals gone, center pods
    for (let i = 0; i < flower.petals.length; i++) {
      let petal = flower.petals[i];
      fill(100, 50, 30);
      drawPetal(petal.angle, petal.length, 0.8);
    }

    // Draw seed pods
    fill(flower.seedColor);
    for (let i = 0; i < 4; i++) {
      let angle = map(i, 0, 4, 0, TWO_PI);
      let x = cos(angle) * flower.size * 0.3;
      let y = sin(angle) * flower.size * 0.3;
      ellipse(x, y, flower.size * 0.2);
    }
  }

  pop();
}

function drawPetal(angle, length, widthRatio) {
  push();
  rotate(angle);
  let w = length * widthRatio;
  let h = length;
  quad(0, 0, w/2, -h, -w/2, -h, 0, 0);
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
