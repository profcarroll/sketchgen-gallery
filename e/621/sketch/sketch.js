let structures = [];
let crystals = [];
let pools = [];
let time = 0;
let lightColor;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 1);
  
  // Generate city structures
  for (let i = 0; i < 20; i++) {
    structures.push({
      x: random(-width/2, width/2),
      y: 0,
      z: random(-height/2, height/2),
      height: random(100, 300),
      width: random(20, 60),
      depth: random(20, 60),
      color: random(0.5, 0.8)
    });
  }
  
  // Generate crystalline trails
  for (let i = 0; i < 50; i++) {
    crystals.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-height/2, height/2),
      size: random(2, 8),
      hue: random(0.1, 0.9)
    });
  }
  
  // Generate pools
  for (let i = 0; i < 15; i++) {
    pools.push({
      x: random(-width/2, width/2),
      y: 0,
      z: random(-height/2, height/2),
      radius: random(30, 80),
      hue: random(0.4, 0.7)
    });
  }
}

function draw() {
  background(0);
  time += 0.005;
  
  // Simulate light cycle
  let sunAngle = time % 1;
  lightColor = color(sunAngle * 0.3, 0.8, 0.9);
  
  // Camera movement
  let camX = sin(time * 0.2) * 500;
  let camY = sin(time * 0.1) * 100;
  let camZ = cos(time * 0.2) * 500;
  camera(camX, camY, camZ, 0, 0, 0, 0, 1, 0);
  
  // Draw structures
  for (let s of structures) {
    push();
    translate(s.x, s.y - s.height/2, s.z);
    rotateX(PI/4);
    rotateY(time * 0.1);
    noStroke();
    fill(s.color, 0.8, 0.9);
    box(s.width, s.height, s.depth);
    pop();
  }
  
  // Draw crystalline trails
  for (let c of crystals) {
    push();
    translate(c.x, c.y, c.z);
    noStroke();
    fill(c.hue, 1, 1);
    sphere(c.size);
    pop();
  }
  
  // Draw pools with fractal reflections
  for (let p of pools) {
    push();
    translate(p.x, p.y, p.z);
    noStroke();
    fill(p.hue, 0.7, 0.6);
    sphere(p.radius);
    
    // Simulate liquid distortion
    beginShape(POINTS);
    for (let i = 0; i < 200; i++) {
      let angle = i * 0.1 + time;
      let r = p.radius + sin(angle) * 5;
      let x = r * cos(angle);
      let y = r * sin(angle);
      let z = sin(time * 2 + i * 0.05) * 5;
      vertex(x, y, z);
    }
    endShape();
    pop();
  }
  
  // Draw bioluminescent flora
  for (let i = 0; i < 100; i++) {
    let x = random(-width/2, width/2);
    let y = 0;
    let z = random(-height/2, height/2);
    let pulse = sin(time * 3 + i) * 0.5 + 0.5;
    push();
    translate(x, y, z);
    noStroke();
    fill(0.5, 1, 0.8 + pulse * 0.2);
    sphere(5 + pulse * 10);
    pop();
  }
  
  // Draw metallic deposits reacting to light
  for (let i = 0; i < 30; i++) {
    let x = random(-width/2, width/2);
    let y = 0;
    let z = random(-height/2, height/2);
    let intensity = sin(time * 2 + i) * 0.5 + 0.5;
    push();
    translate(x, y, z);
    noStroke();
    fill(0.1, 0.3, 0.9 + intensity * 0.1);
    sphere(3 + intensity * 5);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
