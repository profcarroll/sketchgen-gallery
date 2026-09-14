let structures = [];
let waterColor;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create pyramidal structures
  for (let i = 0; i < 20; i++) {
    structures.push({
      x: random(-width/2, width/2),
      y: random(height/4, height/2),
      z: random(-200, 200),
      size: random(30, 80),
      angle: random(TWO_PI)
    });
  }
  
  // Set up water color
  waterColor = color(190, 50, 30, 0.7);
}

function draw() {
  background(220, 10, 90);
  
  // Create dynamic lighting
  pointLight(255, 255, 255, 0, -height/2, 200);
  pointLight(100, 150, 255, 0, height/2, 200);
  
  // Move structures based on time
  for (let structure of structures) {
    structure.angle += 0.001;
    structure.x += sin(frameCount * 0.001 + structure.angle) * 0.5;
    structure.z += cos(frameCount * 0.001 + structure.angle) * 0.5;
  }
  
  // Draw water surface
  drawWater();
  
  // Draw pyramidal structures
  for (let structure of structures) {
    push();
    translate(structure.x, structure.y, structure.z);
    rotateY(structure.angle);
    
    // Create pyramid shape
    fill(20, 30, 60);
    stroke(10, 20, 40);
    strokeWeight(1);
    
    // Pyramid with 4 triangular faces
    beginShape();
    vertex(0, -structure.size/2, 0);  // top
    vertex(-structure.size/2, structure.size/2, -structure.size/2);  // front left
    vertex(structure.size/2, structure.size/2, -structure.size/2);   // front right
    endShape(CLOSE);
    
    beginShape();
    vertex(0, -structure.size/2, 0);  // top
    vertex(structure.size/2, structure.size/2, -structure.size/2);   // front right
    vertex(structure.size/2, structure.size/2, structure.size/2);    // back right
    endShape(CLOSE);
    
    beginShape();
    vertex(0, -structure.size/2, 0);  // top
    vertex(structure.size/2, structure.size/2, structure.size/2);    // back right
    vertex(-structure.size/2, structure.size/2, structure.size/2);   // back left
    endShape(CLOSE);
    
    beginShape();
    vertex(0, -structure.size/2, 0);  // top
    vertex(-structure.size/2, structure.size/2, structure.size/2);   // back left
    vertex(-structure.size/2, structure.size/2, -structure.size/2);  // front left
    endShape(CLOSE);
    
    pop();
  }
}

function drawWater() {
  push();
  translate(0, height/2, 0);
  rotateX(PI/2);
  
  // Create water surface with wave effect
  for (let i = -width/2; i < width/2; i += 20) {
    for (let j = -height/2; j < height/2; j += 20) {
      let waveHeight = sin(i * 0.01 + frameCount * 0.01) * 
                       cos(j * 0.01 + frameCount * 0.01) * 5;
      
      fill(hue(waterColor), saturation(waterColor), brightness(waterColor) + waveHeight, 0.7);
      noStroke();
      
      // Draw water tiles
      rect(i, j, 20, 20);
    }
  }
  
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
