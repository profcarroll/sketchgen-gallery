let structures = [];
let vines = [];
let mossPatches = [];
let crumblingWalls = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  
  // Pre-generate all geometry for performance
  for (let i = 0; i < 50; i++) {
    structures.push({
      x: random(-1000, 1000),
      y: 0,
      z: random(-2000, 2000),
      width: random(50, 200),
      depth: random(50, 200),
      height: random(100, 400),
      rotation: random(TWO_PI),
      crumbling: false,
      crumbleProgress: 0
    });
  }
  
  for (let i = 0; i < 300; i++) {
    vines.push({
      x: random(-1000, 1000),
      y: 0,
      z: random(-2000, 2000),
      length: random(20, 80),
      angle: random(TWO_PI),
      segments: floor(random(3, 8))
    });
  }
  
  for (let i = 0; i < 150; i++) {
    mossPatches.push({
      x: random(-1000, 1000),
      y: 0,
      z: random(-2000, 2000),
      size: random(30, 100)
    });
  }
  
  // Add some crumbling wall sections
  for (let i = 0; i < 100; i++) {
    crumblingWalls.push({
      x: random(-1000, 1000),
      y: 0,
      z: random(-2000, 2000),
      width: random(30, 80),
      height: random(60, 120),
      depth: random(10, 30),
      rotation: random(TWO_PI),
      progress: random(1)
    });
  }
}

function draw() {
  background(40, 45, 50);
  
  // Animate camera path
  time += 0.002;
  const camX = sin(time * 0.3) * 500;
  const camY = cos(time * 0.2) * 100 - 50;
  const camZ = time * 100 - 500;
  
  // Use camera lookAt with some offset to create cinematic movement
  const lookX = sin(time * 0.3 + 0.5) * 200;
  const lookY = cos(time * 0.2 + 0.3) * 100;
  const lookZ = time * 100 + 1000;
  
  // Set camera manually using perspective and translate
  translate(0, 0, camZ);
  rotateX(-0.1);
  rotateY(-0.05);
  translate(-camX, -camY, 0);
  
  // Draw structures using batched shapes
  beginShape(QUADS);
  fill(70, 75, 80);
  stroke(50, 55, 60);
  strokeWeight(1);
  
  for (let s of structures) {
    push();
    translate(s.x, s.y, s.z);
    rotateY(s.rotation);
    
    const w = s.width / 2;
    const h = s.height / 2;
    const d = s.depth / 2;
    
    // Front face
    vertex(-w, -h,  d);
    vertex( w, -h,  d);
    vertex( w,  h,  d);
    vertex(-w,  h,  d);
    
    // Back face
    vertex(-w, -h, -d);
    vertex( w, -h, -d);
    vertex( w,  h, -d);
    vertex(-w,  h, -d);
    
    // Left face
    vertex(-w, -h, -d);
    vertex(-w, -h,  d);
    vertex(-w,  h,  d);
    vertex(-w,  h, -d);
    
    // Right face
    vertex( w, -h, -d);
    vertex( w, -h,  d);
    vertex( w,  h,  d);
    vertex( w,  h, -d);
    
    // Top face
    vertex(-w, -h, -d);
    vertex( w, -h, -d);
    vertex( w, -h,  d);
    vertex(-w, -h,  d);
    
    // Bottom face
    vertex(-w,  h, -d);
    vertex( w,  h, -d);
    vertex( w,  h,  d);
    vertex(-w,  h,  d);
    
    pop();
  }
  
  endShape();
  
  // Draw crumbling walls with exposed rebar
  beginShape(QUADS);
  fill(60, 65, 70);
  stroke(40, 45, 50);
  strokeWeight(0.5);
  
  for (let wall of crumblingWalls) {
    push();
    translate(wall.x, wall.y, wall.z);
    rotateY(wall.rotation);
    
    const w = wall.width / 2;
    const h = wall.height / 2;
    const d = wall.depth / 2;
    
    // Draw the wall with some crumbling effect
    if (wall.progress > 0.3) {
      fill(50, 55, 60);
      stroke(30, 35, 40);
      
      // Front face
      vertex(-w, -h,  d);
      vertex( w, -h,  d);
      vertex( w,  h,  d);
      vertex(-w,  h,  d);
      
      // Back face
      vertex(-w, -h, -d);
      vertex( w, -h, -d);
      vertex( w,  h, -d);
      vertex(-w,  h, -d);
      
      // Left face
      vertex(-w, -h, -d);
      vertex(-w, -h,  d);
      vertex(-w,  h,  d);
      vertex(-w,  h, -d);
      
      // Right face
      vertex( w, -h, -d);
      vertex( w, -h,  d);
      vertex( w,  h,  d);
      vertex( w,  h, -d);
      
      // Top face
      vertex(-w, -h, -d);
      vertex( w, -h, -d);
      vertex( w, -h,  d);
      vertex(-w, -h,  d);
      
      // Bottom face
      vertex(-w,  h, -d);
      vertex( w,  h, -d);
      vertex( w,  h,  d);
      vertex(-w,  h,  d);
    }
    
    pop();
  }
  
  endShape();
  
  // Draw vines as batched lines
  beginShape(LINES);
  stroke(30, 80, 30);
  strokeWeight(1);
  
  for (let v of vines) {
    push();
    translate(v.x, v.y, v.z);
    
    const start = createVector(0, 0, 0);
    vertex(start.x, start.y, start.z);
    
    let current = start.copy();
    for (let i = 0; i < v.segments; i++) {
      const angle = v.angle + random(-0.3, 0.3);
      const length = v.length / v.segments;
      
      current.add(createVector(
        cos(angle) * length,
        random(-1, 1) * length * 0.2,
        sin(angle) * length
      ));
      
      vertex(current.x, current.y, current.z);
    }
    
    pop();
  }
  
  endShape();
  
  // Draw moss patches as batched points
  beginShape(POINTS);
  fill(20, 70, 20);
  noStroke();
  
  for (let m of mossPatches) {
    push();
    translate(m.x, m.y, m.z);
    vertex(0, 0, 0);
    pop();
  }
  
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
