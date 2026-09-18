let spheres = [];
let core;
let rotationSpeed = 0.005;
let time = 0;

function setup() {
  createCanvas(600, 600, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create core structure
  core = {
    x: 0,
    y: 0,
    z: 0,
    radius: 40,
    rotation: 0
  };

  // Create orbiting spheres
  for (let i = 0; i < 20; i++) {
    let angle = random(TWO_PI);
    let distance = random(150, 300);
    let radius = random(8, 16);
    let hue = random(100, 140); // teal to emerald
    let saturation = random(70, 90);
    let brightness = random(60, 90);
    
    spheres.push({
      x: cos(angle) * distance,
      y: sin(angle) * distance,
      z: random(-100, 100),
      radius: radius,
      angle: angle,
      distance: distance,
      speed: random(0.002, 0.008),
      hue: hue,
      saturation: saturation,
      brightness: brightness,
      phase: random(TWO_PI)
    });
  }
}

function draw() {
  background(0);
  time += 0.01;

  // Ambient lighting
  ambientLight(30);
  pointLight(255, 255, 255, 0, 0, 400);

  // Center rotation
  core.rotation += rotationSpeed;
  rotateY(core.rotation);

  // Draw core structure
  push();
  noStroke();
  fill(30, 20, 80); // Tarnished copper
  sphere(core.radius);
  
  // Add internal glowing effect
  fill(100, 100, 70, 0.3);
  sphere(core.radius * 0.8);
  pop();

  // Draw orbiting spheres
  for (let i = 0; i < spheres.length; i++) {
    let s = spheres[i];
    
    // Update position
    s.angle += s.speed;
    s.x = cos(s.angle) * s.distance;
    s.y = sin(s.angle) * s.distance;
    s.z = sin(time * 0.5 + s.phase) * 50;

    push();
    translate(s.x, s.y, s.z);
    
    // Glow effect
    noStroke();
    fill(s.hue, s.saturation, s.brightness, 0.8);
    sphere(s.radius);

    // Add inner light
    fill(s.hue + 20, 100, 90, 0.6);
    sphere(s.radius * 0.4);
    
    pop();
  }

  // Draw connecting lines (only a few at a time)
  stroke(100, 100, 80, 0.3);
  noFill();
  beginShape(LINES);
  for (let i = 0; i < min(5, spheres.length); i++) {
    let s1 = spheres[i];
    let s2 = spheres[(i + 1) % spheres.length];
    
    vertex(s1.x, s1.y, s1.z);
    vertex(s2.x, s2.y, s2.z);
  }
  endShape();
}
