let horsePoints = [];
let spineCurve = [];
let legPositions = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  
  // Create a stylized horse body with flowing curves
  const segments = 20;
  for (let i = 0; i < segments; i++) {
    const t = map(i, 0, segments - 1, 0, TWO_PI);
    const x = 100 * cos(t);
    const y = 50 * sin(t * 0.5);
    const z = 30 * sin(t * 0.7);
    horsePoints.push({x, y, z});
  }
  
  // Create spine curve for dynamic motion
  for (let i = 0; i < 100; i++) {
    const t = map(i, 0, 99, 0, TWO_PI * 2);
    spineCurve.push(createVector(
      50 * cos(t),
      30 * sin(t * 1.5),
      20 * sin(t)
    ));
  }
  
  // Initialize leg positions
  for (let i = 0; i < 4; i++) {
    legPositions.push({
      front: createVector(0, 0, 0),
      back: createVector(0, 0, 0)
    });
  }
}

function draw() {
  background(20, 30, 50);
  
  // Camera movement for dynamic view
  const time = millis() * 0.001;
  camera(
    300 * cos(time * 0.3),
    100 + 50 * sin(time * 0.2),
    300 * sin(time * 0.3),
    0, 0, 0,
    0, 1, 0
  );
  
  // Dynamic lighting
  pointLight(255, 200, 180, 200, -100, 100);
  ambientLight(100);
  
  // Draw the horse body with flowing curves
  push();
  rotateY(time * 0.2);
  
  // Body as a continuous curve
  fill(180, 120, 80);
  beginShape();
  for (let i = 0; i < horsePoints.length; i++) {
    const p = horsePoints[i];
    const offset = sin(time * 3 + i * 0.2) * 15;
    vertex(p.x + offset, p.y, p.z);
  }
  endShape(CLOSE);
  
  // Draw spine with dynamic motion
  fill(160, 100, 60);
  beginShape();
  for (let i = 0; i < spineCurve.length; i++) {
    const v = spineCurve[i];
    const offset = sin(time * 4 + i * 0.3) * 20;
    vertex(v.x + offset, v.y, v.z);
  }
  endShape();
  
  // Draw legs with synchronized gallop motion
  for (let i = 0; i < 4; i++) {
    const legOffset = time * 2 + i * PI/2;
    const extension = sin(legOffset) * 30;
    
    // Front legs
    push();
    translate(-50, 0, -10);
    rotateZ(legOffset * 0.5);
    fill(140, 90, 50);
    box(8, 20 + extension, 8);
    pop();
    
    // Back legs
    push();
    translate(50, 0, -10);
    rotateZ(-legOffset * 0.7);
    fill(140, 90, 50);
    box(8, 20 + extension, 8);
    pop();
  }
  
  pop();
}
