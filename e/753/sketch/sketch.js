let grid = [];
let nodes = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create a grid of structural planes
  let gridSize = 20;
  for (let i = 0; i < gridSize; i++) {
    grid[i] = [];
    for (let j = 0; j < gridSize; j++) {
      grid[i][j] = { x: map(i, 0, gridSize-1, -width/2, width/2),
                     y: map(j, 0, gridSize-1, -height/2, height/2),
                     z: 0 };
    }
  }

  // Create energy nodes at critical connection points
  for (let i = 0; i < 150; i++) {
    let x = random(-width/2, width/2);
    let y = random(-height/2, height/2);
    let z = random(-300, 300);
    nodes.push({ x, y, z, size: random(20, 60), pulse: random(TWO_PI) });
  }
}

function draw() {
  background(0);
  time += 0.01;

  // Camera movement for immersive effect
  let camX = sin(time * 0.2) * 500;
  let camY = cos(time * 0.15) * 300;
  camera(camX, camY, 800, 0, 0, 0, 0, 1, 0);

  // Draw structural planes
  drawStructuralPlanes();

  // Draw energy seams and nodes
  drawEnergySeams();
  drawNodes();
}

function drawStructuralPlanes() {
  stroke(0, 0, 50);
  strokeWeight(0.5);
  noFill();
  
  for (let i = 0; i < grid.length; i++) {
    beginShape(LINES);
    for (let j = 0; j < grid[i].length; j++) {
      let p1 = grid[i][j];
      let p2 = grid[(i+1) % grid.length][j];
      vertex(p1.x, p1.y, p1.z);
      vertex(p2.x, p2.y, p2.z);
      
      if (j < grid[i].length - 1) {
        let p3 = grid[i][j];
        let p4 = grid[i][j+1];
        vertex(p3.x, p3.y, p3.z);
        vertex(p4.x, p4.y, p4.z);
      }
    }
    endShape();
  }
}

function drawEnergySeams() {
  noStroke();
  fill(80, 100, 60, 0.7);
  
  for (let i = 0; i < grid.length - 1; i++) {
    for (let j = 0; j < grid[i].length - 1; j++) {
      let p1 = grid[i][j];
      let p2 = grid[i+1][j];
      let p3 = grid[i][j+1];
      let p4 = grid[i+1][j+1];
      
      // Pulsing effect for energy seams
      let pulse = sin(time * 2 + i * 0.1 + j * 0.1) * 0.5 + 0.5;
      
      beginShape();
      vertex(p1.x, p1.y, p1.z);
      vertex(p2.x, p2.y, p2.z);
      vertex(p4.x, p4.y, p4.z);
      vertex(p3.x, p3.y, p3.z);
      endShape(CLOSE);
    }
  }
}

function drawNodes() {
  noStroke();
  
  for (let node of nodes) {
    node.pulse += 0.1;
    
    let pulse = sin(node.pulse) * 0.5 + 0.5;
    let size = node.size * pulse;
    
    // Create a shimmering green color
    let hue = (time * 20 + node.x * 0.01) % 360;
    fill(hue, 100, 80, 0.8);
    
    push();
    translate(node.x, node.y, node.z);
    sphere(size);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
