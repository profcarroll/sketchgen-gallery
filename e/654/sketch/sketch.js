let spherePosition;
let sphereVelocity;
let channels = [];
let barriers = [];

function setup() {
  createCanvas(600, 600, WEBGL);
  spherePosition = createVector(0, -200, 0);
  sphereVelocity = createVector(0, 0, 0);
  
  // Create channel structure
  for (let i = 0; i < 15; i++) {
    let z = map(i, 0, 14, -300, 300);
    channels.push({
      x: 0,
      y: 0,
      z: z,
      width: 200 + sin(z * 0.01) * 50,
      height: 200 + cos(z * 0.01) * 50
    });
  }

  // Create barriers
  for (let i = 0; i < 30; i++) {
    barriers.push({
      x: random(-150, 150),
      y: random(-150, 150),
      z: random(-300, 300),
      size: random(10, 40)
    });
  }
}

function draw() {
  background(20);
  ambientLight(60);
  pointLight(255, 255, 255, 0, -200, 0);
  
  // Rotate the scene
  rotateY(frameCount * 0.005);
  rotateX(sin(frameCount * 0.003) * 0.1);
  
  // Draw channels
  for (let channel of channels) {
    push();
    translate(channel.x, channel.y, channel.z);
    noStroke();
    fill(100, 120, 180, 150);
    box(channel.width, channel.height, 20);
    pop();
  }
  
  // Draw barriers
  for (let barrier of barriers) {
    push();
    translate(barrier.x, barrier.y, barrier.z);
    noStroke();
    fill(150, 100, 100, 200);
    sphere(barrier.size);
    pop();
  }
  
  // Update and draw sphere
  updateSphere();
  drawSphere();
}

function updateSphere() {
  // Apply gravity
  sphereVelocity.y += 0.2;
  
  // Update position
  spherePosition.add(sphereVelocity);
  
  // Check collisions with channel walls
  for (let channel of channels) {
    if (spherePosition.z > channel.z - 10 && spherePosition.z < channel.z + 10) {
      if (abs(spherePosition.x) > channel.width/2 - 20) {
        sphereVelocity.x *= -0.8;
        spherePosition.x = constrain(spherePosition.x, -channel.width/2 + 20, channel.width/2 - 20);
      }
      if (abs(spherePosition.y) > channel.height/2 - 20) {
        sphereVelocity.y *= -0.8;
        spherePosition.y = constrain(spherePosition.y, -channel.height/2 + 20, channel.height/2 - 20);
      }
    }
  }
  
  // Check collisions with barriers
  for (let barrier of barriers) {
    let d = dist(spherePosition.x, spherePosition.y, spherePosition.z, barrier.x, barrier.y, barrier.z);
    if (d < barrier.size + 15) {
      let angle = atan2(spherePosition.z - barrier.z, spherePosition.x - barrier.x);
      sphereVelocity.x += cos(angle) * 0.5;
      sphereVelocity.z += sin(angle) * 0.5;
      sphereVelocity.y -= 0.5;
    }
  }
  
  // Keep sphere within bounds
  spherePosition.x = constrain(spherePosition.x, -250, 250);
  spherePosition.y = constrain(spherePosition.y, -250, 250);
  spherePosition.z = constrain(spherePosition.z, -300, 300);
}

function drawSphere() {
  push();
  translate(spherePosition.x, spherePosition.y, spherePosition.z);
  noStroke();
  fill(255, 200, 100);
  sphere(15);
  pop();
}
