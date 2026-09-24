let shapes = [];
let rot = 0;
let scl = 1;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(RGB);
  
  // Create a set of large geometric shapes with the specified palette
  for (let i = 0; i < 20; i++) {
    shapes.push({
      type: random(['rect', 'triangle', 'arc', 'polygon']),
      x: random(width),
      y: random(height),
      size: random(50, 200),
      rotation: random(TWO_PI),
      color: random([
        color(255, 204, 0),   // mustard yellow
        color(255, 102, 0),   // burnt orange
        color(0, 102, 102)    // deep teal
      ]),
      speed: random(0.001, 0.005),
      pulse: random(0.5, 1.5)
    });
  }
}

function draw() {
  background(0);
  
  // Apply global transformations based on mouse drag
  translate(width / 2, height / 2);
  rotate(rot);
  scale(scl);
  translate(-width / 2, -height / 2);

  // Draw and animate shapes
  for (let shape of shapes) {
    push();
    translate(shape.x, shape.y);
    rotate(shape.rotation);
    
    fill(shape.color);
    noStroke();
    
    switch (shape.type) {
      case 'rect':
        rectMode(CENTER);
        let rectSize = shape.size * (1 + sin(frameCount * shape.speed) * 0.3 * shape.pulse);
        rect(0, 0, rectSize, rectSize);
        break;
        
      case 'triangle':
        triangle(
          0, -shape.size/2,
          -shape.size/2, shape.size/2,
          shape.size/2, shape.size/2
        );
        break;
        
      case 'arc':
        arc(0, 0, shape.size, shape.size, 0, PI);
        break;
        
      case 'polygon':
        let sides = 5 + floor(random(3));
        beginShape();
        for (let i = 0; i < sides; i++) {
          let angle = map(i, 0, sides, 0, TWO_PI);
          let px = cos(angle) * shape.size;
          let py = sin(angle) * shape.size;
          vertex(px, py);
        }
        endShape(CLOSE);
        break;
    }
    
    pop();
  }
}

function mouseDragged() {
  // Rotate and scale the entire composition based on mouse movement
  rot += (mouseX - pmouseX) * 0.01;
  scl += (mouseY - pmouseY) * 0.001;
  scl = constrain(scl, 0.5, 2);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
