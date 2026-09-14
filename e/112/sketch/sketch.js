let polygons = [];
let gridLines = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize polygons
  for (let i = 0; i < 20; i++) {
    polygons.push({
      pos: createVector(random(-width/2, width/2), random(-height/2, height/2)),
      size: random(50, 200),
      rotation: random(TWO_PI),
      speed: random(0.001, 0.005),
      color: color(random(200, 300), 80, 90, 0.3)
    });
  }
  
  // Initialize grid lines
  for (let i = 0; i < 50; i++) {
    gridLines.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-200, 200),
      length: random(100, 400),
      speed: random(0.0005, 0.002),
      color: color(200, 50, 80, 0.2)
    });
  }
}

function draw() {
  background(0);
  time += 0.01;
  
  // Rotate the whole scene
  rotateY(time * 0.1);
  rotateX(sin(time * 0.3) * 0.1);
  
  // Draw grid lines
  for (let line of gridLines) {
    push();
    translate(line.x, line.y, line.z);
    rotateZ(time * line.speed);
    stroke(line.color);
    noFill();
    box(line.length, 2, 2);
    pop();
  }
  
  // Draw polygons
  for (let poly of polygons) {
    push();
    translate(poly.pos.x, poly.pos.y, 0);
    rotateZ(poly.rotation + time * poly.speed);
    
    fill(poly.color);
    noStroke();
    
    beginShape();
    let sides = 6;
    for (let i = 0; i < sides; i++) {
      let angle = map(i, 0, sides, 0, TWO_PI);
      let x = cos(angle) * poly.size;
      let y = sin(angle) * poly.size;
      vertex(x, y);
    }
    endShape(CLOSE);
    
    // Add glow effect
    stroke(poly.color);
    noFill();
    beginShape();
    for (let i = 0; i < sides; i++) {
      let angle = map(i, 0, sides, 0, TWO_PI);
      let x = cos(angle) * (poly.size + 10);
      let y = sin(angle) * (poly.size + 10);
      vertex(x, y);
    }
    endShape(CLOSE);
    
    pop();
    
    // Update positions
    poly.pos.x += sin(time * 0.3 + poly.rotation) * 0.2;
    poly.pos.y += cos(time * 0.3 + poly.rotation) * 0.2;
    poly.rotation += 0.001;
  }
  
  // Simulate overlay effect
  if (frameCount % 60 === 0) {
    for (let poly of polygons) {
      let d = dist(mouseX - width/2, mouseY - height/2, poly.pos.x, poly.pos.y);
      if (d < 150) {
        poly.color = color(hue(poly.color), saturation(poly.color), brightness(poly.color), 0.7);
        poly.speed *= 0.8;
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
