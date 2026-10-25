let lines = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create a dense network of intersecting lines
  for (let i = 0; i < 500; i++) {
    lines.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-1000, 1000),
      angleX: random(TWO_PI),
      angleY: random(TWO_PI),
      angleZ: random(TWO_PI)
    });
  }
}

function draw() {
  background(0, 0, 5); // Very dark background

  // Ambient lighting
  ambientLight(20);
  
  // Dynamic point light source that pulses and moves
  let lightX = sin(time * 0.002) * width/4;
  let lightY = cos(time * 0.001) * height/4;
  pointLight(180, 120, 150, lightX, lightY, -600);
  
  // Rotate scene slowly
  rotateY(time * 0.0002);
  rotateX(time * 0.00005);

  // Draw intersecting lines
  for (let line of lines) {
    push();
    
    translate(line.x, line.y, line.z);
    rotateX(line.angleX + time * 0.001);
    rotateY(line.angleY + time * 0.001);
    rotateZ(line.angleZ + time * 0.001);
    
    stroke(200, 80, 90); // Cool cyan color
    strokeWeight(0.5);
    
    beginShape(LINES);
    vertex(-width/4, 0, 0);
    vertex(width/4, 0, 0);
    endShape();
    
    pop();
  }
  
  time++;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
