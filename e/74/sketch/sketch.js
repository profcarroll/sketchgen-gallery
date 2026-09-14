let angle = 0;
let segments = 20;
let radius = 300;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
}

function draw() {
  background(0);
  
  // Camera movement for immersive experience
  let time = millis() * 0.0005;
  let camX = sin(time) * 200;
  let camY = cos(time * 0.7) * 100;
  let camZ = 300 + sin(time * 0.5) * 100;
  
  camera(camX, camY, camZ, 0, 0, 0, 0, 1, 0);
  
  // Lighting
  pointLight(255, 255, 255, 0, -300, 300);
  ambientLight(50, 50, 50);
  
  // Create the curved pathway
  push();
  rotateY(angle);
  
  for (let i = 0; i < segments; i++) {
    let segmentAngle = TWO_PI / segments * i;
    let x1 = cos(segmentAngle) * radius;
    let y1 = sin(segmentAngle) * radius;
    let x2 = cos(segmentAngle) * (radius + 50);
    let y2 = sin(segmentAngle) * (radius + 50);
    
    // Create steel plates
    fill(10, 80, 30); // Deep umber
    stroke(10, 70, 20);
    strokeWeight(1);
    
    beginShape();
    vertex(x1, y1, 0);
    vertex(x2, y2, 0);
    vertex(x2, y2, -100);
    vertex(x1, y1, -100);
    endShape(CLOSE);
  }
  
  // Create the perpendicular wall
  translate(0, 0, -100);
  rotateX(HALF_PI);
  fill(20, 90, 40); // Oxidized orange
  rect(-radius*1.5, -radius*1.5, radius*3, radius*3);
  
  pop();
  
  angle += 0.002;
}

function mouseDragged() {
  // Adjust the scene based on mouse movement
  let dx = mouseX - pmouseX;
  let dy = mouseY - pmouseY;
  
  rotateY(dx * 0.01);
  rotateX(dy * 0.01);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
