let roots = [];
let crystals = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 1);
  
  // Create root systems emerging from ink
  for (let i = 0; i < 200; i++) {
    roots.push({
      x: random(-width/2, width/2),
      y: height/4,
      z: random(-height/2, height/2),
      segments: [],
      age: random(1000),
      color: color(random(0.05, 0.1), 0.8, 0.1 + random(0.1)),
      growth: random(0.002, 0.005)
    });
  }
  
  // Create initial crystal formations
  for (let i = 0; i < 300; i++) {
    crystals.push({
      x: random(-width/2, width/2),
      y: random(-height/4, height/4),
      z: random(-height/2, height/2),
      size: random(2, 8),
      age: random(1000),
      color: color(random(0.5, 0.7), 0.9, 0.8 + random(0.2))
    });
  }
}

function draw() {
  time += 0.003;
  
  background(0);
  noStroke();
  
  // Dynamic camera movement
  let camX = sin(time * 0.1) * width/4;
  let camY = sin(time * 0.05) * height/8;
  let camZ = cos(time * 0.1) * height/2 + height/2;
  camera(camX, camY, camZ, 0, 0, 0, 0, 1, 0);

  // Draw root systems
  for (let root of roots) {
    push();
    translate(root.x, root.y, root.z);
    
    // Slow growth effect
    let growthFactor = sin(time * root.growth + root.age) * 0.5 + 0.5;
    
    // Create branching root structure
    stroke(hue(root.color), saturation(root.color), brightness(root.color), 0.8);
    strokeWeight(1);
    
    beginShape();
    for (let i = 0; i < 20; i++) {
      let angle = time * 0.5 + i * 0.3;
      let radius = i * 3 * growthFactor;
      let x = cos(angle) * radius;
      let y = -i * 2 * growthFactor;
      let z = sin(angle) * radius;
      
      vertex(x, y, z);
    }
    endShape();
    
    pop();
  }

  // Draw crystal formations
  for (let crystal of crystals) {
    push();
    translate(crystal.x, crystal.y, crystal.z);
    
    let ageFactor = (time + crystal.age) % 1000;
    let sizeFactor = sin(ageFactor * 0.02) * 0.5 + 0.5;
    
    fill(hue(crystal.color), saturation(crystal.color), brightness(crystal.color), 0.7);
    sphere(crystal.size * sizeFactor, 4, 3);
    
    pop();
  }
  
  // Subtle ambient lighting
  pointLight(1, 1, 1, 0, -height/2, 0);
  pointLight(1, 1, 1, 0, height/2, 0);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
