let angle = 0;
let globes = [];
let splines = [];

function setup() {
  createCanvas(600, 600, WEBGL);
  noStroke();

  // Create multiple globes with different sizes and positions
  for (let i = 0; i < 8; i++) {
    globes.push({
      radius: random(15, 30),
      distance: random(100, 250),
      speed: random(0.01, 0.03),
      angleOffset: random(TWO_PI)
    });
  }

  // Create splines (paths) that globes follow
  for (let i = 0; i < 6; i++) {
    splines.push({
      radius: random(150, 300),
      speed: random(0.005, 0.02),
      angleOffset: random(TWO_PI)
    });
  }
}

function draw() {
  background(30);
  angle += 0.005;

  // Center the scene
  translate(0, 0, -200);

  // Rotate the central cube
  rotateX(angle * 0.5);
  rotateY(angle);
  rotateZ(angle * 0.3);

  // Draw the central brass cube
  fill(180, 150, 100);
  box(60);

  // Draw globes orbiting around the central cube
  for (let i = 0; i < globes.length; i++) {
    let g = globes[i];
    let x = sin(angle * g.speed + g.angleOffset) * g.distance;
    let y = cos(angle * g.speed + g.angleOffset) * g.distance;
    let z = sin(angle * g.speed * 0.7 + g.angleOffset) * g.distance / 2;

    push();
    translate(x, y, z);
    fill(255, 100, 0, 200);
    sphere(g.radius);
    pop();
  }

  // Draw splines (orbit paths)
  for (let i = 0; i < splines.length; i++) {
    let s = splines[i];
    push();
    rotateX(angle * s.speed + s.angleOffset);
    stroke(255, 100, 0, 100);
    noFill();
    beginShape();
    for (let a = 0; a < TWO_PI; a += 0.1) {
      let x = cos(a) * s.radius;
      let y = sin(a) * s.radius;
      vertex(x, y, 0);
    }
    endShape(CLOSE);
    pop();
  }

  // Add flickering light effect
  pointLight(255, 100, 0, 0, 0, 0);
}
