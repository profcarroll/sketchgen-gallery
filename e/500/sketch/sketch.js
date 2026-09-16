let grid = [];
let gridSize = 20;
let cellSize = 30;
let rustColors = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noLoop();

  // Create rust color palette
  rustColors = [
    color(80, 10, 5),   // Deep umber
    color(120, 20, 10),  // Dark rust
    color(160, 30, 15),  // Medium rust
    color(200, 40, 20),  // Light rust
    color(220, 50, 25),  // Very light rust
    color(240, 60, 30)   // Nearly white rust
  ];

  // Build grid of pathways
  for (let z = -1000; z <= 1000; z += gridSize) {
    let row = [];
    for (let x = -1000; x <= 1000; x += gridSize) {
      // Create curved path with sharp turn at center
      let distanceFromCenter = dist(x, 0, 0, 0);
      let curveFactor = map(distanceFromCenter, 0, 1000, 0.5, 2.0);
      
      if (distanceFromCenter > 400 && distanceFromCenter < 600) {
        // Sharp perpendicular turn
        let angle = atan2(z, x) + PI/2;
        let newX = x + cos(angle) * 100;
        let newZ = z + sin(angle) * 100;
        row.push({x: newX, y: 0, z: newZ});
      } else if (distanceFromCenter > 600) {
        // Continue straight after turn
        let angle = atan2(z, x);
        let newX = x + cos(angle) * curveFactor * 5;
        let newZ = z + sin(angle) * curveFactor * 5;
        row.push({x: newX, y: 0, z: newZ});
      } else {
        // Smooth curves before turn
        let angle = atan2(z, x);
        let newX = x + cos(angle) * curveFactor * 5;
        let newZ = z + sin(angle) * curveFactor * 5;
        row.push({x: newX, y: 0, z: newZ});
      }
    }
    grid.push(row);
  }
}

function draw() {
  background(20);
  
  // Camera setup
  camera(0, -300, 1000, 0, 0, 0, 0, 1, 0);
  
  // Draw pathways
  strokeWeight(2);
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      let x = grid[i][j].x;
      let y = grid[i][j].y;
      let z = grid[i][j].z;
      
      // Apply rust texture
      let rustColor = rustColors[int(random(rustColors.length))];
      fill(rustColor);
      stroke(rustColor);
      
      push();
      translate(x, y, z);
      sphere(2);
      pop();
    }
  }

  // Draw structural elements
  strokeWeight(1);
  for (let i = 0; i < grid.length - 1; i++) {
    for (let j = 0; j < grid[i].length - 1; j++) {
      let x1 = grid[i][j].x;
      let z1 = grid[i][j].z;
      let x2 = grid[i+1][j].x;
      let z2 = grid[i+1][j].z;
      
      // Only draw connections where path continues
      if (dist(x1, z1, x2, z2) < 50) {
        stroke(150);
        line(x1, 0, z1, x2, 0, z2);
      }
    }
  }
  
  // Draw large rust pockets in the center
  drawRustPockets();
}

function drawRustPockets() {
  noStroke();
  for (let i = 0; i < 50; i++) {
    let x = random(-300, 300);
    let z = random(-300, 300);
    let size = random(20, 100);
    
    // Create wet-looking rust pockets
    fill(random(rustColors.slice(0, 4)));
    push();
    translate(x, 0, z);
    sphere(size);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
