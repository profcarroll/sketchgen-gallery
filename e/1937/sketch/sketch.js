function setup() {
  createCanvas(800, 600, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  
  // Create the ventilation structure
  ventilation = [];
  for (let i = 0; i < 200; i++) {
    ventilation.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-300, 300),
      size: random(10, 50),
      rot: random(TWO_PI)
    });
  }
  
  // Pendulum setup
  pendulum = {
    angle: 0,
    length: 300,
    speed: 0,
    amplitude: 0.3
  };
}

function draw() {
  background(20, 10, 5);
  
  // Ambient light
  ambientLight(10);
  
  // Main directional light from above
  pointLight(255, 255, 255, 0, -300, 200);
  
  // Rotate the whole scene slowly
  rotateY(frameCount * 0.001);
  
  // Draw ventilation structure
  for (let v of ventilation) {
    push();
    translate(v.x, v.y, v.z);
    rotateZ(v.rot);
    
    // Rusted metal color
    fill(20, 30, 30);
    box(v.size, v.size * 0.2, v.size * 0.2);
    
    pop();
  }
  
  // Draw pendulum rod
  push();
  translate(0, -200, 0);
  rotateX(PI / 2);
  fill(50, 30, 70);
  cylinder(10, pendulum.length);
  pop();
  
  // Update pendulum
  pendulum.speed += (sin(pendulum.angle) * 0.001);
  pendulum.angle += pendulum.speed;
  pendulum.speed *= 0.995; // Damping
  
  // Draw pendulum weight
  push();
  translate(
    sin(pendulum.angle) * pendulum.length,
    -200 + cos(pendulum.angle) * pendulum.length,
    0
  );
  fill(30, 80, 90);
  sphere(40);
  pop();
  
  // Dynamic lighting from pendulum
  pointLight(
    255, 200, 150,
    sin(pendulum.angle) * pendulum.length,
    -200 + cos(pendulum.angle) * pendulum.length,
    0
  );
}
