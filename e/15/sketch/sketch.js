let marble;
let funnel;
let gravity;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  marble = {
    x: 0,
    y: -100,
    z: 0,
    radius: 15,
    vx: 0,
    vy: 0,
    vz: 0
  };
  
  funnel = {
    radius: 200,
    height: 300,
    segments: 64,
    angle: 0
  };
  
  gravity = createVector(0, 0.5, 0);
}

function draw() {
  background(20, 30, 50);
  
  // Ambient lighting
  ambientLight(60);
  pointLight(255, 255, 255, 0, -100, 0);
  
  // Rotate the entire scene
  rotateY(frameCount * 0.005);
  
  // Draw the funnel
  drawFunnel();
  
  // Update and draw marble
  updateMarble();
  drawMarble();
}

function drawFunnel() {
  push();
  noStroke();
  fill(100, 120, 140, 180);
  
  beginShape();
  for (let i = 0; i < funnel.segments; i++) {
    const angle = map(i, 0, funnel.segments, 0, TWO_PI);
    const x = funnel.radius * cos(angle);
    const z = funnel.radius * sin(angle);
    
    // Create a curved funnel surface
    const y = map(i, 0, funnel.segments, -funnel.height/2, funnel.height/2);
    
    vertex(x, y, z);
  }
  endShape(CLOSE);
  
  pop();
}

function updateMarble() {
  // Apply gravity
  marble.vy += gravity.y;
  
  // Update position
  marble.x += marble.vx;
  marble.y += marble.vy;
  marble.z += marble.vz;
  
  // Simple collision with funnel walls (approximate)
  const distanceFromCenter = sqrt(marble.x * marble.x + marble.z * marble.z);
  if (distanceFromCenter > funnel.radius - marble.radius) {
    // Reflect velocity
    const angle = atan2(marble.z, marble.x);
    const targetX = cos(angle) * (funnel.radius - marble.radius);
    const targetZ = sin(angle) * (funnel.radius - marble.radius);
    
    marble.vx = (targetX - marble.x) * 0.05;
    marble.vz = (targetZ - marble.z) * 0.05;
    
    // Bounce
    marble.vy *= -0.6;
  }
  
  // Exit condition - if marble goes too far down
  if (marble.y > funnel.height/2 + 50) {
    marble.x = 0;
    marble.y = -100;
    marble.z = 0;
    marble.vx = 0;
    marble.vy = 0;
    marble.vz = 0;
  }
}

function drawMarble() {
  push();
  noStroke();
  
  // Create reflective material
  fill(220, 220, 255);
  specularMaterial(255);
  shininess(100);
  
  translate(marble.x, marble.y, marble.z);
  sphere(marble.radius);
  
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
