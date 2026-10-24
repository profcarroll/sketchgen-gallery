let gears = [];
let pendulum;
let centerX, centerY;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  centerX = width / 2;
  centerY = height / 2;
  
  // Create pendulum
  pendulum = {
    angle: PI/4,
    speed: 0,
    length: 150,
    radius: 10
  };
  
  // Create gears with varying sizes and speeds
  for (let i = 0; i < 8; i++) {
    let angle = map(i, 0, 8, 0, TWO_PI);
    let distance = 100 + i * 60;
    let x = centerX + cos(angle) * distance;
    let y = centerY + sin(angle) * distance;
    let size = 30 + (i % 3) * 20;
    let speed = 0.01 + (i * 0.005);
    
    gears.push({
      x: x,
      y: y,
      size: size,
      speed: speed,
      angle: angle,
      teeth: 12 + i % 4,
      rotation: random(TWO_PI),
      color: [
        map(i, 0, 8, 100, 255),
        map(i, 0, 8, 50, 200),
        map(i, 0, 8, 150, 255)
      ]
    });
  }
}

function draw() {
  background(10, 15, 30);
  
  // Update pendulum
  time += 0.02;
  pendulum.angle = PI/4 + sin(time) * PI/6;
  pendulum.speed = sin(time) * 0.05;
  
  // Draw pendulum bob
  let bobX = centerX + cos(pendulum.angle) * pendulum.length;
  let bobY = centerY + sin(pendulum.angle) * pendulum.length;
  
  noStroke();
  fill(255, 200);
  ellipse(bobX, bobY, pendulum.radius * 2);
  
  // Draw gear connections
  stroke(200, 100);
  strokeWeight(1);
  for (let i = 0; i < gears.length - 1; i++) {
    let g1 = gears[i];
    let g2 = gears[i + 1];
    
    // Connect gears in a chain
    line(g1.x, g1.y, g2.x, g2.y);
  }
  
  // Draw and animate gears
  for (let i = 0; i < gears.length; i++) {
    let gear = gears[i];
    
    // Update gear rotation based on pendulum
    gear.rotation += gear.speed * (pendulum.speed + 0.01) * 2;
    
    // Draw gear with dynamic color
    drawGear(gear);
  }
}

function drawGear(gear) {
  push();
  translate(gear.x, gear.y);
  rotate(gear.rotation);
  
  // Draw gear body with gradient
  let gradient = drawingContext.createRadialGradient(0, 0, 0, 0, 0, gear.size);
  gradient.addColorStop(0, color(gear.color[0], gear.color[1], gear.color[2], 200));
  gradient.addColorStop(1, color(gear.color[0] - 50, gear.color[1] - 50, gear.color[2] - 50, 150));
  
  drawingContext.fillStyle = gradient;
  ellipse(0, 0, gear.size);
  
  // Draw teeth
  noFill();
  stroke(255, 180);
  strokeWeight(2);
  for (let i = 0; i < gear.teeth; i++) {
    let angle = map(i, 0, gear.teeth, 0, TWO_PI);
    let toothX = cos(angle) * (gear.size/2 - 5);
    let toothY = sin(angle) * (gear.size/2 - 5);
    
    // Draw tooth
    push();
    rotate(angle);
    line(0, 0, 0, -gear.size/4);
    pop();
  }
  
  // Draw center hole
  fill(10, 15, 30);
  ellipse(0, 0, gear.size/4);
  
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  centerX = width / 2;
  centerY = height / 2;
}
