// Bauhaus-inspired geometric architecture with dynamic mouse interaction
let planes = [];
let grid = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  pixelDensity(1);
  frameRate(30);

  // Create a grid of points for spatial hashing
  const gridSize = 40;
  for (let x = 0; x < width; x += gridSize) {
    for (let y = 0; y < height; y += gridSize) {
      grid.push({ x, y });
    }
  }

  // Create interlocking planes with different orientations and depths
  const numPlanes = 12;
  for (let i = 0; i < numPlanes; i++) {
    const depth = map(i, 0, numPlanes - 1, 300, -300);
    const size = 200 + i * 20;
    planes.push({
      x: random(-width/4, width/4),
      y: random(-height/4, height/4),
      z: depth,
      w: size,
      h: size,
      angle: random(TWO_PI),
      rotationSpeed: random(-0.005, 0.005),
      color: color(120 + i * 8, 130 + i * 5, 140 + i * 3, 200),
      originalColor: color(120 + i * 8, 130 + i * 5, 140 + i * 3, 200),
      isHighlighted: false
    });
  }
}

function draw() {
  background(20);
  
  // Camera movement for perspective effect
  const time = millis() / 2000;
  const camX = sin(time * 0.1) * 300;
  const camY = cos(time * 0.15) * 150;
  const camZ = 600 + sin(time * 0.05) * 200;
  
  camera(camX, camY, camZ, 0, 0, 0, 0, 1, 0);
  
  // Dynamic lighting based on mouse position
  const mouseRatioX = map(mouseX, 0, width, -1, 1);
  const mouseRatioY = map(mouseY, 0, height, -1, 1);
  
  // Ambient light
  ambientLight(60);
  
  // Directional light that follows the mouse
  directionalLight(255, 255, 255, mouseRatioX, mouseRatioY, -1);
  
  // Point light for additional effects
  pointLight(255, 255, 255, mouseRatioX * 400, mouseRatioY * 300, 300);
  
  // Draw planes
  for (let i = 0; i < planes.length; i++) {
    const plane = planes[i];
    
    push();
    
    // Apply transformations
    translate(plane.x, plane.y, plane.z);
    rotateY(plane.angle + plane.rotationSpeed * frameCount);
    
    // Highlight planes near mouse
    const distToMouse = dist(plane.x, plane.y, mouseX - width/2, mouseY - height/2);
    if (distToMouse < 150) {
      plane.isHighlighted = true;
      plane.color = lerpColor(plane.originalColor, color(255, 150, 50, 200), map(distToMouse, 0, 150, 1, 0));
    } else {
      plane.isHighlighted = false;
      plane.color = plane.originalColor;
    }
    
    // Apply material properties
    fill(plane.color);
    stroke(0);
    strokeWeight(0.5);
    
    // Draw the plane as a rectangle with depth
    rectMode(CENTER);
    rect(0, 0, plane.w, plane.h);
    
    pop();
  }
  
  // Add grid lines for architectural feel
  stroke(80);
  strokeWeight(0.3);
  noFill();
  
  // Draw grid lines in 3D space
  for (let i = 0; i < grid.length; i++) {
    const g = grid[i];
    push();
    translate(g.x - width/2, g.y - height/2, 0);
    beginShape(LINES);
    vertex(0, 0, 0);
    vertex(0, 0, 300);
    endShape();
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
