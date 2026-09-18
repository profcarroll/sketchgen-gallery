let threads = [];
let gridSize = 20;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize grid of threads
  for (let i = 0; i < gridSize; i++) {
    threads[i] = [];
    for (let j = 0; j < gridSize; j++) {
      threads[i][j] = {
        x: map(i, 0, gridSize - 1, -width/2, width/2),
        y: map(j, 0, gridSize - 1, -height/2, height/2),
        z: 0,
        angle: 0
      };
    }
  }
}

function draw() {
  background(0);
  time += 0.01;
  
  // Camera movement for dynamic perspective
  let camX = sin(time * 0.3) * width/4;
  let camY = cos(time * 0.2) * height/4;
  camera(0, 0, (height/2) / tan(PI/6), 0, 0, 0, 0, 1, 0);
  
  // Draw the weaving pattern
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      let thread = threads[i][j];
      
      // Animate each thread
      thread.angle = time + i * 0.2 + j * 0.1;
      
      // Calculate thread positions with wave motion
      let waveX = sin(thread.angle) * 50;
      let waveY = cos(thread.angle) * 50;
      
      // Thread path in 3D space
      let x1 = thread.x + waveX;
      let y1 = thread.y + waveY;
      let z1 = sin(thread.angle * 2) * 30;
      
      let x2 = thread.x - waveX;
      let y2 = thread.y - waveY;
      let z2 = cos(thread.angle * 2) * 30;
      
      // Color based on position and time
      let hue = (i + j + time * 10) % 360;
      stroke(hue, 80, 90, 0.7);
      strokeWeight(1.5);
      
      // Draw thread connections (weaving effect)
      if (i < gridSize - 1) {
        let nextX = threads[i + 1][j].x + sin(threads[i + 1][j].angle) * 50;
        let nextY = threads[i + 1][j].y + cos(threads[i + 1][j].angle) * 50;
        let nextZ = sin(threads[i + 1][j].angle * 2) * 30;
        
        line(x1, y1, z1, nextX, nextY, nextZ);
      }
      
      if (j < gridSize - 1) {
        let nextX = threads[i][j + 1].x + sin(threads[i][j + 1].angle) * 50;
        let nextY = threads[i][j + 1].y + cos(threads[i][j + 1].angle) * 50;
        let nextZ = sin(threads[i][j + 1].angle * 2) * 30;
        
        line(x1, y1, z1, nextX, nextY, nextZ);
      }
    }
  }
  
  // Add central lattice structure
  push();
  rotateY(time * 0.5);
  rotateX(time * 0.3);
  drawLattice();
  pop();
}

function drawLattice() {
  strokeWeight(1);
  for (let i = 0; i < 20; i++) {
    let angle = i * TWO_PI / 20;
    let x = cos(angle) * 150;
    let y = sin(angle) * 150;
    
    let hue = (angle * 10 + time * 50) % 360;
    stroke(hue, 80, 90, 0.7);
    
    // Draw radial lines
    beginShape(LINES);
    vertex(x, y, -200);
    vertex(x, y, 200);
    endShape();
    
    // Draw interconnections
    let nextAngle = (i + 3) % 20 * TWO_PI / 20;
    let nextX = cos(nextAngle) * 150;
    let nextY = sin(nextAngle) * 150;
    
    stroke(hue, 80, 90, 0.5);
    line(x, y, -200, nextX, nextY, 200);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
