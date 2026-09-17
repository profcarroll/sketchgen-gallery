let planes = [];
let time = 0;

function setup() {
  createCanvas(600, 600, WEBGL);
  
  // Create multiple faceted planes in 3D space
  for (let i = 0; i < 12; i++) {
    let plane = {
      x: random(-200, 200),
      y: random(-200, 200),
      z: random(-300, 300),
      size: random(50, 150),
      rotX: random(TWO_PI),
      rotY: random(TWO_PI),
      rotZ: random(TWO_PI),
      color: [random(100, 255), random(100, 255), random(100, 255)]
    };
    planes.push(plane);
  }
}

function draw() {
  background(0);
  time += 0.01;
  
  // Ambient lighting
  ambientLight(60);
  pointLight(255, 255, 255, 0, 0, 300);
  
  for (let plane of planes) {
    push();
    
    // Position and rotate each plane
    translate(plane.x, plane.y, plane.z);
    rotateX(plane.rotX + time * 0.2);
    rotateY(plane.rotY + time * 0.3);
    rotateZ(plane.rotZ + time * 0.1);
    
    // Dynamic color shifting
    let r = sin(time + plane.x * 0.01) * 50 + 155;
    let g = cos(time + plane.y * 0.01) * 50 + 155;
    let b = sin(time + plane.z * 0.01) * 50 + 155;
    
    fill(r, g, b, 200);
    noStroke();
    
    // Draw a faceted cube
    box(plane.size);
    
    pop();
  }
}
