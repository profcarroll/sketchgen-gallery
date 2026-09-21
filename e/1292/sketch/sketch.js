let facets = [];
let mask;
let rotationSpeed = 0.002;
let vortexSpeed = 0.005;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  
  // Create hexagonal mask
  mask = createGraphics(300, 300);
  mask.noStroke();
  mask.fill(255);
  mask.triangle(-150, -150, 150, -150, 0, 150);
  
  // Generate facets
  for (let i = 0; i < 800; i++) {
    let r = random(300, 600);
    let a = random(TWO_PI);
    let h = random(-200, 200);
    facets.push({
      x: r * cos(a),
      y: h,
      z: r * sin(a),
      size: random(5, 20),
      color: color(random(100, 255), random(100, 255), random(100, 255), 200),
      angle: a,
      radius: r
    });
  }
}

function draw() {
  background(0);
  
  // Camera movement
  let cx = cos(time * 0.3) * 200;
  let cy = sin(time * 0.2) * 100;
  let cz = sin(time * 0.4) * 200;
  camera(cx, cy, cz, 0, 0, 0, 0, 1, 0);
  
  // Vortex effect
  time += vortexSpeed;
  
  // Draw facets
  for (let i = 0; i < facets.length; i++) {
    let f = facets[i];
    
    // Apply vortex motion
    let angle = f.angle + time * (f.radius / 1000);
    let r = f.radius + sin(time * 2 + i * 0.01) * 50;
    f.x = r * cos(angle);
    f.z = r * sin(angle);
    
    // Rotate around center
    let rot = time * rotationSpeed * (f.radius / 400);
    let x = f.x * cos(rot) - f.z * sin(rot);
    let z = f.x * sin(rot) + f.z * cos(rot);
    
    push();
    translate(x, f.y, z);
    
    // Color variation
    fill(f.color);
    
    // Draw crystalline facet
    rotate(time * 0.1 + i * 0.02);
    box(f.size);
    
    pop();
  }
  
  // Draw central mask
  push();
  translate(0, 0, -350);
  rotate(time * 0.1);
  texture(mask);
  sphere(150, 6, 6);
  pop();
}
