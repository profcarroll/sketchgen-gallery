let structures = [];
let cameraZ = 0;
let speed = 0.5;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();

  // Generate concrete structures
  for (let i = 0; i < 100; i++) {
    let x = random(-2000, 2000);
    let z = random(-2000, 2000);
    let y = 0;
    let w = random(50, 200);
    let h = random(100, 300);
    let d = random(50, 200);
    structures.push({ x, y, z, w, h, d });
  }
}

function draw() {
  background(100);

  // Camera movement
  cameraZ -= speed;
  
  // Set up camera
  perspective(PI/3, width/height, 1, 5000);
  translate(0, 0, cameraZ);

  // Draw structures
  for (let s of structures) {
    push();
    translate(s.x, s.y, s.z);
    
    // Draw concrete block with grime and moss
    fill(120, 120, 120);
    box(s.w, s.h, s.d);
    
    // Add grime texture
    fill(60, 60, 60);
    for (let i = 0; i < 5; i++) {
      let x = random(-s.w/2, s.w/2);
      let z = random(-s.d/2, s.d/2);
      let size = random(5, 20);
      ellipse(x, -s.h/2 + random(10), size, size);
    }
    
    // Add moss streaks
    fill(30, 100, 30);
    for (let i = 0; i < 3; i++) {
      let x = random(-s.w/2, s.w/2);
      let z = random(-s.d/2, s.d/2);
      let w = random(5, 15);
      let h = random(20, 60);
      rect(x, -s.h/2 + random(10), w, h);
    }
    
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
