let marble;
let channels = [];
let gravity;
let cameraAngle = 0;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  marble = {
    pos: createVector(0, -200, 0),
    vel: createVector(0, 0, 0),
    radius: 10
  };
  
  gravity = createVector(0, 0.3, 0);
  
  // Create the funnel channels
  for (let i = 0; i < 20; i++) {
    const radius = map(i, 0, 19, 150, 20);
    const height = map(i, 0, 19, -200, 200);
    channels.push({
      radius: radius,
      height: height
    });
  }
}

function draw() {
  background(20);
  
  // Camera movement
  cameraAngle += 0.005;
  const camX = sin(cameraAngle) * 400;
  const camZ = cos(cameraAngle) * 400;
  camera(camX, 0, camZ, 0, 0, 0, 0, 1, 0);
  
  // Lighting
  pointLight(255, 255, 255, 0, -300, 0);
  ambientLight(60);
  
  // Draw channels
  noStroke();
  fill(80, 120, 200, 150);
  for (let i = 0; i < channels.length; i++) {
    const channel = channels[i];
    push();
    translate(0, channel.height, 0);
    cylinder(channel.radius, 1, 32, 1);
    pop();
  }
  
  // Update marble physics
  updateMarble();
  
  // Draw marble
  push();
  translate(marble.pos.x, marble.pos.y, marble.pos.z);
  noStroke();
  fill(255, 100, 100);
  sphere(marble.radius);
  pop();
  
  time++;
}

function updateMarble() {
  // Apply gravity
  marble.vel.add(gravity);
  
  // Update position
  marble.pos.add(marble.vel);
  
  // Simple collision with channels (approximate)
  for (let i = 0; i < channels.length; i++) {
    const channel = channels[i];
    const distance = dist(marble.pos.x, marble.pos.z, 0, 0);
    
    if (distance > channel.radius - marble.radius && 
        distance < channel.radius + marble.radius) {
      // Simple bounce
      marble.vel.mult(-0.8);
      // Adjust position to prevent sticking
      const angle = atan2(marble.pos.z, marble.pos.x);
      marble.pos.x = cos(angle) * (channel.radius - marble.radius);
      marble.pos.z = sin(angle) * (channel.radius - marble.radius);
    }
  }
  
  // Keep marble within bounds
  if (marble.pos.y > 250) {
    marble.pos.y = 250;
    marble.vel.y *= -0.8;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
