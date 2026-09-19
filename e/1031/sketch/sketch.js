let stars = [];
let terrainPoints = [];
let cameraZ = 0;
let speed = 0.5;

function setup() {
  createCanvas(400, 400, WEBGL);
  
  // Generate stars
  for (let i = 0; i < 200; i++) {
    stars.push({
      x: random(-width, width),
      y: random(-height, height),
      z: random(-1000, -10),
      size: random(0.5, 2)
    });
  }
  
  // Generate terrain points
  for (let i = 0; i < 300; i++) {
    terrainPoints.push({
      x: random(-width * 2, width * 2),
      y: random(-100, 100),
      z: random(-500, 500)
    });
  }
}

function draw() {
  background(0);
  
  // Camera movement
  cameraZ += speed;
  translate(0, 0, -cameraZ);
  
  // Draw stars
  noStroke();
  fill(255);
  for (let star of stars) {
    push();
    translate(star.x, star.y, star.z);
    sphere(star.size);
    pop();
  }
  
  // Draw terrain
  stroke(180);
  noFill();
  beginShape();
  for (let point of terrainPoints) {
    vertex(point.x, point.y, point.z);
  }
  endShape(CLOSE);
  
  // Draw craters
  noStroke();
  fill(100);
  for (let i = 0; i < 50; i++) {
    let x = random(-width * 2, width * 2);
    let y = random(-100, 100);
    let z = random(-500, 500);
    let r = random(10, 30);
    push();
    translate(x, y, z);
    sphere(r);
    pop();
  }
  
  // Add some ridges
  stroke(120);
  noFill();
  beginShape();
  for (let i = 0; i < 100; i++) {
    let x = random(-width * 2, width * 2);
    let y = random(-50, 50);
    let z = random(-500, 500);
    vertex(x, y, z);
  }
  endShape();
}
