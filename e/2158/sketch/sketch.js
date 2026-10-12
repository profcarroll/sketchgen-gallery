let rods = [];
let bonds = [];

function setup() {
  createCanvas(600, 600, WEBGL);
  
  // Create a fixed lattice pattern of rods
  const spacing = 60;
  const rows = 6;
  const cols = 6;
  const depth = 6;
  
  for (let x = 0; x < rows; x++) {
    for (let y = 0; y < cols; y++) {
      for (let z = 0; z < depth; z++) {
        rods.push({
          x: (x - rows/2) * spacing,
          y: (y - cols/2) * spacing,
          z: (z - depth/2) * spacing
        });
      }
    }
  }
  
  // Connect nearby rods with bonds to form a crystalline structure
  const maxBonds = 300;
  let bondCount = 0;
  
  for (let i = 0; i < rods.length && bondCount < maxBonds; i++) {
    for (let j = i + 1; j < rods.length && bondCount < maxBonds; j++) {
      const rodA = rods[i];
      const rodB = rods[j];
      const dx = rodA.x - rodB.x;
      const dy = rodA.y - rodB.y;
      const dz = rodA.z - rodB.z;
      const distance = Math.sqrt(dx*dx + dy*dy + dz*dz);
      
      if (distance < 80 && distance > 10) {
        bonds.push({
          start: rodA,
          end: rodB
        });
        bondCount++;
      }
    }
  }
}

function draw() {
  background(0);
  
  // Static view - no motion
  rotateY(0.2);
  rotateX(0.1);
  
  // Draw all bonds in one batch
  beginShape(LINES);
  stroke(200, 230);
  noFill();
  for (let bond of bonds) {
    vertex(bond.start.x, bond.start.y, bond.start.z);
    vertex(bond.end.x, bond.end.y, bond.end.z);
  }
  endShape();
  
  // Draw rods as small spheres
  for (let rod of rods) {
    push();
    translate(rod.x, rod.y, rod.z);
    noStroke();
    fill(150, 180, 255);
    sphere(3);
    pop();
  }
}
