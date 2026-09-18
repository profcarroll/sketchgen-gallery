let buildings = [];
let groundTexture;
let time = 0;

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
    buildings.push({ x, y: h / 2, z, w, h, d });
  }

  // Create a texture for the ground
  groundTexture = createGraphics(400, 400);
  groundTexture.background(100);
  for (let i = 0; i < 5000; i++) {
    let x = random(groundTexture.width);
    let y = random(groundTexture.height);
    let s = random(1, 3);
    groundTexture.noStroke();
    groundTexture.fill(50, 50, 50, 100);
    groundTexture.ellipse(x, y, s, s);
  }
}

function draw() {
  background(100, 150, 255);

  // Animate time
  time += 0.005;

  // Sun position (simulated)
  let sunAngle = time % TWO_PI;
  let sunX = cos(sunAngle) * 400;
  let sunZ = sin(sunAngle) * 400;
  let sunY = 200;

  // Ambient light
  ambientLight(50);

  // Directional light (sun)
  directionalLight(255, 255, 255, sunX, sunY, sunZ);

  // Draw ground with texture
  push();
  translate(0, 300, 0);
  rotateX(HALF_PI);
  texture(groundTexture);
  plane(800, 600);
  pop();

  // Draw buildings and shadows
  for (let b of buildings) {
    push();
    translate(b.x, b.y, b.z);

    // Building
    fill(150, 150, 150);
    box(b.w, b.h, b.d);

    // Shadow projection
    let shadowX = b.x - sunX * 0.05;
    let shadowZ = b.z - sunZ * 0.05;
    let shadowY = 300;

    push();
    translate(shadowX, shadowY, shadowZ);
    rotateX(HALF_PI);
    fill(0, 0, 0, 100);
    plane(b.w, b.d);
    pop();

    pop();
  }

  // Simulate day/night cycle
  let lightIntensity = map(sin(time), -1, 1, 50, 255);
  ambientLight(lightIntensity);
}
