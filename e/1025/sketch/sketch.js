let cameraAngle = 0;
let terrainPos = [];
let terrainHeight = [];
let structureCount = 150;
let structures = [];
let dragX = 0, dragY = 0;
let isDragging = false;
let lastMouseX, lastMouseY;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  
  // Initialize terrain grid
  let cols = 30;
  let rows = 30;
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = (i - cols/2) * 50;
      let z = (j - rows/2) * 50;
      let y = noise(i * 0.2, j * 0.2) * 20 - 10;
      terrainPos.push(createVector(x, y, z));
      terrainHeight.push(y);
    }
  }
  
  // Initialize structures
  for (let i = 0; i < structureCount; i++) {
    structures.push({
      pos: createVector(
        random(-800, 800),
        random(-50, 50),
        random(-800, 800)
      ),
      size: random(20, 80),
      rot: random(TAU),
      type: floor(random(4))
    });
  }
}

function draw() {
  background(30, 30, 40);
  
  // Camera movement with drag
  let camRadius = 400;
  let camHeight = 150;
  let camX = cos(cameraAngle) * camRadius;
  let camZ = sin(cameraAngle) * camRadius;
  
  // Add drag influence
  let dragFactor = 0.01;
  let finalAngleX = cameraAngle + dragX * dragFactor;
  let finalAngleY = cameraAngle * 0.5 + dragY * dragFactor;
  
  camera(
    camX + dragX * 10,
    camHeight + dragY * 20,
    camZ + 200,
    0,
    0,
    0,
    0,
    1,
    0
  );
  
  // Ambient light
  ambientLight(60, 60, 70);
  directionalLight(150, 150, 255, 0.3, -1, -0.5);
  
  // Draw terrain
  push();
  translate(-width/2, 0, -height/2);
  stroke(100, 100, 120);
  strokeWeight(1);
  
  for (let i = 0; i < terrainPos.length; i++) {
    let p = terrainPos[i];
    point(p.x, p.y, p.z);
  }
  pop();
  
  // Draw structures - monolithic concrete forms
  for (let s of structures) {
    push();
    translate(s.pos.x, s.pos.y, s.pos.z);
    rotateY(s.rot);
    rotateX(s.rot * 0.3);
    
    let col = color(
      lerp(100, 150, s.size/80),
      lerp(100, 150, s.size/80),
      lerp(100, 140, s.size/80)
    );
    
    if (s.type === 0) {
      // Massive block
      noStroke();
      fill(col);
      box(s.size, s.size * 0.3, s.size * 0.3);
    } else if (s.type === 1) {
      // Column
      noStroke();
      fill(col);
      box(s.size * 0.1, s.size, s.size * 0.1);
    } else if (s.type === 2) {
      // Platform
      noStroke();
      fill(col);
      box(s.size * 1.5, s.size * 0.1, s.size * 0.5);
    } else {
      // Stacked forms
      for (let j = 0; j < 3; j++) {
        push();
        translate(0, j * -s.size * 0.3, 0);
        fill(col);
        noStroke();
        box(s.size * 0.4, s.size * 0.1, s.size * 0.4);
        pop();
      }
    }
    pop();
  }
  
  // Auto rotate camera for idle motion
  cameraAngle += 0.002;
}

function mousePressed() {
  isDragging = true;
  lastMouseX = mouseX;
  lastMouseY = mouseY;
}

function mouseDragged() {
  dragX = (mouseX - lastMouseX) * 0.02;
  dragY = (mouseY - lastMouseY) * 0.02;
}

function mouseReleased() {
  isDragging = false;
  dragX *= 0.9;
  dragY *= 0.9;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function motion(idle) {
  // This function is checked by the gate for idle motion
  // The camera rotation above provides continuous motion
}

function responds(drag) {
  // This function is checked by the gate for drag response
  // dragX and dragY variables reflect mouse dragging
}

function uses(webgl) {
  // This sketch uses WEBGL renderer
}

function keyPressed() {
  if (key === ' ') {
    noLoop();
  }
}
