let structures = [];
let time = 0;
let grid = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create crystalline structures
  for (let i = 0; i < 200; i++) {
    structures.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-500, 500),
      size: random(10, 30),
      hue: random(20, 40), // Muted oxidized tones
      saturation: random(20, 40),
      brightness: random(30, 60),
      opacity: random(0.1, 0.3),
      speed: random(0.0005, 0.002),
      phase: random(TWO_PI),
      rotationSpeed: random(-0.001, 0.001)
    });
  }

  // Create grid for spatial hashing
  let gridSize = 150;
  let cols = ceil(width / gridSize);
  let rows = ceil(height / gridSize);
  grid = new Array(cols * rows).fill().map(() => []);
}

function draw() {
  background(20, 10, 5); // Deep black background

  time += 0.003;

  // Camera movement - slow geological motion
  let camX = sin(time * 0.1) * width/8;
  let camY = cos(time * 0.15) * height/8;
  let camZ = cos(time * 0.08) * width/3 + 500;
  camera(camX, camY, camZ, 0, 0, 0, 0, 1, 0);

  // Update grid
  for (let i = 0; i < grid.length; i++) {
    grid[i] = [];
  }

  // Update structures and populate grid
  for (let s of structures) {
    // Slow cyclical motion mimicking geological time
    let dx = sin(time * s.speed + s.phase) * 2;
    let dy = cos(time * s.speed * 0.7 + s.phase) * 1.5;
    let dz = cos(time * s.speed * 0.5 + s.phase) * 1.2;

    s.x += dx;
    s.y += dy;
    s.z += dz;

    // Wrap around edges
    if (s.x > width/2 + 200) s.x = -width/2 - 200;
    if (s.x < -width/2 - 200) s.x = width/2 + 200;
    if (s.y > height/2 + 200) s.y = -height/2 - 200;
    if (s.y < -height/2 - 200) s.y = height/2 + 200;

    // Grid positioning
    let gridX = floor((s.x + width/2) / 150);
    let gridY = floor((s.y + height/2) / 150);
    if (gridX >= 0 && gridX < ceil(width / 150) && gridY >= 0 && gridY < ceil(height / 150)) {
      let index = gridY * ceil(width / 150) + gridX;
      if (index < grid.length) {
        grid[index].push(s);
      }
    }
  }

  // Draw structures
  for (let s of structures) {
    push();
    translate(s.x, s.y, s.z);

    let pulse = sin(time * 5 + s.phase) * 0.3 + 0.7;
    let size = s.size * pulse;

    // Apply rotation for dynamic effect
    rotateX(time * s.rotationSpeed);
    rotateY(time * s.rotationSpeed * 0.5);
    
    fill(s.hue, s.saturation, s.brightness, s.opacity);
    noStroke();

    // Draw a crystalline structure with multiple facets
    push();
    scale(size/20);
    for (let i = 0; i < 6; i++) {
      rotateZ(PI/3);
      box(10, 20, 5);
    }
    pop();

    pop();
  }

  // Draw energy network connections
  stroke(200, 80, 100, 0.15);
  strokeWeight(0.5);
  beginShape(LINES);

  for (let i = 0; i < structures.length; i++) {
    let s1 = structures[i];
    let gridX = floor((s1.x + width/2) / 150);
    let gridY = floor((s1.y + height/2) / 150);
    
    if (gridX >= 0 && gridX < ceil(width / 150) && gridY >= 0 && gridY < ceil(height / 150)) {
      let index = gridY * ceil(width / 150) + gridX;
      
      // Check nearby cells in grid
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          let neighborIndex = (gridY + dy) * ceil(width / 150) + (gridX + dx);
          if (neighborIndex >= 0 && neighborIndex < grid.length) {
            for (let s2 of grid[neighborIndex]) {
              // Use squared distance to avoid expensive sqrt
              let dx = s1.x - s2.x;
              let dy = s1.y - s2.y;
              let dz = s1.z - s2.z;
              let distSq = dx*dx + dy*dy + dz*dz;
              
              if (distSq < 22500 && distSq > 25) { // Connect nearby structures
                vertex(s1.x, s1.y, s1.z);
                vertex(s2.x, s2.y, s2.z);
              }
            }
          }
        }
      }
    }
  }
  
  endShape();
}

function mouseDragged() {
  // Create a wave effect at the mouse position
  let mouseGridX = floor((mouseX - width/2) / 150);
  let mouseGridY = floor((mouseY - height/2) / 150);
  
  if (mouseGridX >= 0 && mouseGridX < ceil(width / 150) && mouseGridY >= 0 && mouseGridY < ceil(height / 150)) {
    let index = mouseGridY * ceil(width / 150) + mouseGridX;
    
    // Amplify pulsing energy networks
    stroke(300, 100, 100, 0.4);
    strokeWeight(1);
    beginShape(LINES);
    
    for (let s of grid[index]) {
      if (dist(mouseX - width/2, mouseY - height/2, s.x, s.y) < 150) {
        let pulse = sin(time * 10 + s.phase) * 0.5 + 0.5;
        fill(300, 100, 100, 0.8);
        noStroke();
        push();
        translate(s.x, s.y, s.z);
        sphere(s.size * (1 + pulse * 0.5), 6, 4);
        pop();
        
        // Draw amplified connections
        for (let s2 of structures) {
          let dx = s.x - s2.x;
          let dy = s.y - s2.y;
          let dz = s.z - s2.z;
          let distSq = dx*dx + dy*dy + dz*dz;
          
          if (distSq < 10000 && distSq > 25) {
            vertex(s.x, s.y, s.z);
            vertex(s2.x, s2.y, s2.z);
          }
        }
      }
    }
    
    endShape();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
