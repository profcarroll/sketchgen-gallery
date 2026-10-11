let stars = [];
let gears = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create star clusters
  for (let i = 0; i < 200; i++) {
    stars.push({
      x: random(-width * 2, width * 2),
      y: random(-height * 2, height * 2),
      z: random(-1000, 1000),
      size: random(2, 8),
      hue: random(20, 40),
      saturation: random(70, 100),
      brightness: random(80, 100),
      speed: random(0.001, 0.005),
      angle: random(TWO_PI)
    });
  }

  // Create gears
  for (let i = 0; i < 12; i++) {
    gears.push({
      x: 0,
      y: 0,
      z: random(-500, 500),
      radius: random(50, 150),
      rotation: random(TWO_PI),
      speed: random(0.002, 0.008)
    });
  }
}

function draw() {
  background(0);
  time += 0.01;

  // Camera movement
  let camX = sin(time * 0.2) * 500;
  let camY = cos(time * 0.3) * 300;
  let camZ = sin(time * 0.1) * 400;
  camera(camX, camY, camZ, 0, 0, 0, 0, 1, 0);

  // Draw gears
  for (let gear of gears) {
    push();
    translate(gear.x, gear.y, gear.z);
    rotateZ(gear.rotation);
    
    stroke(200, 50, 80);
    noFill();
    
    // Draw gear teeth
    for (let i = 0; i < 12; i++) {
      let angle = TWO_PI * i / 12;
      let x1 = cos(angle) * gear.radius;
      let y1 = sin(angle) * gear.radius;
      let x2 = cos(angle) * (gear.radius + 20);
      let y2 = sin(angle) * (gear.radius + 20);
      
      line(x1, y1, 0, x2, y2, 0);
    }
    
    pop();
    
    gear.rotation += gear.speed;
  }

  // Draw stars
  for (let star of stars) {
    push();
    let x = star.x + sin(time * star.speed + star.angle) * 100;
    let y = star.y + cos(time * star.speed + star.angle) * 100;
    
    // Position in 3D space
    translate(x, y, star.z);
    
    // Rotate based on position and time
    rotateY(time * 0.2);
    rotateX(time * 0.1);
    
    // Color based on HSB
    fill(star.hue, star.saturation, star.brightness);
    noStroke();
    
    // Draw star cluster
    sphere(star.size);
    
    pop();
  }

  // Add some dark matter swirls
  for (let i = 0; i < 50; i++) {
    let angle = time * 0.1 + i * 0.2;
    let radius = 300 + sin(time * 0.05 + i) * 100;
    let x = cos(angle) * radius;
    let y = sin(angle) * radius;
    let z = sin(time * 0.03 + i) * 200;
    
    push();
    translate(x, y, z);
    fill(0, 0, 0, 0.1);
    noStroke();
    sphere(5);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
