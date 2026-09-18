let buildings = [];
let waterPuddles = [];
let timeOfDay = 0;
let sunPosition;

function setup() {
  createCanvas(800, 600, WEBGL);
  noStroke();

  // Generate buildings
  for (let i = 0; i < 100; i++) {
    let x = random(-400, 400);
    let z = random(-300, 300);
    let w = random(20, 60);
    let h = random(50, 200);
    let d = random(20, 60);
    buildings.push({ x, y: h/2, z, w, h, d });
  }

  // Generate puddles
  for (let i = 0; i < 100; i++) {
    let x = random(-400, 400);
    let z = random(-300, 300);
    let r = random(10, 50);
    waterPuddles.push({ x, y: 0, z, r });
  }
}

function draw() {
  background(50);

  // Update time of day
  timeOfDay += 0.002;
  if (timeOfDay > 1) timeOfDay = 0;

  // Calculate sun position
  sunPosition = createVector(
    sin(timeOfDay * TWO_PI) * 400,
    cos(timeOfDay * TWO_PI) * 300,
    0
  );

  // Draw ground
  fill(80);
  plane(1000, 1000);

  // Draw buildings
  for (let b of buildings) {
    push();
    translate(b.x, b.y, b.z);
    fill(150);
    box(b.w, b.h, b.d);
    
    // Shadows
    let shadowX = b.x - sunPosition.x * 0.2;
    let shadowZ = b.z - sunPosition.z * 0.2;
    fill(30);
    plane(b.w, b.d);
    pop();
  }

  // Draw puddles
  for (let p of waterPuddles) {
    push();
    translate(p.x, p.y, p.z);
    fill(100, 150, 255, 180);
    ellipse(0, 0, p.r * 2, p.r * 2);
    pop();
  }

  // Draw sun
  push();
  translate(sunPosition.x, sunPosition.y, sunPosition.z);
  fill(255, 255, 100);
  sphere(30);
  pop();
}
