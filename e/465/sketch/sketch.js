let monolith;
let nebulaParticles = [];
let rotationSpeed = 0.002;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  // Create the monolith as a tall, thin rectangular prism
  monolith = {
    width: 100,
    height: 600,
    depth: 100,
    x: 0,
    y: 0,
    z: 0,
    rotationX: 0,
    rotationY: 0
  };

  // Generate stellar dust particles
  for (let i = 0; i < 2000; i++) {
    nebulaParticles.push({
      x: random(-width * 2, width * 2),
      y: random(-height * 2, height * 2),
      z: random(-1000, 1000),
      size: random(0.5, 3),
      speed: random(0.05, 0.2),
      color: color(random(50, 150), random(80, 200), random(200, 255), 150)
    });
  }
}

function draw() {
  background(0);
  // Slowly rotate the monolith
  monolith.rotationY += rotationSpeed;
  monolith.rotationX += rotationSpeed * 0.3;

  // Draw nebula particles
  push();
  translate(0, 0, -500);
  for (let p of nebulaParticles) {
    fill(p.color);
    noStroke();
    ellipse(p.x, p.y, p.size);
    // Update particle positions
    p.x += sin(frameCount * 0.01 + p.z * 0.001) * p.speed;
    p.y += cos(frameCount * 0.01 + p.z * 0.001) * p.speed;
    // Reset if out of bounds
    if (abs(p.x) > width * 2 || abs(p.y) > height * 2) {
      p.x = random(-width * 2, width * 2);
      p.y = random(-height * 2, height * 2);
    }
  }
  pop();

  // Draw the monolith
  push();
  translate(monolith.x, monolith.y, monolith.z);
  rotateX(monolith.rotationX);
  rotateY(monolith.rotationY);

  // Draw the black monolith with subtle highlights
  noStroke();
  fill(0);
  box(monolith.width, monolith.height, monolith.depth);

  // Add subtle highlight on one side
  fill(30);
  beginShape();
  vertex(-monolith.width/2, -monolith.height/2, monolith.depth/2);
  vertex(monolith.width/2, -monolith.height/2, monolith.depth/2);
  vertex(monolith.width/2, monolith.height/2, monolith.depth/2);
  vertex(-monolith.width/2, monolith.height/2, monolith.depth/2);
  endShape(CLOSE);

  pop();
}
