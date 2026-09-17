let buildings = [];
let time = 0;
let sunAngle = 0;

function setup() {
  createCanvas(800, 600, WEBGL);
  noStroke();

  // Create a grid of buildings
  for (let x = -300; x < 300; x += 60) {
    for (let z = -300; z < 300; z += 60) {
      if (random() > 0.3) { // Randomly skip some spots
        let height = random(50, 200);
        buildings.push({ x, z, height });
      }
    }
  }

  // Create ground
  let ground = [];
  for (let i = 0; i < 1000; i++) {
    ground.push({
      x: random(-400, 400),
      y: 0,
      z: random(-400, 400)
    });
  }
}

function draw() {
  background(135, 206, 235); // Sky blue

  time += 0.005;
  sunAngle = (time % 1) * TWO_PI;

  // Simulate day/night cycle
  let sunX = cos(sunAngle) * 300;
  let sunY = sin(sunAngle) * 300;
  let skyColor = lerpColor(color(135, 206, 235), color(0, 0, 100), map(sunY, -300, 300, 0, 1));

  // Draw sky
  background(skyColor);

  // Draw sun
  push();
  translate(sunX, sunY, 0);
  fill(255, 255, 0);
  sphere(20);
  pop();

  // Draw buildings and shadows
  for (let building of buildings) {
    let shadowLength = map(building.height, 50, 200, 30, 100);
    let shadowX = sunX * (building.height / 200);
    let shadowZ = sunY * (building.height / 200);

    // Draw building
    push();
    translate(building.x, 0, building.z);
    rotateX(PI/2);
    fill(100, 100, 150);
    box(40, 40, building.height);
    pop();

    // Draw shadow
    push();
    translate(building.x + shadowX, 0, building.z + shadowZ);
    rotateX(PI/2);
    fill(0, 0, 0, 100);
    box(shadowLength, 40, 5);
    pop();
  }

  // Draw ground
  push();
  translate(0, 0, 0);
  rotateX(PI/2);
  fill(100, 80, 50);
  plane(800, 800);
  pop();

  // Add some dynamic texture to the ground
  for (let i = 0; i < 100; i++) {
    let x = map(i, 0, 100, -400, 400) + sin(time * 2 + i) * 10;
    let z = map(i, 0, 100, -400, 400) + cos(time * 2 + i) * 10;
    push();
    translate(x, 0, z);
    rotateX(PI/2);
    fill(150, 130, 100);
    plane(5, 5);
    pop();
  }
}
