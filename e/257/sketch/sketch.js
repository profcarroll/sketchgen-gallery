let shapes = [];
let veins = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create organic shapes
  for (let i = 0; i < 200; i++) {
    shapes.push({
      pos: p5.Vector.random3D().mult(random(100, 300)),
      size: random(20, 80),
      rot: random(TWO_PI),
      speed: random(0.001, 0.005),
      hue: random(180, 240)
    });
  }
  
  // Create vein structures
  for (let i = 0; i < 50; i++) {
    veins.push({
      points: [],
      hue: random(60, 120),
      width: random(1, 3)
    });
    // Initialize vein path
    for (let j = 0; j < 50; j++) {
      veins[i].points.push(p5.Vector.random3D().mult(random(100, 400)));
    }
  }
}

function draw() {
  background(0);
  time += 0.01;
  
  // Camera movement
  let cx = sin(time * 0.2) * 200;
  let cy = cos(time * 0.3) * 100;
  let cz = sin(time * 0.1) * 150;
  camera(0, 0, 600 + cz, cx, cy, 0, 0, 1, 0);
  
  // Draw shapes
  for (let shape of shapes) {
    push();
    translate(shape.pos.x, shape.pos.y, shape.pos.z);
    rotateX(time * shape.speed);
    rotateY(time * shape.speed * 0.5);
    rotateZ(time * shape.speed * 0.3);
    
    noStroke();
    fill(shape.hue, 60, 80, 0.7);
    sphere(shape.size, 6, 4);
    
    pop();
  }
  
  // Draw veins
  for (let vein of veins) {
    push();
    stroke(vein.hue, 100, 100, 0.8);
    strokeWeight(vein.width);
    noFill();
    
    beginShape();
    for (let i = 0; i < vein.points.length; i++) {
      let v = vein.points[i];
      let x = v.x + sin(time * 0.5 + i * 0.1) * 20;
      let y = v.y + cos(time * 0.3 + i * 0.1) * 15;
      let z = v.z + sin(time * 0.4 + i * 0.1) * 25;
      vertex(x, y, z);
    }
    endShape();
    pop();
  }
  
  // Pulsing effect
  let pulse = sin(time * 2) * 0.1 + 0.9;
  ambientLight(20 * pulse);
  pointLight(255, 255, 255, 0, 0, 400);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
