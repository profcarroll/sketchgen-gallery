let camera;
let structures = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  camera = createCamera();
  
  // Generate Brutalist concrete structures
  for (let i = 0; i < 50; i++) {
    structures.push({
      x: random(-1000, 1000),
      y: 0,
      z: random(-2000, 2000),
      width: random(50, 200),
      depth: random(50, 200),
      height: random(100, 400),
      rotation: random(TWO_PI)
    });
  }
}

function draw() {
  background(40, 45, 50);
  
  // Animate camera path
  time += 0.002;
  const camX = sin(time * 0.3) * 500;
  const camY = cos(time * 0.2) * 100 - 50;
  const camZ = time * 100 - 500;
  
  camera.setPosition(camX, camY, camZ);
  camera.lookAt(0, 0, time * 100);
  
  // Draw structures
  for (let s of structures) {
    push();
    translate(s.x, s.y, s.z);
    rotateY(s.rotation);
    
    // Concrete texture effect
    fill(70, 75, 80);
    stroke(50, 55, 60);
    strokeWeight(1);
    
    // Main structure
    box(s.width, s.height, s.depth);
    
    // Add some concrete details
    fill(60, 65, 70);
    noStroke();
    for (let i = 0; i < 3; i++) {
      const x = random(-s.width/2, s.width/2);
      const z = random(-s.depth/2, s.depth/2);
      const w = random(5, 20);
      const h = random(5, 20);
      rect(x, -s.height/2 + random(10, s.height - 20), w, h);
    }
    
    pop();
  }
  
  // Add some distant elements to emphasize scale
  fill(60, 65, 70);
  noStroke();
  for (let i = 0; i < 100; i++) {
    const x = random(-2000, 2000);
    const z = random(-3000, -1000);
    const size = random(5, 30);
    const y = map(z, -3000, -1000, -500, 500);
    
    push();
    translate(x, y, z);
    sphere(size);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
