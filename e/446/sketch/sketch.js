let tunnelSegments = [];
let cameraZ = 0;
let rotationX = 0;
let rotationY = 0;
let lastMouseX = 0;
let lastMouseY = 0;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();

  // Generate tunnel segments
  for (let i = 0; i < 100; i++) {
    tunnelSegments.push({
      x: random(-200, 200),
      y: random(-200, 200),
      z: -i * 300,
      width: random(80, 150),
      height: random(80, 150),
      rotation: random(TWO_PI)
    });
  }
}

function draw() {
  background(20, 20, 30);
  ambientLight(60);
  pointLight(255, 255, 255, 0, 0, -1000);

  // Camera movement
  cameraZ = sin(time * 0.001) * 50;
  rotateX(rotationX);
  rotateY(rotationY);
  translate(0, 0, cameraZ);

  // Draw tunnel segments
  for (let segment of tunnelSegments) {
    push();
    translate(segment.x, segment.y, segment.z);
    rotateZ(segment.rotation);
    
    // Damp concrete texture with mineral streaks
    fill(80, 80, 90);
    box(segment.width, segment.height, 100);
    
    // Add some details
    fill(60, 60, 70);
    beginShape();
    vertex(-segment.width/2, -segment.height/2, 50);
    vertex(segment.width/2, -segment.height/2, 50);
    vertex(segment.width/2, segment.height/2, 50);
    vertex(-segment.width/2, segment.height/2, 50);
    endShape(CLOSE);
    
    pop();
  }

  time++;
}

function mousePressed() {
  lastMouseX = mouseX;
  lastMouseY = mouseY;
}

function mouseDragged() {
  rotationY += (mouseX - lastMouseX) * 0.01;
  rotationX += (mouseY - lastMouseY) * 0.01;
  
  lastMouseX = mouseX;
  lastMouseY = mouseY;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
