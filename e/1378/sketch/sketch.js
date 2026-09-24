let grid = [];
let time = 0;
let lightPos = { x: 0, y: 0, z: 0 };

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  
  // Create a grid of cubes
  const gridSize = 20;
  const spacing = 100;
  for (let i = 0; i < gridSize; i++) {
    grid[i] = [];
    for (let j = 0; j < gridSize; j++) {
      grid[i][j] = {
        x: (i - gridSize/2) * spacing,
        y: (j - gridSize/2) * spacing,
        z: 0,
        size: random(20, 60)
      };
    }
  }
}

function draw() {
  background(10);
  
  // Animate light source
  time += 0.005;
  lightPos.x = sin(time) * 300;
  lightPos.y = cos(time * 0.7) * 200;
  lightPos.z = sin(time * 0.3) * 150;
  
  // Ambient light
  ambientLight(40);
  
  // Dynamic directional light
  directionalLight(255, 255, 255, 
    lightPos.x, lightPos.y, lightPos.z);
  
  // Rotate the whole scene slowly
  rotateY(time * 0.1);
  rotateX(sin(time * 0.3) * 0.1);
  
  // Draw grid of cubes with subtle breathing effect
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      push();
      
      const cube = grid[i][j];
      translate(cube.x, cube.y, cube.z);
      
      // Breathing animation
      const breathing = sin(time * 2 + i + j) * 0.5 + 1;
      scale(cube.size * breathing);
      
      // Color based on position and time
      const hue = (i + j + time * 10) % 360;
      fill(hue, 30, 90);
      
      box(1);
      pop();
    }
  }
  
  // Add subtle floating particles
  if (frameCount % 5 === 0) {
    for (let i = 0; i < 5; i++) {
      push();
      const angle = time * 0.5 + i;
      const radius = 800 + sin(time + i) * 200;
      const x = cos(angle) * radius;
      const y = sin(angle * 0.7) * 300;
      const z = sin(angle * 0.3) * 100;
      
      translate(x, y, z);
      fill(255, 100);
      noStroke();
      sphere(5);
      pop();
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
