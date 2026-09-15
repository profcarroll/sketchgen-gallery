let character;
let buildings = [];
let scorchMarks = [];
let pavementTexture;

function setup() {
  createCanvas(800, 600);
  character = {
    x: width / 2,
    y: height / 2,
    size: 20,
    speed: 3
  };

  // Generate buildings
  for (let i = 0; i < 50; i++) {
    buildings.push({
      x: random(width),
      y: random(height),
      w: random(40, 100),
      h: random(60, 150),
      color: color(random(100, 200), random(100, 200), random(100, 200))
    });
  }

  // Create pavement texture
  pavementTexture = createGraphics(width, height);
  pavementTexture.background(150);
  pavementTexture.stroke(100);
  for (let i = 0; i < 1000; i++) {
    let x = random(width);
    let y = random(height);
    let w = random(2, 6);
    let h = random(2, 6);
    pavementTexture.rect(x, y, w, h);
  }
}

function draw() {
  background(100, 150, 200); // Sky

  // Draw pavement
  image(pavementTexture, 0, 0);

  // Draw buildings
  for (let building of buildings) {
    fill(building.color);
    noStroke();
    rect(building.x, building.y, building.w, building.h);
    // Building windows
    fill(255, 255, 0, 180);
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 6; j++) {
        if (random() > 0.3) {
          rect(building.x + 5 + i * (building.w - 10) / 3,
               building.y + 5 + j * (building.h - 10) / 5,
               (building.w - 10) / 4, (building.h - 10) / 6);
        }
      }
    }
  }

  // Draw character
  fill(255);
  noStroke();
  ellipse(character.x, character.y, character.size);

  // Handle movement
  if (keyIsPressed) {
    if (keyCode === LEFT_ARROW) character.x -= character.speed;
    if (keyCode === RIGHT_ARROW) character.x += character.speed;
    if (keyCode === UP_ARROW) character.y -= character.speed;
    if (keyCode === DOWN_ARROW) character.y += character.speed;
  }

  // Keep character in bounds
  character.x = constrain(character.x, 0, width);
  character.y = constrain(character.y, 0, height);

  // Attack with spacebar
  if (keyIsPressed && key === ' ') {
    let markX = character.x;
    let markY = character.y;
    scorchMarks.push({ x: markX, y: markY, size: random(20, 50), age: 0 });
  }

  // Update and draw scorch marks
  for (let i = scorchMarks.length - 1; i >= 0; i--) {
    let mark = scorchMarks[i];
    mark.age += 1;
    fill(0, 0, 0, 100 - mark.age * 2);
    noStroke();
    ellipse(mark.x, mark.y, mark.size + mark.age * 0.5);

    if (mark.age > 50) {
      scorchMarks.splice(i, 1);
    }
  }

  // Animate the character
  character.x += sin(frameCount * 0.02) * 0.5;
  character.y += cos(frameCount * 0.03) * 0.5;
}
