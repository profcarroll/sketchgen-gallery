let pendulums = [];
let numPendulums = 150;
let floorSize = 800;
let pendulumLength = 200;
let swingSpeed = 0.005;
let swingAmplitude = 0.3;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create pendulums in a grid pattern across the factory floor
  for (let i = 0; i < numPendulums; i++) {
    let x = random(-floorSize/2 + 50, floorSize/2 - 50);
    let z = random(-floorSize/2 + 50, floorSize/2 - 50);
    
    // Create a pendulum with a slight variation in phase for natural rhythm
    pendulums.push({
      x: x,
      z: z,
      y: 0,
      length: pendulumLength,
      angle: random(TWO_PI),
      angularVelocity: 0,
      phaseOffset: random(TWO_PI),
      colorHue: map(x, -floorSize/2, floorSize/2, 10, 30), // Warm copper tones
      colorSat: 80 + random(10),
      colorBri: 60 + random(20)
    });
  }
}

function draw() {
  background(20, 10, 10); // Dark factory floor
  
  // Set up lighting to highlight the polished surfaces
  pointLight(255, 255, 255, 0, -height/2, 0);
  pointLight(255, 255, 255, 0, height/2, 0);
  
  // Add subtle ambient light
  ambientLight(30, 30, 30);
  
  // Draw a grid floor to establish the factory scale
  push();
  translate(0, floorSize/2, 0);
  rotateX(PI/2);
  stroke(40, 20, 40);
  noFill();
  
  // Create a large grid pattern for the floor
  for (let x = -floorSize/2; x <= floorSize/2; x += 100) {
    line(x, -floorSize/2, x, floorSize/2);
  }
  for (let z = -floorSize/2; z <= floorSize/2; z += 100) {
    line(-floorSize/2, z, floorSize/2, z);
  }
  pop();
  
  // Update and draw pendulums
  for (let pendulum of pendulums) {
    // Apply physics to pendulum motion with a slight phase offset
    let time = millis() * swingSpeed;
    pendulum.angle += pendulum.angularVelocity;
    
    // Add some damping for realistic motion
    pendulum.angularVelocity *= 0.999;
    
    // Apply gravitational force and phase offset for natural rhythm
    let gravity = 0.0005;
    pendulum.angularVelocity += sin(pendulum.angle) * gravity;
    pendulum.angle += (sin(time + pendulum.phaseOffset) * swingAmplitude);
    
    // Calculate the pendulum's position in 3D space
    let x = pendulum.x + sin(pendulum.angle) * pendulum.length;
    let y = -pendulum.length + cos(pendulum.angle) * pendulum.length;
    let z = pendulum.z;
    
    // Draw the pendulum rod and weight
    push();
    translate(pendulum.x, 0, pendulum.z);
    
    // Draw the rod (thin copper wire)
    stroke(pendulum.colorHue, 30, 80);
    strokeWeight(1);
    line(0, 0, 0, 0, y, 0);
    
    // Draw the pendulum weight (polished copper sphere)
    fill(pendulum.colorHue, pendulum.colorSat, pendulum.colorBri);
    noStroke();
    push();
    translate(0, y, 0);
    sphere(15, 6, 4); // Low detail for performance
    pop();
    
    pop();
  }
  
  // Add a subtle reflection effect from the polished copper surfaces
  beginShape(POINTS);
  for (let pendulum of pendulums) {
    let time = millis() * swingSpeed;
    let pulse = sin(time + pendulum.phaseOffset) * 0.2 + 0.8;
    
    // Create a small point to represent light reflection
    let x = pendulum.x + sin(pendulum.angle) * pendulum.length;
    let y = -pendulum.length + cos(pendulum.angle) * pendulum.length;
    let z = pendulum.z;
    
    fill(20, 80, 100 * pulse, 0.3);
    vertex(x, y, z);
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
