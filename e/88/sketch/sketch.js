let plants = [];
let skyColor;

function setup() {
  createCanvas(windowWidth, windowHeight);
  skyColor = color(135, 206, 235); // Sky blue

  // Create initial plants
  for (let i = 0; i < 15; i++) {
    plants.push({
      x: random(width),
      y: height,
      stemHeight: random(30, 80),
      leaves: [],
      fruits: [],
      age: 0,
      swayAngle: 0,
      swaySpeed: random(0.01, 0.03)
    });
  }
}

function draw() {
  background(skyColor);

  // Draw ground
  fill(34, 139, 34); // Forest green
  rect(0, height - 20, width, 20);

  // Update and draw plants
  for (let plant of plants) {
    updatePlant(plant);
    drawPlant(plant);
  }
}

function updatePlant(plant) {
  plant.age++;

  // Grow stem
  if (plant.stemHeight < 100 && plant.age > 30) {
    plant.stemHeight += 0.2;
  }

  // Add leaves as plant grows
  if (plant.leaves.length < 5 && plant.stemHeight > 50 && plant.age % 10 === 0) {
    plant.leaves.push({
      size: random(10, 20),
      angle: random(TWO_PI),
      growth: 0,
      mature: false
    });
  }

  // Grow leaves and fruits
  for (let leaf of plant.leaves) {
    if (!leaf.mature && leaf.growth < 1) {
      leaf.growth += 0.02;
    } else {
      leaf.mature = true;
    }
  }

  // Add fruit when leaves are mature
  if (plant.fruits.length < 3 && plant.leaves.length > 0 && plant.age % 20 === 0) {
    let matureLeaf = plant.leaves.find(l => l.mature);
    if (matureLeaf) {
      plant.fruits.push({
        x: plant.x + random(-15, 15),
        y: plant.y - plant.stemHeight + random(5, 20),
        size: random(5, 10),
        stage: 0,
        growthRate: random(0.01, 0.03)
      });
    }
  }

  // Update fruit stages
  for (let fruit of plant.fruits) {
    if (fruit.stage < 3) {
      fruit.stage += fruit.growthRate;
    }
  }

  // Sway with time
  plant.swayAngle = sin(frameCount * plant.swaySpeed) * 0.1;
}

function drawPlant(plant) {
  push();

  translate(plant.x, plant.y);

  // Apply sway
  rotate(plant.swayAngle);

  // Draw stem
  stroke(101, 67, 33); // Brown
  strokeWeight(3);
  line(0, 0, 0, -plant.stemHeight);

  // Draw leaves
  for (let leaf of plant.leaves) {
    if (leaf.growth > 0) {
      fill(34, 139, 34); // Green
      noStroke();
      push();
      translate(0, -plant.stemHeight * leaf.growth);
      rotate(leaf.angle);
      ellipse(0, 0, leaf.size * leaf.growth, leaf.size * leaf.growth * 0.6);
      pop();
    }
  }

  // Draw fruits
  for (let fruit of plant.fruits) {
    if (fruit.stage > 0) {
      fill(255, 50, 50); // Red
      noStroke();
      ellipse(fruit.x, fruit.y, fruit.size * fruit.stage);
    }
  }

  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
