let lines = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create parallel lines that intersect to form a grid
  for (let i = 0; i < 20; i++) {
    lines.push({
      y: map(i, 0, 19, -height/2, height/2),
      angle: random(TWO_PI)
    });
  }
}

function draw() {
  background(0, 0, 10); // Dark gray background

  // Ambient lighting
  ambientLight(30);
  
  // Dynamic point light source that pulses and moves
  let lightX = sin(time * 0.002) * width/4;
  let lightY = cos(time * 0.001) * height/4;
  pointLight(180, 120, 150, lightX, lightY, -600);
  
  // Rotate scene slowly
  rotateY(time * 0.0002);
  rotateX(time * 0.00005);

  // Draw intersecting parallel lines
  for (let line of lines) {
    push();
    translate(0, line.y, 0);
    rotateZ(line.angle + time * 0.001);
    
    stroke(200, 80, 90); // Cool cyan color
    strokeWeight(1);
    
    beginShape(LINES);
    vertex(-width/2, 0, 0);
    vertex(width/2, 0, 0);
    endShape();
    
    pop();
  }
  
  time++;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
