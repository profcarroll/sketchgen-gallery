let sandGrains = [];
let shells = [];

function setup() {
  createCanvas(800, 600);
  noLoop();

  // Generate sand grains
  for (let i = 0; i < 5000; i++) {
    let x = random(width);
    let y = random(height * 0.7, height);
    let size = random(1, 3);
    let hue = 60 + random(-5, 5); // Pale yellow
    let sat = 20 + random(10);
    let bri = 80 + random(-10, 10);
    sandGrains.push({ x, y, size, hue, sat, bri });
  }

  // Generate shells
  for (let i = 0; i < 200; i++) {
    let x = random(width);
    let y = random(height * 0.6, height);
    let size = random(8, 15);
    let hue = 30 + random(-10, 10); // Earth tones
    let sat = 30 + random(20);
    let bri = 50 + random(-15, 15);
    let shapeType = floor(random(3)); // 0: circle, 1: oval, 2: irregular
    shells.push({ x, y, size, hue, sat, bri, shapeType });
  }
}

function draw() {
  background(240);

  // Draw sand base with fine texture
  for (let grain of sandGrains) {
    fill(grain.hue, grain.sat, grain.bri);
    noStroke();
    ellipse(grain.x, grain.y, grain.size);
  }

  // Draw shells
  for (let shell of shells) {
    fill(shell.hue, shell.sat, shell.bri);
    noStroke();

    switch (shell.shapeType) {
      case 0: // Circle
        ellipse(shell.x, shell.y, shell.size);
        break;
      case 1: // Oval
        push();
        translate(shell.x, shell.y);
        rotate(random(TWO_PI));
        ellipse(0, 0, shell.size, shell.size * 0.6);
        pop();
        break;
      case 2: // Irregular shape
        beginShape();
        for (let i = 0; i < 8; i++) {
          let angle = map(i, 0, 8, 0, TWO_PI);
          let distance = shell.size * (0.7 + random(0.3));
          let x = cos(angle) * distance;
          let y = sin(angle) * distance;
          vertex(x, y);
        }
        endShape(CLOSE);
        break;
    }
  }
}
