let cameraAngle = 0;
let time = 0;

function setup() {
  createCanvas(600, 600, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
}

function draw() {
  background(220, 5, 95);
  
  // Slowly rotate the camera
  cameraAngle += 0.002;
  let cx = 0 + 200 * cos(cameraAngle);
  let cy = 0 + 200 * sin(cameraAngle);
  camera(cx, cy, 300, 0, 0, 0, 0, 1, 0);
  
  // Draw the green knoll
  push();
  translate(0, 150, 0);
  rotateX(PI / 2);
  noStroke();
  fill(120, 40, 60);
  plane(800, 800);
  pop();
  
  // Draw trees
  for (let i = 0; i < 50; i++) {
    push();
    let angle = random(TWO_PI);
    let dist = random(100, 300);
    let x = dist * cos(angle);
    let z = dist * sin(angle);
    translate(x, 150, z);
    rotateY(random(TWO_PI));
    fill(100, 50, 40);
    noStroke();
    cone(20, 60);
    pop();
  }
  
  // Draw the concrete structure
  push();
  translate(0, -100, 0);
  rotateX(PI / 4);
  rotateY(time * 0.001);
  
  // Create a series of intersecting slabs
  for (let i = 0; i < 8; i++) {
    push();
    let angle = i * TWO_PI / 8;
    let x = 50 * cos(angle);
    let z = 50 * sin(angle);
    translate(x, 0, z);
    rotateY(angle);
    rotateX(PI / 2);
    fill(30, 10, 30);
    noStroke();
    box(60, 400, 20);
    pop();
  }
  
  // Central slab
  fill(25, 15, 35);
  box(100, 200, 100);
  pop();
  
  time++;
}
