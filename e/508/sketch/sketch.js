let pyramids = [];
let waterSurface;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  
  // Create pyramids
  for (let i = 0; i < 5; i++) {
    pyramids.push({
      x: random(-width/3, width/3),
      z: random(-height/3, height/3),
      size: random(50, 120),
      height: random(100, 200)
    });
  }
  
  // Setup water surface
  waterSurface = createGraphics(width, height);
  waterSurface.noStroke();
}

function draw() {
  background(0);
  
  time += 0.01;
  
  // Draw water surface with caustics
  drawWaterSurface();
  
  // Draw pyramids
  for (let pyramid of pyramids) {
    push();
    translate(pyramid.x, 0, pyramid.z);
    drawPyramid(pyramid.size, pyramid.height);
    pop();
  }
}

function drawWaterSurface() {
  waterSurface.push();
  waterSurface.translate(width/2, height/2);
  
  // Create dynamic caustic patterns
  for (let i = 0; i < 1000; i++) {
    let x = random(-width/2, width/2);
    let y = random(-height/2, height/2);
    let size = random(2, 8);
    let alpha = map(sin(time + i * 0.01), -1, 1, 50, 150);
    
    waterSurface.fill(255, 255, 255, alpha);
    waterSurface.ellipse(x, y, size, size);
  }
  
  waterSurface.pop();
  
  // Draw the water surface
  texture(waterSurface);
  plane(width, height);
}

function drawPyramid(size, height) {
  // Pyramid vertices
  let vertices = [
    [0, -height/2, 0],        // top
    [-size/2, height/2, -size/2], // front left
    [size/2, height/2, -size/2],  // front right
    [size/2, height/2, size/2],   // back right
    [-size/2, height/2, size/2]   // back left
  ];
  
  // Draw pyramid faces
  beginShape(TRIANGLE_FAN);
  vertex(0, -height/2, 0);  // top
  for (let i = 0; i <= vertices.length; i++) {
    let v = vertices[i % vertices.length];
    vertex(v[0], v[1], v[2]);
  }
  endShape();
  
  // Draw base
  beginShape(TRIANGLE_FAN);
  for (let v of vertices) {
    vertex(v[0], v[1], v[2]);
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
