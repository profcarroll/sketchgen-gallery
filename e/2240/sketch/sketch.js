let lattice;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create a complex lattice structure using recursive geometry
  lattice = createLattice(20, 800);
}

function draw() {
  background(20, 30, 5); // Dark antique brass background
  
  // Slow rotation of the entire scene
  rotateY(time * 0.001);
  rotateX(sin(time * 0.0005) * 0.1);
  
  // Draw the lattice structure with glowing lines
  time += 0.02;
  
  for (let i = 0; i < lattice.length; i++) {
    let branch = lattice[i];
    
    beginShape(LINES);
    for (let j = 0; j < branch.length - 1; j++) {
      let pos1 = branch[j];
      let pos2 = branch[j + 1];
      
      // Create a subtle pulsing glow effect
      let pulse = sin(time * 3 + i + j) * 0.3 + 0.7;
      
      // Use brass-like color with varying brightness
      let hue = 25 + sin(time * 0.01 + i) * 5;
      let sat = 40 + sin(time * 0.02 + j) * 10;
      let bright = 60 + sin(time * 0.03 + i + j) * 15;
      
      stroke(hue, sat, bright, pulse * 0.8);
      strokeWeight(0.5 + sin(time * 2 + i + j) * 0.2);
      
      vertex(pos1.x, pos1.y, pos1.z);
      vertex(pos2.x, pos2.y, pos2.z);
    }
    endShape();
  }
  
  // Add floating particles that move through the lattice
  for (let i = 0; i < 100; i++) {
    let angle1 = time * 0.01 + i;
    let angle2 = time * 0.02 + i * 0.7;
    
    let x = sin(angle1) * 400 + cos(angle2) * 300;
    let y = cos(angle1) * 400 + sin(angle2) * 300;
    let z = sin(time * 0.005 + i) * 200;
    
    // Particle glow effect
    let pulse = sin(time * 3 + i) * 0.5 + 0.5;
    fill(30, 80, 90, pulse * 0.7);
    noStroke();
    push();
    translate(x, y, z);
    sphere(2 + pulse * 2);
    pop();
  }
}

// Create a recursive lattice structure with branching
function createLattice(depth, size) {
  let branches = [];
  
  for (let i = 0; i < 10; i++) {
    let branch = [];
    
    // Start from center
    let startX = 0;
    let startY = 0;
    let startZ = 0;
    
    // Create a branching structure
    for (let j = 0; j < depth; j++) {
      let x = startX + random(-size, size);
      let y = startY + random(-size, size);
      let z = startZ + random(-size, size);
      
      branch.push({x, y, z});
      
      // Occasionally branch out
      if (random() < 0.2 && j < depth - 1) {
        let newBranch = [];
        for (let k = 0; k < depth * 0.5; k++) {
          let nx = x + random(-size * 0.3, size * 0.3);
          let ny = y + random(-size * 0.3, size * 0.3);
          let nz = z + random(-size * 0.3, size * 0.3);
          newBranch.push({x: nx, y: ny, z: nz});
        }
        branches.push(newBranch);
      }
    }
    
    branches.push(branch);
  }
  
  return branches;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
