let structures = [];
let cameraPosition = { x: 0, y: 0, z: 0 };
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  
  // Generate Brutalist structures
  for (let i = 0; i < 50; i++) {
    const x = random(-1000, 1000);
    const z = random(-1000, 1000);
    const height = random(50, 200);
    const width = random(30, 80);
    const depth = random(30, 80);
    
    structures.push({
      x, z, height, width, depth
    });
  }
}

function draw() {
  background(30, 35, 40);
  
  // Animate camera drone flight
  time += 0.002;
  const camX = sin(time * 0.3) * 800;
  const camZ = cos(time * 0.2) * 800;
  const camY = sin(time * 0.1) * 50 + 100;
  
  cameraPosition = { x: camX, y: camY, z: camZ };
  
  // Set up lighting
  pointLight(255, 255, 255, camX, camY, camZ);
  ambientLight(50, 50, 50);
  
  // Draw ground
  push();
  translate(0, 100, 0);
  rotateX(HALF_PI);
  fill(40, 45, 50);
  plane(2000, 2000);
  pop();
  
  // Draw structures
  for (let structure of structures) {
    push();
    translate(structure.x, structure.height/2, structure.z);
    
    // Muted concrete color
    fill(100, 105, 110);
    
    // Draw main structure
    box(structure.width, structure.height, structure.depth);
    
    // Add Brutalist details - repeating patterns
    stroke(80, 85, 90);
    strokeWeight(1);
    
    // Vertical grid pattern
    for (let i = 0; i < 3; i++) {
      const y = map(i, 0, 2, -structure.height/2, structure.height/2);
      line(-structure.width/2, y, -structure.depth/2, structure.width/2, y, -structure.depth/2);
    }
    
    // Horizontal grid pattern
    for (let i = 0; i < 3; i++) {
      const x = map(i, 0, 2, -structure.width/2, structure.width/2);
      line(x, -structure.height/2, -structure.depth/2, x, structure.height/2, -structure.depth/2);
    }
    
    pop();
  }
  
  // Add some decay effects
  push();
  translate(0, 100, 0);
  rotateX(HALF_PI);
  fill(0, 0, 0, 30);
  plane(1800, 1800);
  pop();
}
