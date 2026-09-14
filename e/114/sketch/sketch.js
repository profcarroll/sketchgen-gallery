let structures = [];

function setup() {
  createCanvas(600, 600, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Generate floating architectural forms
  for (let i = 0; i < 20; i++) {
    structures.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-500, 500),
      size: random(50, 150),
      rotationX: random(TWO_PI),
      rotationY: random(TWO_PI),
      speed: random(0.001, 0.005)
    });
  }
}

function draw() {
  background(240, 10, 95, 0.95);
  
  // Ambient lighting
  ambientLight(100);
  pointLight(255, 255, 255, 0, -height/2, 300);
  
  // Camera movement for subtle drift
  let time = millis() * 0.0002;
  camera(0, 0, (height/2) / tan(PI/6), 0, 0, 0, 0, 1, 0);
  
  // Apply global rotation based on time
  rotateY(time * 0.2);
  rotateX(sin(time * 0.3) * 0.1);
  
  for (let s of structures) {
    push();
    
    translate(s.x, s.y, s.z);
    rotateX(s.rotationX + time * s.speed);
    rotateY(s.rotationY + time * s.speed * 0.5);
    
    // Draw a soft, translucent polyhedron
    fill(270, 30, 80, 0.4);
    stroke(270, 40, 90, 0.6);
    strokeWeight(1);
    
    let sides = 6;
    beginShape();
    for (let i = 0; i < sides; i++) {
      let angle = map(i, 0, sides, 0, TWO_PI);
      let x = s.size * cos(angle);
      let y = s.size * sin(angle);
      vertex(x, y, 0);
    }
    endShape(CLOSE);
    
    // Add inner glow
    noStroke();
    fill(270, 20, 100, 0.1);
    sphere(s.size * 0.6);
    
    pop();
  }
}

function mousePressed() {
  // Shift all structures slightly on click
  for (let s of structures) {
    s.x += random(-50, 50);
    s.y += random(-50, 50);
    s.z += random(-50, 50);
  }
}

function mouseDragged() {
  // Adjust depth perception based on drag direction
  let dx = mouseX - pmouseX;
  let dy = mouseY - pmouseY;
  
  for (let s of structures) {
    s.z += dx * 0.1;
    s.x += dy * 0.1;
  }
}
