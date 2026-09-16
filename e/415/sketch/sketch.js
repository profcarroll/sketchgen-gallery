let monolith;
let stars = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  frameRate(30);

  // Create the monolith structure
  monolith = createMonolith();

  // Generate starfield
  for (let i = 0; i < 5000; i++) {
    stars.push({
      x: random(-width * 2, width * 2),
      y: random(-height * 2, height * 2),
      z: random(-1000, -100),
      size: random(0.5, 2)
    });
  }
}

function draw() {
  background(0);

  // Slow rotation of the monolith
  let rot = millis() / 5000;
  
  push();
  rotateY(rot);
  rotateX(sin(rot * 0.5) * 0.1);
  rotateZ(cos(rot * 0.3) * 0.1);
  drawMonolith();
  pop();

  // Draw stars
  drawStars();
}

function createMonolith() {
  // Create a geometric monolith using basic shapes
  let geometry = [];
  
  // Main structure - a tall, thin rectangular prism
  for (let i = 0; i < 50; i++) {
    let x = random(-20, 20);
    let y = random(-100, 100);
    let z = random(-50, 50);
    geometry.push({x, y, z});
  }
  
  return geometry;
}

function drawMonolith() {
  // Draw the monolith with metallic appearance
  noStroke();
  fill(30, 30, 40); // Dark blue-gray base color
  
  // Draw main structure as a series of points for a clean look
  beginShape(POINTS);
  for (let point of monolith) {
    vertex(point.x, point.y, point.z);
  }
  endShape();
  
  // Add some silver highlights
  fill(150, 150, 170, 150);
  for (let i = 0; i < 20; i++) {
    let x = random(-30, 30);
    let y = random(-100, 100);
    let z = random(-50, 50);
    sphere(2, 4, 4);
  }
}

function drawStars() {
  // Draw the starfield
  noStroke();
  fill(255);
  
  beginShape(POINTS);
  for (let star of stars) {
    vertex(star.x, star.y, star.z);
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
