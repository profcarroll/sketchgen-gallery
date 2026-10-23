let roots = [];
let schematics = [];
let time = 0;
let pendulumAngle = 0;
let pendulumSpeed = 0.01;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create petrified mangrove roots
  for (let i = 0; i < 200; i++) {
    roots.push({
      x: random(width),
      y: random(height),
      size: random(50, 200),
      angle: random(TWO_PI),
      sway: random(100, 300)
    });
  }
  
  // Create self-organized vector schematics
  for (let i = 0; i < 800; i++) {
    schematics.push({
      x: random(width),
      y: random(height),
      length: random(10, 50),
      angle: random(TWO_PI),
      speed: random(0.001, 0.003),
      hue: random(180, 240), // Deep sapphire to cyan range
      alpha: random(0.3, 0.7),
      frequency: random(0.01, 0.02)
    });
  }
}

function draw() {
  background(220, 30, 10, 0.03); // Deep blue background
  
  time += 0.02;
  pendulumAngle += pendulumSpeed;
  
  // Draw petrified roots
  for (let i = 0; i < roots.length; i++) {
    let root = roots[i];
    
    push();
    translate(root.x, root.y);
    rotate(root.angle);
    
    // Create organic root shape with subtle sway
    let swayOffset = sin(time * 0.01 + i) * root.sway;
    noStroke();
    fill(200, 20, 20, 0.8);
    
    beginShape();
    for (let a = 0; a < TWO_PI; a += 0.1) {
      let x = cos(a) * (root.size + swayOffset * sin(a * 3));
      let y = sin(a) * (root.size * 0.5 + swayOffset * cos(a * 2));
      vertex(x, y);
    }
    endShape(CLOSE);
    
    pop();
  }
  
  // Draw and update schematics with pendulum influence
  for (let i = 0; i < schematics.length; i++) {
    let schematic = schematics[i];
    
    // Apply pendulum force to the schematic's movement
    let pendulumForce = sin(pendulumAngle) * 0.5;
    schematic.angle += pendulumForce * 0.02;
    
    // Animate position and angle using noise with pendulum influence
    schematic.x += cos(schematic.angle) * schematic.speed * 100;
    schematic.y += sin(schematic.angle) * schematic.speed * 100;
    schematic.angle += (noise(schematic.x * 0.002, schematic.y * 0.002, time * schematic.frequency) - 0.5) * 0.05;
    
    // Reset schematic if out of bounds
    if (schematic.x < -100 || schematic.x > width + 100 ||
        schematic.y < -100 || schematic.y > height + 100) {
      schematic.x = random(width);
      schematic.y = random(height);
      schematic.angle = random(TWO_PI);
    }
    
    // Draw the schematic line
    stroke(schematic.hue, 80, 90, schematic.alpha);
    strokeWeight(1.5);
    line(
      schematic.x,
      schematic.y,
      schematic.x + cos(schematic.angle) * schematic.length,
      schematic.y + sin(schematic.angle) * schematic.length
    );
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
