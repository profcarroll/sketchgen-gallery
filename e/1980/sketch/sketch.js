let structures = [];
let cameraZ = 0;
let speed = 0.5;
let quartzForms = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();

  // Generate concrete structures
  for (let i = 0; i < 50; i++) {
    let x = random(-1000, 1000);
    let z = random(-1000, 1000);
    let y = 0;
    let w = random(50, 150);
    let h = random(80, 200);
    let d = random(50, 150);
    structures.push({ x, y, z, w, h, d });
  }

  // Generate quartz formations
  for (let i = 0; i < 30; i++) {
    let x = random(-1000, 1000);
    let z = random(-1000, 1000);
    let y = random(-500, -200); // Subterranean
    let size = random(30, 80);
    let height = random(50, 150);
    quartzForms.push({ x, y, z, size, height });
  }
}

function draw() {
  background(40);

  // Camera movement
  cameraZ -= speed;
  
  // Set up camera
  perspective(PI/3, width/height, 1, 5000);
  translate(0, 0, cameraZ);

  // Draw concrete structures
  for (let s of structures) {
    push();
    translate(s.x, s.y, s.z);
    
    // Draw concrete block
    fill(120, 120, 120);
    box(s.w, s.h, s.d);
    
    // Add grime texture
    fill(60, 60, 60);
    for (let i = 0; i < 3; i++) {
      let x = random(-s.w/2, s.w/2);
      let z = random(-s.d/2, s.d/2);
      let size = random(5, 15);
      ellipse(x, -s.h/2 + random(10), size, size);
    }
    
    pop();
  }

  // Draw quartz formations
  for (let q of quartzForms) {
    push();
    translate(q.x, q.y, q.z);
    
    // Draw sharp quartz structure
    fill(220, 240, 255);
    cone(q.size, q.height);
    
    // Add crystal highlights
    fill(180, 220, 255);
    for (let i = 0; i < 3; i++) {
      let angle = random(TWO_PI);
      let dist = random(0, q.size/2);
      let x = cos(angle) * dist;
      let z = sin(angle) * dist;
      let size = random(2, 6);
      ellipse(x, -q.height/2 + random(5), size, size);
    }
    
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
