let planes = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  angleMode(RADIANS);

  // Create interlocking crystalline planes
  for (let i = 0; i < 12; i++) {
    planes.push({
      x: random(-width/3, width/3),
      y: random(-height/3, height/3),
      z: random(-200, 200),
      size: random(50, 150),
      rotX: random(TWO_PI),
      rotY: random(TWO_PI),
      rotZ: random(TWO_PI),
      color: color(random(100, 255), random(100, 255), random(100, 255), 200)
    });
  }
}

function draw() {
  background(0);
  noStroke();
  
  time += 0.005;
  
  // Camera movement for subtle perspective shifts
  let camX = sin(time * 0.3) * 100;
  let camY = cos(time * 0.2) * 50;
  camera(0, 0, (height/2) / tan(PI/6), 0, 0, 0, 0, 1, 0);
  
  // Move camera slightly to create shifting perspective
  translate(camX, camY, 0);

  for (let i = 0; i < planes.length; i++) {
    let p = planes[i];
    
    // Animate rotation
    p.rotX += sin(time + i) * 0.01;
    p.rotY += cos(time + i) * 0.01;
    p.rotZ += sin(time * 0.5 + i) * 0.005;
    
    // Color shift based on time and position
    let hue = (time * 20 + i * 30) % 360;
    let sat = 80 + 20 * sin(time * 0.5 + i);
    let bright = 70 + 30 * cos(time * 0.3 + i);
    
    push();
    translate(p.x, p.y, p.z);
    rotateX(p.rotX);
    rotateY(p.rotY);
    rotateZ(p.rotZ);
    
    // Create crystalline structure using geometric shapes
    let size = p.size + sin(time * 2 + i) * 10;
    fill(hue, sat, bright, 180);
    
    // Draw interlocking planes
    for (let j = 0; j < 3; j++) {
      push();
      rotateZ(j * TWO_PI / 3);
      box(size, size * 0.2, size * 0.2);
      pop();
    }
    
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
